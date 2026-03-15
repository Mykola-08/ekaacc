import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Bienestar para Atletas y Deportistas | EKA Balance',
  description:
    'Mejora tu rendimiento, recupera lesiones y optimiza tu cuerpo con nuestros planes para deportistas.',
};

export default function AthletesPage() {
  return <PersonaContent persona="athletes" />;
}
