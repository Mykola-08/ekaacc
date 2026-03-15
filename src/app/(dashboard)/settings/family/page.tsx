import { redirect } from 'next/navigation';

export default function FamilySettingsPage() {
  redirect('/settings?section=family');
}
