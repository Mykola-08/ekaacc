import { createClient } from '@/lib/platform/supabase/server';
import { redirect } from 'next/navigation';
import { ProgressContentHeadless as ProgressContent } from '@/components/platform/progress/progress-content-headless';
import type { Report } from '@/lib/platform/types/types';

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth-portal');
  }

  let reports: Report[] = [];
  try {
    const { data, error } = await supabase.from('reports').select('*').eq('userId', user.id);
    if (data) {
      reports = data as unknown as Report[];
    } else if (error) {
      console.warn('Could not fetch reports:', error.message);
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
  }

  return <ProgressContent reports={reports} />;
}
