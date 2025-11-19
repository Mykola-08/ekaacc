-- Enable pg_net if not already enabled
create extension if not exists pg_net;

-- Create the trigger function
create or replace function public.handle_user_confirmation()
returns trigger as $$
declare
  -- REPLACE WITH YOUR PROJECT URL AND SERVICE KEY
  -- For local development, this might not work as expected without extra setup.
  -- In production, replace with your actual Supabase project URL.
  project_url text := 'https://rbnfyxhewsivofvwdpuk.supabase.co/functions/v1/on-confirmation';
  service_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA';
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
