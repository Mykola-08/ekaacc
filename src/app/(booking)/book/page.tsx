import { BookingWizard } from '@/components/booking/BookingWizard';
import { SuspenseBoundary } from '@/components/ui/suspense-boundary';

export default function BookPage() {
  return (
    <div className="dashboard-theme bg-background text-foreground min-h-screen font-sans">
      <SuspenseBoundary>
        <BookingWizard />
      </SuspenseBoundary>
    </div>
  );
}
