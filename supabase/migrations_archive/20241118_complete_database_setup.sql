-- Comprehensive Database Setup Migration
-- This migration creates all missing tables needed for existing functions to work
-- Uses conditional creation to avoid conflicts with existing tables

-- Function to check if table exists
CREATE OR REPLACE FUNCTION table_exists(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if column exists in table
CREATE OR REPLACE FUNCTION column_exists(table_name TEXT, column_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- 1. ADMIN NOTIFICATIONS TABLE
DO $$
BEGIN
    IF NOT table_exists('admin_notifications') THEN
        CREATE TABLE admin_notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            recipients TEXT,
            recipient_ids UUID[],
            priority TEXT DEFAULT 'medium',
            is_active BOOLEAN DEFAULT true,
            created_by UUID REFERENCES auth.users(id),
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view all notifications" ON admin_notifications
            FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "Admins can create notifications" ON admin_notifications
            FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "Admins can update notifications" ON admin_notifications
            FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "Admins can delete notifications" ON admin_notifications
            FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

        -- Add indexes
        CREATE INDEX idx_admin_notifications_type ON admin_notifications(type);
        CREATE INDEX idx_admin_notifications_priority ON admin_notifications(priority);
        CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at);
        CREATE INDEX idx_admin_notifications_is_active ON admin_notifications(is_active);
    END IF;
END $$;

-- 2. NOTIFICATION TEMPLATES TABLE
DO $$
BEGIN
    IF NOT table_exists('notification_templates') THEN
        CREATE TABLE notification_templates (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            subject TEXT,
            body TEXT NOT NULL,
            variables TEXT[],
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view templates" ON notification_templates
            FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "Admins can manage templates" ON notification_templates
            FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

        -- Add indexes
        CREATE INDEX idx_notification_templates_type ON notification_templates(type);
        CREATE INDEX idx_notification_templates_is_active ON notification_templates(is_active);
    END IF;
END $$;

-- 3. USER NOTIFICATIONS TABLE
DO $$
BEGIN
    IF NOT table_exists('user_notifications') THEN
        CREATE TABLE user_notifications (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            priority TEXT DEFAULT 'medium',
            metadata JSONB,
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own notifications" ON user_notifications
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own notifications" ON user_notifications
            FOR UPDATE USING (auth.uid() = user_id);

        -- Add indexes
        CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
        CREATE INDEX idx_user_notifications_type ON user_notifications(type);
        CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
        CREATE INDEX idx_user_notifications_priority ON user_notifications(priority);
        CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);
    END IF;
END $$;

-- 4. SYSTEM CONFIGURATIONS TABLE
DO $$
BEGIN
    IF NOT table_exists('system_configurations') THEN
        CREATE TABLE system_configurations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            key TEXT NOT NULL UNIQUE,
            value TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'general',
            is_encrypted BOOLEAN DEFAULT false,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE system_configurations ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view configurations" ON system_configurations
            FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "Admins can manage configurations" ON system_configurations
            FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

        -- Add indexes
        CREATE INDEX idx_system_configurations_key ON system_configurations(key);
        CREATE INDEX idx_system_configurations_category ON system_configurations(category);
        CREATE INDEX idx_system_configurations_is_active ON system_configurations(is_active);
    END IF;
END $$;

-- 5. PAYMENTS TABLE
DO $$
BEGIN
    IF NOT table_exists('payments') THEN
        CREATE TABLE payments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            currency TEXT DEFAULT 'USD',
            status TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            transaction_id TEXT,
            gateway_response JSONB,
            metadata JSONB,
            processed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own payments" ON payments
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Admins can view all payments" ON payments
            FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
        
        CREATE POLICY "System can create payments" ON payments
            FOR INSERT WITH CHECK (true);

        -- Add indexes
        CREATE INDEX idx_payments_user_id ON payments(user_id);
        CREATE INDEX idx_payments_status ON payments(status);
        CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
        CREATE INDEX idx_payments_created_at ON payments(created_at);
    END IF;
END $$;

-- 6. TRANSACTION RPC FUNCTIONS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'begin_transaction') THEN
        CREATE OR REPLACE FUNCTION begin_transaction(transaction_type TEXT, amount DECIMAL, description TEXT)
        RETURNS UUID AS $$
        DECLARE
            transaction_id UUID;
        BEGIN
            INSERT INTO transactions (type, amount, description, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING id INTO transaction_id;
            
            RETURN transaction_id;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'commit_transaction') THEN
        CREATE OR REPLACE FUNCTION commit_transaction(transaction_id UUID)
        RETURNS BOOLEAN AS $$
        BEGIN
            UPDATE transactions 
            SET status = 'completed', 
                updated_at = NOW()
            WHERE id = $1 AND status = 'pending';
            
            RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rollback_transaction') THEN
        CREATE OR REPLACE FUNCTION rollback_transaction(transaction_id UUID, reason TEXT)
        RETURNS BOOLEAN AS $$
        BEGIN
            UPDATE transactions 
            SET status = 'failed',
                description = COALESCE(description, '') || ' - Rolled back: ' || COALESCE($2, ''),
                updated_at = NOW()
            WHERE id = $1 AND status = 'pending';
            
            RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END $$;

-- 7. FIX EXISTING TABLE COLUMNS (only if tables exist)
DO $$
BEGIN
    IF table_exists('donations') AND column_exists('donations', 'donor_id') THEN
        -- Add missing columns to donations table if they don't exist
        IF NOT column_exists('donations', 'campaign_id') THEN
            ALTER TABLE donations ADD COLUMN campaign_id UUID;
        END IF;
        IF NOT column_exists('donations', 'anonymous') THEN
            ALTER TABLE donations ADD COLUMN anonymous BOOLEAN DEFAULT false;
        END IF;
        IF NOT column_exists('donations', 'recurring') THEN
            ALTER TABLE donations ADD COLUMN recurring BOOLEAN DEFAULT false;
        END IF;
        IF NOT column_exists('donations', 'metadata') THEN
            ALTER TABLE donations ADD COLUMN metadata JSONB;
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('reports') AND column_exists('reports', 'reporter_id') THEN
        -- Add missing columns to reports table if they don't exist
        IF NOT column_exists('reports', 'moderator_notes') THEN
            ALTER TABLE reports ADD COLUMN moderator_notes TEXT;
        END IF;
        IF NOT column_exists('reports', 'escalated_at') THEN
            ALTER TABLE reports ADD COLUMN escalated_at TIMESTAMPTZ;
        END IF;
        IF NOT column_exists('reports', 'resolved_by') THEN
            ALTER TABLE reports ADD COLUMN resolved_by UUID;
        END IF;
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('subscriptions') AND column_exists('subscriptions', 'user_id') THEN
        -- Add missing columns to subscriptions table if they don't exist
        IF NOT column_exists('subscriptions', 'cancel_reason') THEN
            ALTER TABLE subscriptions ADD COLUMN cancel_reason TEXT;
        END IF;
        IF NOT column_exists('subscriptions', 'cancelled_at') THEN
            ALTER TABLE subscriptions ADD COLUMN cancelled_at TIMESTAMPTZ;
        END IF;
        IF NOT column_exists('subscriptions', 'trial_ends_at') THEN
            ALTER TABLE subscriptions ADD COLUMN trial_ends_at TIMESTAMPTZ;
        END IF;
    END IF;
END $$;

-- 8. GRANT PERMISSIONS
GRANT SELECT ON admin_notifications TO anon, authenticated;
GRANT SELECT ON notification_templates TO anon, authenticated;
GRANT SELECT, UPDATE ON user_notifications TO anon, authenticated;
GRANT SELECT ON system_configurations TO anon, authenticated;
GRANT SELECT ON payments TO anon, authenticated;
GRANT EXECUTE ON FUNCTION begin_transaction TO anon, authenticated;
GRANT EXECUTE ON FUNCTION commit_transaction TO anon, authenticated;
GRANT EXECUTE ON FUNCTION rollback_transaction TO anon, authenticated;

-- 9. CREATE TRIGGERS FOR UPDATED_AT
DO $$
BEGIN
    IF table_exists('admin_notifications') THEN
        CREATE TRIGGER update_admin_notifications_updated_at
            BEFORE UPDATE ON admin_notifications
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('notification_templates') THEN
        CREATE TRIGGER update_notification_templates_updated_at
            BEFORE UPDATE ON notification_templates
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('user_notifications') THEN
        CREATE TRIGGER update_user_notifications_updated_at
            BEFORE UPDATE ON user_notifications
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('system_configurations') THEN
        CREATE TRIGGER update_system_configurations_updated_at
            BEFORE UPDATE ON system_configurations
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF table_exists('payments') THEN
        CREATE TRIGGER update_payments_updated_at
            BEFORE UPDATE ON payments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 10. INSERT DEFAULT SYSTEM CONFIGURATIONS
DO $$
BEGIN
    IF table_exists('system_configurations') THEN
        INSERT INTO system_configurations (key, value, description, category) VALUES
            ('site_name', 'Therapy Platform', 'Name of the website/application', 'general'),
            ('site_description', 'A comprehensive therapy and mental health platform', 'Description of the website/application', 'general'),
            ('support_email', 'support@therapyplatform.com', 'Primary support email address', 'contact'),
            ('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'uploads'),
            ('session_timeout_minutes', '30', 'User session timeout in minutes', 'security'),
            ('password_reset_expiry_hours', '24', 'Password reset token expiry time in hours', 'security'),
            ('email_verification_required', 'true', 'Whether email verification is required for new users', 'registration'),
            ('default_user_role', 'user', 'Default role assigned to new users', 'registration'),
            ('payment_gateway_enabled', 'true', 'Whether payment processing is enabled', 'payments'),
            ('stripe_publishable_key', '', 'Stripe publishable key for client-side operations', 'payments'),
            ('stripe_secret_key', '', 'Stripe secret key for server-side operations', 'payments'),
            ('mailgun_api_key', '', 'Mailgun API key for email services', 'email'),
            ('mailgun_domain', '', 'Mailgun domain for email services', 'email'),
            ('twilio_account_sid', '', 'Twilio account SID for SMS services', 'sms'),
            ('twilio_auth_token', '', 'Twilio auth token for SMS services', 'sms'),
            ('twilio_phone_number', '', 'Twilio phone number for SMS services', 'sms'),
            ('google_analytics_id', '', 'Google Analytics tracking ID', 'analytics'),
            ('facebook_app_id', '', 'Facebook app ID for social login', 'social'),
            ('facebook_app_secret', '', 'Facebook app secret for social login', 'social'),
            ('google_client_id', '', 'Google client ID for social login', 'social'),
            ('google_client_secret', '', 'Google client secret for social login', 'social'),
            ('maintenance_mode', 'false', 'Whether the site is in maintenance mode', 'maintenance'),
            ('maintenance_message', 'Site is currently under maintenance. Please check back later.', 'Message displayed during maintenance', 'maintenance'),
            ('terms_of_service_url', '/terms', 'URL to terms of service page', 'legal'),
            ('privacy_policy_url', '/privacy', 'URL to privacy policy page', 'legal'),
            ('cookie_policy_url', '/cookies', 'URL to cookie policy page', 'legal'),
            ('max_login_attempts', '5', 'Maximum number of failed login attempts before lockout', 'security'),
            ('login_lockout_duration_minutes', '30', 'Duration of login lockout in minutes', 'security'),
            ('two_factor_auth_enabled', 'false', 'Whether two-factor authentication is enabled', 'security'),
            ('session_storage_type', 'database', 'Where to store session data (database|redis|memory)', 'sessions'),
            ('redis_host', 'localhost', 'Redis server host for session storage', 'redis'),
            ('redis_port', '6379', 'Redis server port for session storage', 'redis'),
            ('redis_password', '', 'Redis server password for session storage', 'redis'),
            ('redis_database', '0', 'Redis database number for session storage', 'redis'),
            ('file_storage_type', 'local', 'Where to store uploaded files (local|s3|gcs)', 'storage'),
            ('aws_access_key_id', '', 'AWS access key ID for S3 storage', 'aws'),
            ('aws_secret_access_key', '', 'AWS secret access key for S3 storage', 'aws'),
            ('aws_region', 'us-east-1', 'AWS region for S3 storage', 'aws'),
            ('s3_bucket_name', '', 'S3 bucket name for file storage', 'aws'),
            ('google_cloud_project_id', '', 'Google Cloud project ID for GCS storage', 'gcp'),
            ('google_cloud_key_file', '', 'Google Cloud service account key file path', 'gcp'),
            ('gcs_bucket_name', '', 'Google Cloud Storage bucket name', 'gcp'),
            ('log_level', 'info', 'Application logging level (debug|info|warn|error)', 'logging'),
            ('log_file_path', 'logs/app.log', 'Path to application log file', 'logging'),
            ('error_notification_email', 'errors@therapyplatform.com', 'Email address for error notifications', 'notifications'),
            ('performance_monitoring_enabled', 'true', 'Whether performance monitoring is enabled', 'monitoring'),
            ('newrelic_license_key', '', 'New Relic license key for performance monitoring', 'monitoring'),
            ('datadog_api_key', '', 'Datadog API key for performance monitoring', 'monitoring'),
            ('datadog_app_key', '', 'Datadog app key for performance monitoring', 'monitoring'),
            ('backup_enabled', 'true', 'Whether database backups are enabled', 'backup'),
            ('backup_frequency_hours', '24', 'Frequency of database backups in hours', 'backup'),
            ('backup_retention_days', '30', 'Number of days to retain database backups', 'backup'),
            ('cdn_enabled', 'false', 'Whether CDN is enabled for static assets', 'cdn'),
            ('cdn_url', '', 'CDN base URL for static assets', 'cdn'),
            ('cdn_api_key', '', 'CDN API key for cache invalidation', 'cdn'),
            ('rate_limiting_enabled', 'true', 'Whether API rate limiting is enabled', 'rate_limiting'),
            ('rate_limit_requests_per_minute', '60', 'Number of API requests allowed per minute', 'rate_limiting'),
            ('rate_limit_requests_per_hour', '1000', 'Number of API requests allowed per hour', 'rate_limiting'),
            ('captcha_enabled', 'true', 'Whether CAPTCHA is required for forms', 'captcha'),
            ('recaptcha_site_key', '', 'reCAPTCHA site key for client-side', 'captcha'),
            ('recaptcha_secret_key', '', 'reCAPTCHA secret key for server-side', 'captcha'),
            ('social_login_enabled', 'true', 'Whether social login is enabled', 'social_login'),
            ('email_notifications_enabled', 'true', 'Whether email notifications are enabled', 'notifications'),
            ('sms_notifications_enabled', 'false', 'Whether SMS notifications are enabled', 'notifications'),
            ('push_notifications_enabled', 'true', 'Whether push notifications are enabled', 'notifications'),
            ('webhook_secret', '', 'Secret key for webhook signatures', 'webhooks'),
            ('api_version', 'v1', 'Current API version', 'api'),
            ('api_rate_limit', '100', 'API rate limit per minute', 'api'),
            ('database_connection_pool_size', '20', 'Database connection pool size', 'database'),
            ('cache_ttl_seconds', '3600', 'Cache time-to-live in seconds', 'cache'),
            ('search_index_rebuild_interval_hours', '24', 'Interval for rebuilding search indexes', 'search'),
            ('user_registration_enabled', 'true', 'Whether new user registration is enabled', 'registration'),
            ('guest_checkout_enabled', 'false', 'Whether guest checkout is enabled', 'checkout'),
            ('minimum_password_length', '8', 'Minimum required password length', 'password'),
            ('require_uppercase_in_password', 'true', 'Whether passwords must contain uppercase letters', 'password'),
            ('require_lowercase_in_password', 'true', 'Whether passwords must contain lowercase letters', 'password'),
            ('require_numbers_in_password', 'true', 'Whether passwords must contain