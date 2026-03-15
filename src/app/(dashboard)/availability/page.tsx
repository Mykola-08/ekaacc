import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AvailabilityManager } from '@/components/dashboard/widgets/AvailabilityManager';

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex-1 space-y-4">
      <AvailabilityManager />
    </div>
  );
}
