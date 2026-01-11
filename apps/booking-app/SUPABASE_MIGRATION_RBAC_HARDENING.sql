-- RBAC Hardening
-- 1. Updates permission checking to rely on Trusted Tables (profiles) instead of User Metadata.
-- 2. Secures the 'profiles' table to prevent role escalation.

-- REPLACE the helper function to use public.profiles instead of auth.users metadata
-- This is stricter because 'profiles' is fully under RLS control.
CREATE OR REPLACE FUNCTION public.get_user_permissions(check_user_id UUID)
RETURNS TABLE (permission_key VARCHAR) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
    user_role_val VARCHAR;
BEGIN
    -- 1. Get user role from Trusted 'profiles' table
    -- We assume 'profiles' table has a 'role' column. 
    -- If using enum, cast to text.
    SELECT role::text INTO user_role_val 
    FROM public.profiles 
    WHERE id = check_user_id; -- Assumes profile.id = auth.users.id (if linked via auth_id)
    
    -- If profiles.id is NOT auth.id, use: WHERE auth_id = check_user_id
    IF user_role_val IS NULL THEN
        SELECT role::text INTO user_role_val 
        FROM public.profiles 
        WHERE auth_id = check_user_id;
    END IF;

    -- Fallback to metadata ONLY if profile not found (optional, maybe unsafe for very strict)
    IF user_role_val IS NULL THEN
         RETURN; -- Strict mode: No profile = No permissions.
    END IF;

    -- 2. Return Permissions
    RETURN QUERY
    -- Role permissions
    SELECT rp.permission_key 
    FROM public.role_permissions rp 
    WHERE rp.role = user_role_val
    UNION
    -- Custom granted permissions
    SELECT ucp.permission_key 
    FROM public.user_custom_permissions ucp 
    WHERE ucp.user_id = check_user_id AND ucp.is_granted = true
    EXCEPT
    -- Custom revoked permissions
    SELECT ucp.permission_key 
    FROM public.user_custom_permissions ucp 
    WHERE ucp.user_id = check_user_id AND ucp.is_granted = false;
END;
$$;

-- SECURE PROFILES: Prevent Role Escalation
-- Ensure users cannot update their own role column.
alter table profiles enable row level security;

-- Policy: Users can update their own profile BUT NOT the role.
-- Note: Postgres RLS for UPDATE can be tricky with specific columns. 
-- Best practice: separate policy or triggers.
-- Helper Trigger to reset role on update if user is not admin.

CREATE OR REPLACE FUNCTION public.protect_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the actor is an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.role_permissions rp 
        WHERE rp.role = (SELECT role::text FROM public.profiles WHERE auth_id = auth.uid()) 
        AND rp.permission_key = 'user_management.manage'
    ) THEN
        RAISE EXCEPTION 'You are not authorized to change roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON profiles;
CREATE TRIGGER tr_protect_profile_role
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_role_change();

