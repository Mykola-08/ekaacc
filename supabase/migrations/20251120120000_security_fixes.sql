-- Migration to fix security warnings
-- 1. Move extensions to 'extensions' schema
-- 2. Fix mutable search_path in functions

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Move extensions to extensions schema
-- Note: We use IF EXISTS to avoid errors if they are already moved or not installed, 
-- though the linter says they are in public.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION pg_net SET SCHEMA extensions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION vector SET SCHEMA extensions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER EXTENSION pg_trgm SET SCHEMA extensions;
    END IF;
END
$$;

-- Fix function search paths
-- We set search_path to 'public, extensions' to ensure they can find tables and extensions.

ALTER FUNCTION public.process_real_time_mood_analysis(UUID) SET search_path = public, extensions;

ALTER FUNCTION public.update_updated_at_column() SET search_path = public, extensions;

ALTER FUNCTION public.check_user_permission(UUID, TEXT) SET search_path = public, extensions;

ALTER FUNCTION public.monitor_wellness_alerts(UUID) SET search_path = public, extensions;

ALTER FUNCTION public.handle_new_user() SET search_path = public, extensions;

ALTER FUNCTION public.generate_personalized_recommendations(UUID) SET search_path = public, extensions;

ALTER FUNCTION public.calculate_user_engagement_score(UUID) SET search_path = public, extensions;
