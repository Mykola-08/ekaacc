import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/platform/supabase';
import { getTierValidationService } from '@/services/tier-validation-service';
import type { VIPTier, LoyaltyTier } from '@/lib/platform/subscription-types';

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
    const { userId, tierType, tierName } = body;

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
    let progressResult;

    if (tierType === 'vip') {
      validationResult = await validationService.validateVIPTierEligibility(userId, tierName as VIPTier);
      progressResult = await validationService.getVIPTierProgress(userId, tierName as VIPTier);
    } else {
      validationResult = await validationService.validateLoyaltyTierEligibility(userId, tierName as LoyaltyTier);
      progressResult = await validationService.getLoyaltyTierProgress(userId, tierName as LoyaltyTier);
    }

    // Get current user tier information
    const { data: currentTiers } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    const currentVIPTier = currentTiers?.find(t => t.tier_type === 'vip');
    const currentLoyaltyTier = currentTiers?.find(t => t.tier_type === 'loyalty');

    return NextResponse.json({
      success: true,
      data: {
        isEligible: validationResult.isEligible,
        requirements: validationResult.missingRequirements,
        progress: progressResult.progress,
        nextRequirements: progressResult.nextRequirements,
        currentTiers: {
          vip: currentVIPTier?.tier_name || null,
          loyalty: currentLoyaltyTier?.tier_name || null
        },
        canUpgrade: validationResult.isEligible && (tierType === 'vip' ? 
          !currentVIPTier || currentVIPTier.tier_name !== tierName :
          !currentLoyaltyTier || currentLoyaltyTier.tier_name !== tierName
        )
      }
    });

  } catch (error) {
    console.error('Tier validation error:', error);
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

    // Get validation service
    const validationService = await getTierValidationService();

    // Validate eligibility for all tiers
    const vipValidations = await Promise.all([
      validationService.validateVIPTierEligibility(userId, 'silver'),
      validationService.validateVIPTierEligibility(userId, 'gold'),
      validationService.validateVIPTierEligibility(userId, 'platinum')
    ]);

    const loyaltyValidations = await Promise.all([
      validationService.validateLoyaltyTierEligibility(userId, 'member'),
      validationService.validateLoyaltyTierEligibility(userId, 'elite')
    ]);

    // Get progress for all tiers
    const vipProgress = await Promise.all([
      validationService.getVIPTierProgress(userId, 'silver'),
      validationService.getVIPTierProgress(userId, 'gold'),
      validationService.getVIPTierProgress(userId, 'platinum')
    ]);

    const loyaltyProgress = await Promise.all([
      validationService.getLoyaltyTierProgress(userId, 'member'),
      validationService.getLoyaltyTierProgress(userId, 'elite')
    ]);

    // Get current user tier information
    const { data: currentTiers } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    const currentVIPTier = currentTiers?.find(t => t.tier_type === 'vip');
    const currentLoyaltyTier = currentTiers?.find(t => t.tier_type === 'loyalty');

    return NextResponse.json({
      success: true,
      data: {
        vip: {
          silver: {
            isEligible: vipValidations[0].isEligible,
            requirements: vipValidations[0].missingRequirements,
            progress: vipProgress[0].progress,
            nextRequirements: vipProgress[0].nextRequirements,
            current: currentVIPTier?.tier_name === 'silver'
          },
          gold: {
            isEligible: vipValidations[1].isEligible,
            requirements: vipValidations[1].missingRequirements,
            progress: vipProgress[1].progress,
            nextRequirements: vipProgress[1].nextRequirements,
            current: currentVIPTier?.tier_name === 'gold'
          },
          platinum: {
            isEligible: vipValidations[2].isEligible,
            requirements: vipValidations[2].missingRequirements,
            progress: vipProgress[2].progress,
            nextRequirements: vipProgress[2].nextRequirements,
            current: currentVIPTier?.tier_name === 'platinum'
          }
        },
        loyalty: {
          member: {
            isEligible: loyaltyValidations[0].isEligible,
            requirements: loyaltyValidations[0].missingRequirements,
            progress: loyaltyProgress[0].progress,
            nextRequirements: loyaltyProgress[0].nextRequirements,
            current: currentLoyaltyTier?.tier_name === 'member'
          },
          elite: {
            isEligible: loyaltyValidations[1].isEligible,
            requirements: loyaltyValidations[1].missingRequirements,
            progress: loyaltyProgress[1].progress,
            nextRequirements: loyaltyProgress[1].nextRequirements,
            current: currentLoyaltyTier?.tier_name === 'elite'
          }
        }
      }
    });

  } catch (error) {
    console.error('Bulk tier validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}