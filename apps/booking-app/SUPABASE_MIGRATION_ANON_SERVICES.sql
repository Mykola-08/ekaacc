-- Create a separate table for anonymous user services
-- Based on the 'services' table structure

create table if not exists anon_services (
  id uuid primary key default gen_random_uuid(),
  original_service_id uuid references services(id) on delete set null, -- Link to original if needed
  created_at timestamptz default now(),
  name text not null,
  description text,
  price integer not null check (price >= 0),
  duration integer not null check (duration > 0),
  image_url text,
  location text,
  version text,
  is_active boolean default true, -- This allows disabling specific services for anon users
  currency text default 'EUR'
);

-- Copy existing active services to the new table
insert into anon_services (original_service_id, name, description, price, duration, image_url, is_active, currency)
select id, name, description, price, duration, image_url, is_active, currency
from services
where is_active = true;

-- Add RLS policies if needed (public read)
alter table anon_services enable row level security;

create policy "Allow public read access"
  on anon_services for select
  using (true);

-- Example: Disable a service in this table
-- update anon_services set is_active = false where name = 'Premium Haircut & Beard';
