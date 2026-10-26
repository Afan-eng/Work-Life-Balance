-- Apply once to an existing Supabase project to activate clock-locked streaks.
-- This migration preserves tracker history and recomputes streak totals from it.

ALTER TABLE public.user_streaks ALTER COLUMN current_streak SET DEFAULT 0;
ALTER TABLE public.user_streaks ALTER COLUMN best_streak SET DEFAULT 0;
ALTER TABLE public.user_streaks ALTER COLUMN last_activity_date DROP DEFAULT;
ALTER TABLE public.user_streaks ADD COLUMN IF NOT EXISTS time_zone TEXT NOT NULL DEFAULT 'UTC';

-- Rebuild legacy counters from completed tracker days, excluding the still-open local day.
WITH RECURSIVE activity_days AS (
  SELECT streak.user_id,
         (entry.key)::DATE AS activity_date,
         (timezone(coalesce(streak.time_zone, 'UTC'), now()))::DATE AS local_today
  FROM public.user_streaks AS streak
  CROSS JOIN LATERAL jsonb_each_text(coalesce(streak.completion_matrix, '{}'::JSONB)) AS entry
  WHERE entry.value = 'true'
), completed AS (
  SELECT user_id, activity_date
  FROM activity_days
  WHERE activity_date < local_today
), ranked AS (
  SELECT user_id, activity_date,
         activity_date - row_number() OVER (PARTITION BY user_id ORDER BY activity_date)::INTEGER AS run_group
  FROM completed
), best_runs AS (
  SELECT user_id, max(day_count)::INTEGER AS best_streak
  FROM (SELECT user_id, run_group, count(*) AS day_count FROM ranked GROUP BY user_id, run_group) AS runs
  GROUP BY user_id
), current_run(user_id, cursor_date, run_length, local_today, completion_matrix) AS (
  SELECT streak.user_id,
         (timezone(coalesce(streak.time_zone, 'UTC'), now()))::DATE - 1,
         0,
         (timezone(coalesce(streak.time_zone, 'UTC'), now()))::DATE,
         coalesce(streak.completion_matrix, '{}'::JSONB)
  FROM public.user_streaks AS streak
  UNION ALL
  SELECT run.user_id, run.cursor_date - 1, run.run_length + 1, run.local_today, run.completion_matrix
  FROM current_run AS run
  WHERE run.completion_matrix ->> run.cursor_date::TEXT = 'true'
), current_runs AS (
  SELECT user_id, max(run_length)::INTEGER AS current_streak
  FROM current_run
  GROUP BY user_id
)
UPDATE public.user_streaks AS streak
SET current_streak = coalesce(current_runs.current_streak, 0),
    best_streak = greatest(coalesce(best_runs.best_streak, 0), coalesce(current_runs.current_streak, 0)),
    last_activity_date = (SELECT max(activity_date) FROM activity_days WHERE activity_days.user_id = streak.user_id)
FROM current_runs
LEFT JOIN best_runs ON best_runs.user_id = current_runs.user_id
WHERE streak.user_id = current_runs.user_id;

-- Remove direct client writes; authenticated clients record only through the server-clock RPC.
DROP POLICY IF EXISTS "Users can insert their own streak record" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streak record" ON public.user_streaks;

