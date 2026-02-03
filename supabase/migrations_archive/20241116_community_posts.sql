-- Create community_posts table for user-generated content and discussions
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_published ON community_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_community_posts_published_at ON community_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_featured ON community_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_community_posts_likes_count ON community_posts(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view published posts and their own unpublished posts
CREATE POLICY "Users can view published posts" ON community_posts
    FOR SELECT
    USING (
        is_published = true 
        OR user_id = auth.uid()
    );

-- Users can create their own posts
CREATE POLICY "Users can create their own posts" ON community_posts
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Users can update their own posts
CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE
    USING (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON community_posts
    FOR DELETE
    USING (user_id = auth.uid());

-- Admin can manage all posts (assuming admin role exists)
CREATE POLICY "Admins can manage all posts" ON community_posts
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura
            JOIN user_roles ur ON ura.role_id = ur.id
            WHERE ura.user_id = auth.uid() 
            AND ur.name = 'admin'
        )
    );

-- Grant permissions
GRANT SELECT ON community_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON community_posts TO authenticated;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to set published_at when post is published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_published = true AND OLD.is_published = false THEN
        NEW.published_at = now();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_community_posts_published_at
    BEFORE UPDATE ON community_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_published_at();