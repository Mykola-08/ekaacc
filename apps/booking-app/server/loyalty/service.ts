
import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

export type RewardTransactionType = 'earned_booking' | 'earned_referral' | 'redeemed_booking' | 'redeemed_reward' | 'adjustment' | 'expired';

export class LoyaltyService {
  private client: SupabaseClient | null = null;

  constructor(client?: SupabaseClient) {
    if (client) this.client = client;
  }

  private async getClient() {
    if (this.client) return this.client;
    return await createClient();
  }
  
  async getBalance(userId: string) {
    const supabase = await this.getClient();
    const { data } = await supabase
      .from('user_rewards_balance')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    return data || { current_points: 0, lifetime_points: 0 };
  }

  async addPoints(userId: string, points: number, type: RewardTransactionType, referenceId?: string, description?: string) {
    const supabase = await this.getClient();
    
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
        current_points: (balance.current_points || 0) + points,
        lifetime_points: (balance.lifetime_points || 0) + (points > 0 ? points : 0)
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

  async redeemReward(userId: string, rewardId: string) {
    const supabase = await this.getClient();
    
    // 1. Get Reward Cost
    const { data: reward } = await supabase
      .from('service')
      .select('name, metadata')
      .eq('id', rewardId)
      .single();
      
    if (!reward || !reward.metadata?.point_cost) {
      throw new Error('Invalid reward');
    }
    
    const cost = reward.metadata.point_cost;

    // 2. Check Balance
    const balance = await this.getBalance(userId);
    if ((balance.current_points || 0) < cost) {
      throw new Error('Insufficient points');
    }

    // 3. Deduct Points & Log
    await this.addPoints(
        userId, 
        -cost, 
        'redeemed_reward', 
        rewardId, 
        `Redeemed: ${reward.name}`
    );
    
    return { success: true, remaining_points: (balance.current_points || 0) - cost };
  }
}
