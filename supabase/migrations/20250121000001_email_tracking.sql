-- Migration: Add email tracking tables
-- Description: Tables for tracking email events from Resend webhooks and verification tokens

-- Email events table for tracking all email interactions
CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- email.sent, email.delivered, email.bounced, etc.
  email_id TEXT NOT NULL, -- Resend email ID
  recipient TEXT NOT NULL,
  sender TEXT,
  subject TEXT,
  bounce_type TEXT, -- hard, soft (for bounced emails)
  bounce_reason TEXT,
  click_url TEXT, -- for clicked events
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  raw_data JSONB, -- Full webhook payload
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON email_events(email_id);
CREATE INDEX IF NOT EXISTS idx_email_events_recipient ON email_events(recipient);
CREATE INDEX IF NOT EXISTS idx_email_events_event_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at DESC);

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick token lookups
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- Add email bounce tracking to user notification settings
ALTER TABLE user_notification_settings
ADD COLUMN IF NOT EXISTS email_bounced BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_bounce_reason TEXT,
ADD COLUMN IF NOT EXISTS spam_complaint BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_email_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_email_opened_at TIMESTAMPTZ;

-- Function to clean up expired verification tokens
CREATE OR REPLACE FUNCTION clean_expired_verification_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verification_tokens
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can insert email events (from webhooks)
CREATE POLICY "Service role can insert email events"
  ON email_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can view all email events
CREATE POLICY "Admins can view email events"
  ON email_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Users can view their own verification tokens
CREATE POLICY "Users can view own verification tokens"
  ON email_verification_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can manage verification tokens
CREATE POLICY "Service role can manage verification tokens"
  ON email_verification_tokens
  FOR ALL
  TO service_role
  WITH CHECK (true);

COMMENT ON TABLE email_events IS 'Tracks all email events from Resend webhooks';
COMMENT ON TABLE email_verification_tokens IS 'Stores email verification tokens for user registration';
