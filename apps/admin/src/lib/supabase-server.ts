import { createClient } from '@supabase/supabase-js'
import { getSession } from '@auth0/nextjs-auth0/edge'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Server-side Supabase client factory using Auth0 access token for RLS.
// Call inside Edge/Route handlers. Avoid using service role key for user-scoped operations.
export async function getSupabaseWithAuth(request: NextRequest) {
  const session = await getSession(request, NextResponse.next())
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
export async function fetchUserProfile(request: NextRequest) {
  const supabase = await getSupabaseWithAuth(request)
  const { data, error } = await supabase.from('users').select('id, email, role, tenant_id').single()
  if (error) throw error
  return data
}