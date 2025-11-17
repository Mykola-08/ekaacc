-- Drop all existing auth-related tables in proper order to handle foreign key constraints

-- Drop junction tables first (no dependencies)
DROP TABLE IF EXISTS public.user_role_assignments CASCADE;
DROP TABLE IF EXISTS public.user_permission_assignments CASCADE;
DROP TABLE IF EXISTS public.role_permission_assignments CASCADE;
DROP TABLE IF EXISTS public.user_oauth_accounts CASCADE;
DROP TABLE IF EXISTS user_account_providers CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_refresh_tokens CASCADE;

-- Drop main auth tables
DROP TABLE IF EXISTS public.user_accounts CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_permissions CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.user_activity_logs CASCADE;
DROP TABLE IF EXISTS public.user_login_attempts CASCADE;

-- Drop audit and metadata tables
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.system_logs CASCADE;
DROP TABLE IF EXISTS public.error_logs CASCADE;

-- Drop notification and communication tables
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.user_notifications CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.email_queue CASCADE;

-- Drop organization and team tables
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organization_invitations CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;

-- Drop content and resource tables
DROP TABLE IF EXISTS public.content_categories CASCADE;
DROP TABLE IF EXISTS public.content_tags CASCADE;
DROP TABLE IF EXISTS public.content_items CASCADE;
DROP TABLE IF EXISTS public.content_item_tags CASCADE;
DROP TABLE IF EXISTS public.content_comments CASCADE;
DROP TABLE IF EXISTS content_likes CASCADE;
DROP TABLE IF EXISTS content_bookmarks CASCADE;
DROP TABLE IF EXISTS content_shares CASCADE;

-- Drop media and file tables
DROP TABLE IF EXISTS public.media_files CASCADE;
DROP TABLE IF EXISTS public.file_uploads CASCADE;
DROP TABLE IF EXISTS public.file_categories CASCADE;

-- Drop analytics and tracking tables
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.analytics_page_views CASCADE;
DROP TABLE IF EXISTS public.analytics_sessions CASCADE;
DROP TABLE IF EXISTS public.analytics_user_properties CASCADE;

-- Drop integration and API tables
DROP TABLE IF EXISTS public.api_keys CASCADE;
DROP TABLE IF EXISTS public.api_usage_logs CASCADE;
DROP TABLE IF EXISTS public.webhook_endpoints CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;

-- Drop settings and configuration tables
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.feature_flags CASCADE;
DROP TABLE IF EXISTS public.maintenance_windows CASCADE;

-- Drop any remaining tables that might have foreign key relationships
DROP TABLE IF EXISTS public.user_email_verifications CASCADE;
DROP TABLE IF EXISTS public.user_password_resets CASCADE;
DROP TABLE IF EXISTS public.user_two_factor_auth CASCADE;
DROP TABLE IF EXISTS public.user_security_events CASCADE;
DROP TABLE IF EXISTS public.user_device_tokens CASCADE;

-- Drop any custom types
DROP TYPE IF EXISTS public.user_status_enum CASCADE;
DROP TYPE IF EXISTS public.user_role_enum CASCADE;
DROP TYPE IF EXISTS public.permission_resource_type_enum CASCADE;
DROP TYPE IF EXISTS public.oauth_provider_enum CASCADE;
DROP TYPE IF EXISTS public.session_status_enum CASCADE;
DROP TYPE IF EXISTS public.organization_role_enum CASCADE;
DROP TYPE IF EXISTS public.content_status_enum CASCADE;
DROP TYPE IF EXISTS public.content_type_enum CASCADE;
DROP TYPE IF EXISTS public.media_type_enum CASCADE;
DROP TYPE IF EXISTS public.analytics_event_type_enum CASCADE;
DROP TYPE IF EXISTS public.webhook_status_enum CASCADE;
DROP TYPE IF EXISTS public.api_key_status_enum CASCADE;