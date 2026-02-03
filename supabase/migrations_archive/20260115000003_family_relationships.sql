
-- FAMILY & RELATIONSHIPS
-- Allows Guardians (Parents) to manage Dependents (Children/Elders)

create type relationship_type as enum ('parent', 'guardian', 'partner', 'child', 'dependent');

create table if not exists user_relationship (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  guardian_id uuid not null references auth.users(id) on delete cascade,
  dependent_id uuid references auth.users(id) on delete set null, -- Optional if dependent has no login
  
  -- If dependent has no auth account, we store profile data here or link to a 'shadow' profile
  -- For simplicity, we assume dependents might be 'managed users' without auth, 
  -- OR real users linked.
  
  metadata jsonb default '{}'::jsonb, -- Store "Name", "Gener", "DOB" if no dependent_id
  
  type relationship_type not null default 'child',
  is_verified boolean default false
);

create index if not exists idx_relationships_guardian on user_relationship(guardian_id);

-- RLS
alter table user_relationship enable row level security;
create policy "Users manage their dependents" on user_relationship for all using (auth.uid() = guardian_id);
create policy "Admins view all relationships" on user_relationship for select using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'super_admin'))
);
