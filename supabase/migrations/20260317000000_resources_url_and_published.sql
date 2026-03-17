-- Migration: Add url and is_published to resources table
-- Rationale: resources table has video_url but needs a generic url field and
--            an explicit is_published boolean for simpler frontend filtering.

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;

-- Back-fill: use video_url as url when present
UPDATE public.resources
  SET url = video_url
  WHERE video_url IS NOT NULL AND url IS NULL;

-- Mark all previously published (published_at set) as published
UPDATE public.resources
  SET is_published = (published_at IS NOT NULL)
  WHERE true;

-- Add a type alias column so frontend can use consistent "type" naming
-- while the existing "category" column keeps its CHECK constraint.
-- type mirrors category with any new entries going via category.
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS type TEXT
  GENERATED ALWAYS AS (category) STORED;

COMMENT ON COLUMN public.resources.url IS 'Generic external URL for the resource (video, article, etc.)';
COMMENT ON COLUMN public.resources.is_published IS 'Whether the resource is visible to end users';
COMMENT ON COLUMN public.resources.type IS 'Computed alias for category - same value, improves API consistency';
