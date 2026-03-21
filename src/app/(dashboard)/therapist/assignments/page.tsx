import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AssignmentManager } from './assignment-manager';

export default async function AssignmentManagerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Get therapist's profile id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  // Fetch assignments created by this therapist, join patient profile for name
  const { data: assignments } = await supabase
    .from('assignments')
    .select(
      'id, title, description, type, status, priority, due_date, created_at, patient_id, therapist_id, patient:patient_id(full_name)'
    )
    .eq('therapist_id', user.id)
    .order('created_at', { ascending: false });

  const normalizedAssignments = (assignments ?? []).map((assignment: any) => ({
    ...assignment,
    patient: Array.isArray(assignment.patient)
      ? (assignment.patient[0] ?? null)
      : assignment.patient,
  }));

  // Fetch patients (profiles with role = 'client' or 'patient') for the dropdown
  const { data: patients } = await supabase
    .from('profiles')
    .select('id, full_name, auth_id')
    .in('role', ['client', 'patient'])
    .order('full_name');

  return <AssignmentManager assignments={normalizedAssignments} patients={patients ?? []} />;
}
