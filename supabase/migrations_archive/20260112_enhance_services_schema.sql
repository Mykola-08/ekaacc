-- Add slug column to service table
ALTER TABLE service ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS service_slug_idx ON service (slug);

-- Ensure storage bucket for services exists
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- Create policy to allow public read access to service-images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'service-images' );

-- Allow authenticated uploads (e.g. admins)
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'service-images' and auth.role() = 'authenticated' );
