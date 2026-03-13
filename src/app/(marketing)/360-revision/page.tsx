import { Metadata } from 'next';
import Revision360Content from '@/marketing/components/Revision360Content';

export const metadata: Metadata = {
  title: 'Revisión 360° | EKA Balance',
  description: 'Un análisis completo de tu bienestar físico y emocional.',
};

export default function Revision360Page() {
  return <Revision360Content />;
}
