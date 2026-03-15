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
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <AvailabilityManager />
      </div>
    </div>
  );
}
