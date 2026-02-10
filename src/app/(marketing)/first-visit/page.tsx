import { Metadata } from 'next';
import FirstTimeContent from '@/components/marketing/FirstTimeContent';

export const metadata: Metadata = {
  title: 'Primera Visita | EKA Balance',
  description: 'Qué esperar en tu primera visita a EKA Balance.',
};

export default function FirstVisitPage() {
  return <FirstTimeContent />;
}
