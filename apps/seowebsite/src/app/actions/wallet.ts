'use server';

import { walletService } from '@/lib/platform/services/wallet-service';
import { billingService } from '@/lib/platform/services/billing-service';
import { createClient } from '@/lib/platform/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWalletBalanceAction() {
  const supabase = await createClient();
  const { data: { user } } = await (supabase.auth as any).getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const balance = await walletService.getBalance(user.id);
    return { success: true, balance };
  } catch (error) {
    return { error: 'Failed to fetch balance' };
  }
}

export async function createWalletTopUpIntentAction(amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await (supabase.auth as any).getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  try {
    const intent = await billingService.createWalletTopUpIntent(user.id, amount);
    return { success: true, clientSecret: intent.clientSecret };
  } catch (error) {
    console.error('Top-up intent creation failed:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create top-up intent' };
  }
}

export type Transaction = {
  id: string;
  created_at: string;
  type: 'wallet' | 'plan_credit';
  amount: number;
  description: string;
  status: string;
};

export async function getClientTransactions() {
  const supabase = await createClient(); // Use custom client wrapper here to match file context
  const { data: { user } } = await (supabase.auth as any).getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.rpc('get_client_transactions', {
    p_user_id: user.id,
    p_limit: 50
  });

  if (error) {
    console.error('Transaction History Error:', error);
    return [];
  }

  return data as Transaction[];
}
