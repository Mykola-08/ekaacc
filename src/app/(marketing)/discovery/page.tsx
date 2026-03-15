import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DiscoveryContent = dynamic(() => import('@/marketing/components/DiscoveryContent'), {
  ssr: true,
  loading: () => <div className="bg-background min-h-screen animate-pulse" />,
});

export const metadata: Metadata = {
  title: 'Descobreix el teu servei ideal - EKA Balance',
  description:
    "Formulari personalitzat per trobar el servei de teràpia holística que millor s'adapti a les teves necessitats específiques.",
};

export default function DiscoveryPage() {
  return <DiscoveryContent />;
}
