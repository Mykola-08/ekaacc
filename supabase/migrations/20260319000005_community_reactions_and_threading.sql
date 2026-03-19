ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{"like":0,"heart":0,"pray":0}'::jsonb;

ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_community_posts_parent_id ON public.community_posts(parent_id);
