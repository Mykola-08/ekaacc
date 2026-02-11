import { Metadata } from 'next';
import CookiePolicyContent from '@/components/marketing/CookiePolicyContent';

export const metadata: Metadata = {
  title: 'Política de Cookies | EKA Balance',
  description: 'Información sobre el uso de cookies en nuestro sitio web.',
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
