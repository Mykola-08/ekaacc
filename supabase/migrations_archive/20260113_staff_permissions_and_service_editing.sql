-- Migration: Staff Permissions and Service Editing
-- Date: 2026-01-13
-- Goals:
-- 1. Link Staff profiles to Auth Users.
-- 2. Define 'manage_services' permission.
-- 3. Grant 'manage_services' to 'Admin' and 'Lead Therapist' roles.
-- 4. Secure 'service' and 'service_variant' tables with RBAC policies.

-- 1. Link Staff to Users
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS staff_user_id_idx ON staff (user_id);

-- 2. Helper Function for Checking Permissions (if not exists)
CREATE OR REPLACE FUNCTION public.has_permission(check_user_id uuid, check_perm_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.get_user_permissions(check_user_id) WHERE permission_key = check_perm_key
  );
END;
$$;

-- 3. Define Permissions
INSERT INTO permissions (key, name, description)
VALUES 
  ('manage_services', 'Manage Services', 'Create, update, and delete services and variants')
ON CONFLICT (key) DO NOTHING;

-- 4. Grant Permissions to Roles
-- Admin gets everything usually, best to make it explicit for this system
INSERT INTO role_permissions (role, permission_key)
VALUES 
  ('Admin', 'manage_services'),
  ('Lead Therapist', 'manage_services')
ON CONFLICT (role, permission_key) DO NOTHING;

-- 5. Update RLS on 'service' table
ALTER TABLE service ENABLE ROW LEVEL SECURITY;

-- Allow read for everyone (already likely has a policy, but ensuring it)
CREATE POLICY "Public read access" ON service FOR SELECT USING (true);

-- Allow full management for users with permission
CREATE POLICY "Manage services with permission" ON service FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    public.has_permission(auth.uid(), 'manage_services') OR 
    -- Fallback for super admins checked via metadata directly if permission system fails
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'Admin'
  )
);

-- 6. Update RLS on 'service_variant' table
ALTER TABLE service_variant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access variants" ON service_variant FOR SELECT USING (true);

CREATE POLICY "Manage variants with permission" ON service_variant FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    public.has_permission(auth.uid(), 'manage_services') OR 
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'Admin'
  )
);
