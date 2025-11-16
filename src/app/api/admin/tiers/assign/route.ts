import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTierValidationService } from '@/services/tier-validation-service';
import type { VIPTier, LoyaltyTier } from '@/lib/subscription-types';

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

    const body = await request.json();
    const { userId, tierType, tierName, reason } = body;

    // Validate required fields
    if (!userId || !tierType || !tierName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, tierType, and tierName are required' },
        { status: 400 }
      );
    }

    // Validate tier type and name
    const validVIPTiers: VIPTier[] = ['silver', 'gold', 'platinum'];
    const validLoyaltyTiers: LoyaltyTier[] = ['member', 'elite'];

    if (tierType === 'vip' && !validVIPTiers.includes(tierName as VIPTier)) {
      return NextResponse.json(
        { error: 'Invalid VIP tier name. Must be one of: silver, gold, platinum' },
        { status: 400 }
      );
    }

    if (tierType === 'loyalty' && !validLoyaltyTiers.includes(tierName as LoyaltyTier)) {
      return NextResponse.json(
        { error: 'Invalid Loyalty tier name. Must be one of: member, elite' },
        { status: 400 }
      );
    }

    // Get validation service
    const validationService = await getTierValidationService();

    // Validate tier eligibility
    let validationResult;
    if (tierType === 'vip') {
      validationResult = await validationService.validateVIPTierEligibility(userId, tierName as VIPTier);
    } else {
      validationResult = await validationService.validateLoyaltyTierEligibility(userId, tierName as LoyaltyTier);
    }

    if (!validationResult.isEligible) {
      return NextResponse.json(
        { 
          error: 'User does not meet tier requirements',
          requirements: validationResult.requirements,
          progress: validationResult.progress
        },
        { status: 400 }
      );
    }

    // Check if user already has this tier
    const { data: existingTier } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .eq('tier_type', tierType)
      .eq('tier_name', tierName)
      .eq('is_active', true)
      .single();

    if (existingTier) {
      return NextResponse.json(
        { error: 'User already has this tier assigned' },
        { status: 400 }
      );
    }

    // Deactivate any existing tiers of the same type
    await supabase
      .from('user_tiers')
      .update({ is_active: false, deactivated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('tier_type', tierType)
      .eq('is_active', true);

    // Assign new tier
    const { data: newTier, error: tierError } = await supabase
      .from('user_tiers')
      .insert({
        user_id: userId,
        tier_type: tierType,
        tier_name: tierName,
        is_active: true,
        assigned_by: adminUser!.id,
        assigned_at: new Date().toISOString(),
        reason: reason || 'Tier assigned by admin'
      })
      .select()
      .single();

    if (tierError) {
      console.error('Error assigning tier:', tierError);
      return NextResponse.json(
        { error: 'Failed to assign tier' },
        { status: 500 }
      );
    }

    // Create audit log
    const { error: auditError } = await supabase
      .from('tier_audit_logs')
      .insert({
        user_id: userId,
        action: 'assign',
        tier_type: tierType,
        tier_name: tierName,
        performed_by: adminUser!.id,
        reason: reason || 'Tier assigned by admin',
        timestamp: new Date().toISOString(),
        metadata: {
          admin_note: reason,
          validation_passed: true,
          previous_tier: existingTier?.tier_name || null
        }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Don't fail the request if audit logging fails
    }

    return NextResponse.json({
      success: true,
      data: newTier,
      message: `Successfully assigned ${tierType} ${tierName} tier to user`
    });

  } catch (error) {
    console.error('Tier assignment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { error: authError, user: adminUser } = await verifyAdminAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: authError === 'Insufficient permissions' ? 403 : 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get user's current tiers
    const { data: tiers, error } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tiers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user tiers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tiers
    });

  } catch (error) {
    console.error('Fetch user tiers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}