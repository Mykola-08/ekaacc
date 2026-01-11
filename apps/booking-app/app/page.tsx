import { listServices } from '@/server/booking/service';
import { Service } from '@/types/database';
import { ServiceCard } from '@/components/booking/ServiceCard';
import { Flower } from "lucide-react";

// Revalidate every 60 seconds - good balance of freshness and performance
export const revalidate = 60;

// Generate static params for common services
export const dynamic = 'force-static';
export const dynamicParams = true;

async function getServices(): Promise<Service[]> {
  const { data, error } = await listServices();

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return (data || []) as Service[];
}

export default async function Home() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-background-dark text-slate-200 font-display p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-12">
        
        {/* Simple Header */}
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="size-16 flex items-center justify-center text-primary rounded-full bg-surface-highlight border border-border-subtle">
            <Flower className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary">Select a Service</h1>
          <p className="text-slate-400 max-w-lg">
            Choose a service below to start your booking process.
          </p>
        </header>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-500">
              No services available at the moment.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
