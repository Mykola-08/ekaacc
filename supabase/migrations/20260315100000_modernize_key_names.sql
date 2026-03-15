-- Migration: Modernize Supabase key naming
-- Renames legacy SUPABASE_SERVICE_ROLE_KEY references to SUPABASE_SECRET_KEY

-- 1. Update app_config: rename legacy key if it exists
UPDATE public.app_config
SET key = 'SUPABASE_SECRET_KEY'
WHERE key = 'SUPABASE_SERVICE_ROLE_KEY'
  AND NOT EXISTS (SELECT 1 FROM public.app_config WHERE key = 'SUPABASE_SECRET_KEY');

-- 2. Update the sync_to_stripe_webhook function to use new key name
CREATE OR REPLACE FUNCTION sync_to_stripe_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
  url text := 'https://dopkncrqutxnchwqxloa.supabase.co/functions/v1/sync-to-stripe';
  apikey text := current_setting('request.header.apikey', true);
BEGIN
  IF apikey IS NULL THEN
    apikey := (SELECT value FROM app_config WHERE key = 'SUPABASE_SECRET_KEY');
  END IF;

  payload := jsonb_build_object(
    'old_record', old,
    'record', new,
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA
  );

  PERFORM net.http_post(
    url := url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || apikey
    ),
    body := payload
  );

  RETURN new;
END;
$$;

-- 3. Ensure app_config has description and category columns for secret metadata
ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
