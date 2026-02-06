-- Centralized application error reporting table.
-- Stores client and server errors with release/version context.
CREATE TABLE IF NOT EXISTS public.app_error_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('client', 'server')),
  level text NOT NULL DEFAULT 'error' CHECK (level IN ('error', 'warning', 'fatal')),
  message text NOT NULL,
  stack text,
  digest text,
  route text,
  url text,
  user_id uuid,
  user_agent text,
  ip_address inet,
  request_id text,
  environment text NOT NULL,
  app_version text NOT NULL,
  app_build_id text NOT NULL,
  app_build_timestamp timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  location jsonb NOT NULL DEFAULT '{}'::jsonb,
  additional_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_app_error_reports_created_at
  ON public.app_error_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_error_reports_user_id
  ON public.app_error_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_app_error_reports_build_id
  ON public.app_error_reports (app_build_id);
CREATE INDEX IF NOT EXISTS idx_app_error_reports_environment
  ON public.app_error_reports (environment);

ALTER TABLE public.app_error_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Therapists can view error reports" ON public.app_error_reports;
CREATE POLICY "Therapists can view error reports"
  ON public.app_error_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = (select auth.uid())
        AND profiles.role = 'therapist'
    )
  );

