import { Metadata } from 'next';
import CookiePolicyContent from '@/marketing/components/CookiePolicyContent';


export const metadata: Metadata = {
  title: 'Cookie Policy | EKA Balance',
  description: 'Information about how EKA Balance uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
