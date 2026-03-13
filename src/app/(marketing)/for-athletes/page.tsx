import { Metadata } from 'next';
import ForAthletesContent from '@/marketing/components/ForAthletesContent';

export const metadata: Metadata = {
  title: 'Bienestar para Atletas y Deportistas | EKA Balance',
  description:
    'Mejora tu rendimiento, recupera lesiones y optimiza tu cuerpo con nuestros planes para deportistas.',
};

export default function AthletesPage() {
  return <ForAthletesContent />;
}
