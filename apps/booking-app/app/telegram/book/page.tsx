import { listServices } from '@/server/booking/service';
import { ServiceList } from '@/components/booking/ServiceList';

export const revalidate = 0;

export default async function TelegramBookPage() {
  const { data: services, error } = await listServices();

  if (error) {
    return <div className="p-4 text-red-500">Error loading services</div>;
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Book a Session</h1>
      <ServiceList services={services || []} />
    </div>
  );
}
