import { Metadata } from 'next';
import DiscountsContent from '@/components/marketing/DiscountsContent';

export const metadata: Metadata = {
  title: 'Descuentos | EKA Balance',
  description: 'Ofertas especiales y paquetes de servicios.',
};

export default function DiscountsPage() {
  return <DiscountsContent />;
}
