import { Metadata } from 'next';
import PrivacyPolicyContent from '@/components/marketing/PrivacyPolicyContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Política de Privacidad | EKA Balance',
  description: 'Nuestra política de manejo de datos y privacidad.',
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
