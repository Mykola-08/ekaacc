import { Metadata } from 'next';
import TermsContent from '@/components/marketing/TermsContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | EKA Balance',
  description: 'Términos de servicio para EKA Balance.',
};

export default function TermsPage() {
  return <TermsContent />;
}
