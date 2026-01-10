import { createClient } from '@/lib/platform/supabase/server'

export const runtime = 'nodejs'

export default async function ServerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile: any = null
  let error: string | null = null
  
  if (user) {
    try {
      const { data, error: dbError } = await supabase.from('users').select('id, email, role, tenant_id').single()
      if (dbError) throw dbError
      profile = data
    } catch (e: any) {
      error = e.message
    }
  } else {
    error = 'Unauthenticated'
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
      <p className="text-muted-foreground text-sm">This page is server-rendered using the Supabase session cookie and a Supabase client.</p>
    </div>
  )
}