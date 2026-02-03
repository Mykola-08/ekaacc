-- Create transaction management RPC functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function is called via RPC to indicate transaction start
    -- Actual transaction management is handled by Supabase client
    -- This function serves as a placeholder for transaction tracking
    PERFORM pg_advisory_xact_lock(hashtext('transaction_lock_' || auth.uid()::text));
END;
$$;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function is called via RPC to indicate transaction commit
    -- Actual transaction management is handled by Supabase client
    -- This function serves as a placeholder for transaction tracking
    PERFORM pg_advisory_unlock(hashtext('transaction_lock_' || auth.uid()::text));
END;
$$;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function is called via RPC to indicate transaction rollback
    -- Actual transaction management is handled by Supabase client
    -- This function serves as a placeholder for transaction tracking
    PERFORM pg_advisory_unlock(hashtext('transaction_lock_' || auth.uid()::text));
END;
$$;

-- Grant permissions for RPC functions
GRANT EXECUTE ON FUNCTION begin_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION commit_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_transaction() TO authenticated;

-- Fix column mismatches in existing tables
-- Fix donations table - add user_id column alongside donor_id
ALTER TABLE donations ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);

-- Fix reports table - add report_type column alongside type
ALTER TABLE reports ADD COLUMN IF NOT EXISTS report_type TEXT;
UPDATE reports SET report_type = type WHERE report_type IS NULL;
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON reports(report_type);

-- Fix subscriptions table - add missing columns that code expects
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS interval TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS price INTEGER;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Add role column to users table if it doesn't exist
-- Note: This might need to be handled differently depending on your auth setup
-- For now, we'll create a view that includes role information
CREATE OR REPLACE VIEW user_roles_view AS
SELECT 
    u.id,
    u.email,
    COALESCE(ura.role_name, 'user') as role
FROM auth.users u
LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN user_roles ur ON ura.role_id = ur.id;

-- Grant permissions for new tables
GRANT SELECT ON admin_notifications TO anon, authenticated;
GRANT SELECT ON notification_templates TO anon, authenticated;
GRANT ALL ON user_notifications TO authenticated;
GRANT SELECT ON system_configurations TO anon, authenticated;
GRANT SELECT ON payments TO authenticated;
GRANT ALL ON admin_notifications TO authenticated;
GRANT ALL ON notification_templates TO authenticated;
GRANT ALL ON system_configurations TO authenticated;
GRANT ALL ON payments TO authenticated;