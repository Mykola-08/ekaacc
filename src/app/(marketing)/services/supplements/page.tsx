import { Metadata } from 'next';
import NutritionContent from '@/components/marketing/NutritionContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Suplementos | EKA Balance',
  description: 'Asesoramiento sobre suplementación natural.',
};

export default function SupplementsPage() {
  return <NutritionContent />;
}
