import { Metadata } from 'next';
import ServicesContent from '@/components/marketing/ServicesContent';

export const metadata: Metadata = {
  title: 'Servicios | EKA Balance',
  description: 'Descubre nuestros servicios personalizados de bienestar y terapias integratives.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
