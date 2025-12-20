import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client for server components using SSR
// Uses API key authentication (not JWT)
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}
