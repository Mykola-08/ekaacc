-- ==========================================================================
-- MIGRATION: 20260309000000_telegram_deep_integration.sql
-- Deep Telegram Bot Integration (Groups, Channels, Analytics, Scheduled Posts)
-- ==========================================================================

-- 1. Telegram Channels (managed by bot)
create table if not exists telegram_channels (
  id uuid default gen_random_uuid() primary key,
  chat_id bigint not null unique,
  title text not null,
  username text,               -- @channel_username
  type text not null default 'channel', -- 'channel', 'group', 'supergroup'
  description text,
  member_count integer default 0,
  invite_link text,
  is_active boolean default true,
  linked_chat_id bigint,       -- linked discussion group for channels
  bot_is_admin boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table telegram_channels enable row level security;

create policy "Admins can manage telegram channels"
  on telegram_channels for all
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_channels to authenticated;
grant all on telegram_channels to service_role;

create index if not exists idx_telegram_channels_chat_id on telegram_channels(chat_id);


-- 2. Telegram Channel Posts (published & scheduled)
create table if not exists telegram_posts (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references telegram_channels(id) on delete cascade not null,
  message_id bigint,            -- Telegram message_id after posting
  content text not null,
  parse_mode text default 'HTML', -- 'HTML', 'Markdown', 'MarkdownV2'
  media_type text,               -- 'photo', 'video', 'document', null for text
  media_url text,
  buttons jsonb,                 -- inline keyboard markup [{text, url}]
  status text not null default 'draft', -- 'draft', 'scheduled', 'published', 'failed', 'deleted'
  scheduled_at timestamptz,
  published_at timestamptz,
  error_message text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table telegram_posts enable row level security;

create policy "Admins can manage telegram posts"
  on telegram_posts for all
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_posts to authenticated;
grant all on telegram_posts to service_role;

create index if not exists idx_telegram_posts_channel_id on telegram_posts(channel_id);
create index if not exists idx_telegram_posts_status on telegram_posts(status);
create index if not exists idx_telegram_posts_scheduled_at on telegram_posts(scheduled_at)
  where status = 'scheduled';


-- 3. Telegram Post Analytics (per-post metrics)
create table if not exists telegram_post_analytics (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references telegram_posts(id) on delete cascade not null,
  views integer default 0,
  forwards integer default 0,
  replies integer default 0,
  reactions jsonb default '{}',  -- {"👍": 5, "❤️": 3}
  link_clicks integer default 0,
  recorded_at timestamptz default now()
);

alter table telegram_post_analytics enable row level security;

create policy "Admins can view post analytics"
  on telegram_post_analytics for select
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_post_analytics to authenticated;
grant all on telegram_post_analytics to service_role;

create index if not exists idx_telegram_post_analytics_post_id on telegram_post_analytics(post_id);


-- 4. Telegram Channel Analytics (daily snapshots)
create table if not exists telegram_channel_analytics (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references telegram_channels(id) on delete cascade not null,
  date date not null,
  member_count integer default 0,
  new_members integer default 0,
  left_members integer default 0,
  messages_count integer default 0,
  views_total integer default 0,
  avg_post_reach numeric(5,2) default 0,
  engagement_rate numeric(5,2) default 0, -- percentage
  created_at timestamptz default now(),
  unique(channel_id, date)
);

alter table telegram_channel_analytics enable row level security;

create policy "Admins can view channel analytics"
  on telegram_channel_analytics for select
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_channel_analytics to authenticated;
grant all on telegram_channel_analytics to service_role;

create index if not exists idx_telegram_channel_analytics_channel_date
  on telegram_channel_analytics(channel_id, date);


-- 5. Telegram Bot Commands Log (audit trail)
create table if not exists telegram_bot_commands (
  id uuid default gen_random_uuid() primary key,
  telegram_user_id bigint,
  chat_id bigint,
  command text not null,
  args text,
  response_status text default 'success', -- 'success', 'error', 'ignored'
  created_at timestamptz default now()
);

alter table telegram_bot_commands enable row level security;

create policy "Admins can view bot commands"
  on telegram_bot_commands for select
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_bot_commands to authenticated;
grant all on telegram_bot_commands to service_role;

create index if not exists idx_telegram_bot_commands_chat_id on telegram_bot_commands(chat_id);
create index if not exists idx_telegram_bot_commands_created_at on telegram_bot_commands(created_at);


-- 6. Telegram Group Members tracking
create table if not exists telegram_group_members (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references telegram_channels(id) on delete cascade not null,
  telegram_user_id bigint not null,
  username text,
  first_name text,
  last_name text,
  status text default 'member', -- 'member', 'admin', 'creator', 'left', 'kicked', 'restricted'
  joined_at timestamptz default now(),
  left_at timestamptz,
  linked_user_id uuid references auth.users(id), -- platform link
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(channel_id, telegram_user_id)
);

alter table telegram_group_members enable row level security;

create policy "Admins can manage group members"
  on telegram_group_members for all
  using (
    exists (
      select 1 from auth.users
      where id = auth.uid()
      and (raw_user_meta_data->>'role' in ('admin', 'super_admin', 'Admin', 'SuperAdmin'))
    )
  );

grant select on telegram_group_members to authenticated;
grant all on telegram_group_members to service_role;

create index if not exists idx_telegram_group_members_channel_id on telegram_group_members(channel_id);
create index if not exists idx_telegram_group_members_tg_user on telegram_group_members(telegram_user_id);


-- 7. Telegram Webhook Events (raw event log for debugging)
create table if not exists telegram_webhook_events (
  id uuid default gen_random_uuid() primary key,
  update_id bigint,
  event_type text not null, -- 'message', 'callback_query', 'channel_post', 'member_update', etc.
  payload jsonb not null,
  processed boolean default false,
  created_at timestamptz default now()
);

alter table telegram_webhook_events enable row level security;

create policy "Service role only for webhook events"
  on telegram_webhook_events for all
  using (auth.jwt() ->> 'role' = 'service_role');

grant all on telegram_webhook_events to service_role;

create index if not exists idx_telegram_webhook_events_type on telegram_webhook_events(event_type);
create index if not exists idx_telegram_webhook_events_created_at on telegram_webhook_events(created_at);

-- Auto-cleanup old webhook events (keep 30 days)
-- This can be called by a cron/edge function
create or replace function cleanup_old_telegram_events()
returns void as $$
begin
  delete from telegram_webhook_events
  where created_at < now() - interval '30 days';
end;
$$ language plpgsql security definer;


-- 8. Add new permissions for Telegram deep integration
DO $$
DECLARE
  p_channel_manage uuid;
  p_channel_post uuid;
  p_channel_analytics uuid;
BEGIN
  insert into permissions (code, description) values
    ('telegram.channel.manage', 'Can manage Telegram channels and groups'),
    ('telegram.channel.post', 'Can create and publish posts to channels'),
    ('telegram.channel.analytics', 'Can view channel and post analytics')
  on conflict (code) do update set description = EXCLUDED.description;

  select id into p_channel_manage from permissions where code = 'telegram.channel.manage';
  select id into p_channel_post from permissions where code = 'telegram.channel.post';
  select id into p_channel_analytics from permissions where code = 'telegram.channel.analytics';

  -- Grant to admin role
  insert into role_permissions (role, permission_id) values
    ('admin', p_channel_manage),
    ('admin', p_channel_post),
    ('admin', p_channel_analytics)
  on conflict do nothing;
END $$;
-- ==========================================================================
-- MIGRATION: 20260310000000_telegram_user_notifications.sql
-- Adds Telegram as a notification channel alongside email, push, and in-app.
-- ==========================================================================

-- 1. Extend user_notification_settings with Telegram columns
--    Follows existing pattern: {category}_{channel} (e.g. marketing_email)
alter table user_notification_settings
  add column if not exists marketing_telegram boolean default false,
  add column if not exists security_telegram boolean default true,
  add column if not exists updates_telegram  boolean default true,
  add column if not exists booking_telegram  boolean default true,
  add column if not exists reminder_telegram boolean default true;

-- 2. Add telegram channel toggle to app_config (platform-level on/off)
insert into app_config (key, value, description, category)
values ('telegram_notifications_enabled', 'true', 'Whether Telegram notifications are enabled', 'notifications')
on conflict (key) do nothing;

-- 3. Add update policy on telegram_links so users can manage their own link
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'telegram_links' and policyname = 'Users can update own telegram link'
  ) then
    create policy "Users can update own telegram link"
      on telegram_links for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

-- 4. Notification dispatch log — tracks every notification sent (any channel)
create table if not exists notification_dispatch_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  channel text not null,          -- 'email' | 'telegram' | 'push' | 'in_app'
  notification_type text not null, -- 'booking_confirmed' | 'booking_reminder' etc.
  reference_id uuid,              -- bookingId or other entity id
  message_preview text,
  metadata jsonb default '{}',
  sent_at timestamptz default now(),
  delivered boolean default true,
  error_message text
);

