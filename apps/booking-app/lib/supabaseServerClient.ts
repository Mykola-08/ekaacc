import { createClient } from '@supabase/supabase-js';

// Service role client (server-side only). DO NOT expose service key to client bundles.
// Uses API key authentication (not JWT)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9zZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA1NjM0NCwiZXhwIjoyMDc4NjMyMzQ0fQ.5gzhfCb4GwDII-H6SFjhGegKa-Pk_aDxrOQkVVaGuMA';

export const supabaseServer = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
