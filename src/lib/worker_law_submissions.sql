-- Apply once to the Supabase project used by this app.
-- Submissions are insert-only from the public client; there is no browser read policy.
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
ALTER TABLE public.worker_law_submissions DROP CONSTRAINT IF EXISTS worker_law_submissions_law_slug_check;
ALTER TABLE public.worker_law_submissions ADD CONSTRAINT worker_law_submissions_law_slug_check CHECK (law_slug IN ('wages', 'industrial-relations', 'social-security', 'osh', 'posh', 'rpwd', 'apprentices', 'child-labour', 'maternity-reference', 'employee-compensation-reference'));
REVOKE ALL ON TABLE public.worker_law_submissions FROM anon, authenticated;
GRANT INSERT ON TABLE public.worker_law_submissions TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit worker law queries" ON public.worker_law_submissions;
CREATE POLICY "Anyone can submit worker law queries"
  ON public.worker_law_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
