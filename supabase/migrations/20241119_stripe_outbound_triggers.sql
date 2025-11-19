-- Enable pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the sync-to-stripe Edge Function
CREATE OR REPLACE FUNCTION sync_to_stripe_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  request_id integer;
BEGIN
  -- Construct payload
  IF TG_OP = 'DELETE' THEN
    payload = jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'old_record', row_to_json(OLD)
    );
  ELSE
    payload = jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW),
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END
    );
  END IF;

  -- Make HTTP request to Edge Function
  -- Note: We use a fire-and-forget approach. 
  -- Ideally, we would use a queue for reliability, but this is a direct integration.
  SELECT net.http_post(
    url := 'https://rbnfyxhewsivofvwdpuk.supabase.co/functions/v1/sync-to-stripe',
    body := payload,
    headers := '{"Content-Type": "application/json"}'::jsonb
  ) INTO request_id;

  RETURN NULL; -- Return value is ignored for AFTER triggers
END;
$$;

-- Trigger for Profiles (Customers)
DROP TRIGGER IF EXISTS on_profile_change_sync_stripe ON profiles;
CREATE TRIGGER on_profile_change_sync_stripe
AFTER INSERT OR UPDATE
ON profiles
FOR EACH ROW
EXECUTE FUNCTION sync_to_stripe_webhook();

-- Trigger for Services (Products/Prices)
DROP TRIGGER IF EXISTS on_service_change_sync_stripe ON services;
CREATE TRIGGER on_service_change_sync_stripe
AFTER INSERT OR UPDATE
ON services
FOR EACH ROW
EXECUTE FUNCTION sync_to_stripe_webhook();
