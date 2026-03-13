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
    <div className="px-4 py-8 md:px-8">
      <div className="">
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">Availability</h2>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your schedule and availability for client sessions.
        </p>
      </div>
      <AvailabilityManager />
    </div>
  );
}
