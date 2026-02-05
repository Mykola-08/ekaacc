// Tier Validation Service - VIP & Loyalty Tier Validation
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface TierEligibility {
  isEligible: boolean;
  missingRequirements: string[];
  progress: Record<string, number>;
}

export interface TierProgress {
  progress: number;
  nextRequirements: string[];
}

const tierValidationService = {
  validate: async (args: { userId: string; tierId: string }): Promise<ValidationResult> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_tiers')
        .select('tier_id, expires_at')
        .eq('user_id', args.userId)
        .eq('tier_id', args.tierId)
        .single();

      if (error || !data) {
        return { valid: false, reason: 'Tier not assigned' };
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, reason: 'Tier expired' };
      }

      return { valid: true };
    } catch {
      return { valid: false, reason: 'Validation error' };
    }
  },

  assignTier: async (args: { userId: string; tierId: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabaseAdmin
        .from('user_tiers')
        .upsert(
          {
            user_id: args.userId,
            tier_id: args.tierId,
            assigned_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,tier_id' }
        );

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },

  validateVIPTierEligibility: async (
    userId: string,
    tier: string | { id: string; requirements?: Record<string, number> }
  ): Promise<TierEligibility> => {
    try {
      const tierObj = typeof tier === 'string' ? { id: tier } : tier;
      // Get user stats for VIP validation
      const { data: stats } = await supabaseAdmin
        .from('user_stats')
        .select('total_spent, sessions_completed, referrals')
        .eq('user_id', userId)
        .single();

      if (!stats || !tierObj.requirements) {
        return { isEligible: true, missingRequirements: [], progress: {} };
      }

      const missing: string[] = [];
      const progress: Record<string, number> = {};

      for (const [key, required] of Object.entries(tierObj.requirements)) {
        const current = (stats as Record<string, number>)[key] || 0;
        progress[key] = Math.min(100, (current / required) * 100);
        if (current < required) {
          missing.push(`${key}: ${current}/${required}`);
        }
      }

      return {
        isEligible: missing.length === 0,
        missingRequirements: missing,
        progress,
      };
    } catch {
      return { isEligible: false, missingRequirements: ['Error checking eligibility'], progress: {} };
    }
  },

  validateLoyaltyTierEligibility: async (
    userId: string,
    tier: string | { id: string; points_required?: number }
  ): Promise<TierEligibility> => {
    try {
      const tierObj = typeof tier === 'string' ? { id: tier } : tier;
      const { data: loyalty } = await supabaseAdmin
        .from('loyalty_points')
        .select('points')
        .eq('user_id', userId)
        .single();

      const currentPoints = loyalty?.points || 0;
      const required = tierObj.points_required || 0;

      return {
        isEligible: currentPoints >= required,
        missingRequirements: currentPoints < required ? [`${required - currentPoints} more points needed`] : [],
        progress: { points: Math.min(100, (currentPoints / required) * 100) },
      };
    } catch {
      return { isEligible: false, missingRequirements: ['Error checking eligibility'], progress: {} };
    }
  },

  getVIPTierProgress: async (
    userId: string,
    tier: string | { id: string; requirements?: Record<string, number> }
  ): Promise<TierProgress> => {
    const eligibility = await tierValidationService.validateVIPTierEligibility(userId, tier);
    const avgProgress = Object.values(eligibility.progress).reduce((a, b) => a + b, 0) /
      Math.max(1, Object.values(eligibility.progress).length);

    return {
      progress: avgProgress,
      nextRequirements: eligibility.missingRequirements,
    };
  },

  getLoyaltyTierProgress: async (
    userId: string,
    tier: string | { id: string; points_required?: number }
  ): Promise<TierProgress> => {
    const eligibility = await tierValidationService.validateLoyaltyTierEligibility(userId, tier);

    return {
      progress: eligibility.progress.points || 0,
      nextRequirements: eligibility.missingRequirements,
    };
  },
};

export const getTierValidationService = async () => tierValidationService;
