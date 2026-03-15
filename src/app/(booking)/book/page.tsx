import { BookingWizard } from '@/components/booking/BookingWizard';
import { SuspenseBoundary } from '@/components/ui/suspense-boundary';

export default function BookPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SuspenseBoundary>
        <BookingWizard />
      </SuspenseBoundary>
    </div>
  );
}