-- Exposes aggregate counts only and waits for a minimum cohort to avoid
-- revealing the activity of a small number of individual users.
CREATE OR REPLACE FUNCTION public.get_public_streak_stats()
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
WITH users AS (
  SELECT user_id, coalesce(completion_matrix, '{}'::JSONB) AS completion_matrix,
         coalesce(time_zone, 'UTC') AS time_zone,
         timezone(coalesce(time_zone, 'UTC'), now())::DATE AS local_today
  FROM public.user_streaks
), ranked AS (
  SELECT users.user_id, users.local_today, (entry.key)::DATE AS activity_date,
         (entry.key)::DATE - row_number() OVER (PARTITION BY users.user_id ORDER BY (entry.key)::DATE)::INTEGER AS run_group
  FROM users
  CROSS JOIN LATERAL jsonb_each_text(users.completion_matrix) AS entry
  WHERE entry.value = 'true' AND (entry.key)::DATE < users.local_today
), runs AS (
  SELECT user_id, run_group, count(*)::INTEGER AS run_length,
         max(activity_date) AS last_day, max(local_today) AS local_today
  FROM ranked
  GROUP BY user_id, run_group
), cohort AS (
  SELECT users.user_id, users.completion_matrix, users.time_zone,
         (users.completion_matrix ->> users.local_today::TEXT = 'true') AS active_today,
         coalesce(max(runs.run_length) FILTER (WHERE runs.last_day = users.local_today - 1), 0)::INTEGER AS current_streak,
         coalesce(max(runs.run_length), 0)::INTEGER AS best_streak
  FROM users
  LEFT JOIN runs ON runs.user_id = users.user_id
  GROUP BY users.user_id, users.completion_matrix, users.time_zone, users.local_today
), totals AS (
  SELECT count(*)::INTEGER AS member_count,
         count(*) FILTER (WHERE active_today)::INTEGER AS active_today,
         count(*) FILTER (WHERE current_streak > 0)::INTEGER AS members_with_streak,
         round(avg(current_streak) FILTER (WHERE current_streak > 0), 1) AS average_streak
  FROM cohort
), days AS (
  SELECT calendar.day::DATE AS activity_date,
         count(*) FILTER (WHERE c.completion_matrix ->> calendar.day::DATE::TEXT = 'true')::INTEGER AS active
  FROM generate_series((now() AT TIME ZONE 'UTC')::DATE - 364, (now() AT TIME ZONE 'UTC')::DATE, INTERVAL '1 day') AS calendar(day)
  CROSS JOIN cohort c
  GROUP BY calendar.day
)
SELECT jsonb_build_object(
  'cohort_ready', totals.member_count >= 5,
  'member_count', CASE WHEN totals.member_count >= 5 THEN totals.member_count ELSE 0 END,
  'active_today', CASE WHEN totals.member_count >= 5 AND totals.active_today >= 5 THEN totals.active_today ELSE NULL END,
  'members_with_streak', CASE WHEN totals.member_count >= 5 AND totals.members_with_streak >= 5 THEN totals.members_with_streak ELSE NULL END,
  'average_streak', CASE WHEN totals.member_count >= 5 AND totals.members_with_streak >= 5 THEN coalesce(totals.average_streak, 0) ELSE NULL END,
  'last_365_days', CASE WHEN totals.member_count >= 5 THEN
    (SELECT jsonb_agg(jsonb_build_object('date', activity_date, 'active', CASE WHEN active >= 5 THEN active ELSE NULL END) ORDER BY activity_date) FROM days)
    ELSE '[]'::JSONB END
)
FROM totals;
$$;

REVOKE ALL ON FUNCTION public.get_public_streak_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_streak_stats() TO anon, authenticated;

-- Record a completed tracker against the database's current time and the
-- authenticated member's IANA timezone. Missing local days end the run.
CREATE OR REPLACE FUNCTION public.record_tracker_completion(
  p_action_type TEXT,
  p_time_zone TEXT DEFAULT 'UTC'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_time_zone TEXT;
  v_today DATE;
  v_cursor DATE;
  v_matrix JSONB;
  v_current INTEGER := 0;
  v_best INTEGER := 0;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Sign in to record a tracker contribution'; END IF;
  IF p_action_type NOT IN ('moment', 'mood', 'habit', 'pomodoro', 'breath', 'challenge') THEN
    RAISE EXCEPTION 'Unsupported tracker activity';
  END IF;

  SELECT name INTO v_time_zone FROM pg_timezone_names WHERE name = p_time_zone;
  IF v_time_zone IS NULL THEN v_time_zone := 'UTC'; END IF;
  v_today := timezone(v_time_zone, now())::DATE;

  INSERT INTO public.user_streaks (user_id, current_streak, best_streak, last_activity_date, completion_matrix, time_zone)
  VALUES (v_user_id, 0, 0, NULL, '{}'::JSONB, v_time_zone)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT coalesce(completion_matrix, '{}'::JSONB) || jsonb_build_object(v_today::TEXT, true)
  INTO v_matrix
  FROM public.user_streaks
  WHERE user_id = v_user_id
  FOR UPDATE;

  v_cursor := v_today - 1;
  WHILE v_matrix ->> v_cursor::TEXT = 'true' LOOP
    v_current := v_current + 1;
    v_cursor := v_cursor - 1;
  END LOOP;

  WITH completed AS (
    SELECT (entry.key)::DATE AS activity_date
    FROM jsonb_each_text(v_matrix) AS entry
    WHERE entry.value = 'true' AND (entry.key)::DATE < v_today
  ), ranked AS (
    SELECT activity_date, activity_date - row_number() OVER (ORDER BY activity_date)::INTEGER AS run_group
    FROM completed
  ), runs AS (
    SELECT count(*)::INTEGER AS run_length FROM ranked GROUP BY run_group
  )
  SELECT coalesce(max(run_length), 0) INTO v_best FROM runs;
  v_best := greatest(v_best, v_current);

  UPDATE public.user_streaks
  SET completion_matrix = v_matrix,
      current_streak = v_current,
      best_streak = v_best,
      last_activity_date = v_today,
      time_zone = v_time_zone,
      updated_at = now()
  WHERE user_id = v_user_id;

  RETURN jsonb_build_object(
    'today', v_today,
    'current_streak', v_current,
    'best_streak', v_best,
    'completion_matrix', v_matrix,
    'time_zone', v_time_zone
  );
END;
$$;

REVOKE ALL ON FUNCTION public.record_tracker_completion(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_tracker_completion(TEXT, TEXT) TO authenticated;
