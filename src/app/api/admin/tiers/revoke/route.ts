import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/platform/supabase';

// Helper function to verify admin authentication and permissions
async function verifyAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No valid authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

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

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const { error: authError, user: adminUser } = await verifyAdminAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: authError === 'Insufficient permissions' ? 403 : 401 }
      );
    }

    const body = (await request.json()) as any;
    const { userId, tierType, tierName, reason } = body;

    // Validate required fields
    if (!userId || !tierType || !tierName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, tierType, and tierName are required' },
        { status: 400 }
      );
    }

    // Find the active tier to revoke
    const { data: existingTier, error: fetchError } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .eq('tier_type', tierType)
      .eq('tier_name', tierName)
      .eq('is_active', true)
      .single();

    if (fetchError || !existingTier) {
      return NextResponse.json({ error: 'Active tier not found for this user' }, { status: 404 });
    }

    // Revoke the tier
    const { error: revokeError } = await supabase
      .from('user_tiers')
      .update({
        is_active: false,
        deactivated_at: new Date().toISOString(),
        deactivation_reason: reason || 'Tier revoked by admin',
      })
      .eq('id', existingTier.id);

    if (revokeError) {
      console.error('Error revoking tier:', revokeError);
      return NextResponse.json({ error: 'Failed to revoke tier' }, { status: 500 });
    }

    // Create audit log
    const { error: auditError } = await supabase.from('tier_audit_logs').insert({
      user_id: userId,
      action: 'revoke',
      tier_type: tierType,
      tier_name: tierName,
      performed_by: adminUser!.id,
      reason: reason || 'Tier revoked by admin',
      timestamp: new Date().toISOString(),
      metadata: {
        admin_note: reason,
        previous_tier_id: existingTier.id,
        deactivation_reason: reason,
      },
    });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Don't fail the request if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: `Successfully revoked ${tierType} ${tierName} tier from user`,
      data: {
        tierId: existingTier.id,
        deactivatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Tier revocation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
