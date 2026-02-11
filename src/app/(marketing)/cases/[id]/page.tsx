import { Metadata } from 'next';
import CasoDetailContent from '@/components/marketing/CasoDetailContent';

// Note: generateStaticParams logic would depend on the data source for cases.
// For now, we rely on dynamic rendering.

export const metadata: Metadata = {
  title: 'Detalle del Caso | EKA Balance',
  description: 'Historia detallada de transformación personal.',
};

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CasoDetailContent />;
}
