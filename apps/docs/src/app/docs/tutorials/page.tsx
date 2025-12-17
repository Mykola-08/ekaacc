import RoleGuard from '@/components/RoleGuard';

export default function Tutorials() {
  return (
    <RoleGuard allowedRoles={['user', 'admin', 'developer']} fallback={<div>You do not have permission to view this page.</div>}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Tutorials</h1>

        <h2>Setting up the Booking System</h2>
        <p>This tutorial guides you through setting up the EKA Booking system from scratch.</p>

        <h3>Prerequisites</h3>
        <ul>
          <li>Node.js 18+</li>
          <li>Supabase account</li>
          <li>Stripe account</li>
        </ul>

        <h3>Step 1: Clone the Repository</h3>
        <pre><code>git clone https://github.com/ekaacc/ekaacc.git
cd ekaacc</code></pre>

        <h3>Step 2: Install Dependencies</h3>
        <pre><code>npm install</code></pre>

        <h3>Step 3: Configure Environment Variables</h3>
        <p>Copy <code>.env.example</code> to <code>.env.local</code> and fill in your Supabase and Stripe credentials.</p>

        <h3>Step 4: Database Setup</h3>
        <p>Run the SQL migrations provided in <code>SUPABASE_BOOKING_SCHEMA.sql</code> in your Supabase SQL editor.</p>
        <p>Alternatively, you can manually create the tables:</p>
        <pre><code>{`create table services (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- duration in minutes
  image_url text
);

-- Insert some sample data
insert into services (name, description, price, duration, image_url)
values
  ('Haircut', 'Standard haircut service', 25.00, 30, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80'),
  ('Massage', 'Full body massage', 80.00, 60, 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'),
  ('Manicure', 'Professional manicure', 35.00, 45, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80');

create table bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  service_id uuid references services(id) not null,
  customer_name text not null,
  customer_email text not null,
  start_time timestamp with time zone not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  stripe_session_id text
);`}</code></pre>

        <h3>Step 5: Run the Application</h3>
        <pre><code>npm run dev</code></pre>

        <h2>Managing Bookings</h2>
        <p>Learn how to manage bookings as an administrator.</p>
        <p>...</p>
      </div>
    </RoleGuard>
  );
}
