import { ClinicalNotes } from '@/components/admin/patients/ClinicalNotes';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  return <ClinicalNotes userId={id} />;
}
