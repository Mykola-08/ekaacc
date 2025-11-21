import { fetchUserProfile } from '@/lib/supabase-server'
import { headers } from 'next/headers'

export const runtime = 'edge'

export default async function ServerDashboardPage() {
  const h = await headers()
  const req = new Request('https://internal.local/home/server-dashboard', { headers: new Headers({ cookie: h.get('cookie') || '' }) })
  let profile: any = null
  let error: string | null = null
  try {
    profile = await fetchUserProfile(req)
  } catch (e: any) {
    error = e.message
  }
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Server Dashboard (SSR)</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {profile && (
        <div className="grid gap-2 text-sm">
          <div><span className="font-medium">User:</span> {profile.email}</div>
          <div><span className="font-medium">Role:</span> {profile.role}</div>
          <div><span className="font-medium">Tenant:</span> {profile.tenant_id}</div>
        </div>
      )}
      <p className="text-muted-foreground text-sm">This page is server-rendered using the Auth0 session cookie and a Supabase client authorized via access token.</p>
    </div>
  )
}