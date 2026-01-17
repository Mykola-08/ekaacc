-- Unified System Migration (Features, Permissions, Superadmin, Plans, Wallet, Overhaul)
-- Timestamp: 20260117000000

-- SECTION 1: CORE FEATURES (Journal, Availability, Telegram Links)

-- 1.1 Journal Entries Table
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text,
  mood text check (mood in ('happy', 'neutral', 'sad', 'excited', 'tired')),
  created_at width_bucket_timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at width_bucket_timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table journal_entries enable row level security;

create policy "Users can view own journal entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on journal_entries for update
  using (auth.uid() = user_id);


-- 1.2 Therapist Availability Table
create table if not exists therapist_availability (
  id uuid default gen_random_uuid() primary key,
  therapist_id uuid references auth.users(id) on delete cascade not null,
  day_of_week text not null check (day_of_week in ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(therapist_id, day_of_week, start_time)
);

alter table therapist_availability enable row level security;

create policy "Public can view availability"
  on therapist_availability for select
  to authenticated, anon
  using (true);

create policy "Therapists can manage own availability"
  on therapist_availability for all
  using (auth.uid() = therapist_id);


-- 1.3 Telegram Links Table
create table if not exists telegram_links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  telegram_chat_id bigint not null unique,
  telegram_username text,
  is_verified boolean default false,
  verification_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table telegram_links enable row level security;

create policy "Users can view own telegram link"
  on telegram_links for select
  using (auth.uid() = user_id);


-- 1.4 Notification Triggers (Simplified Stub)
create or replace function log_notification_event()
returns trigger as $$
begin
  -- Logic to insert into a notifications queue table could go here
  return new;
end;
$$ language plpgsql;

create trigger on_booking_created
  after insert on booking
  for each row
  execute function log_notification_event();


-- SECTION 2: GRANULAR PERMISSIONS & TELEGRAM MANAGEMENT

-- 2.1 Permissions System
create table if not exists permissions (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists role_permissions (
  id uuid default gen_random_uuid() primary key,
  role text not null, -- 'admin', 'therapist', 'client', 'super_admin'
  permission_id uuid references permissions(id) on delete cascade not null,
  unique(role, permission_id)
);

create table if not exists user_permissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  permission_id uuid references permissions(id) on delete cascade not null,
  is_granted boolean not null default true,
  unique(user_id, permission_id)
);

-- RLS for Permissions
alter table permissions enable row level security;
alter table role_permissions enable row level security;
alter table user_permissions enable row level security;

-- Only admins/superadmins can view permissions (simplified for bootstrap)
create policy "Admins can view all permissions"
  on permissions for select
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid() 
      and (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'super_admin')
    )
  );


-- 2.2 Telegram Chats Management
create table if not exists telegram_chats (
  chat_id bigint primary key,
  title text,
  type text, -- 'group', 'supergroup', 'channel'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table telegram_chats enable row level security;

create policy "Admins can manage telegram chats"
  on telegram_chats for all
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid() 
      and (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'super_admin')
    )
  );


-- 2.3 Seed Initial Data (Permissions)
DO $$
DECLARE
  p_tg_send uuid;
  p_tg_admin uuid;
  p_user_manage uuid;
  p_perm_manage uuid;
BEGIN
  -- Insert Permissions and get IDs
  insert into permissions (code, description) values 
    ('telegram.send', 'Can send messages via Telegram Bot'),
    ('telegram.admin', 'Can manage Telegram Bot settings and groups'),
    ('user.manage', 'Can manage users'),
    ('permission.manage', 'Can manage permissions')
  on conflict (code) do update set description = EXCLUDED.description
  returning id into p_tg_send;

  -- Re-fetch IDs safely
  select id into p_tg_send from permissions where code = 'telegram.send';
  select id into p_tg_admin from permissions where code = 'telegram.admin';
  select id into p_user_manage from permissions where code = 'user.manage';
  select id into p_perm_manage from permissions where code = 'permission.manage';

  -- Seed Admin Role
  insert into role_permissions (role, permission_id) values 
    ('admin', p_tg_send),
    ('admin', p_tg_admin),
    ('admin', p_user_manage),
    ('admin', p_perm_manage)
  on conflict do nothing;

  -- Seed Therapist Role
  insert into role_permissions (role, permission_id) values 
    ('therapist', p_tg_send)
  on conflict do nothing;
  
END $$;


-- SECTION 3: SUPERADMIN PROTECTION

-- 3.1 Protection Function
create or replace function protect_superadmin_changes()
returns trigger as $$
declare
  actor_role text;
