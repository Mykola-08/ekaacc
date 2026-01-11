-- Migration: Social, Admin Features, and Activity Logs
-- Date: 2026-01-11

--------------------------------------------------------------------------------
-- 1. Activity Logs (Extensive Metadata Collection)
--------------------------------------------------------------------------------
-- Logs every significant user interaction
create table if not exists activity_logs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    actor_id uuid references profiles(id) on delete set null,
    target_type text not null, -- 'booking', 'service', 'profile', 'payment'
    target_id uuid, -- ID of the object being acted upon
    action text not null, -- 'create', 'update', 'delete', 'view', 'login', etc.
    metadata jsonb default '{}'::jsonb, -- Store snapshot of changes or request details
    ip_address text,
    user_agent text
);

alter table activity_logs enable row level security;

-- Admin/Therapist can view all logs
create policy "Admins view all activity"
    on activity_logs for select
    using ( exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'therapist')) );

-- Users can view their own activity
create policy "Users view own activity"
    on activity_logs for select
    using ( actor_id = (select id from profiles where auth_id = auth.uid()) );


--------------------------------------------------------------------------------
-- 2. Social Features (Forum / Community)
--------------------------------------------------------------------------------
create table if not exists posts (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    author_id uuid references profiles(id) on delete cascade not null,
    title text,
    content text not null,
    tags text[] default '{}',
    is_pinned boolean default false,
    is_locked boolean default false,
    view_count integer default 0,
    likes_count integer default 0
);

create table if not exists comments (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    post_id uuid references posts(id) on delete cascade not null,
    parent_comment_id uuid references comments(id) on delete cascade, -- For nested threads
    author_id uuid references profiles(id) on delete cascade not null,
    content text not null,
    likes_count integer default 0
);

alter table posts enable row level security;
alter table comments enable row level security;

-- Policies: Everyone can read public posts.
create policy "Public read posts" on posts for select using (true);
create policy "Public read comments" on comments for select using (true);

-- Auth users can create
create policy "Auth create posts" on posts for insert with check (auth.uid() is not null);
create policy "Auth create comments" on comments for insert with check (auth.uid() is not null);

-- Authors can edit/delete own
create policy "Authors edit own posts" on posts for update using (author_id = (select id from profiles where auth_id = auth.uid()));
create policy "Authors edit own comments" on comments for update using (author_id = (select id from profiles where auth_id = auth.uid()));


--------------------------------------------------------------------------------
-- 3. Social Features (Direct Messaging / Chats)
--------------------------------------------------------------------------------
create table if not exists chat_channels (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    type text default 'direct', -- 'direct', 'group'
    metadata jsonb default '{}'::jsonb
);

create table if not exists chat_participants (
    channel_id uuid references chat_channels(id) on delete cascade,
    profile_id uuid references profiles(id) on delete cascade,
    joined_at timestamptz default now(),
    last_read_at timestamptz default now(),
    primary key (channel_id, profile_id)
);

create table if not exists chat_messages (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    channel_id uuid references chat_channels(id) on delete cascade not null,
    sender_id uuid references profiles(id) on delete set null,
    content text,
    attachments jsonb default '[]'::jsonb, -- Media, files
    is_system_message boolean default false
);

alter table chat_channels enable row level security;
alter table chat_participants enable row level security;
alter table chat_messages enable row level security;

-- Policies
create policy "View channels if participant" on chat_channels for select
    using (exists (select 1 from chat_participants where channel_id = chat_channels.id and profile_id = (select id from profiles where auth_id = auth.uid())));

create policy "View messages if participant" on chat_messages for select
    using (exists (select 1 from chat_participants where channel_id = chat_messages.channel_id and profile_id = (select id from profiles where auth_id = auth.uid())));

create policy "Send messages if participant" on chat_messages for insert
    with check (exists (select 1 from chat_participants where channel_id = chat_messages.channel_id and profile_id = (select id from profiles where auth_id = auth.uid())));

--------------------------------------------------------------------------------
-- 4. Admin/Therapist Enhancements (Notes & Privacy)
--------------------------------------------------------------------------------
-- Detailed notes for admins/therapists on Users, Bookings, etc.
create table if not exists admin_notes (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    author_id uuid references profiles(id) on delete set null,
    target_type text not null, -- 'profile', 'booking', 'service'
    target_id uuid not null,
    content text not null,
    is_private_to_author boolean default false
);

alter table admin_notes enable row level security;

create policy "Admins view all notes" on admin_notes for select
    using ( exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'therapist')) );

create policy "Admins create notes" on admin_notes for insert
    with check ( exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'therapist')) );


--------------------------------------------------------------------------------
-- 5. Privacy Settings Columns
--------------------------------------------------------------------------------
alter table profiles 
    add column if not exists privacy_settings jsonb default '{"share_history": false, "visible_in_directory": false, "allow_marketing": true}'::jsonb,
    add column if not exists date_sharing_opt_in timestamptz;

-- Ensure RLS allows users to update their own privacy settings
create policy "Users update own privacy" on profiles for update
    using (auth_id = auth.uid())
    with check (auth_id = auth.uid());