alter table notification_dispatch_log enable row level security;

create policy "Users can view own dispatch log"
  on notification_dispatch_log for select
  using (auth.uid() = user_id);

grant select on notification_dispatch_log to authenticated;
grant all on notification_dispatch_log to service_role;

create index if not exists idx_notif_dispatch_user on notification_dispatch_log(user_id);
create index if not exists idx_notif_dispatch_channel on notification_dispatch_log(channel);
create index if not exists idx_notif_dispatch_type on notification_dispatch_log(notification_type);
create index if not exists idx_notif_dispatch_ref on notification_dispatch_log(reference_id);

-- 5. Add reminded_at column to bookings for reminder dedup
alter table bookings
  add column if not exists reminded_at timestamptz;

-- 6. Auto-cleanup old dispatch log entries (>90 days)
create or replace function cleanup_old_notification_dispatch_log()
returns void as $$
begin
  delete from notification_dispatch_log where sent_at < now() - interval '90 days';
end;
$$ language plpgsql security definer;
-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to user_memory table (1536 dims for text-embedding-3-small)
ALTER TABLE user_memory ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Optional: Create an index on the embedding for faster similarity search
CREATE INDEX IF NOT EXISTS idx_user_memory_embedding
ON user_memory USING hnsw (embedding vector_cosine_ops);

