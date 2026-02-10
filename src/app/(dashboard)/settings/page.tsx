import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { SettingsPage } from '@/components/settings/SettingsPage';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Use user metadata (auth.users is not accessible via PostgREST)
  const profile = {
    ...user.user_metadata,
    email: user.email,
    id: user.id,
    created_at: user.created_at,
  };

  // Fetch Identity Status
  const { data: identity } = await supabase
    .from('identity_verifications')
    .select('status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return (
    <Suspense fallback={<div className="space-y-4 px-4 py-8"><div className="h-24 animate-pulse rounded-lg bg-muted" /></div>}>
      <SettingsPage
        profile={profile}
        identityStatus={identity?.status || 'none'}
      />
    </Suspense>
  );
}
