// Re-export the canonical browser client singleton.
// Using a single instance prevents auth-lock contention (AbortError).
export { createClient } from '@/lib/supabase/client';
