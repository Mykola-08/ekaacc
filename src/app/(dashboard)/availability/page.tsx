import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AvailabilityManager } from '@/components/dashboard/widgets/AvailabilityManager';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-700 md:px-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Availability</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Manage your schedule and availability for client sessions.
        </p>
      </div>
      <AvailabilityManager />
    </div>
  );
}
