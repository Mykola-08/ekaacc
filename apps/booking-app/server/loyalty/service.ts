
import { createClient } from '@/lib/supabase/server';

export type RewardTransactionType = 'earned_booking' | 'earned_referral' | 'redeemed_booking' | 'adjustment' | 'expired';

export class LoyaltyService {
  
  async getBalance(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('user_rewards_balance')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    return data || { current_points: 0, lifetime_points: 0 };
  }

  async addPoints(userId: string, points: number, type: RewardTransactionType, referenceId?: string, description?: string) {
    const supabase = await createClient();
    
    // 1. Log transaction
    const { error: txError } = await supabase
      .from('reward_transaction')
      .insert({
        user_id: userId,
        amount: points,
        transaction_type: type,
        reference_id: referenceId,
        description: description
      });

    if (txError) throw txError;

    // 2. Update balance
    // This assumes a trigger or simple increment. For safety, we use rpc or careful updates.
    // Ideally this is a Postgres function for atomicity.
    const { error: balError } = await supabase.rpc('increment_points', {
      p_user_id: userId,
      p_amount: points
    });

    // Fallback if RPC doesn't exist (need to create it in migration)
    if (balError) {
      // Manual fetch-update (less safe concurrently)
      const balance = await this.getBalance(userId);
      await supabase.from('user_rewards_balance').upsert({
        user_id: userId,
        current_points: balance.current_points + points,
        lifetime_points: balance.lifetime_points + (points > 0 ? points : 0)
      });
    }
  }

  async redeemPoints(userId: string, points: number, referenceBookingId: string) {
    const balance = await this.getBalance(userId);
    if (balance.current_points < points) {
      throw new Error('Insufficient points');
    }

    return this.addPoints(userId, -points, 'redeemed_booking', referenceBookingId, 'Redeemed for booking discount');
  }
}
