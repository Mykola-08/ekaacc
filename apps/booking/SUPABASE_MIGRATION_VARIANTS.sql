-- Migration to add location and version to service table
-- Run this in your Supabase SQL Editor

-- 1. Create service table if it doesn't exist (it was previously assumed)
create table if not exists service (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  price integer not null check (price >= 0),
  duration integer not null check (duration > 0),
  image_url text,
  active boolean default true
);

-- 2. Add new columns for variants
alter table service add column if not exists location text;
alter table service add column if not exists version text;

-- 3. Update existing rows (optional example)
-- update service set location = 'Main Branch', version = 'Standard' where location is null;
