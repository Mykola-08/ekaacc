import { Metadata } from 'next';
import FamiliesContent from '@/components/marketing/FamiliesContent';

export const metadata: Metadata = {
  title: 'Bienestar para Familias | EKA Balance',
  description: 'Terapia sistémica y bienestar para toda la familia.',
};

export default function FamiliesPage() {
  return <FamiliesContent />;
}
