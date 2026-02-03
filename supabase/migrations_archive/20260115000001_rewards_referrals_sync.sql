
-- REWARDS & LOYALTY SYSTEM
-- Tracks user points and history

create table if not exists user_rewards_balance (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_points integer not null default 0 check (current_points >= 0),
  lifetime_points integer not null default 0,
  updated_at timestamptz default now()
);

create type reward_transaction_type as enum ('earned_booking', 'earned_referral', 'redeemed_booking', 'adjustment', 'expired');

create table if not exists reward_transaction (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null, -- Positive for earn, negative for spend
  transaction_type reward_transaction_type not null,
  reference_id text, -- e.g. booking_id or referral_id
  description text,
  expires_at timestamptz -- optional expiration for specific points
);

create index if not exists idx_reward_transaction_user on reward_transaction(user_id);

-- REFERRAL SYSTEM
-- Manages unique codes and tracking

create table if not exists referral_code (
  code text primary key, -- e.g. "MYKOLA20"
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  is_active boolean default true,
  usage_count integer default 0
);

create index if not exists idx_referral_code_owner on referral_code(owner_id);

create table if not exists referral_usage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  code text not null references referral_code(code),
  referred_user_id uuid not null references auth.users(id), -- The new user
  status text default 'pending' check (status in ('pending', 'completed', 'rewarded')),
  reward_amount_referrer integer default 0,
  reward_amount_referee integer default 0,
  unique(referred_user_id) -- One referral per new user
);

-- CALENDAR SYNC
-- Stores tokens for 2-way sync (Google/Outlook)

create table if not exists calendar_connection (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('google', 'outlook', 'icloud')),
  remote_calendar_id text, -- Specific calendar ID to sync with
  sync_token text, -- Provider specific sync token
  access_token text, -- Should be encrypted at app layer
  refresh_token text, -- Should be encrypted at app layer
  token_expires_at timestamptz,
  is_active boolean default true,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, provider)
);

-- External Calendar Events (Shadow copy for conflict checking)
create table if not exists external_calendar_event (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references calendar_connection(id) on delete cascade,
  remote_event_id text not null,
  title text, -- redacted if private
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_all_day boolean default false,
  unique(connection_id, remote_event_id)
);

create index if not exists idx_external_events_time on external_calendar_event(connection_id, start_time, end_time);


-- RLS POLICIES

-- Rewards
alter table user_rewards_balance enable row level security;
create policy "Users view own balance" on user_rewards_balance for select using (auth.uid() = user_id);
create policy "Admins manage balances" on user_rewards_balance for all using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))
);

alter table reward_transaction enable row level security;
create policy "Users view own transactions" on reward_transaction for select using (auth.uid() = user_id);
create policy "Admins view all transactions" on reward_transaction for select using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))
);

-- Referrals
alter table referral_code enable row level security;
create policy "Users view/create own code" on referral_code for all using (auth.uid() = owner_id);
create policy "Public read codes" on referral_code for select using (true); -- Needed to validate code on signup

alter table referral_usage enable row level security;
create policy "Admins manage referrals" on referral_usage for all using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))
);

-- Calendar
alter table calendar_connection enable row level security;
create policy "Users manage own calendar connections" on calendar_connection for all using (auth.uid() = user_id);

alter table external_calendar_event enable row level security;
create policy "Users view own external events" on external_calendar_event for select using (
  exists (select 1 from calendar_connection where id = external_calendar_event.connection_id and user_id = auth.uid())
);


-- RPC FUNCTIONS

-- Atomically increment/decrement points
create or replace function increment_points(p_user_id uuid, p_amount int)
returns void as \$\$
begin
  insert into user_rewards_balance (user_id, current_points, lifetime_points)
  values (p_user_id, greatest(0, p_amount), greatest(0, p_amount))
  on conflict (user_id) do update
  set current_points = greatest(0, user_rewards_balance.current_points + p_amount),
      lifetime_points = case 
        when p_amount > 0 then user_rewards_balance.lifetime_points + p_amount 
        else user_rewards_balance.lifetime_points 
      end,
      updated_at = now();
end;
\$\$ language plpgsql security definer;

-- Admin stats helper
create or replace function get_referral_stats()
returns table (code text, usage_count int, rewards_distributed int) as \$\$
begin
  return query
  select 
    rc.code,
    rc.usage_count,
     coalesce(sum(ru.reward_amount_referrer), 0)::int as rewards_distributed
  from referral_code rc
  left join referral_usage ru on rc.code = ru.code
  group by rc.code, rc.usage_count;
end;
\$\$ language plpgsql security definer;

