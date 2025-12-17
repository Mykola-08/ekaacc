import { listServices } from '@/server/booking/service';
import { Service } from '@/types/database';
import { ServiceList } from '@/components/booking/ServiceList';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

async function getServices() {
  const { data, error } = await listServices();

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  // Return data directly - now includes 'active' and 'created_at'
  return (data || []) as Service[];
}

export default async function Home() {
  const services = await getServices();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="bg-card shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">EKA Booking</h1>
          <nav>
            <Button variant="ghost">Sign In</Button>
          </nav>
        </div>
      </header>

      <section className="bg-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl sm:tracking-tight lg:text-6xl">
            Book Your Next Session
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-xl text-muted-foreground">
            Professional services at your fingertips. Schedule your appointment today with our easy-to-use booking system.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8 flex-grow w-full">
        <div className="px-4 sm:px-0">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Available Services</h3>
            <ServiceList services={services} />
          </div>
        </div>
      </div>
    </main>
  );
}
