import { getUserSettings } from '@/server/settings/actions';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { redirect } from 'next/navigation';

export default async function Page() {
 const profile = await getUserSettings();

 if (!profile) {
   redirect('/login');
 }

 return <SettingsPage profile={profile} />;
}