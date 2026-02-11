/**
 * Re-exports the consolidated Supabase server client.
 * The main client at @/lib/supabase/server already handles
 * cross-subdomain cookies via domain option in production.
 */
export { createClient } from '@/lib/supabase/server';