-- Create a search function for RAG
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  memory_type text,
  importance int,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    memory_type,
    importance,
    1 - (user_memory.embedding <=> query_embedding) AS similarity
  FROM user_memory
  WHERE user_id = p_user_id
    AND 1 - (user_memory.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
-- Optimize RLS policies that incorrectly use per-row auth.users subqueries
-- Replacing subqueries with JWT claims for scalability and performance

-- 1. features table
DROP POLICY IF EXISTS "Admins can manage features" ON features;
CREATE POLICY "Admins can manage features" ON features FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 2. user_feature_enrollment table
DROP POLICY IF EXISTS "Admins can view all enrollments" ON user_feature_enrollment;
CREATE POLICY "Admins can view all enrollments" ON user_feature_enrollment FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 3. user_feature_overrides table
DROP POLICY IF EXISTS "Admins can manage overrides" ON user_feature_overrides;
CREATE POLICY "Admins can manage overrides" ON user_feature_overrides FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 4. permissions table
DROP POLICY IF EXISTS "Admins can manage permissions" ON permissions;
CREATE POLICY "Admins can manage permissions" ON permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 5. role_permissions table
DROP POLICY IF EXISTS "Admins can manage role permissions" ON role_permissions;
CREATE POLICY "Admins can manage role permissions" ON role_permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 6. user_custom_permissions table
DROP POLICY IF EXISTS "Admins can manage user custom permissions" ON user_custom_permissions;
CREATE POLICY "Admins can manage user custom permissions" ON user_custom_permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 7. wellness_goals
DROP POLICY IF EXISTS "Admins manage all goals" ON wellness_goals;
CREATE POLICY "Admins manage all goals" ON wellness_goals FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Admin', 'admin', 'super_admin', 'therapist') OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
);

-- 8. identity_verifications
DROP POLICY IF EXISTS "Admins manage verifications" ON identity_verifications;
CREATE POLICY "Admins manage verifications" ON identity_verifications FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Admin', 'admin', 'super_admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 9. plan_definition
DROP POLICY IF EXISTS "Admins can manage plan definitions" ON plan_definition;
CREATE POLICY "Admins can manage plan definitions" ON plan_definition
    FOR ALL USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

DROP POLICY IF EXISTS "Therapists can view plan definitions" ON plan_definition;
CREATE POLICY "Therapists can view plan definitions" ON plan_definition
    FOR SELECT TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
    );

-- 10. user_plan
DROP POLICY IF EXISTS "Admins can manage user plans" ON user_plan;
CREATE POLICY "Admins can manage user plans" ON user_plan
    FOR ALL USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

DROP POLICY IF EXISTS "Therapists can view user plans" ON user_plan;
CREATE POLICY "Therapists can view user plans" ON user_plan
    FOR SELECT TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
    );
-- Migration: Add tenant features, expand knowledge base (exercises/supplements), and kinesiology tests

-- 1. Tenant Features Table
CREATE TABLE IF NOT EXISTS public.tenant_features (
    tenant_id text PRIMARY KEY,
    features JSONB NOT NULL DEFAULT '{
        "enable_kinesiology_module": false,
        "enable_community": false,
        "enable_supplements": false,
        "enable_custom_anamnesis": false
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users of the same tenant" ON public.tenant_features
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) OR
        tenant_id = 'default'
    );

CREATE POLICY "Enable update for admins and therapists" ON public.tenant_features
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    )
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    );

CREATE POLICY "Enable insert for admins and therapists" ON public.tenant_features
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    );

CREATE TRIGGER update_tenant_features_updated_at BEFORE UPDATE ON public.tenant_features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Alter Exercises to support Global/SaaS tiers
ALTER TABLE public.exercises
ADD COLUMN IF NOT EXISTS tenant_id text DEFAULT 'global',
ADD COLUMN IF NOT EXISTS is_global boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS exercises_tenant_id_idx ON public.exercises(tenant_id);

-- Update RLS for exercises
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exercises;
CREATE POLICY "Enable read access for global or tenant" ON public.exercises
    FOR SELECT
    USING (
        is_global = true OR
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert for therapists" ON public.exercises
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'therapist')
    );

CREATE POLICY "Enable update for owner therapist or admin" ON public.exercises
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND is_global = false)
    );

-- 3. Supplements Table
CREATE TABLE IF NOT EXISTS public.supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    dosage_instructions TEXT,
    tenant_id text DEFAULT 'global',
    is_global boolean DEFAULT true,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for global or tenant" ON public.supplements
    FOR SELECT
    USING (
        is_global = true OR
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert for therapists" ON public.supplements
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'therapist')
    );

CREATE POLICY "Enable update for owner therapist or admin" ON public.supplements
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND is_global = false)
    );

