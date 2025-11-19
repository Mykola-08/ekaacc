-- Features Table
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'alpha', -- 'alpha', 'beta', 'stable', 'deprecated'
    is_enabled BOOLEAN DEFAULT true,
    min_role VARCHAR(50) DEFAULT 'Patient',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Feature Enrollment (Alpha/Beta programs)
CREATE TABLE IF NOT EXISTS user_feature_enrollment (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    program VARCHAR(20) NOT NULL, -- 'alpha', 'beta'
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, program)
);

-- User Feature Overrides
CREATE TABLE IF NOT EXISTS user_feature_overrides (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_key VARCHAR(100) REFERENCES features(key) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, feature_key)
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_key VARCHAR(100) REFERENCES permissions(key) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_key)
);

-- User Custom Permissions
CREATE TABLE IF NOT EXISTS user_custom_permissions (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) REFERENCES permissions(key) ON DELETE CASCADE,
    is_granted BOOLEAN NOT NULL,
    PRIMARY KEY (user_id, permission_key)
);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feature_enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feature_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_permissions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Features: Everyone can read enabled features, Admins can manage
CREATE POLICY "Everyone can read features" ON features FOR SELECT USING (true);
CREATE POLICY "Admins can manage features" ON features FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);

-- Enrollment: Users can manage their own enrollment
CREATE POLICY "Users can manage their own enrollment" ON user_feature_enrollment FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all enrollments" ON user_feature_enrollment FOR SELECT USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);

-- Overrides: Admins only
CREATE POLICY "Admins can manage overrides" ON user_feature_overrides FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);
CREATE POLICY "Users can view their own overrides" ON user_feature_overrides FOR SELECT USING (auth.uid() = user_id);

-- Permissions: Read only for everyone (to check permissions), Admins manage
CREATE POLICY "Everyone can read permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage permissions" ON permissions FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);

-- Role Permissions: Read only for everyone
CREATE POLICY "Everyone can read role permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage role permissions" ON role_permissions FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);

-- User Custom Permissions: Admins manage, Users view own
CREATE POLICY "Admins can manage user custom permissions" ON user_custom_permissions FOR ALL USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'Admin')
);
CREATE POLICY "Users can view their own custom permissions" ON user_custom_permissions FOR SELECT USING (auth.uid() = user_id);

-- Functions to check permissions and features

CREATE OR REPLACE FUNCTION has_permission(user_id UUID, permission_key VARCHAR)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    user_role VARCHAR;
    has_role_perm BOOLEAN;
    custom_perm BOOLEAN;
BEGIN
    -- Get user role
    SELECT raw_user_meta_data->>'role' INTO user_role FROM auth.users WHERE id = user_id;
    
    -- Check role permission
    SELECT EXISTS (SELECT 1 FROM role_permissions WHERE role = user_role AND role_permissions.permission_key = has_permission.permission_key) INTO has_role_perm;
    
    -- Check custom permission override
    SELECT is_granted INTO custom_perm FROM user_custom_permissions WHERE user_custom_permissions.user_id = has_permission.user_id AND user_custom_permissions.permission_key = has_permission.permission_key;
    
    IF custom_perm IS NOT NULL THEN
        RETURN custom_perm;
    END IF;
    
    RETURN has_role_perm;
END;
$$;

CREATE OR REPLACE FUNCTION is_feature_enabled(user_id UUID, feature_key VARCHAR)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    feature_status VARCHAR;
    feature_enabled BOOLEAN;
    user_enrolled BOOLEAN;
    override_enabled BOOLEAN;
BEGIN
    -- Get feature details
    SELECT status, is_enabled INTO feature_status, feature_enabled FROM features WHERE key = feature_key;
    
    IF NOT feature_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Check override
    SELECT is_enabled INTO override_enabled FROM user_feature_overrides WHERE user_feature_overrides.user_id = is_feature_enabled.user_id AND user_feature_overrides.feature_key = is_feature_enabled.feature_key;
    
    IF override_enabled IS NOT NULL THEN
        RETURN override_enabled;
    END IF;
    
    -- Check status requirements
    IF feature_status = 'stable' THEN
        RETURN TRUE;
    ELSIF feature_status = 'beta' THEN
        SELECT EXISTS (SELECT 1 FROM user_feature_enrollment WHERE user_feature_enrollment.user_id = is_feature_enabled.user_id AND program = 'beta') INTO user_enrolled;
        RETURN user_enrolled;
    ELSIF feature_status = 'alpha' THEN
        SELECT EXISTS (SELECT 1 FROM user_feature_enrollment WHERE user_feature_enrollment.user_id = is_feature_enabled.user_id AND program = 'alpha') INTO user_enrolled;
        RETURN user_enrolled;
    END IF;
    
    RETURN FALSE;
END;
$$;
