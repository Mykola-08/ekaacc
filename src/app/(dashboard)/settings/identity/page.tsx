import { redirect } from 'next/navigation';

export default function IdentitySettingsPage() {
  redirect('/settings?section=profile');
}
