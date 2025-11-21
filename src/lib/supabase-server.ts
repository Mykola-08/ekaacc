import { createClient } from '@supabase/supabase-js'
import { getSession } from '@auth0/nextjs-auth0/edge'

// Server-side Supabase client factory using Auth0 access token for RLS.
// Call inside Edge/Route handlers. Avoid using service role key for user-scoped operations.
export async function getSupabaseWithAuth(request: Request) {
  const session = await getSession(request as any)
  if (!session) throw new Error('Unauthenticated')
  const accessToken = session.accessToken
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anon, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  })
}

// Example helper for server component usage (App Router) – fetch minimal user profile.
export async function fetchUserProfile(request: Request) {
  const supabase = await getSupabaseWithAuth(request)
  const { data, error } = await supabase.from('users').select('id, email, role, tenant_id').single()
  if (error) throw error
  return data
}