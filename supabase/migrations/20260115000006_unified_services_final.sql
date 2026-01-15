-- UNIFIED SERVICES MIGRATION (FINAL STATE)
-- This file represents the cumulative state of the Unified Services architecture
-- as applied to the live database and Stripe account.

-- 1. BASE STRUCTURE
alter table service 
add column if not exists category text default 'general'; 

create index if not exists idx_service_category on service(category);

-- 2. TRANSLATIONS
create table if not exists service_translations (
    id uuid primary key default gen_random_uuid(),
    service_id uuid references service(id) on delete cascade,
    language_code text not null, 
    name text,
    description text,
    unique(service_id, language_code)
);

alter table service_translations enable row level security;
drop policy if exists "Public read translations" on service_translations;
create policy "Public read translations" on service_translations for select using (true);
drop policy if exists "Admins manage translations" on service_translations;
create policy "Admins manage translations" on service_translations for all using (
    exists (
      select 1 from user_role_assignments ura
      join user_roles ur on ur.id = ura.role_id
      where ura.user_id = auth.uid() and ur.name = 'admin'
    )
);

-- 3. VIEWS (Simulating "Different Tables")
create or replace view services_therapy as
select * from service where category = 'therapy' and active = true;

create or replace view services_personalized as
select * from service where category = 'personalized' and active = true;

create or replace view services_360 as
select * from service where category = 'review_360' and active = true;

create or replace view services_products as
select * from service where type = 'product' and active = true;

-- 4. UNIFIED VIEW (Frontend Helper)
create or replace view view_unified_services as
select 
    s.id, s.type, s.category, s.image_url, s.tags,
    coalesce(st.name, s.name) as display_name,
    coalesce(st.description, s.description) as display_description,
    (
        select jsonb_agg(jsonb_build_object(
            'id', sv.id,
            'name', sv.name,
            'duration', sv.duration_min,
            'price', sv.price_amount,
            'location', sv.location,
            'stripe_price_id', sv.stripe_price_id
        ))
        from service_variant sv
        where sv.service_id = s.id and sv.active = true
    ) as variants
from service s
left join service_translations st on st.service_id = s.id 
where s.active = true;
