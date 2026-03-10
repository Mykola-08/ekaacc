import { Metadata } from 'next';
import { Suspense } from 'react';
import BookingContent from '@/marketing/components/BookingContent';


export const metadata: Metadata = {
  title: "Reserva Cita | EKA Balance",
  description: "Reserva la teva cita per a teràpies integratives i serveis de benestar.",
};

export default function BookingPage() {
  return (
    <Suspense>
      <BookingContent />
    </Suspense>
  );
}
