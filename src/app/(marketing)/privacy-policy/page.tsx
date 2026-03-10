import { Metadata } from 'next';
import PrivacyPolicyContent from '@/marketing/components/PrivacyPolicyContent';


export const metadata: Metadata = {
  title: 'Privacy Policy | EKA Balance',
  description: 'Learn how EKA Balance collects, uses, and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
