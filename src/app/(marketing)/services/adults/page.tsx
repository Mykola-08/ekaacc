import { Metadata } from 'next';
import AdultsContent from '@/marketing/components/AdultsContent';

export const metadata: Metadata = {
  title: 'Terapias para Adultos | EKA Balance',
  description: 'Gestión del estrés, ansiedad y problemas digestivos para adultos.',
};

export default function AdultsPage() {
  return <AdultsContent />;
}
