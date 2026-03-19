DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Admins can update community reports'
  ) THEN
    CREATE POLICY "Admins can update community reports"
      ON public.community_post_reports
      FOR UPDATE
      USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin')
      WITH CHECK (coalesce((auth.jwt() ->> 'role'), '') = 'admin');
  END IF;
END
$$;
