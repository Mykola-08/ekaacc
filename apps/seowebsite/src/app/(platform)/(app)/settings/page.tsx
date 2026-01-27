import { createClient } from '@/lib/platform/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsContentHeadless as SettingsContent } from '@/components/platform/settings/settings-content-headless';
import type { User } from '@/lib/platform/types/types';

export default async function SettingsPage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
  redirect('/auth-portal');
 }

 // Extract settings from metadata
 const userSettings = user.user_metadata?.settings || {};
 
 // Construct User object compatible with internal types
 const platformUser: User = {
  id: user.id,
  email: user.email!,
  role: (user.user_metadata?.role as any) || 'Patient',
  initials: (user.email?.[0] || 'U').toUpperCase(),
  name: user.user_metadata?.full_name || user.user_metadata?.name || '',
  settings: userSettings,
  user_metadata: user.user_metadata,
 } as User;

 return <SettingsContent currentUser={platformUser} />;
}
