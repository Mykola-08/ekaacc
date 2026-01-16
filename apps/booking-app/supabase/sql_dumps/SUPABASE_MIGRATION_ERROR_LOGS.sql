-- Enable UUID extension if not enabled (usually it is)
create extension if not exists "uuid-ossp";

-- Create error_logs table
create table if not exists error_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id),
  error_message text,
  stack_trace text,
  component_stack text,
  url text,
  user_agent text,
  app_version text,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table error_logs enable row level security;

-- Policies
-- Admin can view all logs. (Assuming admin role logic or making it accessible to specific users)
-- For now, let's check profile role 'therapist' (as pseudo-admin) or just use a restricted policy.
-- Actually, better to create a function that checks for admin/therapist status.

-- Policy: Only allow inserts via server-side (Service Role) or specific trusted users.
-- But for client-side logging, we might need an insert policy.
-- Let's allow authenticated users to insert their own errors? No, errors might happen before auth.
-- Let's allow anon insert, but maybe rate-limit or trust the server action which uses Service Role.
-- If we use a Server Action, we can use the service role key to bypass RLS for insertion.
-- So we only need a SELECT policy for Admins.

create policy "Admins can view error logs"
  on error_logs
  for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'therapist' -- Or 'admin' if you have that role
    )
  );

-- No insert policy needed if we only insert via Service Role in Server Actions.
-- However, if we want to log from client directly via Supabase Client, we need an insert policy.
-- Let's stick to Server Actions for logging to keep control.
