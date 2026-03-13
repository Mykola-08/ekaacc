import { Metadata } from 'next';
import AboutElenaContent from '@/marketing/components/AboutElenaContent';

export const metadata: Metadata = {
  title: 'Sobre Elena Kucherova | EKA Balance',
  description:
    "Descobreix la trajectòria d'Elena Kucherova, especialista en integració somàtica, rehabilitació neuro-motora i teràpies naturals.",
  keywords: [
    'Elena Kucherova',
    'Biografia',
    'EKA Balance',
    'Integració Somàtica',
    'Rehabilitació',
    'Barcelona',
  ],
  openGraph: {
    title: 'Sobre Elena Kucherova | EKA Balance',
    description:
      'Especialista en integració somàtica i kinesiologia. Descobreix el mètode Elena Kucherova.',
    type: 'profile',
    images: [
      {
        url: 'https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg',
        width: 800,
        height: 800,
        alt: 'Elena Kucherova',
      },
    ],
  },
};

export default function AboutElenaPage() {
  return <AboutElenaContent />;
}
