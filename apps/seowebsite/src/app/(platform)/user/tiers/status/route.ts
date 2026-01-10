import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/platform/supabase';
import { getTierValidationService } from '@/services/tier-validation-service';
import type { VIPTier, LoyaltyTier } from '@/lib/platform/subscription-types';

// Helper function to verify user authentication
async function verifyUserAccess(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'No valid authorization header', user: null };
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }

  return { error: null, user };
}

export async function GET(request: NextRequest) {
  try {
    // Verify user access
    const { error: authError, user } = await verifyUserAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = user!.id; // Use the authenticated user's ID

    // Get user's current tiers
    const { data: currentTiers, error: tierError } = await supabase
      .from('user_tiers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (tierError) {
      console.error('Error fetching user tiers:', tierError);
      return NextResponse.json(
        { error: 'Failed to fetch user tiers' },
        { status: 500 }
      );
    }

    const currentVIPTier = currentTiers?.find(t => t.tier_type === 'vip');
    const currentLoyaltyTier = currentTiers?.find(t => t.tier_type === 'loyalty');

    // Get validation service
    const validationService = await getTierValidationService();

    // Get progress for next tier levels
    let nextVIPTierProgress = null;
    let nextLoyaltyTierProgress = null;

    if (currentVIPTier) {
      const currentTier = currentVIPTier.tier_name as VIPTier;
      if (currentTier === 'silver') {
        nextVIPTierProgress = await validationService.getVIPTierProgress(userId, 'gold');
      } else if (currentTier === 'gold') {
        nextVIPTierProgress = await validationService.getVIPTierProgress(userId, 'platinum');
      }
    } else {
      // No VIP tier, show progress to silver
      nextVIPTierProgress = await validationService.getVIPTierProgress(userId, 'silver');
    }

    if (currentLoyaltyTier) {
      const currentTier = currentLoyaltyTier.tier_name as LoyaltyTier;
      if (currentTier === 'member') {
        nextLoyaltyTierProgress = await validationService.getLoyaltyTierProgress(userId, 'elite');
      }
    } else {
      // No loyalty tier, show progress to member
      nextLoyaltyTierProgress = await validationService.getLoyaltyTierProgress(userId, 'member');
    }

    // Get tier history
    const { data: tierHistory, error: historyError } = await supabase
      .from('tier_audit_logs')
      .select(`
        *,
        admin:users!performed_by(id, email, displayName)
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (historyError) {
      console.error('Error fetching tier history:', historyError);
      // Don't fail the request if history fetch fails
    }

    // Get user benefits usage (mock data for now)
    const usageData = {
      vip: {
        sessionsUsed: 0,
        sessionsRemaining: 0,
        sessionsLimit: 0,
        supportRequests: 0,
        storageUsed: 0,
        storageLimit: 0
      },
      loyalty: {
        pointsEarned: 0,
        pointsMultiplier: 1.0,
        discountUsed: 0,
        discountAvailable: 0
      }
    };

    // Populate usage data based on current tiers
    if (currentVIPTier) {
      const tierName = currentVIPTier.tier_name;
      if (tierName === 'silver') {
        usageData.vip.sessionsLimit = 15;
        usageData.vip.storageLimit = 10;
      } else if (tierName === 'gold') {
        usageData.vip.sessionsLimit = -1; // unlimited
        usageData.vip.storageLimit = 50;
      } else if (tierName === 'platinum') {
        usageData.vip.sessionsLimit = -1; // unlimited
        usageData.vip.storageLimit = -1; // unlimited
      }
    }

    if (currentLoyaltyTier) {
      const tierName = currentLoyaltyTier.tier_name;
      if (tierName === 'member') {
        usageData.loyalty.pointsMultiplier = 1.5;
        usageData.loyalty.discountAvailable = 5;
      } else if (tierName === 'elite') {
        usageData.loyalty.pointsMultiplier = 3.0;
        usageData.loyalty.discountAvailable = 15;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        currentTiers: {
          vip: currentVIPTier ? {
            tier: currentVIPTier.tier_name,
            assignedAt: currentVIPTier.assigned_at,
            expiresAt: null // Add expiration logic if needed
          } : null,
          loyalty: currentLoyaltyTier ? {
            tier: currentLoyaltyTier.tier_name,
            assignedAt: currentLoyaltyTier.assigned_at,
            expiresAt: null // Add expiration logic if needed
          } : null
        },
        nextTierProgress: {
          vip: nextVIPTierProgress,
          loyalty: nextLoyaltyTierProgress
        },
        usage: usageData,
        history: tierHistory || [],
        benefits: {
          hasPriorityBooking: !!currentVIPTier,
          hasDedicatedSupport: !!currentVIPTier,
          hasExclusiveContent: !!currentVIPTier,
          hasEarlyAccess: currentVIPTier?.tier_name === 'gold' || currentVIPTier?.tier_name === 'platinum',
          hasCustomFeatures: currentVIPTier?.tier_name === 'platinum',
          hasWhiteLabel: currentVIPTier?.tier_name === 'platinum',
          pointsMultiplier: usageData.loyalty.pointsMultiplier,
          discountPercentage: usageData.loyalty.discountAvailable
        }
      }
    });

  } catch (error) {
    console.error('User tier status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user access
    const { error: authError, user } = await verifyUserAccess(request);
    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetTierType, targetTierName } = body;

    if (!targetTierType || !targetTierName) {
      return NextResponse.json(
        { error: 'targetTierType and targetTierName are required' },
        { status: 400 }
      );
    }

    const userId = user!.id;
    const validationService = await getTierValidationService();

    // Validate if user can upgrade to the target tier
    let validationResult;
    if (targetTierType === 'vip') {
      validationResult = await validationService.validateVIPTierEligibility(userId, targetTierName as VIPTier);
    } else {
      validationResult = await validationService.validateLoyaltyTierEligibility(userId, targetTierName as LoyaltyTier);
    }

    if (!validationResult.isEligible) {
      return NextResponse.json({
        success: false,
        data: {
          canUpgrade: false,
          reason: 'User does not meet tier requirements',
          requirements: validationResult.missingRequirements,
          progress: validationResult.progress
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        canUpgrade: true,
        requirements: validationResult.missingRequirements,
        progress: validationResult.progress
      }
    });

  } catch (error) {
    console.error('Tier upgrade check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}