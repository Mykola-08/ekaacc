import { Metadata } from 'next';
import AgenyzContent from '@/components/marketing/AgenyzContent';

export const metadata: Metadata = {
  title: 'Agenyz | EKA Balance',
  description: 'Soluciones avanzadas para tu bienestar con Agenyz.',
};

export default function AgenyzPage() {
  return <AgenyzContent />;
}
