-- Fix project_likes and project_comments tables to support text IDs and proper relationships

-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.project_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    project_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.project_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    project_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    parent_id UUID REFERENCES public.project_comments(id)
);

-- 2. Modify existing tables if needed (Handle constraints and types)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Handle project_likes: Drop FK on project_id if exists
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'project_likes'
          AND kcu.column_name = 'project_id'
          AND tc.table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.project_likes DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- Handle project_likes: Change project_id to TEXT if it is UUID
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'project_likes'
        AND column_name = 'project_id'
        AND data_type = 'uuid'
        AND table_schema = 'public'
    ) THEN
         ALTER TABLE public.project_likes ALTER COLUMN project_id TYPE text;
    END IF;

    -- Handle project_comments: Drop FK on project_id if exists
    FOR r IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'project_comments'
          AND kcu.column_name = 'project_id'
          AND tc.table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.project_comments DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;

    -- Handle project_comments: Change project_id to TEXT if it is UUID
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'project_comments'
        AND column_name = 'project_id'
        AND data_type = 'uuid'
        AND table_schema = 'public'
    ) THEN
         ALTER TABLE public.project_comments ALTER COLUMN project_id TYPE text;
    END IF;

    -- Handle project_comments: Ensure user_id FK exists (for user:profiles join)
    -- Check if ANY FK exists on user_id
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'project_comments'
          AND kcu.column_name = 'user_id'
          AND tc.table_schema = 'public'
    ) THEN
        -- Add FK to profiles
        ALTER TABLE public.project_comments
        ADD CONSTRAINT project_comments_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

END $$;

-- 3. RLS Policies

-- project_likes
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_likes' AND policyname = 'Public can view likes'
    ) THEN
        CREATE POLICY "Public can view likes" ON public.project_likes FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_likes' AND policyname = 'Authenticated users can toggle likes'
    ) THEN
        CREATE POLICY "Authenticated users can toggle likes" ON public.project_likes FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- project_comments
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_comments' AND policyname = 'Public can view comments'
    ) THEN
        CREATE POLICY "Public can view comments" ON public.project_comments FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_comments' AND policyname = 'Authenticated users can comment'
    ) THEN
        CREATE POLICY "Authenticated users can comment" ON public.project_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_comments' AND policyname = 'Users can update own comments'
    ) THEN
        CREATE POLICY "Users can update own comments" ON public.project_comments FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'project_comments' AND policyname = 'Users can delete own comments'
    ) THEN
        CREATE POLICY "Users can delete own comments" ON public.project_comments FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;
