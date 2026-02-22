import { createClient as createClientPrimitive } from '@supabase/supabase-js';

// The "createClient" export was previously implicit or expected by other files
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Ensure we don't crash in browser if envs are missing (though this file should be server-only)
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Admin Supabase keys');
    // Return a dummy client or throw, depending on safety.
    // For build safety, we might return a partial mock if needed, but better to fail fast in production.
  }

  return createClientPrimitive(supabaseUrl, supabaseServiceKey);
}

// Explicit export for 'createAdminClient' as required by observability/error-reporting.ts
export function createAdminClient() {
  return createClient();
}
