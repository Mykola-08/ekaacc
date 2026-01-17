import { getActiveTherapists } from '@/server/therapist/service';
import { listServices } from '@/server/booking/service';
import { redirect } from 'next/navigation';
import { ServiceGrid } from '@/components/booking/ServiceGrid';
import { CompareServices } from '@/components/booking/CompareServices';

import { Service } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function BookPage() {
  const therapists = await getActiveTherapists();
  const { data: rawServices } = await listServices();
  const services = (rawServices || []) as Service[];

  if (therapists.length === 1) {
    const therapist = therapists[0]!;
    const therapistName = therapist.display_name || therapist.name;

    if (services && services.length === 1) {
      redirect(`/book/${services[0]!.id}`);
    }

    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Book with {therapistName}</h1>
              <p className="text-muted-foreground text-lg font-medium">Select a service to get started.</p>
            </div>
            <ServiceGrid services={services || []} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Select a Service</h1>
            <p className="text-muted-foreground text-lg font-medium">Choose from our curated wellness sessions.</p>
          </div>
          <ServiceGrid services={services || []} />

          <div className="pt-12">
            <CompareServices />
          </div>
        </div>
      </div>
    </div>
  );
}
