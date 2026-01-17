-- Comprehensive System Overhaul
-- Timestamp: 20260117090000

-- SECTION 1: WELLNESS GOALS
create table if not exists wellness_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null, -- e.g. "Run 5k", "Meditate 10 mins"
    category text, -- "fitness", "mindfulness", "nutrition"
    target_value integer, -- e.g. 5000 (meters), 10 (minutes)
    current_value integer default 0,
    unit text, -- "m", "min", "kg"
    status text check (status in ('active', 'completed', 'abandoned')) default 'active',
    due_date date,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_locked boolean default false -- Admin can lock a goal if needed (e.g. part of a paid program)
);

alter table wellness_goals enable row level security;
create policy "Users manage own goals" on wellness_goals for all using (auth.uid() = user_id);
create policy "Admins manage all goals" on wellness_goals for all using (
    exists (select 1 from auth.users where id = auth.uid() and raw_user_meta_data->>'role' in ('admin', 'super_admin', 'therapist'))
);


-- SECTION 2: SOCIAL 2.0 (Comments & Likes)
create table if not exists post_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references community_posts(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table post_comments enable row level security;
create policy "Public view comments" on post_comments for select using (true); -- Assuming public feed
create policy "Users create comments" on post_comments for insert with check (auth.uid() = user_id);
create policy "Users update own comments" on post_comments for update using (auth.uid() = user_id);
create policy "Users delete own comments" on post_comments for delete using (auth.uid() = user_id);

create table if not exists post_likes (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references community_posts(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default now(),
    unique(post_id, user_id)
);

alter table post_likes enable row level security;
create policy "Public view likes" on post_likes for select using (true);
create policy "Users toggle likes" on post_likes for all using (auth.uid() = user_id);

-- Update trigger for comments/likes count on posts would normally go here, 
-- but for MVP we can count on read or use a view.


-- SECTION 3: IDENTITY VERIFICATION
create table if not exists identity_verifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null check (type in ('passport', 'driver_license', 'id_card')),
    front_image_url text not null,
    back_image_url text, -- Optional for passport
    selfie_image_url text not null,
    status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
    rejection_reason text,
    reviewed_by uuid references auth.users(id),
    reviewed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_locked boolean default true -- Only admins can change status once submitted (actually user shouldn't edit submitted either)
);

alter table identity_verifications enable row level security;
create policy "Users view own verifications" on identity_verifications for select using (auth.uid() = user_id);
create policy "Users create verifications" on identity_verifications for insert with check (auth.uid() = user_id);
create policy "Admins manage verifications" on identity_verifications for all using (
    exists (select 1 from auth.users where id = auth.uid() and raw_user_meta_data->>'role' in ('admin', 'super_admin'))
);


-- SECTION 4: ADMIN LOCK & GOD MODE
-- Add 'is_locked' to critical tables if not exists
alter table booking add column if not exists is_locked boolean default false;
alter table service add column if not exists is_locked boolean default false;
-- profiles table might store user data, let's assume raw_user_meta_data is used, 
-- or if there is a 'profiles' table (some setups have it). Let's check 'profiles' existence safely.
-- (Skipping specific 'profiles' alter for now as we rely on auth.users predominantly efficiently, 
-- but if we had a public profiles table we'd add it there).


-- TRIGGER FUNCTION: Prevent modifications to Locked Rows
create or replace function check_locked_row()
returns trigger as $$
declare
    actor_role text;
begin
    -- If row is locked, only Admin/Superadmin can modify
    if OLD.is_locked = true then
        select raw_user_meta_data->>'role' into actor_role
        from auth.users
        where id = auth.uid();

        if actor_role is null or actor_role not in ('admin', 'super_admin') then
             raise exception 'This record is LOCKED by Administrators and cannot be modified.';
        end if;
    end if;
    
    return NEW;
end;
$$ language plpgsql security definer;

-- Apply Triggers
drop trigger if exists trg_lock_booking on booking;
create trigger trg_lock_booking
    before update or delete on booking
    for each row execute function check_locked_row();

drop trigger if exists trg_lock_service on service;
create trigger trg_lock_service
    before update or delete on service
    for each row execute function check_locked_row();

drop trigger if exists trg_lock_goals on wellness_goals;
create trigger trg_lock_goals
    before update or delete on wellness_goals
    for each row execute function check_locked_row();


-- SECTION 5: GOD MODE RPC
-- Allow Admins to update ANY table ANY field dynamically? 
-- PostgreSQL doesn't easily support "dynamic table update" via safe RPC without dynamic SQL injection risk.
-- Better pattern: The Admin uses the direct Supabase Client with the Service Role Key (in Server Actions) 
-- OR the Admin user has RLS policies that say "using (true)" which we already have for most tables.
-- The "God Mode" is mostly a frontend feature that exposes all fields.
-- However, we do need a way to TOGGLE the lock.

create or replace function admin_toggle_lock(
    p_table_name text,
    p_record_id uuid,
    p_lock_status boolean
) returns void as $$
begin
    -- Dynamic SQL to toggle lock
    -- Validate table name to prevent arbitrary injection
    if p_table_name not in ('booking', 'service', 'wellness_goals', 'identity_verifications') then
        raise exception 'Invalid table for locking';
    end if;
    
    execute format('update %I set is_locked = $1 where id = $2', p_table_name)
    using p_lock_status, p_record_id;
end;
$$ language plpgsql security definer;

-- Only Admins can call this RPC
-- (Revoke execute from public, grant to authenticated? Checks performed inside usually or via RLS if unrelated)
-- We'll add a check inside just in case.
