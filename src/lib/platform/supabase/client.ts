import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dopkncrqutxnchwqxloa.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcGtuY3JxdXR4bmNod3F4bG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTUwNzksImV4cCI6MjA4MzM3MTA3OX0.ctJPZcBYTfxPlQN_winPMB6wVZm8CoNOWcMKZW7FYl0'
  )
  
  return client;
}
