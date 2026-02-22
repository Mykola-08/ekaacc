import BookingWizard from '@/components/booking/BookingWizard';

export default async function BookServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  return <BookingWizard serviceId={serviceId} />;
}
