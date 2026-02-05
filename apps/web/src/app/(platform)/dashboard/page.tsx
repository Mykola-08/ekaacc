import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ClientDashboard } from '@/components/dashboard/client/ClientDashboard';
import { AdminDashboard } from '@/components/dashboard/admin/AdminDashboard';
import { TherapistDashboard } from '@/components/dashboard/therapist/TherapistDashboard';
import { getAvailablePlans } from '@/server/plans/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const profile = user.user_metadata;
  const role = profile.role || 'client';

  if (role === 'admin' || role === 'super_admin') {
    const { data: stats } = await supabase.rpc('get_admin_kpi_stats');
    return <AdminDashboard profile={profile} stats={stats} />;
  }

  if (role === 'therapist') {
    return <TherapistDashboard profile={profile} userId={user.id} />;
  }

  // Client Data Fetching
  const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();

  // Active Plan Usage
  const { data: activeUsage } = await supabase
    .from('user_plan_usage')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();

  // Next Booking
  const { data: bookings } = await supabase
    .from('booking')
    .select('*, service:service_id(name)')
    .eq('user_id', user.id)
    .eq('status', 'confirmed')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(1);

  const nextBooking = bookings?.[0] || null;

  // Goals (New)
  const { data: goals } = await supabase.from('wellness_goals').select('*').eq('user_id', user.id).eq('status', 'active');

  // Plans for marketplace
  const plans = await getAvailablePlans();

  return (
    <ClientDashboard
      profile={profile}
      wallet={wallet}
      nextBooking={nextBooking}
      activeUsage={activeUsage}
      goals={goals}
      plans={plans}
    />
  );
}
