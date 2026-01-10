-- Booking related schema (SQL API - Postgres for Supabase)
-- Ensure high-cardinality partitioning is handled by Supabase automatically across storage shards.

-- Services table (Master catalog of bookable items)
-- Updated 2026-01-10: Moved pricing/duration to service_variant
create table if not exists service (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  stripe_product_id text,
  image_url text,
  location text, -- e.g. 'Downtown', 'Uptown'
  active boolean default true,
  last_updated_by_system text
);

create table if not exists service_variant (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  service_id uuid not null references service(id) on delete cascade,
  name text not null, -- e.g. "60 Minutes", "Intro Session"
  description text,
  duration_min integer not null check (duration_min > 0),
  price_amount integer not null check (price_amount >= 0), -- Stored in Cents
  currency text default 'USD',
  stripe_price_id text,
  active boolean default true,
  last_updated_by_system text
);

-- Staff table (basic)
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  display_name text,
  email text,
  bio text,
  photo_url text,
  specialties text[],
  active boolean default true
);

-- Addons table (optional upsells)
create table if not exists service_addon (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service_id uuid references service(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  active boolean default true
);

-- Booking status + payment enums
create type if not exists booking_status as enum ('scheduled','completed','canceled','no_show','in_service');
create type if not exists payment_status as enum ('pending','authorized','captured','refunded','canceled');

-- Bookings table
-- Updated 2026-01-10: Added Unified Booking Columns
create table if not exists booking (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  service_id uuid not null references service(id) on delete restrict,
  service_variant_id uuid references service_variant(id), -- Specific variant (price/time)
  staff_id uuid references staff(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes integer not null,
  base_price_cents integer not null,
  currency text not null default 'USD',
  customer_reference_id uuid, -- internal CRM / user id if matched
  email text not null,
  phone text,
  display_name text,
  -- Unified Booking Fields
  origin_app text default 'web',
  is_identity_verified boolean default false,
  confidence_score integer default 50,
  deposit_requirement text default 'full', -- 'none', 'partial', 'full'
  
  addons_json jsonb default '[]'::jsonb, -- array of {addonId,name,price_cents}
  payment_mode text not null check (payment_mode in ('full','deposit')),
  deposit_cents integer default 0,
  payment_status payment_status not null default 'pending',
  status booking_status not null default 'scheduled',
  cancellation_policy jsonb, -- {deadlineOffsetHours, refundPercent, feeCents}
  notes text,
  source text not null default 'public_web',
  manage_token_hash text, -- hashed latest token for one-time manage link
  reservation_expires_at timestamptz, -- for pending payment TTL
  stripe_payment_intent text, -- payment intent id after successful Stripe checkout
  constraint no_overlap_exclusive exclusion using gist (
    service_id with =, tstzrange(start_time, end_time) with &&
  )
);

-- Simple index helpers
create index if not exists booking_service_time_idx on booking(service_id, start_time);
create index if not exists booking_email_idx on booking(email);
create index if not exists booking_reservation_expires_idx on booking(reservation_expires_at) where payment_status = 'pending';

-- Function to purge expired tentative reservations (cron-able)
create or replace function booking_release_expired() returns void as $$
  delete from booking
  where payment_status = 'pending'
    and reservation_expires_at is not null
    and reservation_expires_at < now();
$$ language sql;

-- Application configuration (store non-public secrets; protect with RLS: only service role)
create table if not exists app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);
-- Example keys: 'BOOKING_TOKEN_SECRET','STRIPE_WEBHOOK_SECRET','STRIPE_SECRET_KEY'
-- RLS policy suggestion:
-- alter table app_config enable row level security;
-- create policy service_read on app_config for select using (auth.role() = 'service_role');
-- (Ensure only server-side service key accesses this table.)

-- Staff working schedule (weekday 0=Sunday .. 6=Saturday)
create table if not exists staff_schedule (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_hour int not null check (start_hour between 0 and 23),
  end_hour int not null check (end_hour between 1 and 24),
  active boolean default true,
  unique (staff_id, weekday, start_hour, end_hour)
);
create index if not exists staff_schedule_staff_weekday_idx on staff_schedule(staff_id, weekday);

-- Waitlist table for notifying users when slots free up
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service_id uuid not null references service(id) on delete cascade,
  desired_date date not null,
  email text not null,
  notified boolean default false
);
create index if not exists waitlist_service_date_idx on waitlist(service_id, desired_date) where notified = false;

