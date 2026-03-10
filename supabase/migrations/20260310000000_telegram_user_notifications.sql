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
