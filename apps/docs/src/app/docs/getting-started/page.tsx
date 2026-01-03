import { RoleProtected } from '@/components/RoleProtected';

export default function GettingStarted() {
  return (
    <div className="space-y-8">
      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h1>Getting Started with EKA Booking</h1>
          <p className="lead">
            EKA Booking is a frictionless prepaid booking system designed for ease of use and reliability.
          </p>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h2>Overview</h2>
          <p>
            Welcome to the EKA Booking platform. Depending on your role, you will have access to different features and documentation.
            Use the role selector above to switch views and see content relevant to you.
          </p>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['user', 'staff', 'admin', 'developer']}>
        <div>
          <h2>Key Features</h2>
          <ul>
            <li><strong>Simple Booking:</strong> Book appointments without creating an account.</li>
            <li><strong>Real-time Availability:</strong> See up-to-date slots.</li>
            <li><strong>Secure Payments:</strong> Integrated with Stripe for secure transactions.</li>
            <li><strong>Manage Bookings:</strong> Easy cancellation and rescheduling via secure links.</li>
          </ul>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['staff', 'admin', 'developer']}>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <h2>For Staff Members</h2>
          <p>
            As a staff member, you can view your schedule, manage availability, and check in clients.
          </p>
          <ul>
            <li>View daily and weekly schedules.</li>
            <li>Block out time for breaks or personal appointments.</li>
            <li>View client details and booking history.</li>
          </ul>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <div className="bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700">
          <h2>Technical Setup (Developers & Admins)</h2>
          
          <h3>Installation</h3>
          <p>First, run the development server:</p>
          <pre><code>npm run dev</code></pre>

          <h3>Environment Variables</h3>
          <p>Set these in <code>.env.local</code>:</p>
          <pre><code>NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
BOOKING_TOKEN_SECRET=...</code></pre>

          <h3>Database Schema</h3>
          <p>The system uses Supabase. Ensure the <code>SUPABASE_BOOKING_SCHEMA.sql</code> is applied.</p>
        </div>
      </RoleProtected>
    </div>
  );
}
