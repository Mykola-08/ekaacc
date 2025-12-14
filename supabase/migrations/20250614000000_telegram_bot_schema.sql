-- Telegram Bot Schema Migration

-- Users table (linked to Telegram)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint unique,
  username text,
  first_name text,
  last_name text,
  phone text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User Roles
create type user_role_type as enum ('client', 'staff', 'admin');

create table if not exists public.user_roles (
  telegram_user_id bigint primary key references public.users(telegram_user_id) on delete cascade,
  role user_role_type not null default 'client',
  therapist_id uuid references public.staff(id) -- Link to existing staff table if applicable
);

-- Plans (Subscription/Membership)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_month integer not null, -- in cents
  benefits_json jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz default now()
);

-- Update Bookings table to support new requirements
-- We need to check if 'booking' table exists and modify it, or create it if not.
-- Assuming 'booking' exists from SUPABASE_BOOKING_SCHEMA.sql

do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'booking_type') then
        create type booking_type as enum ('normal', 'june_group', 'june_individual');
    end if;
end $$;

alter table public.booking 
add column if not exists user_id uuid references public.users(id),
add column if not exists type booking_type default 'normal',
add column if not exists zoom_meeting_id text,
add column if not exists zoom_join_url text;

-- Session Results
create table if not exists public.session_results (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.booking(id) on delete cascade,
  notes_private text, -- Staff only
  notes_client text, -- Visible to client
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Checklist Items
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  date date not null,
  title text not null,
  description text,
  done boolean default false,
  source_booking_id uuid references public.booking(id),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_users_telegram_id on public.users(telegram_user_id);
create index if not exists idx_bookings_user_id on public.booking(user_id);
create index if not exists idx_checklist_user_date on public.checklist_items(user_id, date);

-- RLS Policies (Basic)
alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.plans enable row level security;
alter table public.session_results enable row level security;
alter table public.checklist_items enable row level security;

-- Allow service role full access (default usually, but good to be explicit if needed)
-- For now, we'll assume the bot uses the service role key, so it bypasses RLS.
-- But for the Web App (authenticated via Telegram), we might need policies.
-- Since Telegram auth is custom, we might need a function to "login" as a user or just use service role in API routes.
