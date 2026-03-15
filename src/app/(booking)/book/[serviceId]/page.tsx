import { BookingWizard } from '@/components/booking/BookingWizard';
import { SuspenseBoundary } from '@/components/ui/suspense-boundary';

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return (
    <SuspenseBoundary>
      <BookingWizard serviceId={serviceId} />
    </SuspenseBoundary>
  );
}
