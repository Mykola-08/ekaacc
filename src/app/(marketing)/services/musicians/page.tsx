import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Salud y Rendimiento para Músicos | EKA Balance',
  description:
    'Prevención de lesiones, posturología y mejora del rendimiento escénico para músicos.',
};

export default function MusiciansPage() {
  return <PersonaContent persona="musicians" />;
}
