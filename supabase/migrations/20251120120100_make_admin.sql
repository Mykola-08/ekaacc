-- Migration to promote mvoronink@gmail.com to admin

DO $$
DECLARE
  target_user_id UUID;
  admin_role_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'mvoronink@gmail.com';
  
  -- Find the admin role
  SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
  
  -- Perform the assignment if both exist
  IF target_user_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
    INSERT INTO public.user_role_assignments (user_id, role_id)
    VALUES (target_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RAISE NOTICE 'User mvoronink@gmail.com has been promoted to admin.';
  ELSE
    RAISE WARNING 'User mvoronink@gmail.com or admin role not found.';
  END IF;
END $$;
