-- Link Staff table to Auth Users for tight integration
-- Timestamp: 20260115000004

-- 1. Add auth_user_id to staff
alter table staff 
add column if not exists auth_user_id uuid references auth.users(id);

create index if not exists idx_staff_auth_user_id on staff(auth_user_id);

-- 2. Policy for Staff to update their own profile (optional, if we want them to edit bio)
alter table staff enable row level security;

create policy "Staff can edit own profile" on staff 
for update using (auth.uid() = auth_user_id);

create policy "Public can view active staff" on staff 
for select using (active = true);

create policy "Admins manage staff" on staff 
for all using (
  exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
);

-- 3. Utility Function to get Staff ID from Auth ID
create or replace function get_current_staff_id() 
returns uuid as $$
  select id from staff where auth_user_id = auth.uid() limit 1;
$$ language sql stable security definer;
