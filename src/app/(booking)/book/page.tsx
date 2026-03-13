import BookingWizard from '@/components/booking/BookingWizard';
import { Suspense } from 'react';

export default function BookPage() {
  return (
    <Suspense fallback={<div>Loading booking...</div>}>
      <BookingWizard />
    </Suspense>
  );
}
