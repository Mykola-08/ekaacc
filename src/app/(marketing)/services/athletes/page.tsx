import { Metadata } from 'next';
import ForAthletesContent from '@/marketing/components/ForAthletesContent';

export const metadata: Metadata = {
  title: 'Rendimiento para Deportistas | EKA Balance',
  description: 'Prevención de lesiones y mejora del rendimiento deportivo.',
};

export default function AthletesPage() {
  return <ForAthletesContent />;
}
