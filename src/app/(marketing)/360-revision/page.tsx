import { Metadata } from 'next';
import Revision360Content from '@/components/marketing/Revision360Content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Revisión 360 | EKA Balance',
  description: 'Evaluación integral de tu estado físico y energético.',
};

export default function Revision360Page() {
  return <Revision360Content />;
}
