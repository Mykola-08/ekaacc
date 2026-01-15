
import { createClient } from '@/lib/supabase/server';

export class WalletService {

  async getBalance(userId: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('user_wallet')
      .select('balance_cents, currency')
      .eq('user_id', userId)
      .single();
      
    return data?.balance_cents || 0;
  }

  /**
   * Process a purchase using Wallet Balance
   */
  async processWalletPayment(userId: string, amountCents: number, referenceId: string, description: string) {
    const supabase = await createClient();
    
    // 1. Check Balance
    const balance = await this.getBalance(userId);
    if (balance < amountCents) {
      throw new Error('Insufficient wallet balance');
    }

    // 2. Transact (Debit)
    // In production, use RPC for atomicity similar to loyalty
    const { error } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount_cents: -amountCents, // Negative for spend
        type: 'purchase',
        reference_id: referenceId,
        description: description
      });
      
    if (error) throw error;

    // 3. Update Balance
    // Assuming trivial update here, normally use RPC/Trigger
    const { error: updateError } = await supabase
      .from('user_wallet')
      .update({ balance_cents: balance - amountCents })
      .eq('user_id', userId);

    if (updateError) throw updateError;
    
    return true;
  }

  /**
   * Top Up Wallet (usually called after Stripe success)
   */
  async topUpWallet(userId: string, amountCents: number, source: string, referenceId: string) {
    const supabase = await createClient();
    
    // 1. Transact (Credit)
    await supabase.from('wallet_transactions').insert({
      user_id: userId,
      amount_cents: amountCents,
      type: 'deposit',
      reference_id: referenceId,
      description: `Top up via ${source}`
    });

    // 2. Update Balance
    const balance = await this.getBalance(userId);
    await supabase
      .from('user_wallet')
      .upsert({ 
        user_id: userId, 
        balance_cents: balance + amountCents 
      });
  }
}
