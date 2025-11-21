-- Security Hardening Migration
-- Date: 2025-11-21
-- Purpose: Strengthen RLS and remove anonymous access to sensitive tables.

-- Revoke anonymous read from users table
REVOKE SELECT ON public.users FROM anon;

-- Ensure authenticated retains minimal access
GRANT SELECT ON public.users TO authenticated;

-- Add role extraction helper (if not exists)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
  claims JSON;
  role TEXT;
BEGIN
  claims := current_setting('request.jwt.claims', true)::json;
  role := COALESCE(
    claims->'https://supabase.io/jwt/claims'->>'role',
    claims->>'role',
    'user'
  );
  RETURN role;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin full access policy (idempotent)
DROP POLICY IF EXISTS "Users Admin Full" ON public.users;
CREATE POLICY "Users Admin Full"
  ON public.users FOR ALL
  USING (public.current_user_role() = 'admin')
  WITH CHECK (public.current_user_role() = 'admin');

-- Tighten update policy to require role match or owner
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (
    (id = current_setting('request.jwt.claims', true)::json->>'user_id' OR id = current_setting('request.jwt.claims', true)::json->>'sub')
    AND public.current_user_role() IN ('user','practitioner','admin')
  )
  WITH CHECK (
    (id = current_setting('request.jwt.claims', true)::json->>'user_id' OR id = current_setting('request.jwt.claims', true)::json->>'sub')
  );

-- Preserve select owner policy
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data"
  ON public.users FOR SELECT
  USING (
    id = current_setting('request.jwt.claims', true)::json->>'user_id'
    OR id = current_setting('request.jwt.claims', true)::json->>'sub'
    OR public.current_user_role() = 'admin'
  );

-- Comment for auditing
COMMENT ON FUNCTION public.current_user_role IS 'Extracts effective role from Auth0-enriched JWT claims.';
