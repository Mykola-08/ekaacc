import { Metadata } from 'next';
import CasosContent from '@/components/marketing/CasosContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Casos de Éxito | EKA Balance',
  description: 'Historias reales de transformación y mejora del bienestar.',
};

export default function CasesPage() {
  return <CasosContent />;
}
