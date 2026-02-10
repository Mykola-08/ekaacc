import { Metadata } from 'next';
import BookingContent from '@/components/marketing/BookingContent';

export const metadata: Metadata = {
  title: 'Reservar Cita | EKA Balance',
  description: 'Reserva tu cita para sesiones de kinesiología, masajes y terapias somáticas.',
};

export default function BookingPage() {
  return <BookingContent />;
}
