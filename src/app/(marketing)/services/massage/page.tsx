import { Metadata } from 'next';
import MassageContent from '@/components/marketing/MassageContent';

export const metadata: Metadata = {
  title: 'Masaje Terapéutico y Relajante | EKA Balance',
  description: 'Masajes descontracturantes, relajantes y drenaje linfático.',
};

export default function MassagePage() {
  return <MassageContent />;
}
