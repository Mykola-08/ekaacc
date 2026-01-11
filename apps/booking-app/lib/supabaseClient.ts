import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// Client for server components using SSR
// Uses API key authentication (not JWT)

// Singleton pattern for client reuse
let clientInstance: SupabaseClient | null = null;

export async function createClient(): Promise<SupabaseClient> {
  if (clientInstance) return clientInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use placeholder for build time, validate at runtime
  const key = supabaseKey || 'placeholder-key-for-build';
  
  clientInstance = createSupabaseClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': 'eka-booking-app'
      }
    }
  });
  
  // Validate at runtime
  if (!supabaseKey && typeof window !== 'undefined') {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
  }

  return clientInstance;
}
