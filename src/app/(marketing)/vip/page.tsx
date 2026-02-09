import { Metadata } from 'next';
import VIPContent from '@/components/marketing/VIPContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Servicios VIP | EKA Balance',
  description: 'Experiencia exclusiva de bienestar y atención prioritaria.',
};

export default function VIPPage() {
  return <VIPContent />;
}