CREATE TRIGGER update_supplements_updated_at BEFORE UPDATE ON public.supplements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Kinesiology Tests Tracking
CREATE TABLE IF NOT EXISTS public.kinesiology_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tenant_id text NOT NULL,
    structural_corrections JSONB DEFAULT '[]',
    chemical_corrections JSONB DEFAULT '[]',
    emotional_corrections JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.kinesiology_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for tenant" ON public.kinesiology_tests
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Enable insert for therapist" ON public.kinesiology_tests
    FOR INSERT
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist'
    );

CREATE POLICY "Enable update for therapist" ON public.kinesiology_tests
    FOR UPDATE
    USING (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist'
    );

CREATE TRIGGER update_kinesiology_tests_updated_at BEFORE UPDATE ON public.kinesiology_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Migration to add Therapist Resources, Clinical Protocols, and Session Constellation Support

-- 1. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Markdown or HTML
    category TEXT NOT NULL CHECK (category IN ('article', 'video', 'exercise', 'meditation', 'protocol', 'worksheet', 'kinesiology')),
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone"
    ON public.resources FOR SELECT
    USING (true);

CREATE POLICY "Resources are insertable by admins and therapists"
    ON public.resources FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid()
            AND rp.role IN ('admin', 'therapist')
        )
    );

CREATE POLICY "Resources are updatable by author or admins"
    ON public.resources FOR UPDATE
    USING (
        auth.uid() = author_id
        OR EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid() AND rp.role = 'admin'
        )
    );

-- 2. Clinical Protocols Table (for Kinesiology, etc.)
CREATE TABLE IF NOT EXISTS public.clinical_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    modality TEXT DEFAULT 'kinesiology',
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- Store the structured protocol steps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Protocols are viewable by therapists"
    ON public.clinical_protocols FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid()
            AND rp.role IN ('admin', 'therapist')
        )
    );

-- 3. Systemic Constellations Table (tied to booking/session)
CREATE TABLE IF NOT EXISTS public.session_constellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL, -- references bookings/appointments
    therapist_id UUID NOT NULL REFERENCES auth.users(id),
    patient_id UUID NOT NULL REFERENCES auth.users(id),
    roles JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, name, represents, details, is_resolved }
    environment_notes TEXT,
    healing_phrases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_constellations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their own session constellations"
    ON public.session_constellations FOR ALL
    USING (auth.uid() = therapist_id);

-- Drop triggers if they exist then recreate
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_protocols_updated_at ON public.clinical_protocols;
CREATE TRIGGER update_protocols_updated_at
BEFORE UPDATE ON public.clinical_protocols
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_constellations_updated_at ON public.session_constellations;
CREATE TRIGGER update_constellations_updated_at
BEFORE UPDATE ON public.session_constellations
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-- Migration: Assignments, Channels (group messaging), and Form Templates
-- Adds therapist-patient homework, in-app group channels, and structured form templates

-- ════════════════════════════════════════════════════════════════════
-- 1. ASSIGNMENTS (therapist → patient homework / exercises)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'exercise' CHECK (type IN ('exercise', 'journal', 'meditation', 'reading', 'worksheet', 'custom')),
    content_json JSONB DEFAULT '{}'::jsonb,
    due_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'submitted', 'reviewed', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Therapists can manage assignments they created
CREATE POLICY "Therapists manage own assignments"
    ON public.assignments FOR ALL
    USING (auth.uid() = therapist_id);

-- Patients can view their own assignments
CREATE POLICY "Patients view own assignments"
    ON public.assignments FOR SELECT
    USING (auth.uid() = patient_id);

-- Patients can update status on their own assignments
CREATE POLICY "Patients update own assignment status"
    ON public.assignments FOR UPDATE
    USING (auth.uid() = patient_id)
    WITH CHECK (auth.uid() = patient_id);

CREATE INDEX idx_assignments_therapist ON public.assignments(therapist_id);
CREATE INDEX idx_assignments_patient ON public.assignments(patient_id);
CREATE INDEX idx_assignments_status ON public.assignments(status);

-- ════════════════════════════════════════════════════════════════════
-- 2. ASSIGNMENT SUBMISSIONS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    response_json JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    feedback TEXT
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own submissions"
    ON public.assignment_submissions FOR ALL
    USING (auth.uid() = patient_id);

CREATE POLICY "Therapists view submissions for their assignments"
    ON public.assignment_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_id AND a.therapist_id = auth.uid()
        )
    );

CREATE POLICY "Therapists review submissions"
    ON public.assignment_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            WHERE a.id = assignment_id AND a.therapist_id = auth.uid()
        )
    );

CREATE INDEX idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_patient ON public.assignment_submissions(patient_id);

-- ════════════════════════════════════════════════════════════════════
-- 3. CHANNELS (in-app group messaging)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'group' CHECK (type IN ('group', 'direct', 'announcement')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    is_archived BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.channel_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(channel_id, user_id)
);

ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;

