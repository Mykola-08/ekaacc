'use server';

import { walletService } from '@/lib/platform/services/wallet-service';
import { billingService } from '@/lib/platform/services/billing-service';
import { createClient } from '@/lib/platform/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWalletBalanceAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await (supabase.auth as any).getUser();

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
  const {
    data: { user },
  } = await (supabase.auth as any).getUser();

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await (supabase.auth as any).getUser();

  if (!user) throw new Error('Not authenticated');

  // Look up user's wallet first, then query transactions by wallet_id
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!wallet) return [];

  const { data: walletTxns, error: walletError } = await supabase
    .from('wallet_transactions')
    .select('id, created_at, type, amount, description')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (walletError) {
    console.error('Transaction History Error:', walletError);
    return [];
  }

  return (walletTxns || []).map((t: any) => ({
    id: t.id,
    created_at: t.created_at,
    type: 'wallet' as const,
    amount: Number(t.amount),
    description: t.description,
    status: 'completed',
  })) as Transaction[];
}
