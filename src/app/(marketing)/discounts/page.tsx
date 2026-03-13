import { Metadata } from 'next';
import DiscountsContent from '@/marketing/components/DiscountsContent';

export const metadata: Metadata = {
  title: 'Descomptes i Ofertes | EKA Balance',
  description:
    'Descobreix els nostres descomptes i ofertes especials per a nous clients, famílies i més.',
};

export default function DiscountsPage() {
  return <DiscountsContent />;
}
