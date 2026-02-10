import { ServicesList } from '@/components/admin/services/ServicesList';
import { getAdminServices } from '@/server/admin/actions';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await getAdminServices();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <ServicesList services={services} />
      </div>
    </div>
  );
}
