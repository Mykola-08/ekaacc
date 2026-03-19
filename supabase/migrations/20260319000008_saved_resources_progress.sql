ALTER TABLE public.saved_resources
ADD COLUMN IF NOT EXISTS last_opened_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_saved_resources_last_opened_at
  ON public.saved_resources(user_id, last_opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_resources_completed_at
  ON public.saved_resources(user_id, completed_at DESC);
