-- Rebuild Booking DB Schema
-- Includes Services, Staff, Bookings, and Storage

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist"; 

-- DROP EXISTING (Cleanup)
drop table if exists booking cascade;
drop table if exists service_addon cascade;
drop table if exists service cascade;
drop table if exists staff cascade;
drop table if exists app_config cascade;

-- 1. SERVICES
create table service (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  price integer not null check (price >= 0), -- Stored in cents (e.g., $50.00 = 5000)
  duration integer not null check (duration > 0), -- minutes
  image_url text,
  location text,
  version text,
  active boolean default true,
  stripe_product_id text,
  stripe_price_id text,
  metadata jsonb default '{}'::jsonb
);

-- Index for searching services
create index if not exists service_active_idx on service(active);

-- 2. STAFF
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

-- 3. ADDONS
create table if not exists service_addon (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  service_id uuid references service(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  active boolean default true,
  stripe_product_id text,
  stripe_price_id text
);

-- 4. ENUMS
do $$ begin
    create type booking_status as enum ('scheduled','completed','canceled','no_show','in_service');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type payment_status as enum ('pending','authorized','captured','refunded','canceled');
exception
    when duplicate_object then null;
end $$;

-- 5. BOOKINGS
create table if not exists booking (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  service_id uuid not null references service(id) on delete restrict,
  staff_id uuid references staff(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  duration_minutes integer not null,
  base_price_cents integer not null,
  currency text not null default 'USD',
  customer_reference_id uuid,
  email text not null,
  phone text,
  display_name text,
  addons_json jsonb default '[]'::jsonb,
  payment_mode text not null check (payment_mode in ('full','deposit')),
  deposit_cents integer default 0,
  payment_status payment_status not null default 'pending',
  status booking_status not null default 'scheduled',
  cancellation_policy jsonb,
  notes text,
  source text not null default 'public_web',
  manage_token_hash text,
  reservation_expires_at timestamptz,
  stripe_payment_intent text,
  constraint no_overlap_exclusive exclude using gist (
    service_id with =, tstzrange(start_time, end_time) with &&
  )
);

create index if not exists booking_service_time_idx on booking(service_id, start_time);
create index if not exists booking_email_idx on booking(email);
create index if not exists booking_reservation_expires_idx on booking(reservation_expires_at) where payment_status = 'pending';

-- 6. APP CONFIG
create table if not exists app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- 7. CLEANUP EXPIRED BOOKINGS FUNCTION
create or replace function booking_release_expired() returns void as $$
  delete from booking
  where payment_status = 'pending'
    and reservation_expires_at is not null
    and reservation_expires_at < now();
$$ language sql;

-- 8. STORAGE BUCKETS & POLICIES
-- Note: 'storage' schema usually exists in Supabase.
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('staff-photos', 'staff-photos', true)
on conflict (id) do nothing;

-- Policies (Drop existing to avoid error if recreating)
drop policy if exists "Public Access Service Images" on storage.objects;
drop policy if exists "Public Access Staff Photos" on storage.objects;
drop policy if exists "Authenticated Upload Service Images" on storage.objects;
drop policy if exists "Authenticated Upload Staff Photos" on storage.objects;

create policy "Public Access Service Images" on storage.objects for select
using ( bucket_id = 'service-images' );

create policy "Public Access Staff Photos" on storage.objects for select
using ( bucket_id = 'staff-photos' );

create policy "Authenticated Upload Service Images" on storage.objects for insert
with check ( bucket_id = 'service-images' and auth.role() = 'authenticated' );

create policy "Authenticated Upload Staff Photos" on storage.objects for insert
with check ( bucket_id = 'staff-photos' and auth.role() = 'authenticated' );
