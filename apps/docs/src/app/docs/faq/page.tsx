import { RoleProtected } from '@/components/RoleProtected';

export default function FAQ() {
  return (
    <div className="space-y-8">
      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h1>Frequently Asked Questions</h1>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['guest', 'user', 'staff', 'admin', 'developer']}>
        <div>
          <h2>General</h2>
          <details className="mb-4 p-4 border rounded-lg dark:border-zinc-700">
            <summary className="font-semibold cursor-pointer">Is authentication required for booking?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">No, the booking system uses tokenized manage links sent via email, so users do not need to create an account.</p>
          </details>

          <details className="mb-4 p-4 border rounded-lg dark:border-zinc-700">
            <summary className="font-semibold cursor-pointer">Can I cancel my booking?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Yes, you can cancel your booking using the link provided in your confirmation email, subject to the cancellation policy.</p>
          </details>
        </div>
      </RoleProtected>

      <RoleProtected allowedRoles={['developer', 'admin']}>
        <div>
          <h2>Technical (Developers)</h2>
          <details className="mb-4 p-4 border rounded-lg dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
            <summary className="font-semibold cursor-pointer">How do I reset the database?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">You can reset the database by running the migration scripts again. Be careful as this will wipe all data.</p>
          </details>

          <details className="mb-4 p-4 border rounded-lg dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
            <summary className="font-semibold cursor-pointer">Where are the secrets stored?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Secrets are stored in the <code>app_config</code> table in Supabase, protected by Row Level Security (RLS).</p>
          </details>

          <details className="mb-4 p-4 border rounded-lg dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900">
            <summary className="font-semibold cursor-pointer">How does the booking flow work?</summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              1. Fetch services<br/>
              2. Fetch availability<br/>
              3. Create booking (pending)<br/>
              4. Pay via Stripe<br/>
              5. Manage via token
            </p>
          </details>
        </div>
      </RoleProtected>
    </div>
  );
}
