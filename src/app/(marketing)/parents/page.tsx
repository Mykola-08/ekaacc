import { Metadata } from 'next';
import ForParentsContent from '@/components/marketing/ForParentsContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Para Padres | EKA Balance',
  description: 'Apoyo y orientación para padres en la crianza y bienestar familiar.',
};

export default function ParentsPage() {
  return <ForParentsContent />;
}
