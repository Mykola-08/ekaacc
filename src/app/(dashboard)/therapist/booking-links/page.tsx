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
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-semibold tracking-tight">Booking Links</h1>
          <p className="text-sm text-muted-foreground">
            Create pre-filled booking links to share with your clients.
          </p>
        </div>

        <div className="px-4 lg:px-6">
          <BookingLinkGenerator />
        </div>
      </div>
    </PermissionGate>
  );
}
