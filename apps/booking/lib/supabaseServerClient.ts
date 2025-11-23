import { createClient } from '@supabase/supabase-js';

// Service role client (server-side only). DO NOT expose service key to client bundles.
// Uses API key authentication (not JWT)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-placeholder';

export const supabaseServer = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
