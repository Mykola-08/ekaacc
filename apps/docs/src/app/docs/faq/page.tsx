import RoleGuard from '@/components/RoleGuard';

export default function FAQ() {
  return (
    <RoleGuard allowedRoles={['user', 'admin', 'developer']} fallback={<div>You do not have permission to view this page.</div>}>
      <div className="prose dark:prose-invert max-w-none">
        <h1>Frequently Asked Questions</h1>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">How do I reset the database?</summary>
          <p className="mt-2">You can reset the database by running the migration scripts again. Be careful as this will wipe all data.</p>
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">Where are the secrets stored?</summary>
          <p className="mt-2">Secrets are stored in the <code>app_config</code> table in Supabase, protected by Row Level Security (RLS).</p>
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">How does the booking flow work?</summary>
          <p className="mt-2">
            1. Fetch services<br/>
            2. Fetch availability<br/>
            3. Create booking (pending)<br/>
            4. Pay via Stripe<br/>
            5. Manage via token
          </p>
        </details>

        <details className="mb-4">
          <summary className="font-semibold cursor-pointer">Is authentication required for booking?</summary>
          <p className="mt-2">No, the booking system uses tokenized manage links sent via email, so users do not need to create an account.</p>
        </details>
      </div>
    </RoleGuard>
  );
}
