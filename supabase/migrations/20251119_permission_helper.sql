CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS TABLE (permission_key VARCHAR) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    -- Get user role
    SELECT raw_user_meta_data->>'role' INTO user_role FROM auth.users WHERE id = user_id;
    
    RETURN QUERY
    -- Role permissions
    SELECT rp.permission_key 
    FROM role_permissions rp 
    WHERE rp.role = user_role
    UNION
    -- Custom granted permissions
    SELECT ucp.permission_key 
    FROM user_custom_permissions ucp 
    WHERE ucp.user_id = get_user_permissions.user_id AND ucp.is_granted = true
    EXCEPT
    -- Custom revoked permissions
    SELECT ucp.permission_key 
    FROM user_custom_permissions ucp 
    WHERE ucp.user_id = get_user_permissions.user_id AND ucp.is_granted = false;
END;
$$;