-- Users can only see channels they belong to
CREATE POLICY "Members can view their channels"
    ON public.channels FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = id AND cm.user_id = auth.uid()
        )
    );

-- Owners/admins can update channel info
CREATE POLICY "Owners can update channels"
    ON public.channels FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = id AND cm.user_id = auth.uid()
            AND cm.role IN ('owner', 'admin')
        )
    );

-- Any authenticated user can create channels
CREATE POLICY "Authenticated users create channels"
    ON public.channels FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Channel member policies
CREATE POLICY "Members can view channel members"
    ON public.channel_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Owners manage channel members"
    ON public.channel_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
            AND cm.role IN ('owner', 'admin')
        )
    );

CREATE INDEX idx_channel_members_channel ON public.channel_members(channel_id);
CREATE INDEX idx_channel_members_user ON public.channel_members(user_id);

-- ════════════════════════════════════════════════════════════════════
-- 4. CHANNEL MESSAGES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.channel_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system')),
    parent_id UUID REFERENCES public.channel_messages(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.channel_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view channel messages"
    ON public.channel_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Members can send messages"
    ON public.channel_messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM public.channel_members cm
            WHERE cm.channel_id = channel_id AND cm.user_id = auth.uid()
        )
    );

CREATE INDEX idx_channel_messages_channel ON public.channel_messages(channel_id, created_at DESC);
CREATE INDEX idx_channel_messages_parent ON public.channel_messages(parent_id) WHERE parent_id IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 5. MESSAGE READ RECEIPTS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.channel_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(message_id, user_id)
);

ALTER TABLE public.message_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own read receipts"
    ON public.message_read_receipts FOR ALL
    USING (auth.uid() = user_id);

CREATE INDEX idx_read_receipts_message ON public.message_read_receipts(message_id);

-- ════════════════════════════════════════════════════════════════════
-- 6. FORM TEMPLATES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.form_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'intake' CHECK (category IN ('intake', 'assessment', 'feedback', 'consent', 'custom')),
    schema_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists and admins can manage form templates"
    ON public.form_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid()
            AND rp.role IN ('admin', 'therapist')
        )
    );

CREATE POLICY "All authenticated users can view active templates"
    ON public.form_templates FOR SELECT
    USING (is_active = true);

-- ════════════════════════════════════════════════════════════════════
-- 7. INTAKE FORM SUBMISSIONS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.intake_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.form_templates(id),
    form_type TEXT NOT NULL DEFAULT 'intake',
    data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'reviewed', 'archived')),
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own intake forms"
    ON public.intake_forms FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Therapists view assigned patient forms"
    ON public.intake_forms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.appointments apt
            WHERE apt.therapist_id = auth.uid()
            AND apt.patient_id = intake_forms.user_id
        )
    );

CREATE POLICY "Admins view all forms"
    ON public.intake_forms FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp
            WHERE rp.user_id = auth.uid() AND rp.role = 'admin'
        )
    );

CREATE INDEX idx_intake_forms_user ON public.intake_forms(user_id);
CREATE INDEX idx_intake_forms_template ON public.intake_forms(template_id);

-- ════════════════════════════════════════════════════════════════════
-- 8. TRIGGERS
-- ════════════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_channels_updated_at ON public.channels;
CREATE TRIGGER update_channels_updated_at
BEFORE UPDATE ON public.channels
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_channel_messages_updated_at ON public.channel_messages;
CREATE TRIGGER update_channel_messages_updated_at
BEFORE UPDATE ON public.channel_messages
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_form_templates_updated_at ON public.form_templates;
CREATE TRIGGER update_form_templates_updated_at
BEFORE UPDATE ON public.form_templates
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
-- Migration: Modernize Supabase key naming
-- Renames legacy SUPABASE_SERVICE_ROLE_KEY references to SUPABASE_SECRET_KEY

-- 1. Update app_config: rename legacy key if it exists
UPDATE public.app_config
SET key = 'SUPABASE_SECRET_KEY'
WHERE key = 'SUPABASE_SERVICE_ROLE_KEY'
  AND NOT EXISTS (SELECT 1 FROM public.app_config WHERE key = 'SUPABASE_SECRET_KEY');

-- 2. Update the sync_to_stripe_webhook function to use new key name
CREATE OR REPLACE FUNCTION sync_to_stripe_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
  url text := 'https://dopkncrqutxnchwqxloa.supabase.co/functions/v1/sync-to-stripe';
  apikey text := current_setting('request.header.apikey', true);
BEGIN
  IF apikey IS NULL THEN
    apikey := (SELECT value FROM app_config WHERE key = 'SUPABASE_SECRET_KEY');
  END IF;

  payload := jsonb_build_object(
    'old_record', old,
    'record', new,
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA
  );

  PERFORM net.http_post(
    url := url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || apikey
    ),
    body := payload
  );

  RETURN new;
END;
$$;

-- 3. Ensure app_config has description and category columns for secret metadata
ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
-- Migration: Add url and is_published to resources table
-- Rationale: resources table has video_url but needs a generic url field and
--            an explicit is_published boolean for simpler frontend filtering.

ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS url TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;

