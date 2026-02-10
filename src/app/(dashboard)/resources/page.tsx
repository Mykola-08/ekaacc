import { redirect } from 'next/navigation';

/**
 * Resources page now redirects to the Wellness page with the Resources tab.
 * Resources have been consolidated into the Wellness section.
 */
export default function DashboardResourcesPage() {
  redirect('/wellness?tab=resources');
}
