import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Rendimiento para Deportistas | EKA Balance',
  description: 'Prevención de lesiones y mejora del rendimiento deportivo.',
};

export default function AthletesPage() {
  return <PersonaContent persona="athletes" />;
}
