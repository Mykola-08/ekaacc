import { Metadata } from 'next';
import NutritionContent from '@/marketing/components/NutritionContent';

export const metadata: Metadata = {
  title: 'Nutrición y Dietética | EKA Balance',
  description: 'Planes nutricionales personalizados para mejorar tu salud y bienestar.',
};

export default function NutritionPage() {
  return <NutritionContent />;
}
