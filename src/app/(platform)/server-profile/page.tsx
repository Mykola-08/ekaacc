import { createClient } from '@/lib/platform/supabase/server';

// Server Component Example: Uses server-side Supabase session.
// Demonstrates SSR user profile retrieval under RLS policies.
export const runtime = 'nodejs';

export default async function ServerProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: any = null;
  let error: string | null = null;

  if (user) {
    try {
      // Assuming 'users' table exists and is linked to auth.users
      // Or maybe we just display user info from auth
      // But the original code queried 'users' table.
      const { data, error: dbError } = await supabase
        .from('users')
        .select('id, email, role, tenant_id')
        .single();
      if (dbError) throw dbError;
      profile = data;
    } catch (e: any) {
      error = e.message || 'Failed to load profile';
    }
  } else {
    error = 'Unauthenticated';
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Server Rendered Profile</h1>
      {error && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {!error && profile && (
        <div className="bg-card/50 space-y-2 rounded border p-4 backdrop-blur">
          <div>
            <span className="font-medium">ID:</span> {profile.id}
          </div>
          <div>
            <span className="font-medium">Email:</span> {profile.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> {profile.role}
          </div>
          <div>
            <span className="font-medium">Tenant:</span> {profile.tenant_id}
          </div>
        </div>
      )}
      <p className="text-muted-foreground text-sm">
        This page is rendered on the server using the Supabase session cookie and a user-scoped
        Supabase client.
      </p>
    </div>
  );
}
