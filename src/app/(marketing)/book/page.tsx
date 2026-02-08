import { Metadata } from 'next';
import BookingContent from '@/components/marketing/BookingContent';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "Reserva Cita | EKA Balance",
  description: "Reserva la teva cita per a teràpies integratives i serveis de benestar.",
};

export default function BookingPage() {
  return <BookingContent />;
}


