import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: profile }, { data: notifPrefs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('auth_id', user.id).single(),
    supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then((r) => ({ data: r.data ?? null })),
  ]);

  return <SettingsClient profile={profile} email={user.email ?? ''} notifPrefs={notifPrefs} />;
}
