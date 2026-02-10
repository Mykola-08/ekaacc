import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ClientDashboard } from '@/components/dashboard/client/ClientDashboard';
import { AdminDashboard } from '@/components/dashboard/admin/AdminDashboard';
import { TherapistDashboard } from '@/components/dashboard/therapist/TherapistDashboard';
import { getAvailablePlans } from '@/server/plans/actions';
import { createAdminClient } from '@/lib/supabase/admin';
import { LoadingSpinner } from '@/components/ui/loading-states';

export const dynamic = 'force-dynamic';

/**
 * Unified Dashboard Home — /dashboard
 *
 * Single entry point for all authenticated users.
 * Renders role-specific content:
 *   - Admin / Super Admin → AdminDashboard
 *   - Therapist → TherapistDashboard
 *   - Client (default) → ClientDashboard
 *
 * The sidebar (UnifiedSidebar) already shows/hides navigation
 * based on the user's permissions, so the user naturally only
 * sees the pages relevant to their role.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const profile = user.user_metadata;
  const role = (profile.role || 'client').toLowerCase();

  // ── Admin ─────────────────────────────────────────────────────
  if (role === 'admin' || role === 'super_admin') {
    const { data: stats } = await supabase.rpc('get_admin_kpi_stats');
    return <AdminDashboard profile={profile} stats={stats} />;
  }

  // ── Therapist ─────────────────────────────────────────────────
  if (role === 'therapist') {
    return <TherapistDashboard profile={profile} userId={user.id} />;
  }

  // ── Client (default) ─────────────────────────────────────────
  const clientData = await fetchClientData(supabase, user.id);

  return (
    <ClientDashboard
      profile={profile}
      {...clientData}
    />
  );
}

/** Fetch all client-specific data in parallel for better performance */
async function fetchClientData(supabase: any, userId: string) {
  const admin = createAdminClient();

  const [
    { data: wallet },
    { data: activeUsage },
    { data: bookings },
    { data: goals },
    plans,
    { data: recentErrors },
  ] = await Promise.all([
    supabase.from('wallets').select('*').eq('user_id', userId).single(),
    supabase
      .from('user_plan_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('expires_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('booking')
      .select('*, service:service_id(name)')
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(1),
    supabase
      .from('wellness_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active'),
    getAvailablePlans(),
    admin
      .from('app_error_reports')
      .select('id, created_at, level, message, route')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    wallet,
    nextBooking: bookings?.[0] || null,
    activeUsage,
    goals,
    plans,
    recentErrors: recentErrors ?? [],
  };
}
