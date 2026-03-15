import { Metadata } from 'next';
import PersonaContent from '@/marketing/components/PersonaContent';

export const metadata: Metadata = {
  title: 'Focus y Calma para Estudiantes | EKA Balance',
  description: 'Mejora tu concentración, reduce la ansiedad antes de exámenes y estudia mejor.',
};

export default function StudentsPage() {
  return <PersonaContent persona="students" />;
}
