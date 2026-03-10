import { Metadata } from 'next';
import DiscoveryContent from '@/marketing/components/DiscoveryContent';


export const metadata: Metadata = {
  title: 'Descobreix el teu servei ideal - EKA Balance',
  description: "Formulari personalitzat per trobar el servei de teràpia holística que millor s'adapti a les teves necessitats específiques.",
};

export default function DiscoveryPage() {
  return (
    <DiscoveryContent />
  );
}
