-- Function to promote a user to admin
-- Usage: SELECT promote_to_admin('user_email@example.com');

CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;

    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';

    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found';
    END IF;

    -- Check if assignment already exists
    IF EXISTS (SELECT 1 FROM public.user_role_assignments WHERE user_id = target_user_id AND role_id = admin_role_id) THEN
        RAISE NOTICE 'User % is already an admin', user_email;
        RETURN;
    END IF;

    -- Insert the role assignment
    INSERT INTO public.user_role_assignments (user_id, role_id)
    VALUES (target_user_id, admin_role_id);

    RAISE NOTICE 'User % promoted to admin successfully', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
