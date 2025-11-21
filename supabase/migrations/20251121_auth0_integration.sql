-- Migration: Configure Supabase to accept Auth0 JWT tokens
-- This migration sets up the necessary configuration for Auth0 integration

-- Create a users table that will be synced from Auth0
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Auth0 user_id (e.g., auth0|123456)
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  name TEXT,
  given_name TEXT,
  family_name TEXT,
  nickname TEXT,
  picture TEXT,
  locale TEXT,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  auth_provider TEXT DEFAULT 'auth0',
  app_metadata JSONB DEFAULT '{}'::jsonb,
  user_metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON public.users(auth_provider);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (
    id = current_setting('request.jwt.claims', true)::json->>'user_id'
    OR
    id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (
    id = current_setting('request.jwt.claims', true)::json->>'user_id'
    OR
    id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- Helper functions in public schema
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('request.jwt.claims', true)::json->>'sub'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_user_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::json->>'sub' IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comment on table
COMMENT ON TABLE public.users IS 'Users table synced from Auth0. Contains user profile information.';

-- Grant necessary permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
