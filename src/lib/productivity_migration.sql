-- Apply once after the existing Balance Compass schema/streak migration.
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
