import { Metadata } from 'next';
import ForMusiciansContent from '@/marketing/components/ForMusiciansContent';

export const metadata: Metadata = {
  title: 'Salud y Rendimiento para Músicos | EKA Balance',
  description: 'Prevención de lesiones, posturología y mejora del rendimiento escénico para músicos.',
};

export default function MusiciansPage() {
  return <ForMusiciansContent />;
}
