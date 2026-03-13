import BookingWizard from '@/components/booking/BookingWizard';
import { Suspense } from 'react';

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return (
    <Suspense fallback={<div>Loading booking...</div>}>
      <BookingWizard serviceId={serviceId} />
    </Suspense>
  );
}
