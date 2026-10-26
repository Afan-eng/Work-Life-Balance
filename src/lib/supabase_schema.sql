-- ====================================================================
-- BALANCE STUDIO: SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- Run this script in the Supabase SQL Editor to initialize all tables
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Streaks Table
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    freeze_tokens INTEGER DEFAULT 2,
    last_activity_date DATE,
    completion_matrix JSONB DEFAULT '{}'::jsonb,
    time_zone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keep existing installations aligned with the clock-based streak rules.
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

-- Enable RLS for user_streaks
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streak record" 
    ON public.user_streaks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak record" 
    ON public.user_streaks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak record" 
    ON public.user_streaks FOR UPDATE 
    USING (auth.uid() = user_id);

-- Streak writes go through the server-clock RPC below so client clocks and
-- stale cross-tab writes cannot replace a user's contribution history.
DROP POLICY IF EXISTS "Users can insert their own streak record" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streak record" ON public.user_streaks;

-- 3. User Habits Table
CREATE TABLE IF NOT EXISTS public.user_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('mind', 'body', 'focus', 'rest')),
    frequency TEXT NOT NULL DEFAULT 'daily',
    streak INTEGER DEFAULT 0,
    completed_today BOOLEAN DEFAULT false,
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_habits
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits" 
    ON public.user_habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits" 
    ON public.user_habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
    ON public.user_habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
    ON public.user_habits FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. User Goals Table
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Career', 'Physical', 'Mental', 'Relationships')),
    target_date DATE NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    milestones JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_goals
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals" 
    ON public.user_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
    ON public.user_goals FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
    ON public.user_goals FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
    ON public.user_goals FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. User Mood Logs Table
CREATE TABLE IF NOT EXISTS public.user_mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    label TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    note TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user_mood_logs
ALTER TABLE public.user_mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs" 
    ON public.user_mood_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood logs" 
    ON public.user_mood_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood logs" 
    ON public.user_mood_logs FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Chat Threads Table (Balance Guide AI)
CREATE TABLE IF NOT EXISTS public.chat_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Mindfulness Conversation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for chat_threads
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat threads" 
    ON public.chat_threads FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat threads" 
    ON public.chat_threads FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat threads" 
    ON public.chat_threads FOR DELETE 
    USING (auth.uid() = user_id);

-- 7. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their threads" 
    ON public.chat_messages FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert messages to their threads" 
    ON public.chat_messages FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 8. Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    author_role TEXT DEFAULT 'Community Member',
    category TEXT NOT NULL CHECK (category IN ('Grounding', 'Deep Work', 'Habit Wins', 'Questions')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Community Upvotes (to prevent double voting)
CREATE TABLE IF NOT EXISTS public.community_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(post_id, user_id)
);

-- Enable RLS for community
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert for community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow user to update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow user to delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow public read for upvotes" ON public.community_upvotes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert for upvotes" ON public.community_upvotes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow user to delete own upvotes" ON public.community_upvotes FOR DELETE USING (auth.uid() = user_id);

-- 10. Survey Responses (SPPU & Community)
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  survey_type TEXT NOT NULL CHECK (survey_type IN ('sppu', 'community')),
  department TEXT,
  stress_level INTEGER NOT NULL,
  screen_hours FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for surveys
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for survey stats" ON survey_responses FOR SELECT USING (true);
CREATE POLICY "Allow anyone to insert survey response" ON survey_responses FOR INSERT WITH CHECK (true);

-- 11. Payments Table (Razorpay Orders & Statuses)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    item_type TEXT NOT NULL CHECK (item_type IN ('subscription', 'workshop_pass')),
    item_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment history" 
    ON public.payments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service roles & users can insert payments" 
    ON public.payments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_habits_user ON public.user_habits(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_user ON public.user_mood_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);

-- 12. Privacy-preserving public audience streak summary
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

-- Worker-rights questions/reports: insert-only from the client, never publicly readable.
CREATE TABLE IF NOT EXISTS public.worker_law_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT CHECK (name IS NULL OR char_length(name) <= 100),
  email TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  law_slug TEXT NOT NULL CHECK (law_slug IN ('wages', 'industrial-relations', 'social-security', 'osh', 'posh', 'rpwd', 'apprentices', 'child-labour', 'maternity-reference', 'employee-compensation-reference')),
  submission_type TEXT NOT NULL CHECK (submission_type IN ('query', 'report')),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 10 AND 4000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_law_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.worker_law_submissions FROM anon, authenticated;
GRANT INSERT ON TABLE public.worker_law_submissions TO anon, authenticated;
DROP POLICY IF EXISTS "Anyone can submit worker law queries" ON public.worker_law_submissions;
CREATE POLICY "Anyone can submit worker law queries"
  ON public.worker_law_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- User-owned library completion and recurring schedule data.
CREATE TABLE IF NOT EXISTS public.content_completions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'podcast')),
  content_id TEXT NOT NULL CHECK (char_length(content_id) BETWEEN 1 AND 120),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_type, content_id)
);
ALTER TABLE public.content_completions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.content_completions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.content_completions TO authenticated;
DROP POLICY IF EXISTS "Users manage own content completions" ON public.content_completions;
CREATE POLICY "Users manage own content completions" ON public.content_completions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.user_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 2 AND 80),
  category TEXT NOT NULL CHECK (category IN ('work', 'break', 'personal', 'sleep', 'movement')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days SMALLINT[] NOT NULL CHECK (cardinality(days) BETWEEN 1 AND 7 AND days <@ ARRAY[0,1,2,3,4,5,6]::SMALLINT[]),
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);
CREATE INDEX IF NOT EXISTS user_schedules_user_idx ON public.user_schedules(user_id);
ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.user_schedules FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_schedules TO authenticated;
DROP POLICY IF EXISTS "Users manage own schedules" ON public.user_schedules;
CREATE POLICY "Users manage own schedules" ON public.user_schedules
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.workshop_interests (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL CHECK (program_id IN ('weekly-circle', 'care-circle')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, program_id)
);
ALTER TABLE public.workshop_interests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.workshop_interests FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.workshop_interests TO authenticated;
DROP POLICY IF EXISTS "Users manage own workshop interests" ON public.workshop_interests;
CREATE POLICY "Users manage own workshop interests" ON public.workshop_interests
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.workshop_completions (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL CHECK (program_id IN ('focus-reset', 'workday-boundaries', 'body-reset', 'weekly-circle', 'care-circle')),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, program_id)
);
ALTER TABLE public.workshop_completions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.workshop_completions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.workshop_completions TO authenticated;
DROP POLICY IF EXISTS "Users manage own workshop completions" ON public.workshop_completions;
CREATE POLICY "Users manage own workshop completions" ON public.workshop_completions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
