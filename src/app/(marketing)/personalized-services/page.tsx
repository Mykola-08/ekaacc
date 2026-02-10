import { Metadata } from 'next';
import PersonalizedServicesContent from '@/components/marketing/PersonalizedServicesContent';

export const metadata: Metadata = {
  title: 'Servicios Personalizados | EKA Balance',
  description: 'Terapias adaptadas a tus necesidades específicas.',
};

export default function PersonalizedServicesPage() {
  return <PersonalizedServicesContent />;
}
