import type { Metadata } from 'next';
import Link from 'next/link';
import { ServiceGrid } from '@/components/booking/ServiceGrid';
import { Button } from '@/components/ui/button';
import { listServices } from '@/server/booking/service';
import type { Service } from '@/types/database';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book a Session | EKA Balance',
  description: 'Select a service and continue to booking.',
};

function normalizeServices(data: unknown): Service[] {
  return Array.isArray(data) ? (data as Service[]) : [];
}

export default async function BookIndexPage() {
  const { data, error } = await listServices();
  const services = normalizeServices(data);

  return (
    <main id="main-content" className="bg-background min-h-screen py-10">
      <div className="container mx-auto space-y-8 px-4 md:px-6">
        <header className="border-border flex flex-wrap items-center justify-between gap-3 border-b pb-6">
          <div>
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
              Book a Session
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">Select a service to continue.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Back</Link>
          </Button>
        </header>

        {error || services.length === 0 ? (
          <section className="border-border bg-card text-muted-foreground rounded-2xl border p-6 text-sm">
            Unable to load services right now. Please try again shortly.
          </section>
        ) : (
          <ServiceGrid services={services} />
        )}
      </div>
    </main>
  );
}
