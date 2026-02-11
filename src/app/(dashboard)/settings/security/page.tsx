import { redirect } from 'next/navigation';

export default function MFASettingsPage() {
  redirect('/settings?tab=security');
}
