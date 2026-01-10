-- Migration to unify service tables and enhance data structure
-- Hides 'anon_services' and moves location logic to variants

-- 1. Enhance 'service' table
alter table service add column if not exists tags text[] default '{}';
alter table service add column if not exists metadata jsonb default '{}'::jsonb;
alter table service add column if not exists is_public boolean default true;

-- 2. Enhance 'service_variant' table
alter table service_variant add column if not exists location text;
alter table service_variant add column if not exists metadata jsonb default '{}'::jsonb;

-- 3. Enhance 'booking' table
alter table booking add column if not exists metadata jsonb default '{}'::jsonb;
alter table booking add column if not exists customer_tags text[];

-- 4. Clean up duplicate tables
-- 'anon_services' was a duplicate of 'service' for public access. 
-- We now use 'service.is_public' and RLS (Row Level Security) instead.
drop table if exists anon_services;

-- 5. Data Migration (Optional - strictly for existing deployments)
-- If you had data in 'service.location', migrate it to variants if needed.
-- update service_variant sv
-- set location = s.location
-- from service s
-- where sv.service_id = s.id and sv.location is null;

-- 6. Deprecation notice
comment on column service.location is 'DEPRECATED: Use service_variant.location instead';
