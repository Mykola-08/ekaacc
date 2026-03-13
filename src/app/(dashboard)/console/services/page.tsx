import { ServicesList } from '@/components/admin/services/ServicesList';
import { getAdminServices } from '@/server/admin/actions';

export default async function ServicesPage() {
  const services = await getAdminServices();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="">
        <h1 className="text-3xl font-semibold">Services Management</h1>
        <ServicesList services={services} />
      </div>
    </div>
  );
}