begin
  select raw_user_meta_data->>'role' into actor_role
  from auth.users
  where id = auth.uid();

  -- Safeguard 1: Prevent deleting a super_admin unless you are one
  if (TG_OP = 'DELETE') then
    if (OLD.raw_user_meta_data->>'role' = 'super_admin') then
        if (actor_role is distinct from 'super_admin') then
            raise exception 'Only Superadmins can delete other Superadmins.';
        end if;
    end if;
    return OLD;
  end if;

  -- Safeguard 2: Prevent changing role TO/FROM super_admin
  if (TG_OP = 'UPDATE') then
    if (OLD.raw_user_meta_data->>'role' = 'super_admin' AND NEW.raw_user_meta_data->>'role' != 'super_admin') then
        if (actor_role is distinct from 'super_admin') then
            raise exception 'Only Superadmins can downgrade High Council members.';
        end if;
    end if;
    
    if (OLD.raw_user_meta_data->>'role' != 'super_admin' AND NEW.raw_user_meta_data->>'role' = 'super_admin') then
        if (actor_role is distinct from 'super_admin') then
             raise exception 'Only Superadmins can promote new High Council members.';
        end if;
    end if;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- 3.2 Apply Trigger (Attempting to attach to auth.users)
-- Warning: Requires appropriate extension/permission level
drop trigger if exists check_superadmin_changes on auth.users;
create trigger check_superadmin_changes
  before delete or update on auth.users
  for each row
  execute function protect_superadmin_changes();


-- SECTION 4: WALLET PRODUCTS & PAYMENT VERIFICATION

-- 4.1 ENHANCE SERVICE FOR UNIFIED PRODUCTS
alter table service add column if not exists type text default 'service' check (type in ('service', 'product', 'wallet_credit', 'membership'));

-- 4.2 CREATE PAYMENT PROOFS (THE VERIFICATOR)
create table if not exists payment_proof (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references auth.users(id),
  booking_id uuid references booking(id),
  wallet_transaction_id uuid references wallet_transactions(id),
  
  -- The Proof
  proof_type text not null check (proof_type in ('image', 'pdf', 'reference_code', 'cash_log')),
  proof_url text, 
  reference_code text, 
  amount_cents integer not null,
  currency text default 'EUR',
  
  -- Verification Status
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  notes text 
);

-- RLS for Proofs
alter table payment_proof enable row level security;
create policy "Users can view own proofs" on payment_proof for select using (auth.uid() = user_id);
create policy "Users can upload own proofs" on payment_proof for insert with check (auth.uid() = user_id);
create policy "Staff can manage all proofs" on payment_proof for all using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'staff', 'therapist'))
);

-- 4.3 SEED DATA: WALLET TOP-UP PRODUCTS
insert into service (id, name, description, type, is_public, metadata)
values 
  (gen_random_uuid(), 'Wallet Credit 50€', 'Add 50 EUR to your digital wallet', 'wallet_credit', true, '{"credit_amount": 5000}'),
  (gen_random_uuid(), 'Wallet Credit 100€', 'Add 100 EUR to your digital wallet (5% Bonus)', 'wallet_credit', true, '{"credit_amount": 10500, "bonus": 500}'),
  (gen_random_uuid(), 'Wallet Credit 200€', 'Add 200 EUR to your digital wallet (10% Bonus)', 'wallet_credit', true, '{"credit_amount": 22000, "bonus": 2000}')
on conflict do nothing;

-- 4.4 FUNCTION: Verify Payment Proof
create or replace function verify_payment_proof(
  p_proof_id uuid,
  p_verifier_id uuid,
  p_status text, -- 'verified' or 'rejected'
  p_notes text
) returns void as $$
declare
  v_booking_id uuid;
  v_wallet_tx_id uuid;
  v_amount int;
  v_user_id uuid;
begin
  -- 1. Update Proof
  update payment_proof 
  set status = p_status, 
      verified_by = p_verifier_id, 
      verified_at = now(), 
      notes = p_notes
  where id = p_proof_id
  returning booking_id, wallet_transaction_id, amount_cents, user_id
  into v_booking_id, v_wallet_tx_id, v_amount, v_user_id;

  -- 2. If Verified...
  if p_status = 'verified' then
    
    -- A. If linked to Booking -> Mark Booking as PAID
    if v_booking_id is not null then
      update booking 
      set payment_status = 'captured',
          status = 'scheduled'
      where id = v_booking_id;
    end if;

    -- B. If linked to Wallet Transaction -> Credit Wallet
    if v_wallet_tx_id is null and v_booking_id is null then
       insert into user_wallet (user_id, balance_cents)
       values (v_user_id, v_amount)
       on conflict (user_id) do update
       set balance_cents = user_wallet.balance_cents + v_amount,
           updated_at = now();
           
       insert into wallet_transactions (user_id, amount_cents, type, description, reference_id)
       values (v_user_id, v_amount, 'deposit', 'Manual Bank Transfer Verified', p_proof_id::text);
    end if;

  end if;
