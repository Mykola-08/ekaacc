import { createBrowserClient } from '@supabase/ssr';

type BrowserClient = ReturnType<typeof createBrowserClient>;

// Persist across Turbopack / webpack HMR reloads to prevent
// navigator-lock conflicts between old and new module instances.
const g = globalThis as unknown as { __supabaseBrowserClient?: BrowserClient };

export function createClient() {
  if (g.__supabaseBrowserClient) return g.__supabaseBrowserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'env-missing';

  g.__supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseKey);

  return g.__supabaseBrowserClient;
}
