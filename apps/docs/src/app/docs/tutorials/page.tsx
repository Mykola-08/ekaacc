import { RoleProtected } from '@/components/RoleProtected';

export default function Tutorials() {
  return (
    <div className="space-y-8">
      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h1>Tutorials</h1>
          <p className="lead">Step-by-step guides to help you get the most out of EKA Booking.</p>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h2>How to Book an Appointment</h2>
          <p>Booking an appointment is simple and doesn&apos;t require an account.</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Navigate to the booking page.</li>
            <li>Select the service you wish to book.</li>
            <li>Choose a date and time from the available slots.</li>
            <li>Enter your contact details (email is required).</li>
            <li>Complete the payment (full or deposit).</li>
            <li>You will receive a confirmation email with a link to manage your booking.</li>
          </ol>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <div>
          <h2>Setting up the Booking System (Developer Guide)</h2>
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
        </div>
      </RoleProtected>
    </div>
  );
}
