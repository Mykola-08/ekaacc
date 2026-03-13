import { Metadata } from 'next';
import ServicesContent from '@/marketing/components/ServicesContent';

export const metadata: Metadata = {
  title: 'Serveis i Teràpies Somàtiques | EKA Balance',
  description:
    "Teràpies integratives per a l'equilibri físic i emocional: Movement Lesson, JKA, Kinesiologia, i més.",
  keywords: [
    'Teràpies Somàtiques',
    'Serveis',
    'EKA Balance',
    'Benestar',
    'Integració',
    'Movement Lesson',
    'JKA',
  ],
  openGraph: {
    title: 'Serveis i Teràpies Somàtiques | EKA Balance',
    description: 'Descobreix els nostres serveis de benestar integratiu.',
    type: 'website',
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
