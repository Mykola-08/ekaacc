import { createClient } from '@/lib/platform/supabase/server'

// Server Component Example: Uses server-side Supabase session.
// Demonstrates SSR user profile retrieval under RLS policies.
export const runtime = 'nodejs'

export default async function ServerProfilePage() {
 const supabase = await createClient()
 const { data: { user } } = await (supabase.auth as any).getUser()

 let profile: any = null
 let error: string | null = null
 
 if (user) {
  try {
   // Assuming 'users' table exists and is linked to auth.users
   // Or maybe we just display user info from auth
   // But the original code queried 'users' table.
   const { data, error: dbError } = await supabase.from('users').select('id, email, role, tenant_id').single()
   if (dbError) throw dbError
   profile = data
  } catch (e: any) {
   error = e.message || 'Failed to load profile'
  }
 } else {
  error = 'Unauthenticated'
 }

 return (
  <div className="p-6 max-w-xl mx-auto space-y-4">
   <h1 className="text-2xl font-semibold">Server Rendered Profile</h1>
   {error && (
    <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error}</div>
   )}
   {!error && profile && (
    <div className="rounded border p-4 space-y-2 bg-card/50 backdrop-blur">
     <div><span className="font-medium">ID:</span> {profile.id}</div>
     <div><span className="font-medium">Email:</span> {profile.email}</div>
     <div><span className="font-medium">Role:</span> {profile.role}</div>
     <div><span className="font-medium">Tenant:</span> {profile.tenant_id}</div>
    </div>
   )}
   <p className="text-sm text-muted-foreground">This page is rendered on the server using the Supabase session cookie and a user-scoped Supabase client.</p>
  </div>
 )
}