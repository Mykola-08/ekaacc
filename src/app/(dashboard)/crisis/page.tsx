import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CrisisPageContent } from '@/components/dashboard/shared/CrisisPageContent';

export default async function CrisisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <CrisisPageContent />;
}
