-- Migration to promote mvoronink@gmail.com to admin

DO $$
DECLARE
  target_user_id UUID;
  admin_role_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'mvoronink@gmail.com';
  
  IF target_user_id IS NULL THEN
    RAISE WARNING 'User mvoronink@gmail.com not found.';
    RETURN;
  END IF;

  -- 1. Update auth.users metadata (Newer system)
  UPDATE auth.users 
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
  WHERE id = target_user_id;
  
  RAISE NOTICE 'Updated auth.users metadata for mvoronink@gmail.com';

  -- 2. Update user_roles table (Older system)
  -- Check if table and column exist to avoid errors
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
    
    -- Check if 'name' column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name') THEN
       
       -- Find admin role
       EXECUTE 'SELECT id FROM public.user_roles WHERE name = $1' INTO admin_role_id USING 'admin';
       
       IF admin_role_id IS NOT NULL THEN
         INSERT INTO public.user_role_assignments (user_id, role_id)
         VALUES (target_user_id, admin_role_id)
         ON CONFLICT (user_id, role_id) DO NOTHING;
         RAISE NOTICE 'Assigned admin role in user_role_assignments';
       ELSE
         RAISE WARNING 'Admin role not found in user_roles table';
       END IF;
       
    ELSE
       RAISE WARNING 'Column "name" not found in user_roles table';
    END IF;

  ELSE
    RAISE WARNING 'Table user_roles not found';
  END IF;

END $$;
