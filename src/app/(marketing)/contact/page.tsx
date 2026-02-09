import { Metadata } from 'next';
import ContactContent from '@/components/marketing/ContactContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contacto | EKA Balance',
  description: 'Ponte en contacto con nosotros para más información.',
};

export default function ContactPage() {
  return <ContactContent />;
}
