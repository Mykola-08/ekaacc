-- Fix Stripe Sync Triggers and Ensure Schema Compliance

-- 1. Ensure `user_profiles` has loop prevention column
alter table if exists user_profiles 
  add column if not exists last_updated_by_system text;

-- 2. Ensure `service` table has Stripe columns and loop prevention
alter table if exists service 
  add column if not exists stripe_product_id text,
  add column if not exists stripe_price_id text,
  add column if not exists last_updated_by_system text;

-- 3. Ensure `service_addon` table has Stripe columns and loop prevention
alter table if exists service_addon 
  add column if not exists stripe_product_id text,
  add column if not exists stripe_price_id text,
  add column if not exists last_updated_by_system text;

-- 4. Enable RLS on core tables
alter table if exists user_profiles enable row level security;
alter table if exists service enable row level security;
alter table if exists service_addon enable row level security;
alter table if exists booking enable row level security;

-- 5. Add RLS policies for service_role (needed for Sync function to write back)
-- user_profiles
create policy "Service role has full access to user_profiles"
  on user_profiles for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- service
create policy "Service role has full access to service"
  on service for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- service_addon
create policy "Service role has full access to service_addon"
  on service_addon for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- booking
create policy "Service role has full access to booking"
  on booking for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');


-- 6. Setup Triggers for Sync
-- We assume `sync_metadata` table exists (part of prior setup or will be created if not present)
create table if not exists sync_metadata (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  entity_type text not null, -- 'customer', 'product', 'price'
  local_id uuid not null,
  external_id text not null,
  external_system text not null default 'stripe',
  sync_status text,
  last_sync_at timestamptz
);

-- Note: The webhook URL needs to be the actual deployed function URL.
-- In a real migration, this might be dynamic or static. 
-- Assuming standard Supabase Edge Function URL structure or matching existing setup.
-- We will use the existing trigger function `sync_to_stripe_webhook` if it exists, or create it.

create or replace function sync_to_stripe_webhook()
returns trigger
language plpgsql
security definer
as $$
declare
  -- You should replace this with your actual Project Ref URL or use a secret if possible in net extensions
  -- For now, we assume the webhook setup might be done via UI or this is a placeholder for the logic.
  -- Supabase migrations usually use `pg_net` or `http` extension.
  request_id bigint;
  payload jsonb;
  url text := 'https://dopkncrqutxnchwqxloa.supabase.co/functions/v1/sync-to-stripe';
  apikey text := current_setting('request.header.apikey', true); -- Pass current key or use service key
begin
  if apikey is null then
    apikey := (select value from app_config where key = 'SUPABASE_SERVICE_ROLE_KEY'); -- fallback if stored
  end if;

  payload := jsonb_build_object(
    'old_record', old,
    'record', new,
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA
  );

  -- Use pg_net to call the edge function
  -- Ensure pg_net extension is enabled: create extension if not exists pg_net;
  perform
    net.http_post(
      url := url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || apikey
      ),
      body := payload
    );

  return new;
end;
$$;

-- Ensure pg_net is available
create extension if not exists pg_net with schema extensions;

-- Drop existing triggers to avoid duplication
drop trigger if exists on_user_profile_change on user_profiles;
drop trigger if exists on_profiles_change on profiles; -- legacy
drop trigger if exists on_service_change on service;
drop trigger if exists on_service_addon_change on service_addon;

-- Create Triggers
create trigger on_user_profile_change
  after insert or update on user_profiles
  for each row execute function sync_to_stripe_webhook();

create trigger on_service_change
  after insert or update on service
  for each row execute function sync_to_stripe_webhook();

create trigger on_service_addon_change
  after insert or update on service_addon
  for each row execute function sync_to_stripe_webhook();
