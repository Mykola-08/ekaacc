import { getActiveTherapists } from '@/server/therapist/service';
import { listServices } from '@/server/booking/service';
import { redirect } from 'next/navigation';
import { ServiceGrid } from '@/components/booking/ServiceGrid';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const therapists = await getActiveTherapists();
  const { data: services } = await listServices();

  if (therapists.length === 1) {
    const therapist = therapists[0]!;
    const therapistName = therapist.display_name || therapist.name;

    if (services && services.length === 1) {
       redirect(`/book/${services[0].id}`);
    }
    
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">Book with {therapistName}</h1>
        <p className="text-muted-foreground mb-6">Select a service to get started.</p>
        <ServiceGrid services={services || []} />
      </div>
    );
  }

  return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Select a Service</h1>
        <ServiceGrid services={services || []} />
      </div>
  );
}
