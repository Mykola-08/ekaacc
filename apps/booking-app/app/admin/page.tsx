import { getTherapistDailySchedule } from '@/server/dashboard/service';
import { createClient } from '@/lib/supabase/server';
import { TherapistDashboard } from '@/components/dashboard/TherapistDashboard';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_id', user.id)
      .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'therapist')) {
      // Strictly speaking, layout.tsx should handle auth, but good to be safe.
      // If layout handles it, we might be fine, but we need profile.id for the service call.
      return <div>Unauthorized</div>;
  }

  const todaySchedule = await getTherapistDailySchedule(profile.id);

  return (
    <div className="space-y-6">
        {/* We can wrap it or just render it. TherapistDashboard has its own container. 
            Inside the admin layout (which has padding), we might want to remove 'max-w-4xl mx-auto' 
            OR keep it to center content. Keeping it maintains consistency.
        */}
        <TherapistDashboard schedule={todaySchedule} />
    </div>
  );
}
