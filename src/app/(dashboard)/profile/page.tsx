import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfilePageClient } from './profile-client';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, bio, avatar_url, phone, specialties, created_at')
    .eq('auth_id', user.id)
    .single();

  return (
    <ProfilePageClient
      profile={profile}
      user={{ email: user.email ?? '', created_at: user.created_at }}
    />
  );
}
