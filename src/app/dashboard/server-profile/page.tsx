import { fetchUserProfile } from '@/lib/supabase-server'
import { headers } from 'next/headers'

// Server Component Example: Uses server-side Supabase with Auth0 session access token.
// Demonstrates SSR user profile retrieval under RLS policies.
export const runtime = 'edge'

export default async function ServerProfilePage() {
  // Construct a Request passing through cookies for getSession.
  const h = await headers()
  const req = new Request('https://internal.local/dashboard/server-profile', {
    headers: new Headers({ cookie: h.get('cookie') || '' })
  })

  let profile: any = null
  let error: string | null = null
  try {
    profile = await fetchUserProfile(req)
  } catch (e: any) {
    error = e.message || 'Failed to load profile'
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Server Rendered Profile</h1>
      {error && (
        <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error}</div>
      )}
      {!error && profile && (
        <div className="rounded border p-4 space-y-2 bg-white/50 backdrop-blur">
          <div><span className="font-medium">ID:</span> {profile.id}</div>
          <div><span className="font-medium">Email:</span> {profile.email}</div>
          <div><span className="font-medium">Role:</span> {profile.role}</div>
          <div><span className="font-medium">Tenant:</span> {profile.tenant_id}</div>
        </div>
      )}
      <p className="text-sm text-muted-foreground">This page is rendered on the server using the Auth0 session cookie and a user-scoped Supabase client.</p>
    </div>
  )
}