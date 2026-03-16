import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GoalsPageClient } from './goals-client';

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: goals } = await supabase
    .from('goals')
    .select('id, title, description, category, progress_percentage, status, is_achieved, target_date, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <GoalsPageClient goals={goals ?? []} />;
}
