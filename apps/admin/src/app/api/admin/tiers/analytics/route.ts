import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to verify admin authentication and permissions
async function verifyAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No valid authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }

  // Check if user has admin role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!userRole || userRole.role !== 'Admin') {
    return { error: 'Insufficient permissions', user };
  }

  return { error: null, user };
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { error: authError } = await verifyAdminAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: authError === 'Insufficient permissions' ? 403 : 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter = startDate && endDate ? 
      `assigned_at.gte.${startDate},assigned_at.lte.${endDate}` : 
      '';

    // Get tier distribution
    const { data: tierDistribution, error: tierError } = await (supabase
      .from('user_tiers')
      .select('tier_type, tier_name, count(*)')
      .eq('is_active', true) as any)
      .group('tier_type, tier_name');

    if (tierError) {
      console.error('Error fetching tier distribution:', tierError);
      return NextResponse.json(
        { error: 'Failed to fetch tier distribution' },
        { status: 500 }
      );
    }

    // Get recent tier assignments
    const { data: recentAssignments, error: recentError } = await supabase
      .from('tier_audit_logs')
      .select(`
        *,
        user:users!user_id(id, email, displayName),
        admin:users!performed_by(id, email, displayName)
      `)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('Error fetching recent assignments:', recentError);
      return NextResponse.json(
        { error: 'Failed to fetch recent assignments' },
        { status: 500 }
      );
    }

    // Get tier activity by date
    const { data: activityByDate, error: activityError } = await (supabase
      .from('tier_audit_logs')
      .select('action, timestamp::date, count(*)')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) as any)
      .group('action, timestamp::date')
      .order('timestamp::date', { ascending: false });

    if (activityError) {
      console.error('Error fetching activity by date:', activityError);
      return NextResponse.json(
        { error: 'Failed to fetch activity by date' },
        { status: 500 }
      );
    }

    // Get total tier users
    const { count: totalTierUsers, error: countError } = await supabase
      .from('user_tiers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      console.error('Error fetching total tier users:', countError);
      return NextResponse.json(
        { error: 'Failed to fetch total tier users' },
        { status: 500 }
      );
    }

    // Get action statistics
    const { data: actionStats, error: statsError } = await (supabase
      .from('tier_audit_logs')
      .select('action, count(*)') as any)
      .group('action');

    if (statsError) {
      console.error('Error fetching action statistics:', statsError);
      return NextResponse.json(
        { error: 'Failed to fetch action statistics' },
        { status: 500 }
      );
    }

    // Process the data for dashboard
    const processedData = {
      overview: {
        totalTierUsers: totalTierUsers || 0,
        totalVipUsers: tierDistribution?.filter((t: any) => t.tier_type === 'vip').reduce((sum: number, t: any) => sum + parseInt(t.count), 0) || 0,
        totalLoyaltyUsers: tierDistribution?.filter((t: any) => t.tier_type === 'loyalty').reduce((sum: number, t: any) => sum + parseInt(t.count), 0) || 0,
        recentActivity: recentAssignments?.length || 0
      },
      tierDistribution: {
        vip: {
          silver: tierDistribution?.find((t: any) => t.tier_type === 'vip' && t.tier_name === 'silver')?.count || 0,
          gold: tierDistribution?.find((t: any) => t.tier_type === 'vip' && t.tier_name === 'gold')?.count || 0,
          platinum: tierDistribution?.find((t: any) => t.tier_type === 'vip' && t.tier_name === 'platinum')?.count || 0
        },
        loyalty: {
          member: tierDistribution?.find((t: any) => t.tier_type === 'loyalty' && t.tier_name === 'member')?.count || 0,
          elite: tierDistribution?.find((t: any) => t.tier_type === 'loyalty' && t.tier_name === 'elite')?.count || 0
        }
      },
      activityStats: {
        totalActions: actionStats?.reduce((sum: number, stat: any) => sum + parseInt(stat.count), 0) || 0,
        assignCount: actionStats?.find((s: any) => s.action === 'assign')?.count || 0,
        revokeCount: actionStats?.find((s: any) => s.action === 'revoke')?.count || 0,
        upgradeCount: actionStats?.find((s: any) => s.action === 'upgrade')?.count || 0,
        downgradeCount: actionStats?.find((s: any) => s.action === 'downgrade')?.count || 0
      },
      recentActivity: recentAssignments || [],
      activityByDate: activityByDate?.map((item: any) => ({
        date: item.timestamp,
        action: item.action,
        count: parseInt(item.count)
      })) || []
    };

    return NextResponse.json({
      success: true,
      data: processedData
    });

  } catch (error) {
    console.error('Tier analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}