-- Enable Realtime for critical tables
-- This allows the client apps to subscribe to changes via WebSockets

-- 1. Enable replication on the 'booking' table
-- Critical for: Therapist Availability Sync, Session Status Updates
alter publication supabase_realtime add table booking;

-- 2. Enable replication on the 'staff' table
-- Critical for: Presence indicators (if backing staff profile status changes)
alter publication supabase_realtime add table staff;

-- 3. Enable replication on 'user_rewards_balance'
-- Critical for: Immediate feedback on loyalty points (Notification Broadcasting)
alter publication supabase_realtime add table user_rewards_balance;

-- 4. Enable replication on 'service_variant'
-- Useful for: Real-time price updates or availability toggles
alter publication supabase_realtime add table service_variant;

-- 5. Enable replication on 'notifications' (if it exists, or create a simple one)
-- Using a dedicated table for broadcast messages is often cleaner than just signals
create table if not exists app_notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  recipient_id uuid not null, -- references auth.users(id)
  title text not null,
  message text not null,
  type text default 'info', -- 'info', 'success', 'warning', 'error'
  read boolean default false,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS on notifications
alter table app_notifications enable row level security;

create policy "Users can view their own notifications"
  on app_notifications for select
  using (auth.uid() = recipient_id);

alter publication supabase_realtime add table app_notifications;
