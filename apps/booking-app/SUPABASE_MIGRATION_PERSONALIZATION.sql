-- Personalization and Booking Ecosystem Migration
-- Author: GitHub Copilot
-- Date: 2026-01-11
-- Aligned with FEATURE_MAP.md

-- 1. Enums for Roles and Relationships
do $$ begin
    create type user_role as enum ('admin', 'therapist', 'client');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type relationship_type as enum ('parent', 'guardian', 'partner', 'friend', 'family', 'other');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type wallet_transaction_type as enum ('deposit', 'payment', 'refund', 'reward', 'adjustment', 'transfer');
exception
    when duplicate_object then null;
end $$;

-- 2. Profiles Table (Central Identity)
-- Supports both authenticated users and managed dependents
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Link to Supabase Auth (nullable for managed dependents)
  auth_id uuid references auth.users(id) on delete set null unique,
  
  -- Ownership for managed profiles (e.g. Child managed by Parent)
  managed_by uuid references profiles(id) on delete set null,
  
  -- Core Fields
  role user_role not null default 'client',
  full_name text not null,
  email text, -- Optional for children
  phone text,
  dob date, -- Critical for personalization
  gender text,
  language text default 'en',
  country text,
  city text,
  
  -- Trust & Safety
  trust_score integer default 100,
  is_verified boolean default false,
  verification_level text default 'none', -- 'none', 'id_checked', 'trusted'
  
  -- Personalization (Jsonb for flexibility)
  -- Structure: { "goals": [], "preferences": {}, "contraindications": [], "notes": "" }
  personalization_data jsonb default '{}'::jsonb,
  
  -- Metadata
  metadata jsonb default '{}'::jsonb
);

-- RLS: Profiles are visible to self and admins. Managed profiles visible to manager.
alter table profiles enable row level security;

-- 3. Relationships Table (User to User)
create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  from_profile_id uuid not null references profiles(id) on delete cascade,
  to_profile_id uuid not null references profiles(id) on delete cascade,
  type relationship_type not null default 'family',
  permissions jsonb default '{"can_book": true, "can_view_history": true}'::jsonb,
  
  unique(from_profile_id, to_profile_id)
);

-- 4. Wallets & Points
-- One wallet per profile. Managed profiles might share parent wallet (handled in logic or via shared_wallet_id)
create table if not exists wallets (
  profile_id uuid primary key references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  
  balance_cents integer default 0 check (balance_cents >= 0),
  currency text default 'USD',
  
  points_balance integer default 0 check (points_balance >= 0),
  
  -- Credits / Vouchers stored as JSON structure
  -- e.g. [{ "id": "...", "service_id": "...", "expires_at": "..." }]
  credits_data jsonb default '[]'::jsonb,
  
  updated_at timestamptz default now()
);

-- Wallet Transactions Log
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  wallet_id uuid not null references wallets(profile_id),
  amount integer not null, -- Can be negative for spend
  currency text default 'USD', -- or 'POINTS'
  type wallet_transaction_type not null,
  
  reference_id uuid, -- e.g. booking_id
  description text,
  metadata jsonb default '{}'::jsonb
);

-- 5. Reviews & Social Proof
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  
  booking_id uuid not null references booking(id) on delete cascade, -- Link to booking
  author_profile_id uuid references profiles(id) on delete set null,
  therapist_profile_id uuid references profiles(id) on delete set null, -- cached for ease
  
  rating integer not null check (rating between 1 and 5),
  comment text,
  
  is_public boolean default true,
  is_anonymous boolean default false,
  
  therapist_reply text,
  admin_flagged boolean default false
);

-- 6. Update Bookings Table
-- Enhance existing booking table to support Profile links
alter table booking 
  add column if not exists profile_id uuid references profiles(id) on delete set null,
  add column if not exists booked_by_profile_id uuid references profiles(id) on delete set null,
  add column if not exists payment_method_details jsonb default '{}'::jsonb;

-- 7. Memberships / VIP Levels (Simple Start)
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id),
  plan_id text not null, -- 'basic', 'vip', 'elite'
  status text default 'active',
  starts_at timestamptz default now(),
  ends_at timestamptz,
  auto_renew boolean default true
);

-- 8. Onboarding & Personalization Questions
-- This allows dynamic questions for the "Good Onboarding" experience
create table if not exists onboarding_questions (
  id uuid primary key default gen_random_uuid(),
  question_key text unique not null, -- e.g. 'primary_goal', 'massage_preference'
  question_text text not null,
  type text not null default 'text', -- 'text', 'single_choice', 'multi_choice', 'scale'
  options jsonb, -- ["Relaxation", "Pain Relief"]
  display_order integer default 0,
  category text default 'general', -- 'health', 'preferences'
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists user_onboarding_answers (
  profile_id uuid not null references profiles(id) on delete cascade,
  question_id uuid not null references onboarding_questions(id) on delete cascade,
  answer_data jsonb not null, -- {"value": "Pain Relief"} or {"values": ["Neck", "Back"]}
  updated_at timestamptz default now(),
  primary key (profile_id, question_id)
);

-- Indexes
create index if not exists idx_profiles_auth_id on profiles(auth_id);
create index if not exists idx_profiles_managed_by on profiles(managed_by);
create index if not exists idx_booking_profile_id on booking(profile_id);
create index if not exists idx_relationships_from on relationships(from_profile_id);

-- Seed Onboarding Data
-- We verify if they exist to avoid huge insert blocks on re-run, or use ON CONFLICT
insert into onboarding_questions (question_key, question_text, type, options, display_order, category)
values
  ('primary_goal', 'What is your primary goal for therapy?', 'single_choice', 
   '["Stress Relief", "Pain Management", "Rehabilitation", "Spiritual Growth", "General Wellness"]'::jsonb, 
   1, 'goals'),
  ('stress_level', 'How would you rate your current stress level (1-10)?', 'scale', 
   '{"min": 1, "max": 10}'::jsonb, 
   2, 'health'),
  ('focus_areas', 'Which areas should we focus on?', 'multi_choice', 
   '["Neck", "Shoulders", "Lower Back", "Legs", "Feet", "Head/Face"]'::jsonb, 
   3, 'preferences'),
  ('pressure_preference', 'What is your preferred massage pressure?', 'single_choice', 
   '["Light", "Medium", "Firm", "Deep Tissue"]'::jsonb, 
   4, 'preferences')
on conflict (question_key) do update 
  set options = excluded.options, question_text = excluded.question_text;

