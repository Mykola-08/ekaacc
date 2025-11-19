-- Enable pg_net if not already enabled
create extension if not exists pg_net;

-- Create the trigger function
create or replace function public.handle_user_confirmation()
returns trigger as $$
declare
  -- REPLACE WITH YOUR PROJECT URL AND SERVICE KEY
  -- For local development, this might not work as expected without extra setup.
  -- In production, replace with your actual Supabase project URL.
  project_url text := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/on-confirmation';
  service_key text := 'YOUR_SERVICE_ROLE_KEY';
begin
  -- Check if email was just confirmed
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    perform net.http_post(
      url := project_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
        'record', row_to_json(new)
      )
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
create trigger on_auth_user_confirmed
  after update on auth.users
  for each row execute procedure public.handle_user_confirmation();