-- Back-fill: use video_url as url when present
UPDATE public.resources
  SET url = video_url
  WHERE video_url IS NOT NULL AND url IS NULL;

-- Mark all previously published (published_at set) as published
UPDATE public.resources
  SET is_published = (published_at IS NOT NULL)
  WHERE true;

-- Add a type alias column so frontend can use consistent "type" naming
-- while the existing "category" column keeps its CHECK constraint.
-- type mirrors category with any new entries going via category.
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS type TEXT
  GENERATED ALWAYS AS (category) STORED;

COMMENT ON COLUMN public.resources.url IS 'Generic external URL for the resource (video, article, etc.)';
COMMENT ON COLUMN public.resources.is_published IS 'Whether the resource is visible to end users';
COMMENT ON COLUMN public.resources.type IS 'Computed alias for category - same value, improves API consistency';
-- Migration: AI Insights table + dedicated Mood Entries table
-- Rationale:
--   1. ai_insights table is queried by /ai-insights page but was never formally
--      created in migrations. Adding it here makes the schema explicit.
--   2. mood_entries is a first-class table for standalone mood tracking
--      (decoupled from journal_entries.mood) enabling richer analytics,
--      daily check-ins without writing a full journal, and better streaks.
--
-- Rollback: DROP TABLE public.mood_entries; DROP TABLE public.ai_insights;

-- ════════════════════════════════════════════════════════════════════
-- 1. AI INSIGHTS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.ai_insights (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type    TEXT NOT NULL DEFAULT 'general'
                    CHECK (insight_type IN (
                        'general', 'mood_pattern', 'goal_recommendation',
                        'journal_analysis', 'session_summary', 'risk_flag',
                        'positive_reinforcement', 'weekly_recap'
                    )),
    content         TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}'::jsonb,
    source          TEXT DEFAULT 'system'
                    CHECK (source IN ('system', 'therapist', 'user_triggered', 'scheduled')),
    is_read         BOOLEAN NOT NULL DEFAULT false,
    is_dismissed    BOOLEAN NOT NULL DEFAULT false,
    severity        TEXT DEFAULT 'info'
                    CHECK (severity IN ('info', 'positive', 'warning', 'critical')),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own ai_insights"
    ON public.ai_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users update own ai_insights (read/dismiss)"
    ON public.ai_insights FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role inserts insights (via edge functions / background jobs)
CREATE POLICY "Service role manages ai_insights"
    ON public.ai_insights FOR ALL
    USING (auth.role() = 'service_role');

CREATE INDEX idx_ai_insights_user ON public.ai_insights(user_id, created_at DESC);
CREATE INDEX idx_ai_insights_type  ON public.ai_insights(user_id, insight_type);
CREATE INDEX idx_ai_insights_unread ON public.ai_insights(user_id, is_read) WHERE NOT is_read;

-- ════════════════════════════════════════════════════════════════════
-- 2. MOOD ENTRIES (standalone, not tied to journal)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.mood_entries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),
    -- Optional annotations
    note        TEXT,
    energy      SMALLINT CHECK (energy BETWEEN 1 AND 10),
    sleep_hours NUMERIC(4,1) CHECK (sleep_hours BETWEEN 0 AND 24),
    tags        TEXT[]  DEFAULT ARRAY[]::TEXT[],
    -- Context: optional link back to a journal entry or booking
    journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
    booking_id       UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    -- When: user-provided date (defaults to now), for manual backdating
    logged_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own mood_entries"
    ON public.mood_entries FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Therapists can read their patients' mood entries (via explicit consent / RLS join)
CREATE POLICY "Therapists read patient mood_entries"
    ON public.mood_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.therapist_id = (
                SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1
            )
            AND b.client_id = (
                SELECT id FROM public.profiles WHERE auth_id = mood_entries.user_id LIMIT 1
            )
        )
    );

CREATE INDEX idx_mood_entries_user      ON public.mood_entries(user_id, logged_at DESC);
CREATE INDEX idx_mood_entries_logged_at ON public.mood_entries(logged_at DESC);

-- Helper view: daily mood aggregate per user
CREATE OR REPLACE VIEW public.mood_daily_avg AS
SELECT
    user_id,
    DATE(logged_at) AS day,
    ROUND(AVG(score)::NUMERIC, 2) AS avg_score,
    MAX(score) AS max_score,
    MIN(score) AS min_score,
    COUNT(*) AS entry_count
FROM public.mood_entries
GROUP BY user_id, DATE(logged_at);

-- ════════════════════════════════════════════════════════════════════
-- 3. UPDATED_AT trigger for ai_insights
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER ai_insights_updated_at
    BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- Migration: User Streaks and Activity Log
-- Rationale:
--   Enables gamification and habit-tracking features:
--   - user_streaks: tracks current/longest streaks per activity type
--     (journaling, mood check-ins, session attendance, assignments)
--   - user_activity_log: append-only log of wellness-related events
--     used to compute streaks, power AI insights, and show activity feeds
--
-- Rollback: DROP TABLE public.user_activity_log; DROP TABLE public.user_streaks;

