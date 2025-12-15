-- Migration: auth_events & invites tables with RLS
-- Date: 2025-11-21
-- Description: Introduces auth_events for login/security auditing and invites for gated registration.

-- Safety: Wrap in transaction
begin;

create table if not exists public.auth_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  email text,
  ip inet,
  user_agent text,
  auth_method text,
  client_id text,
  timestamp timestamptz not null default now()
);

create index if not exists auth_events_user_id_idx on public.auth_events (user_id);
create index if not exists auth_events_timestamp_idx on public.auth_events (timestamp);

comment on table public.auth_events is 'Security and login events captured post-auth.';

create table if not exists public.invites (
  code text primary key,
  issued_to_email text,
  role text not null default 'user',
  tenant_id text not null default 'default',
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  created_by text,
  constraint invites_not_expired check (expires_at > created_at)
);

create index if not exists invites_expires_at_idx on public.invites (expires_at);
create index if not exists invites_tenant_role_idx on public.invites (tenant_id, role);

comment on table public.invites is 'Invite codes gating registration, mapped to role & tenant.';

-- RLS enable
alter table public.auth_events enable row level security;
alter table public.invites enable row level security;

-- Helper functions (if not already present)
-- current_user_id() should already exist; create if missing.
do $$
begin
  if not exists (select 1 from pg_proc where proname = 'current_user_id') then
    execute $$create function public.current_user_id() returns text as $$
    begin
      return coalesce((current_setting('request.jwt.claim')::jsonb ->> 'user_id'), 'anonymous');
    end;$$ language plpgsql stable;$$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_proc where proname = 'current_user_role') then
    execute $$create function public.current_user_role() returns text as $$
    declare r text;
    begin
      r := (current_setting('request.jwt.claim')::jsonb ->> 'role');
      return coalesce(r, 'anonymous');
    end;$$ language plpgsql stable;$$;
  end if;
end$$;

-- Policies for auth_events
create policy if not exists auth_events_select_own on public.auth_events
  for select using (current_user_id() = user_id);

create policy if not exists auth_events_select_admin on public.auth_events
  for select using (current_user_role() = 'admin');

-- No direct insert/update from client; only via service key Action
create policy if not exists auth_events_service_insert on public.auth_events
  for insert to service_role using (true) with check (true);

-- Policies for invites
-- Admin full read/write
create policy if not exists invites_admin_all on public.invites
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- Allow a registering user to read a specific invite code that is not expired & unused
create policy if not exists invites_read_code on public.invites
  for select using (
    current_user_role() = 'admin' or (
      used_at is null and expires_at > now()
    )
  );

-- Optional: function to redeem invite (sets used_at) executed via service role
create or replace function public.redeem_invite(p_code text, p_user_id text) returns boolean as $$
declare v_role text; v_tenant text;
begin
  update public.invites set used_at = now() where code = p_code and used_at is null and expires_at > now();
  if not found then return false; end if;
  select role, tenant_id into v_role, v_tenant from public.invites where code = p_code;
  -- Upsert into users metadata (example assumes public.users table)
  update public.users set role = v_role, tenant_id = v_tenant where id = p_user_id;
  return true;
end;$$ language plpgsql security definer;

commit;