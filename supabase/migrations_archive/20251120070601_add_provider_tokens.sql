-- Migration: Add provider tokens storage for OAuth providers
-- This allows storing provider access and refresh tokens for API access

-- Create table to store OAuth provider tokens
CREATE TABLE IF NOT EXISTS public.user_provider_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'github', 'twitter', 'linkedin', 'apple', 'facebook')),
  provider_token TEXT, -- Access token from OAuth provider
  provider_refresh_token TEXT, -- Refresh token from OAuth provider
  token_expires_at TIMESTAMPTZ, -- When the access token expires
  scopes TEXT[], -- Scopes granted by the user
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one token entry per user per provider
  UNIQUE(user_id, provider)
);

-- Add indexes for efficient lookups
CREATE INDEX idx_user_provider_tokens_user_id ON public.user_provider_tokens(user_id);
CREATE INDEX idx_user_provider_tokens_provider ON public.user_provider_tokens(provider);
CREATE INDEX idx_user_provider_tokens_user_provider ON public.user_provider_tokens(user_id, provider);

-- Enable RLS
ALTER TABLE public.user_provider_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own tokens
CREATE POLICY "Users can view their own provider tokens"
  ON public.user_provider_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own provider tokens"
  ON public.user_provider_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider tokens"
  ON public.user_provider_tokens
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own provider tokens"
  ON public.user_provider_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all provider tokens (for debugging/support)
CREATE POLICY "Admins can view all provider tokens"
  ON public.user_provider_tokens
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u.auth_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_provider_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_provider_tokens_updated_at_trigger
  BEFORE UPDATE ON public.user_provider_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_provider_tokens_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.user_provider_tokens IS 'Stores OAuth provider tokens for accessing third-party APIs on behalf of users';
COMMENT ON COLUMN public.user_provider_tokens.provider_token IS 'Access token from OAuth provider for API calls';
COMMENT ON COLUMN public.user_provider_tokens.provider_refresh_token IS 'Refresh token to obtain new access tokens';
COMMENT ON COLUMN public.user_provider_tokens.token_expires_at IS 'Timestamp when the access token expires (typically 1 hour for Google)';
COMMENT ON COLUMN public.user_provider_tokens.scopes IS 'Array of scopes granted by the user during OAuth flow';
