import { redirect } from 'next/navigation';

export default function FormsPage() {
  redirect('/settings?section=forms');
}
