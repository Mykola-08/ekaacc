import { Metadata } from 'next';
import KinesiologyContent from '@/components/marketing/KinesiologyContent';

export const metadata: Metadata = {
  title: 'Kinesiología Sistémica | EKA Balance',
  description: 'Enfoque sistémico para el bienestar integral.',
};

export default function SystemicPage() {
  return <KinesiologyContent />;
}