end;
$$ language plpgsql security definer;


-- SECTION 5: PLAN SEEDING
delete from plan_definition where name in ('VIP Membership', 'Loyal Customer Pack');

insert into plan_definition (name, description, credits_total, validity_days, price_cents, active, metadata)
values (
  'VIP Membership', 
  'Elite access. Includes 10 sessions, priority booking, and private suite access.', 
  10, 
  365, 
  80000, 
  true, 
  '{"badge": "VIP", "color": "gold"}'::jsonb
);

insert into plan_definition (name, description, credits_total, validity_days, price_cents, active, metadata)
values (
  'Loyal Customer Pack', 
  'Perfect for regulars. 5 sessions to use within 3 months.', 
  5, 
  90, 
  35000, 
  true, 
  '{"badge": "Loyal", "color": "blue"}'::jsonb
);


-- SECTION 6: WALLET DEDUCTION & ATOMIC PLAN PURCHASE

-- 6.1 Deduct Function
create or replace function deduct_wallet_balance(
    p_user_id uuid,
    p_amount_cents integer,
    p_description text,
    p_reference_id text
) returns void as $$
declare
    v_wallet_id uuid;
    v_new_balance bigint;
begin
    -- Lock Wallet
    select id, balance_cents into v_wallet_id, v_new_balance 
    from wallets 
    where user_id = p_user_id
    for update;
    
    if not found then raise exception 'Wallet not found'; end if;
    if v_new_balance < p_amount_cents then raise exception 'Insufficient balance'; end if;

    v_new_balance := v_new_balance - p_amount_cents;

    -- Update
    update wallets set balance_cents = v_new_balance where id = v_wallet_id;

    -- Log
    insert into wallet_transactions (
        wallet_id, user_id, amount_cents, balance_after_cents, 
        type, description, reference_id
    ) values (
        v_wallet_id, p_user_id, -p_amount_cents, v_new_balance, -- Negative for debit
        'purchase', p_description, p_reference_id
    );
end;
$$ language plpgsql security definer;

-- 6.2 Atomic Plan Purchase
create or replace function purchase_plan_atomic(
    p_user_id uuid,
    p_plan_id uuid
) returns uuid as $$
declare
    v_plan plan_definition%ROWTYPE;
    v_usage_id uuid;
begin
    -- Get Plan
    select * into v_plan from plan_definition where id = p_plan_id;
    if not found then raise exception 'Plan not found'; end if;

    -- 1. Deduct (Will raise exception if insufficient funds)
    perform deduct_wallet_balance(
        p_user_id, 
        v_plan.price_cents, 
        'Purchase Plan: ' || v_plan.name, 
        p_plan_id::text
    );

    -- 2. Assign Plan (Reusing existing function logic or calling it if available)
    v_usage_id := assign_plan_to_user(p_user_id, p_plan_id, p_user_id);

    return v_usage_id;
end;
$$ language plpgsql security definer;


-- SECTION 7: COMPREHENSIVE OVERHAUL (Goals, Social, Identity, Locks)

-- 7.1 WELLNESS GOALS
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


-- 7.2 SOCIAL 2.0 (Comments & Likes)
create table if not exists post_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references community_posts(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table post_comments enable row level security;
create policy "Public view comments" on post_comments for select using (true); 
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


-- 7.3 IDENTITY VERIFICATION
create table if not exists identity_verifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null check (type in ('passport', 'driver_license', 'id_card')),
    front_image_url text not null,
    back_image_url text, 
    selfie_image_url text not null,
    status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
    rejection_reason text,
    reviewed_by uuid references auth.users(id),
    reviewed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_locked boolean default true 
);

alter table identity_verifications enable row level security;
create policy "Users view own verifications" on identity_verifications for select using (auth.uid() = user_id);
create policy "Users create verifications" on identity_verifications for insert with check (auth.uid() = user_id);
create policy "Admins manage verifications" on identity_verifications for all using (
    exists (select 1 from auth.users where id = auth.uid() and raw_user_meta_data->>'role' in ('admin', 'super_admin'))
);


-- 7.4 ADMIN LOCK & GOD MODE
alter table booking add column if not exists is_locked boolean default false;
alter table service add column if not exists is_locked boolean default false;

create or replace function check_locked_row()
returns trigger as $$
declare
    actor_role text;
begin
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


create or replace function admin_toggle_lock(
    p_table_name text,
    p_record_id uuid,
    p_lock_status boolean
) returns void as $$
begin
    if p_table_name not in ('booking', 'service', 'wellness_goals', 'identity_verifications') then
        raise exception 'Invalid table for locking';
    end if;
    
    execute format('update %I set is_locked = $1 where id = $2', p_table_name)
    using p_lock_status, p_record_id;
end;
$$ language plpgsql security definer;
