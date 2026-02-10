import { Metadata } from 'next';
import ArtistsContent from '@/components/marketing/ArtistsContent';

export const metadata: Metadata = {
  title: 'Bienestar para Artistas | EKA Balance',
  description: 'Mejora tu rendimiento artístico y gestiona el estrés escénico.',
};

export default function ArtistsPage() {
  return <ArtistsContent />;
}
