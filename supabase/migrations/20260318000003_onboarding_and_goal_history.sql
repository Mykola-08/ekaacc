-- Onboarding completion marker
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Goal progress history table for milestone timeline
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  progress_percentage integer NOT NULL CHECK (progress_percentage BETWEEN 0 AND 100),
  note text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'goal_progress_history'
      AND policyname = 'Users can manage own goal history'
  ) THEN
    CREATE POLICY "Users can manage own goal history"
    ON public.goal_progress_history
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
