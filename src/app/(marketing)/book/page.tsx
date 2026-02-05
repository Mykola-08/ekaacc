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
      <div className="min-h-screen bg-background text-foreground pb-20">
        <div className="container mx-auto py-20 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">Book with {therapistName}</h1>
              <p className="text-muted-foreground text-xl font-medium opacity-80">Experience deep transformation through our curated wellness sessions.</p>
            </div>
            
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-200/20 to-purple-200/20 rounded-[40px] blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative">
                  <ServiceGrid services={services || []} />
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container mx-auto py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">Select a Service</h1>
            <p className="text-muted-foreground text-xl font-medium opacity-80">Choose the path that resonates with your current needs.</p>
          </div>
          
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-200/10 via-blue-200/10 to-purple-200/10 rounded-[40px] blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
             <div className="relative">
                <ServiceGrid services={services || []} />
             </div>
          </div>

          <div className="pt-20">
            <div className="max-w-4xl mx-auto">
                <CompareServices />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
