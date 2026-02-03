-- Migration: Unified Booking and Service Variants
-- Date: 2026-01-10
-- Goals: 
-- 1. Split Service into Service (Product) and ServiceVariant (Price/Duration).
-- 2. Enhance Booking table with origin, verification, and confidence data.
-- 3. Add logic for calculating user trust scores.

-- ==========================================
-- 1. Service Variations Tables
-- ==========================================

create table if not exists service_variant (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  service_id uuid not null references service(id) on delete cascade,
  name text not null, -- e.g. "60 Minutes", "Intro Session"
  description text,
  duration_min integer not null check (duration_min > 0),
  price_amount integer not null check (price_amount >= 0), -- Stored in Cents (smallest unit)
  currency text default 'USD',
  stripe_price_id text,
  active boolean default true,
  last_updated_by_system text
);

-- Enable RLS
alter table service_variant enable row level security;

-- RLS Policies (Service Role Access)
create policy "Service role full access on service_variant"
  on service_variant for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Public Read Access
create policy "Public read access on service_variant"
  on service_variant for select
  using (true);

-- ==========================================
-- 2. Data Migration (Backward Compatibility)
-- ==========================================
-- Move existing flat service data into a default variant if no variants exist
insert into service_variant (service_id, name, duration_min, price_amount, stripe_price_id)
select 
  id, 
  coalesce(version, 'Standard'), 
  coalesce(duration, 60), 
  price, -- Assuming existing price is already compatible
  stripe_price_id
from service
where not exists (select 1 from service_variant where service_id = service.id);

-- ==========================================
-- 3. Booking Table Enhancements
-- ==========================================

create type deposit_requirement_type as enum ('none', 'partial', 'full');

alter table booking 
  add column if not exists origin_app text default 'web',
  add column if not exists is_identity_verified boolean default false,
  add column if not exists confidence_score integer default 50,
  add column if not exists deposit_requirement deposit_requirement_type default 'full',
  add column if not exists service_variant_id uuid references service_variant(id);

-- Backfill service_variant_id for existing bookings
-- This is a best-effort match based on service_id and duration if possible, 
-- or just picking the first variant relative to the service.
update booking b
set service_variant_id = (
  select id from service_variant sv 
  where sv.service_id = b.service_id 
  limit 1
)
where service_variant_id is null;

-- ==========================================
-- 4. User Confidence Logic
-- ==========================================

create or replace function calculate_trust_score(check_email text)
returns integer
language plpgsql
security definer
as $$
declare
  score integer := 50; -- Base Score
  stats record;
begin
  -- Calculate stats for the email
  select 
    count(*) filter (where status = 'completed') as completed_count,
    count(*) filter (where status = 'no_show') as noshow_count,
    count(*) filter (where status = 'canceled') as canceled_count
  into stats
  from booking
  where email = check_email;

  -- Apply Logic
  score := score + (stats.completed_count * 10);
  score := score - (stats.noshow_count * 50); -- Heavy penalty for no-shows
  score := score - (stats.canceled_count * 5); -- Light penalty for cancellations

  -- Clamp Score (0-100)
  if score > 100 then score := 100; end if;
  if score < 0 then score := 0; end if;

  return score;
end;
$$;

-- ==========================================
-- 5. Triggers for Sync
-- ==========================================

-- Trigger for sync to stripe (reuse existing webhook function)
drop trigger if exists on_service_variant_change on service_variant;

create trigger on_service_variant_change
  after insert or update on service_variant
  for each row execute function sync_to_stripe_webhook();

