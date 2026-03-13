import { Metadata } from 'next';
import PersonalizedServicesContent from '@/marketing/components/PersonalizedServicesContent';

export const metadata: Metadata = {
  title: 'Plans Personalitzats i Serveis VIP | EKA Balance',
  description:
    'Descobreix els nostres plans personalitzats per a oficinistes, atletes, músics i més.',
};

export default function PersonalizedServicesPage() {
  return <PersonalizedServicesContent />;
}
