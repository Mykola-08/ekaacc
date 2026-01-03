# Supabase Setup for EKA Booking

1.  **Create a new project** in Supabase.
2.  **Go to the SQL Editor** and run the following query to create the `services` table:

```sql
create table service (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- duration in minutes
  image_url text
);

-- Insert some sample data
insert into service (name, description, price, duration, image_url)
values
  ('Haircut', 'Standard haircut service', 25.00, 30, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80'),
  ('Massage', 'Full body massage', 80.00, 60, 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'),
  ('Manicure', 'Professional manicure', 35.00, 45, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80');

create table booking (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_id uuid references service(id) not null,
  customer_name text not null,
  customer_email text not null,
  start_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_session_id text
);
```

3.  **Get your API credentials**:
    *   Go to Project Settings -> API.
    *   Copy the `Project URL` and `anon` public key.
4.  **Update `.env.local`**:
    *   Paste the URL and Key into `c:\eka-booking\.env.local`.
