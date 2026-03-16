import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AssignmentsPageClient } from './assignments-client';

export default async function AssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, description, status, due_date, created_at')
    .eq('patient_id', user.id)
    .order('created_at', { ascending: false });

  return <AssignmentsPageClient assignments={assignments ?? []} />;
}
