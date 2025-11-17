/**
 * @file Wallet Service - Supabase Implementation
 * @description Service for managing user wallets and transactions using Supabase.
 * Replaces Firebase Firestore with Supabase for production-grade backend integration.
 */

import type { Wallet, WalletTransaction, PurchasableItem, Purchase } from '@/lib/wallet-types';
import { supabase, supabaseAdmin } from '@/lib/supabase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Wallet Service Interface
 */
export interface IWalletService {
  getWallet(userId: string): Promise<Wallet | null>;
  getBalance(userId: string): Promise<number>;
  pauseWallet(userId: string, reason: string): Promise<void>;
  unpauseWallet(userId: string): Promise<void>;
  getTransactions(userId: string, limit?: number): Promise<WalletTransaction[]>;
  addCredit(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction>;
  deductAmount(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction>;
  getPurchasableItems(): Promise<PurchasableItem[]>;
  getPurchases(userId: string): Promise<Purchase[]>;
  createPurchase(userId: string, itemId: string, quantity?: number, discountPercentage?: number): Promise<Purchase>;
  canAfford(userId: string, amount: number): Promise<boolean>;
  isWalletActive(userId: string): Promise<boolean>;
}

/**
 * Supabase Wallet Service Implementation
 */
class SupabaseWalletService implements IWalletService {
  private static instance: SupabaseWalletService;

  static getInstance(): SupabaseWalletService {
    if (!SupabaseWalletService.instance) {
      SupabaseWalletService.instance = new SupabaseWalletService();
    }
    return SupabaseWalletService.instance;
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      balance: data.balance,
      currency: data.currency,
      isActive: data.is_active,
      isPaused: data.is_paused,
      pauseReason: data.pause_reason,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastTransactionAt: data.last_transaction_at,
    } as Wallet;
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet?.balance || 0;
  }

  async pauseWallet(userId: string, reason: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('wallets')
      .update({ 
        is_paused: true,
        pause_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to pause wallet: ${error.message}`);
    }
  }

  async unpauseWallet(userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('wallets')
      .update({ 
        is_paused: false,
        pause_reason: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to unpause wallet: ${error.message}`);
    }
  }

  async getTransactions(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get wallet transactions: ${error.message}`);
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      type: item.type,
      amount: item.amount,
      balanceAfter: item.balance_after ?? 0,
      status: item.status,
      description: item.description,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    } as WalletTransaction));
  }

  async addCredit(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async deductAmount(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async getPurchasableItems(): Promise<PurchasableItem[]> {
    const { data, error } = await supabase
      .from('purchasable_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to get purchasable items: ${error.message}`);
    }

    return (data || []).map(item => ({
      id: item.id,
      type: item.type ?? item.category ?? 'session',
      name: item.name,
      description: item.description,
      price: item.price,
      currency: item.currency,
      isActive: item.is_active,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    } as PurchasableItem));
  }

  async getPurchases(userId: string): Promise<Purchase[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get purchases: ${error.message}`);
    }

    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name ?? '',
      itemId: item.item_id,
      itemType: item.item_type ?? 'session',
      itemName: item.item_name ?? '',
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.total_amount,
      discountApplied: item.discount_percentage ?? 0,
      finalPrice: item.total_amount,
      currency: item.currency,
      status: item.status,
      paymentMethod: 'wallet',
      transactionId: item.transaction_id ?? undefined,
      metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
      isFulfilled: !!item.fulfilled_at,
      fulfilledAt: item.fulfilled_at ?? undefined,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    } as Purchase));
  }

  async createPurchase(
    userId: string,
    itemId: string,
    quantity: number = 1,
    discountPercentage: number = 0
  ): Promise<Purchase> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Purchase creation must be done via Cloud Functions to ensure wallet transaction integrity.');
  }

  async canAfford(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }

  async isWalletActive(userId: string): Promise<boolean> {
    const wallet = await this.getWallet(userId);
    return wallet ? wallet.isActive && !wallet.isPaused : false;
  }
}

/**
 * Mock Wallet Service Implementation
 */
class MockWalletService implements IWalletService {
  private static instance: MockWalletService;
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, WalletTransaction[]> = new Map();
  private purchasableItems: PurchasableItem[] = [
    {
      id: 'item-1',
      name: 'Therapy Session',
      description: 'One therapy session credit',
      price: 50,
      currency: 'EUR',
      type: 'session',
      isActive: true,
      metadata: {
        category: 'session',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'item-2',
      name: 'Premium Session',
      description: 'Premium therapy session with extended time',
      price: 80,
      currency: 'EUR',
      type: 'session',
      isActive: true,
      metadata: {
        category: 'session',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  private purchases: Map<string, Purchase[]> = new Map();

  static getInstance(): MockWalletService {
    if (!MockWalletService.instance) {
      MockWalletService.instance = new MockWalletService();
    }
    return MockWalletService.instance;
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    return this.wallets.get(userId) || {
      id: `wallet-${userId}`,
      userId,
      balance: 100,
      currency: 'EUR',
      isActive: true,
      isPaused: false,
      totalCredits: 0,
      totalDebits: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTransactionAt: new Date().toISOString(),
    };
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet?.balance || 0;
  }

  async pauseWallet(userId: string, reason: string): Promise<void> {
    const wallet = await this.getWallet(userId);
    if (wallet) {
      wallet.isPaused = true;
      wallet.pauseReason = reason;
      wallet.updatedAt = new Date().toISOString();
      this.wallets.set(userId, wallet);
    }
  }

  async unpauseWallet(userId: string): Promise<void> {
    const wallet = await this.getWallet(userId);
    if (wallet) {
      wallet.isPaused = false;
      wallet.pauseReason = undefined;
      wallet.updatedAt = new Date().toISOString();
      this.wallets.set(userId, wallet);
    }
  }

  async getTransactions(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const userTransactions = this.transactions.get(userId) || [];
    return userTransactions.slice(0, limit);
  }

  async addCredit(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async deductAmount(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async getPurchasableItems(): Promise<PurchasableItem[]> {
    return this.purchasableItems;
  }

  async getPurchases(userId: string): Promise<Purchase[]> {
    return this.purchases.get(userId) || [];
  }

  async createPurchase(
    userId: string,
    itemId: string,
    quantity: number = 1,
    discountPercentage: number = 0
  ): Promise<Purchase> {
    // This should be done via Cloud Function in production to ensure transaction integrity
    throw new Error('Purchase creation must be done via Cloud Functions to ensure wallet transaction integrity.');
  }

  async canAfford(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }

  async isWalletActive(userId: string): Promise<boolean> {
    const wallet = await this.getWallet(userId);
    return wallet ? wallet.isActive && !wallet.isPaused : false;
  }
}

/**
 * Get the active wallet service implementation
 */
export async function getWalletService(): Promise<IWalletService> {
  if (USE_MOCK_DATA) {
    return MockWalletService.getInstance();
  } else {
    return SupabaseWalletService.getInstance();
  }
}

// Export default for convenience
const walletService = USE_MOCK_DATA
  ? MockWalletService.getInstance()
  : SupabaseWalletService.getInstance();

export default walletService;
