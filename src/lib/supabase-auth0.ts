import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface CreateSupabaseAuth0ClientOptions {
  auth0AccessToken: string
  supabaseUrl?: string
  supabaseAnonKey?: string
}

// Creates a Supabase client that forwards Auth0 bearer token for RLS.
// Use on the server (e.g., inside Next.js Route Handlers) when you have an Auth0 access token.
export function createSupabaseAuth0Client(options: CreateSupabaseAuth0ClientOptions): SupabaseClient {
  const supabaseUrl = options.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnon = options.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const client = createClient(supabaseUrl, supabaseAnon, {
    global: {
      headers: {
        Authorization: `Bearer ${options.auth0AccessToken}`,
      },
    },
  })
  return client
}

// Example convenience function for server-side usage (wraps try/catch).
export async function fetchUserProfile(auth0AccessToken: string) {
  const supabase = createSupabaseAuth0Client({ auth0AccessToken })
  return supabase.from('users').select('*').limit(1)
}
import { createClient } from '@supabase/supabase-js'
import type Auth0ClientType from '@auth0/auth0-spa-js'

/**
 * Create a Supabase client that will obtain access tokens from Auth0 when making requests.
 *
 * Usage (example):
 *   import Auth0Client from '@auth0/auth0-spa-js'
 *   const auth0 = new Auth0Client({ domain, clientId, authorizationParams: { redirect_uri } })
 *   const supabase = createSupabaseWithAuth0(auth0)
 *
 * Notes:
 * - This helper sets `auth.accessToken` to an async function which Supabase will call to
 *   obtain the bearer token for requests. The function uses `auth0.getTokenSilently()`.
 * - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createSupabaseWithAuth0(auth0Client: Auth0ClientType) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and ANON key must be defined in NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Supabase will call this function to get an up-to-date access token for the current user.
      accessToken: async () => {
        try {
          const token = await auth0Client.getTokenSilently()
          return token
        } catch (err) {
          console.error('Failed to get Auth0 token silently:', err)
          return null
        }
      },
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: { 'x-application-name': 'ekaacc-app' },
    },
    db: { schema: 'public' },
  })
}

export default createSupabaseWithAuth0
