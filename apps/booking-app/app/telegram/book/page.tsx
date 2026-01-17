import { listServices } from '@/server/booking/service';
import { ServiceGrid } from '@/components/booking/ServiceGrid';

export const revalidate = 0;

export default async function TelegramBookPage() {
  const { data: services, error } = await listServices();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-destructive bg-card p-6 rounded-2xl shadow-sm border border-destructive/20">
          Error loading services. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mb-8 pl-1">
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-1">Book a Session</h1>
        <p className="text-muted-foreground/80">Select a service to get started</p>
      </div>
      <ServiceGrid services={(services as any) || []} />
    </div>
  );
}
