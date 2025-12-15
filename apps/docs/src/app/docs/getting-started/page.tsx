import RoleGuard from '@/components/RoleGuard';

export default function GettingStarted() {
  return (
    <RoleGuard allowedRoles={['user', 'admin', 'developer']} fallback={<div>You do not have permission to view this page.</div>}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Getting Started with Eka Booking</h1>
        <p>
          Eka Booking is a production-ready frictionless prepaid booking micro-app built on Next.js + Supabase + Stripe.
        </p>

        <h2>Features</h2>
        <ul>
          <li>Minimal data capture (email required, phone optional)</li>
          <li>Real-time staff-based availability</li>
          <li>Slot reservation with TTL while payment completes</li>
          <li>Prepayment (full or deposit) + cancellation & refund policies</li>
          <li>Tokenized manage links (no user login)</li>
          <li>Stripe payment + webhook capture + refund on cancel</li>
          <li>Waitlist enrollment per service/date</li>
          <li>Secure secret retrieval via <code>app_config</code> (service role)</li>
        </ul>

        <h2>Installation</h2>
        <p>First, run the development server:</p>
        <pre><code>npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev</code></pre>

        <p>Open <a href="http://localhost:3000">http://localhost:3000</a> with your browser.</p>

        <h2>Environment Variables</h2>
        <p>Set these in <code>.env.local</code> (service role key must stay server only):</p>
        <pre><code>NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=... (optional if stored in app_config)
STRIPE_WEBHOOK_SECRET=... (optional if stored in app_config)
BOOKING_TOKEN_SECRET=... (optional if stored in app_config)</code></pre>

        <h2>Supabase Schema</h2>
        <p>Apply <code>SUPABASE_BOOKING_SCHEMA.sql</code> then insert secrets:</p>
        <pre><code>insert into app_config(key,value) values
 ('BOOKING_TOKEN_SECRET','your-long-random'),
 ('STRIPE_SECRET_KEY','sk_live_...'),
 ('STRIPE_WEBHOOK_SECRET','whsec_...');</code></pre>
        <p>Protect <code>app_config</code> with RLS for service role only.</p>

        <h2>Run Tests</h2>
        <pre><code>npm run test</code></pre>
      </div>
    </RoleGuard>
  );
}
