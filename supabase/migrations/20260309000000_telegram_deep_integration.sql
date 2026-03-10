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
