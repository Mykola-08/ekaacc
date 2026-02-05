import { getResources } from '@/server/resources/service';
import { ResourcesPage } from '@/components/resources/ResourcesPage';

export default async function Page() {
  const resources = await getResources();
  return <ResourcesPage initialResources={resources} />;
}

