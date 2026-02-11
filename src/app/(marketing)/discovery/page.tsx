import { Metadata } from 'next';
import DiscoveryContent from '@/components/marketing/DiscoveryContent';

export const metadata: Metadata = {
  title: 'Sesión de Descubrimiento | EKA Balance',
  description: 'Explora cómo podemos ayudarte en una sesión introductoria.',
};

export default function DiscoveryPage() {
  return <DiscoveryContent />;
}
