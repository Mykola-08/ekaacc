-- User Groups
CREATE TABLE IF NOT EXISTS user_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Group Members
CREATE TABLE IF NOT EXISTS user_group_members (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES user_groups(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, group_id)
);

-- Broadcasts History
CREATE TABLE IF NOT EXISTS broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    group_id UUID REFERENCES user_groups(id),
    sent_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Admins can manage groups
CREATE POLICY "Admins can manage user groups"
    ON user_groups
    USING (
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
    );

-- Admins can manage members
CREATE POLICY "Admins can manage group members"
    ON user_group_members
    USING (
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
    );

-- Admins can manage broadcasts
CREATE POLICY "Admins can manage broadcasts"
    ON broadcasts
    USING (
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
    );

-- Seed default groups
INSERT INTO user_groups (name, description) VALUES 
('All Users', 'All registered users'),
('Newsletter', 'Users subscribed to the newsletter'),
('Beta Testers', 'Users opted into beta features')
ON CONFLICT (name) DO NOTHING;
