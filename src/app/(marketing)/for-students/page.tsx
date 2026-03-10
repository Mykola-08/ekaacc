import { Metadata } from 'next';
import ForStudentsContent from '@/marketing/components/ForStudentsContent';


export const metadata: Metadata = {
  title: 'Focus y Calma para Estudiantes | EKA Balance',
  description: 'Mejora tu concentración, reduce la ansiedad antes de exámenes y estudia mejor.',
};

export default function StudentsPage() {
  return <ForStudentsContent />;
}
