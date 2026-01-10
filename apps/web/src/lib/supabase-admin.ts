import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate configuration at runtime, not build time
function validateConfig() {
  if (!supabaseUrl || (!supabaseServiceKey && process.env.NODE_ENV === 'production')) {
    console.error('Missing Supabase Service Key or URL for admin client');
  }
}

// Create a Supabase client with the SERVICE ROLE key for admin tasks
// This bypasses RLS, so be careful where you use it!
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || 'placeholder-key-for-build',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Export validation function to call at runtime
export { validateConfig as validateSupabaseAdminConfig };
