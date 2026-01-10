import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client for server components using SSR
// Uses API key authentication (not JWT)
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use placeholder for build time, validate at runtime
  const key = supabaseKey || 'placeholder-key-for-build';
  
  const client = createSupabaseClient(supabaseUrl, key);
  
  // Validate at runtime
  if (!supabaseKey && typeof window !== 'undefined') {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured');
  }

  return client;
}
