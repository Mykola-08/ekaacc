import { Metadata } from 'next';
import ChildrenContent from '@/marketing/components/ChildrenContent';

export const metadata: Metadata = {
  title: 'Terapias Infantiles | EKA Balance',
  description: 'Kinesiología y apoyo al desarrollo para niños.',
};

export default function ChildrenPage() {
  return <ChildrenContent />;
}
