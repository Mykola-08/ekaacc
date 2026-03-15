import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Bienestar para Madres y Padres | EKA Balance',
  description: 'Apoyo para el estrés, ansiedad y bienestar emocional en la crianza.',
};

export default function ParentsPage() {
  return <PersonaContent persona="parents" />;
}
