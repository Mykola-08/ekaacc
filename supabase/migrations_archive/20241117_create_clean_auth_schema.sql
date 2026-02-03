-- Create a clean, well-organized auth system using Supabase's built-in auth
-- This migration creates only the essential tables for a modern auth system

-- Create user profiles table to extend Supabase auth.users
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user role assignments table
CREATE TABLE public.user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.user_roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, role_id)
);

-- Create permissions table
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role permissions table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.user_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create audit logs table for security events
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.user_roles (name, description) VALUES
    ('admin', 'Full system administrator with all permissions'),
    ('user', 'Regular user with basic permissions'),
    ('moderator', 'Content moderator with limited administrative permissions');

-- Insert default permissions
INSERT INTO public.permissions (name, resource, action, description) VALUES
    ('users.read', 'users', 'read', 'Read user information'),
    ('users.write', 'users', 'write', 'Create and update users'),
    ('users.delete', 'users', 'delete', 'Delete users'),
    ('roles.read', 'roles', 'read', 'Read roles and permissions'),
    ('roles.write', 'roles', 'write', 'Create and update roles'),
    ('roles.delete', 'roles', 'delete', 'Delete roles'),
    ('content.read', 'content', 'read', 'Read content'),
    ('content.write', 'content', 'write', 'Create and update content'),
    ('content.delete', 'content', 'delete', 'Delete content'),
    ('admin.access', 'admin', 'access', 'Access admin panel');

-- Assign permissions to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'admin'),
    id 
FROM public.permissions;

-- Assign basic permissions to user role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'user'),
    id 
FROM public.permissions 
WHERE name IN ('users.read', 'content.read', 'content.write');

-- Assign moderator permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'moderator'),
    id 
FROM public.permissions 
WHERE name IN ('users.read', 'content.read', 'content.write', 'content.delete');

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_role_assignments_user_id ON public.user_role_assignments(user_id);
CREATE INDEX idx_user_role_assignments_role_id ON public.user_role_assignments(role_id);
CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.user_role_assignments (user_id, role_id)
    VALUES (NEW.id, (SELECT id FROM public.user_roles WHERE name = 'user'));
    
    INSERT INTO public.audit_logs (user_id, action, resource_type, details)
    VALUES (NEW.id, 'user.created', 'user', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update the updated_at timestamp (auth specific)
CREATE OR REPLACE FUNCTION public.update_auth_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_auth_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_auth_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- User profiles: Users can read all profiles, update their own
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- User roles: Only admins can manage roles
CREATE POLICY "Only admins can manage roles" ON public.user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments
            JOIN public.user_roles ON user_roles.id = user_role_assignments.role_id
            WHERE user_role_assignments.user_id = auth.uid()
            AND user_roles.name = 'admin'
        )
    );

-- User role assignments: Admins can manage, users can view their own
CREATE POLICY "Users can view own role assignments" ON public.user_role_assignments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage role assignments" ON public.user_role_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments AS ura
            JOIN public.user_roles ON user_roles.id = ura.role_id
            WHERE ura.user_id = auth.uid()
            AND user_roles.name = 'admin'
        )
    );

-- Permissions: Only admins can manage permissions
CREATE POLICY "Only admins can manage permissions" ON public.permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments
            JOIN public.user_roles ON user_roles.id = user_role_assignments.role_id
            WHERE user_role_assignments.user_id = auth.uid()
            AND user_roles.name = 'admin'
        )
    );

-- Role permissions: Only admins can manage
CREATE POLICY "Only admins can manage role permissions" ON public.role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments
            JOIN public.user_roles ON user_roles.id = user_role_assignments.role_id
            WHERE user_role_assignments.user_id = auth.uid()
            AND user_roles.name = 'admin'
        )
    );

-- User preferences: Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (user_id = auth.uid());

-- Audit logs: Only admins can view all logs, users can view their own
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments
            JOIN public.user_roles ON user_roles.id = user_role_assignments.role_id
            WHERE user_role_assignments.user_id = auth.uid()
            AND user_roles.name = 'admin'
        )
    );

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON public.user_profiles TO anon, authenticated;
GRANT UPDATE ON public.user_profiles TO authenticated;

GRANT SELECT ON public.user_roles TO anon, authenticated;
GRANT ALL ON public.user_roles TO authenticated;

GRANT SELECT ON public.user_role_assignments TO anon, authenticated;
GRANT ALL ON public.user_role_assignments TO authenticated;

GRANT SELECT ON public.permissions TO anon, authenticated;
GRANT ALL ON public.permissions TO authenticated;

GRANT SELECT ON public.role_permissions TO anon, authenticated;
GRANT ALL ON public.role_permissions TO authenticated;

GRANT SELECT ON public.user_preferences TO anon, authenticated;
GRANT ALL ON public.user_preferences TO authenticated;

GRANT SELECT ON public.audit_logs TO anon, authenticated;
GRANT ALL ON public.audit_logs TO authenticated;