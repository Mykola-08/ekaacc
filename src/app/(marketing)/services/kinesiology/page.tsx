import { Metadata } from 'next';
import KinesiologiaContent from '@/components/marketing/KinesiologyContent';

export const metadata: Metadata = {
  title: 'Kinesiología Holística | EKA Balance',
  description: 'Equilibra tu cuerpo, mente y emociones con Kinesiología Holística.',
};

export default function KinesiologiaPage() {
  return <KinesiologiaContent />;
}
