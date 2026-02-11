import { redirect } from 'next/navigation';

export default function ReferralSettingsPage() {
  redirect('/settings?tab=referral');
}
