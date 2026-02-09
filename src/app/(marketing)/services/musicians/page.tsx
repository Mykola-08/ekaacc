import { Metadata } from 'next';
import ForMusiciansContent from '@/components/marketing/ForMusiciansContent';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Salud y Rendimiento para Músicos | EKA Balance',
  description:
    'Prevención de lesiones, posturología y mejora del rendimiento escénico para músicos.',
};

export default function MusiciansPage() {
  return <ForMusiciansContent />;
}
