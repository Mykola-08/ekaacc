import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/platform/supabase';

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
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const tierType = searchParams.get('tierType');
    const tierName = searchParams.get('tierName');
    const performedBy = searchParams.get('performedBy');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('tier_audit_logs')
      .select(`
        *,
        user:users!user_id(id, email, displayName),
        admin:users!performed_by(id, email, displayName)
      `)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (action) {
      query = query.eq('action', action);
    }

    if (tierType) {
      query = query.eq('tier_type', tierType);
    }

    if (tierName) {
      query = query.eq('tier_name', tierName);
    }

    if (performedBy) {
      query = query.eq('performed_by', performedBy);
    }

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    const { data: logs, error, count } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      );
    }

    // Get summary statistics
    const { data: stats } = await supabase
      .from('tier_audit_logs')
      .select('action', { count: 'exact' });

    const actionCounts = {
      assign: 0,
      revoke: 0,
      upgrade: 0,
      downgrade: 0
    };

    if (stats) {
      const { data: actionData } = await supabase
        .from('tier_audit_logs')
        .select('action', { count: 'exact' })
        .not('action', 'is', null);

      if (actionData) {
        const counts = actionData.reduce((acc, log) => {
          acc[log.action] = (acc[log.action] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        Object.assign(actionCounts, counts);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        logs: logs || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        },
        stats: {
          totalActions: count || 0,
          actionCounts
        }
      }
    });

  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const { error: authError } = await verifyAdminAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: authError === 'Insufficient permissions' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { logIds } = body;

    if (!Array.isArray(logIds) || logIds.length === 0) {
      return NextResponse.json(
        { error: 'logIds must be a non-empty array' },
        { status: 400 }
      );
    }

    // Delete audit logs (soft delete by marking as deleted)
    const { error: deleteError } = await supabase
      .from('tier_audit_logs')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .in('id', logIds);

    if (deleteError) {
      console.error('Error deleting audit logs:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete audit logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${logIds.length} audit log entries`,
      deletedCount: logIds.length
    });

  } catch (error) {
    console.error('Delete audit logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}