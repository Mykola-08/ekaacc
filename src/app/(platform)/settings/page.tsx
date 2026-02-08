import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsPage } from '@/components/settings/SettingsPage';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile extended info
  const { data: profile } = await supabase.from('auth.users').select('*').eq('id', user.id).single();
  // In Supabase, auth.users is protected. We usually query a public profiles table OR use getUser() metadata.
  // Let's use user.user_metadata merged with any public profile data.

  // Fetch Identity Status
  const { data: identity } = await supabase.from('identity_verifications').select('status').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();

  return (
    <SettingsPage
      profile={{ ...user.user_metadata, email: user.email }}
      identityStatus={identity?.status || 'none'}
    />
  );
}

