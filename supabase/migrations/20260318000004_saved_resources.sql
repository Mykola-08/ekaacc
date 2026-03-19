CREATE TABLE IF NOT EXISTS public.saved_resources (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);

ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_resources'
      AND policyname = 'Users manage own saved resources'
  ) THEN
    CREATE POLICY "Users manage own saved resources"
      ON public.saved_resources
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