-- ════════════════════════════════════════════════════════════════════
-- 1. USER STREAKS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_streaks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type   TEXT NOT NULL
                    CHECK (activity_type IN (
                        'journal',       -- wrote a journal entry
                        'mood_checkin',  -- logged a mood entry
                        'session',       -- attended a therapy session
                        'assignment',    -- completed an assignment
                        'goal_checkin',  -- updated a goal's progress
                        'login'          -- daily login streak
                    )),
    current_streak  INTEGER NOT NULL DEFAULT 0,
    longest_streak  INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    total_days      INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, activity_type)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streaks"
    ON public.user_streaks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_streaks_user ON public.user_streaks(user_id);

CREATE TRIGGER user_streaks_updated_at
    BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- 2. USER ACTIVITY LOG
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type   TEXT NOT NULL,  -- matches user_streaks.activity_type + custom events
    event           TEXT NOT NULL,  -- e.g. 'journal_entry_created', 'mood_logged', 'booking_completed'
    entity_id       UUID,           -- optional FK to the related entity
    entity_table    TEXT,           -- e.g. 'journal_entries', 'mood_entries', 'bookings'
    metadata        JSONB DEFAULT '{}'::jsonb,
    xp_earned       INTEGER NOT NULL DEFAULT 0,  -- future: gamification points
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own activity log"
    ON public.user_activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role inserts activity log"
    ON public.user_activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX idx_activity_log_user       ON public.user_activity_log(user_id, occurred_at DESC);
