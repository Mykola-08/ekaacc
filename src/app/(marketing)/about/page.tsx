import { Metadata } from 'next';
import AboutElenaContent from '@/components/marketing/AboutElenaContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sobre Elena | EKA Balance',
  description: 'Conoce a Elena Kucherova, especialista en terapias integrativas.',
};

export default function AboutPage() {
  return <AboutElenaContent />;
}
