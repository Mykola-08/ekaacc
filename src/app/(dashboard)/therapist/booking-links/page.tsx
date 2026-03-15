import { Metadata } from 'next';
import { PermissionGate } from '@/components/dashboard/auth/PermissionGate';
import { BookingLinkGenerator } from '@/components/booking/BookingLinkGenerator';

export const metadata: Metadata = {
  title: 'Booking Links | EKA Platform',
  description: 'Generate customized booking links for clients.',
};

export default function BookingLinksPage() {
  return (
    <PermissionGate permission={{ group: 'appointment_management', action: 'create' }}>
      <div className="container mx-auto max-w-4xl space-y-8 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Links</h1>
          <p className="text-muted-foreground mt-2">
            Create pre-filled booking links to share with your clients.
          </p>
        </div>

        <BookingLinkGenerator />
      </div>
    </PermissionGate>
  );
}
