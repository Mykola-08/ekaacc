-- Trigger to automatically create a Profile when a User signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (auth_id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    'client' -- Default role
  )
  on conflict (auth_id) do nothing; -- Safe if profile created manually
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