CREATE INDEX idx_activity_log_type       ON public.user_activity_log(user_id, activity_type, occurred_at DESC);
CREATE INDEX idx_activity_log_entity     ON public.user_activity_log(entity_id) WHERE entity_id IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 3. RPC: increment_streak
--    Called after each qualifying user action.
--    Handles streak continuation, reset, and longest_streak tracking.
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_streak(
    p_user_id       UUID,
    p_activity_type TEXT
)
RETURNS TABLE (current_streak INT, longest_streak INT, is_new_record BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_today         DATE := CURRENT_DATE;
    v_row           public.user_streaks%ROWTYPE;
    v_days_since    INT;
    v_new_streak    INT;
    v_new_longest   INT;
    v_is_new_record BOOLEAN := false;
BEGIN
    -- Upsert base row
    INSERT INTO public.user_streaks (user_id, activity_type, current_streak, longest_streak, last_activity_date, total_days)
    VALUES (p_user_id, p_activity_type, 0, 0, NULL, 0)
    ON CONFLICT (user_id, activity_type) DO NOTHING;

    SELECT * INTO v_row
    FROM public.user_streaks
    WHERE user_id = p_user_id AND activity_type = p_activity_type
    FOR UPDATE;

    -- Already logged today — idempotent, no change
    IF v_row.last_activity_date = v_today THEN
        RETURN QUERY SELECT v_row.current_streak, v_row.longest_streak, false;
        RETURN;
    END IF;

    v_days_since := COALESCE(v_today - v_row.last_activity_date, 999);

    -- Continue streak (activity yesterday) vs reset (gap > 1 day)
    IF v_days_since = 1 THEN
        v_new_streak := v_row.current_streak + 1;
    ELSE
        v_new_streak := 1;
    END IF;

    v_new_longest := GREATEST(v_row.longest_streak, v_new_streak);
    v_is_new_record := v_new_longest > v_row.longest_streak;

    UPDATE public.user_streaks SET
        current_streak     = v_new_streak,
        longest_streak     = v_new_longest,
        last_activity_date = v_today,
        total_days         = v_row.total_days + 1,
        updated_at         = now()
    WHERE user_id = p_user_id AND activity_type = p_activity_type;

    RETURN QUERY SELECT v_new_streak, v_new_longest, v_is_new_record;
END;
$$;

-- ════════════════════════════════════════════════════════════════════
-- 4. RPC: log_user_activity
--    Single entry point for logging activity + updating streaks atomically.
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id      UUID,
    p_activity_type TEXT,
    p_event        TEXT,
    p_entity_id    UUID    DEFAULT NULL,
    p_entity_table TEXT    DEFAULT NULL,
    p_metadata     JSONB   DEFAULT '{}'::jsonb,
    p_xp_earned    INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.user_activity_log
        (user_id, activity_type, event, entity_id, entity_table, metadata, xp_earned)
    VALUES
        (p_user_id, p_activity_type, p_event, p_entity_id, p_entity_table, p_metadata, p_xp_earned);

    -- Update streak for streak-tracked activity types
    IF p_activity_type IN ('journal', 'mood_checkin', 'session', 'assignment', 'goal_checkin', 'login') THEN
        PERFORM public.increment_streak(p_user_id, p_activity_type);
    END IF;
END;
$$;
-- Migration: Notification Preferences + Notification Inbox
-- Rationale:
--   - notification_preferences: per-user channel (email/push/in-app) and
--     category (booking, ai_insight, assignment, etc.) opt-in/out matrix
--   - notifications table was implied by existing code but had no formal schema.
--     This migration ensures it has the right shape with RLS.
--
-- Rollback: DROP TABLE public.notification_preferences;
--           (notifications table: only add columns if it existed, else drop)

-- ════════════════════════════════════════════════════════════════════
-- 1. ENSURE notifications TABLE EXISTS with correct shape
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'info'
                CHECK (type IN ('info', 'success', 'warning', 'error', 'booking', 'assignment', 'ai_insight', 'payment', 'system')),
    title       TEXT NOT NULL,
    body        TEXT,
    action_url  TEXT,
    action_label TEXT,
    is_read     BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sent_via    TEXT[] DEFAULT ARRAY[]::TEXT[],  -- ['email', 'push', 'in_app']
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ DEFAULT now(),
    read_at     TIMESTAMPTZ
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role inserts notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON public.notifications(user_id, is_read) WHERE NOT is_read;

-- ════════════════════════════════════════════════════════════════════
-- 2. NOTIFICATION PREFERENCES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

    -- Channel toggles
    email_enabled   BOOLEAN NOT NULL DEFAULT true,
    push_enabled    BOOLEAN NOT NULL DEFAULT true,
    in_app_enabled  BOOLEAN NOT NULL DEFAULT true,
    telegram_enabled BOOLEAN NOT NULL DEFAULT false,

    -- Category opt-outs (true = enabled, false = muted)
    booking_reminders   BOOLEAN NOT NULL DEFAULT true,
    booking_changes     BOOLEAN NOT NULL DEFAULT true,
    assignment_due      BOOLEAN NOT NULL DEFAULT true,
    assignment_reviewed BOOLEAN NOT NULL DEFAULT true,
    ai_insights_weekly  BOOLEAN NOT NULL DEFAULT true,
    goal_nudges         BOOLEAN NOT NULL DEFAULT true,
    community_mentions  BOOLEAN NOT NULL DEFAULT true,
    payment_receipts    BOOLEAN NOT NULL DEFAULT true,
    system_updates      BOOLEAN NOT NULL DEFAULT false,

    -- Quiet hours (stored as HH:MM in user's local timezone intent)
    quiet_hours_start   TIME,
    quiet_hours_end     TIME,

    -- Digest preference
    digest_frequency TEXT NOT NULL DEFAULT 'daily'
                     CHECK (digest_frequency IN ('realtime', 'daily', 'weekly', 'never')),

    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notification_preferences"
    ON public.notification_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notif_prefs_user ON public.notification_preferences(user_id);

CREATE TRIGGER notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- 3. RPC: get_unread_notification_count
--    Called by the header badge to show unread count efficiently
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.notifications
    WHERE user_id = p_user_id
      AND is_read = false
      AND is_archived = false;
$$;
-- Onboarding completion marker
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Goal progress history table for milestone timeline
CREATE TABLE IF NOT EXISTS public.goal_progress_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  progress_percentage integer NOT NULL CHECK (progress_percentage BETWEEN 0 AND 100),
  note text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'goal_progress_history'
      AND policyname = 'Users can manage own goal history'
  ) THEN
    CREATE POLICY "Users can manage own goal history"
    ON public.goal_progress_history
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
CREATE TABLE IF NOT EXISTS public.saved_resources (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);

ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_resources'
      AND policyname = 'Users manage own saved resources'
  ) THEN
    CREATE POLICY "Users manage own saved resources"
      ON public.saved_resources
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{"like":0,"heart":0,"pray":0}'::jsonb;

ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_community_posts_parent_id ON public.community_posts(parent_id);
CREATE TABLE IF NOT EXISTS public.community_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reported_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('spam', 'harassment', 'misinformation', 'unsafe', 'other')),
  details text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Users can create own community reports'
  ) THEN
    CREATE POLICY "Users can create own community reports"
      ON public.community_post_reports
      FOR INSERT
      WITH CHECK (auth.uid() = reported_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Users can view own community reports'
  ) THEN
    CREATE POLICY "Users can view own community reports"
      ON public.community_post_reports
      FOR SELECT
      USING (auth.uid() = reported_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Admins can view all community reports'
  ) THEN
    CREATE POLICY "Admins can view all community reports"
      ON public.community_post_reports
      FOR SELECT
      USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin');
  END IF;
END
$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_post_reports'
      AND policyname = 'Admins can update community reports'
  ) THEN
    CREATE POLICY "Admins can update community reports"
      ON public.community_post_reports
      FOR UPDATE
      USING (coalesce((auth.jwt() ->> 'role'), '') = 'admin')
      WITH CHECK (coalesce((auth.jwt() ->> 'role'), '') = 'admin');
  END IF;
END
$$;
ALTER TABLE public.saved_resources
ADD COLUMN IF NOT EXISTS last_opened_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_saved_resources_last_opened_at
  ON public.saved_resources(user_id, last_opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_resources_completed_at
  ON public.saved_resources(user_id, completed_at DESC);
