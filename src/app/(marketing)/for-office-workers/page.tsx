import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Bienestar para Oficinistas - Ergonomía y Salud | EKA Balance',
  description:
    'Soluciones personalizadas y corporativas para aliviar el dolor de espalda, reducir el estrés, y mejorar la postura en el trabajo y la oficina.',
  keywords:
    'bienestar para oficinistas, ergonomía, dolor de espalda, salud corporativa, office worker wellness, corporate health, postura, stress laboral',
  openGraph: {
    title: 'Bienestar para Oficinistas | EKA Balance',
    description:
      'Soluciones personalizadas y corporativas para aliviar el dolor de espalda, reducir el estrés, y mejorar la postura en el trabajo.',
    type: 'website',
    url: 'https://ekabalance.com/for-office-workers',
  },
};

export default function OfficeWorkersPage() {
  return <PersonaContent persona="office-workers" />;
}
