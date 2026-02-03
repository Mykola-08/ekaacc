-- UNIFIED SERVICE & PRODUCT SCHEMA
-- This migration refines the 'service' table to be the single source of truth for 
-- Sessions, Packs, and Digital Products, enabling "Unified" display in filtering.

-- 1. ADD CATEGORY & TYPE HANDLING
-- We already have 'type' in service from previous migration (service, product, etc)
-- Start with ensuring we have a 'category' column for high-level grouping.

alter table service 
add column if not exists category text default 'general'; 
-- Examples: 'therapy', 'coaching', 'massage', 'corporate', 'education'

create index if not exists idx_service_category on service(category);

-- 2. ADD TRANSLATION SUPPORT (for Localization)
-- Instead of separate tables per language, we use a translation table linked to service.
-- This keeps the core schema clean.

create table if not exists service_translations (
    id uuid primary key default gen_random_uuid(),
    service_id uuid references service(id) on delete cascade,
    language_code text not null, -- 'es', 'ca', 'fr' (default en is in main table)
    name text,
    description text,
    unique(service_id, language_code)
);

-- RLS for Translations
alter table service_translations enable row level security;
create policy "Public read translations" on service_translations for select using (true);
create policy "Admins manage translations" on service_translations for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
);


-- 3. SEED THE UNIFIED CATALOG
-- Clear existing generic data if needed or just insert new "Unified" structures.
-- We will use UPSERT on specific known UUIDs or Names to ensure idempotency.

do $$
declare
    v_psychology_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    v_pack3_id uuid := 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';
    v_office_id uuid := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33';
    v_review_id uuid := 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44';
begin

    -- A. CORE SERVICE: Psychology (General)
    insert into service (id, name, description, category, type, is_public, image_url)
    values (
        v_psychology_id,
        'Psychology Session',
        'Professional therapy session tailored to your needs.',
        'therapy',
        'service',
        true,
        '/images/services/psychology.jpg'
    )
    on conflict (id) do update set 
        category = 'therapy',
        type = 'service';

    -- Translations for Psychology
    insert into service_translations (service_id, language_code, name, description)
    values 
        (v_psychology_id, 'es', 'Sesión de Psicología', 'Sesión de terapia profesional adaptada a tus necesidades.'),
        (v_psychology_id, 'ca', 'Sessió de Psicologia', 'Sessió de teràpia professional adaptada a les teves necessitats.')
    on conflict (service_id, language_code) do update set name=excluded.name;

    -- Variants: Rubi vs BCN, 60 vs 90
    -- We delete old variants for this service to reset them cleanly
    delete from service_variant where service_id = v_psychology_id;
    
    insert into service_variant (service_id, name, duration_min, price_amount, location, currency)
    values 
        (v_psychology_id, '1h Rubi', 60, 6000, 'Rubi', 'EUR'),
        (v_psychology_id, '1.5h Rubi', 90, 8500, 'Rubi', 'EUR'),
        (v_psychology_id, '1h Barcelona', 60, 7000, 'Barcelona', 'EUR'), -- BCN usually more expensive?
        (v_psychology_id, '1.5h Barcelona', 90, 9500, 'Barcelona', 'EUR');


    -- B. PACKS: 3 Sessions (Product/Service)
    -- This is a "Service" that you buy, which grants credits.
    insert into service (id, name, description, category, type, is_public)
    values (
        v_pack3_id,
        '3 Session Pack',
        'Bundle of 3 sessions. Save 10%.',
        'therapy',
        'subscription', -- or 'pack'
        true
    ) on conflict (id) do nothing;

    -- Variants for the Pack (Maybe just one standard variant)
    insert into service_variant (service_id, name, duration_min, price_amount, location)
    values (v_pack3_id, 'Standard Pack', 0, 16000, 'Any') -- 3 * 60 = 180, so 160 is discount
    on conflict do nothing;


    -- C. PERSONALIZED: Office Workers (Specific Target)
    insert into service (id, name, description, category, type, is_public, tags)
    values (
        v_office_id,
        'Office Decompression',
        'Targeted release for desk-bound professionals.',
        'personalized',
        'service',
        true,
        ARRAY['office', 'posture', 'stress']
    ) on conflict (id) do nothing;
    
    insert into service_variant (service_id, name, duration_min, price_amount, location)
    values 
        (v_office_id, '45min Express', 45, 5000, 'Rubi'),
        (v_office_id, '45min Express', 45, 5500, 'Barcelona')
    on conflict do nothing;


    -- D. 360 REVIEW (Special Category)
    insert into service (id, name, description, category, type, is_public)
    values (
        v_review_id,
        '360 Wellness Review',
        'Complete assessment of mental and physical state.',
        'review_360',
        'service',
        true
    ) on conflict (id) do nothing;

    insert into service_variant (service_id, name, duration_min, price_amount, location)
    values (v_review_id, '2h Full Assessment', 120, 15000, 'Rubi')
    on conflict do nothing;

end $$;

-- 4. UTILITY VIEW FOR FRONTEND
-- Helper view to simplify querying "Unified" list with default language fallback

create or replace view view_unified_services as
select 
    s.id,
    s.type,
    s.category,
    s.image_url,
    s.tags,
    coalesce(st.name, s.name) as display_name,
    coalesce(st.description, s.description) as display_description,
    -- Aggregate variants into JSON for easy frontend parsing
    (
        select jsonb_agg(jsonb_build_object(
            'id', sv.id,
            'name', sv.name,
            'duration', sv.duration_min,
            'price', sv.price_amount,
            'location', sv.location
        ))
        from service_variant sv
        where sv.service_id = s.id and sv.active = true
    ) as variants
from service s
left join service_translations st on st.service_id = s.id 
-- NOTE: In a real query, you'd filter `st.language_code = current_lang` 
-- View limits this, so better to query tables directly or use a function.
where s.active = true;
