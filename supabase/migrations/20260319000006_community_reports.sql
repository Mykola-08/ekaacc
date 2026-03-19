CREATE TABLE IF NOT EXISTS public.community_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'misinformation', 'unsafe', 'other')),
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Users can create own community reports'
  ) THEN
    CREATE POLICY "Users can create own community reports"
      ON public.community_post_reports
      FOR INSERT
      WITH CHECK (auth.uid() = reported_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Users can view own community reports'
  ) THEN
    CREATE POLICY "Users can view own community reports"
      ON public.community_post_reports
      FOR SELECT
      USING (auth.uid() = reported_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Admins can view all community reports'
  ) THEN
    CREATE POLICY "Admins can view all community reports"
      ON public.community_post_reports
      FOR SELECT
      USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin');
  END IF;
END
$$;
