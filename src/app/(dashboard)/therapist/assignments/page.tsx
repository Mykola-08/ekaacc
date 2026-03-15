import { createClient } from '@/lib/supabase/server';
import { AssignmentManager } from './assignment-manager';

export default async function AssignmentManagerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch assignments created by this therapist
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*, profiles:user_id(full_name)')
    .eq('assigned_by', user?.id)
    .order('created_at', { ascending: false });

  // Fetch patients for the Create Assignment dropdown
  const { data: patients } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'patient')
    .order('full_name');

  return (
    <AssignmentManager
      assignments={assignments || []}
      patients={patients || []}
    />
  );
}
