import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export type ServiceRoleClientOptions = {
  /** Application name for headers */
  appName?: string;
  /** Database schema (default: 'public') */
  schema?: string;
};

/**
 * Create a Supabase service role client for server-side operations
 * This client bypasses Row Level Security (RLS) and should ONLY be used server-side
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * 
 * WARNING: Never expose the service role key to client bundles!
 */
export function createServiceRoleClient(options?: ServiceRoleClientOptions) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': options?.appName || 'eka-app',
      },
    },
    db: {
      schema: options?.schema || 'public',
    },
  });
}
