import { Metadata } from 'next';
import CasosContent from '@/marketing/components/CasosContent';

export const metadata: Metadata = {
  title: 'Casos Frecuentes | EKA Balance',
  description:
    'Descubre cómo ayudamos a resolver problemas comunes como dolor de espalda, estrés, ansiedad, migrañas y más.',
};

export default function CasosPage() {
  return <CasosContent />;
}
