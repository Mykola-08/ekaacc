import { redirect } from 'next/navigation';

/**
 * Profile page now redirects to the unified Account page (/settings).
 * Profile information has been merged into the Settings/Account page.
 */
export default function ProfilePage() {
  redirect('/settings');
}
