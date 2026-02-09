// Re-export from main supabase module to avoid duplicate clients
// This file exists for backwards compatibility
export { supabaseAdmin } from '@/lib/platform/supabase';

// Validation helper for production checks
export function validateSupabaseAdminConfig(): void {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || (!supabaseServiceKey && process.env.NODE_ENV === 'production')) {
    console.error('Missing Supabase Service Key or URL for admin client');
  }
}
