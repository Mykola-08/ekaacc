import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getResources } from '@/server/resources/service';
import { ResourcesPage } from '@/components/resources/ResourcesPage';

export const dynamic = 'force-dynamic';

export default async function DashboardResourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const resources = await getResources();

  return <ResourcesPage initialResources={resources} />;
}
