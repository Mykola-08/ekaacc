// Wallet Service - User Balance Management
import { supabaseAdmin } from '@/lib/platform/supabase';

export interface Wallet {
  balance: number;
  credits: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export const walletService = {
  getBalance: async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error || !data) return 0;
      return data.balance || 0;
    } catch {
      return 0;
    }
  },

  processStripeTopUp: async (
    userId: string,
    credits: number,
    paymentIntentId: string,
    _amount: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Record the transaction
      // Look up wallet to get wallet_id for the transaction
      const { data: wallet } = await supabaseAdmin
        .from('wallets')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      const { error: txError } = await supabaseAdmin.from('wallet_transactions').insert({
        wallet_id: wallet.id,
        amount: credits,
        type: 'credit',
        stripe_payment_intent_id: paymentIntentId,
        description: 'Stripe top-up',
      });

      if (txError) {
        return { success: false, error: txError.message };
      }

      // Update wallet balance
      const { error: walletError } = await supabaseAdmin.rpc('increment_wallet_balance', {
        p_user_id: userId,
        p_amount: credits,
      });

      if (walletError) {
        console.error('Error updating wallet:', walletError);
        // Transaction recorded but balance update failed
        return { success: false, error: 'Balance update failed' };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: message };
    }
  },

  getWallet: async (userId: string): Promise<Wallet> => {
    try {
      const { data, error } = await supabaseAdmin
        .from('wallets')
        .select('balance, credits')
        .eq('user_id', userId)
        .single();

      if (error || !data) return { balance: 0, credits: 0 };
      return { balance: data.balance || 0, credits: data.credits || 0 };
    } catch {
      return { balance: 0, credits: 0 };
    }
  },

  getTransactions: async (userId: string, limit: number = 10): Promise<Transaction[]> => {
    try {
      // Look up wallet first, then query transactions by wallet_id
      const { data: wallet } = await supabaseAdmin
        .from('wallets')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!wallet) return [];

      const { data, error } = await supabaseAdmin
        .from('wallet_transactions')
        .select('id, amount, type, description, created_at')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return [];
      return (data || []) as Transaction[];
    } catch {
      return [];
    }
  },
};

export const getWalletService = async () => walletService;
