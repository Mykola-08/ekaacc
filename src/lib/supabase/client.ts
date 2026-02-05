import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dopkncrqutxnchwqxloa.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko'
  );

  return client;
}
