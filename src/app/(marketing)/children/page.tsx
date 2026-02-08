import { Metadata } from 'next';
import ChildrenContent from '@/components/marketing/ChildrenContent';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terapias Infantiles | EKA Balance',
  description: 'Kinesiología y apoyo al desarrollo para niños.',
};

export default function ChildrenPage() {
  return <ChildrenContent />;
}
