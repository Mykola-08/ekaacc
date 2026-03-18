import { BookingWizard } from '@/components/booking/BookingWizard';
import { SuspenseBoundary } from '@/components/ui/suspense-boundary';

export default function BookPage() {
  return (
    <SuspenseBoundary>
      <BookingWizard />
    </SuspenseBoundary>
  );
}
