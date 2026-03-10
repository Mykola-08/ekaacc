import AgenyzContent from '@/marketing/components/AgenyzContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenyz | Cellular Nutrition & Anti-Aging',
  description: 'Unleash your genetic potential with bio-available supplements designed to restore balance, defy aging, and fuel your vitality at the DNA level.',
};

export default function AgenyzPage() {
  return <AgenyzContent />;
}
