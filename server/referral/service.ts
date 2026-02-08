import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

export class ReferralService {
  async createReferralCode(userId: string, customCode?: string) {
    const supabase = await createClient();
    const code = customCode || nanoid(8).toUpperCase(); // Simple 8 char code

    const { data, error } = await supabase
      .from('referral_code')
      .insert({
        code: code,
        owner_id: userId,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReferralCode(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('referral_code')
      .select('*')
      .eq('owner_id', userId)
      .single();
    return data;
  }

  async validateCode(code: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('referral_code')
      .select('owner_id, is_active')
      .eq('code', code)
      .single();

    if (!data || !data.is_active) return null;
    return data;
  }

  async trackReferralRegistration(code: string, newUserId: string) {
    const supabase = await createClient();

    // Validate code
    const refData = await this.validateCode(code);
    if (!refData) throw new Error('Invalid code');

    if (refData.owner_id === newUserId) throw new Error('Cannot refer self');

    // Record usage
    const { error } = await supabase.from('referral_usage').insert({
      code: code,
      referred_user_id: newUserId,
      status: 'pending', // Waiting for first booking
    });

    if (error) throw error;
  }

  async completeReferral(referralId: string) {
    // Called when the new user completes their first booking
    // Triggers rewards via LoyaltyService
  }
}
