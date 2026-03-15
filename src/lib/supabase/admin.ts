import { createClient as createClientPrimitive } from '@supabase/supabase-js';

// The "createClient" export was previously implicit or expected by other files
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

  if (!supabaseUrl || !supabaseSecretKey) {
    console.warn('Missing Admin Supabase keys');
  }

  return createClientPrimitive(supabaseUrl, supabaseSecretKey);
}

// Explicit export for 'createAdminClient' as required by observability/error-reporting.ts
export function createAdminClient() {
  return createClient();
}
