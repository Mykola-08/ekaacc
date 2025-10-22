/**
 * @file Wallet Service
 * @description Service for managing user wallets, transactions, and purchases.
 * Supports both mock data (for development) and Firestore (for production).
 */

import type {
  Wallet,
  WalletTransaction,
  Purchase,
  PurchasableItem,
  TransactionType,
  TransactionStatus,
  PurchaseStatus,
} from '@/lib/wallet-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Wallet Service Interface
 */
export interface IWalletService {
  // Wallet Management
  getWallet(userId: string): Promise<Wallet | null>;
  getBalance(userId: string): Promise<number>;
  pauseWallet(userId: string, reason: string): Promise<void>;
  unpauseWallet(userId: string): Promise<void>;
  
  // Transactions
  getTransactions(userId: string, limit?: number): Promise<WalletTransaction[]>;
  addCredit(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction>;
  deductAmount(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction>;
  
  // Purchases
  getPurchasableItems(): Promise<PurchasableItem[]>;
  getPurchases(userId: string): Promise<Purchase[]>;
  createPurchase(
    userId: string,
    itemId: string,
    quantity: number,
    discountPercentage?: number
  ): Promise<Purchase>;
  
  // Utility
  canAfford(userId: string, amount: number): Promise<boolean>;
  isWalletActive(userId: string): Promise<boolean>;
}

/**
 * Mock Wallet Service Implementation
 */
class MockWalletService implements IWalletService {
  private static instance: MockWalletService;
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, WalletTransaction[]> = new Map();
  private purchases: Map<string, Purchase[]> = new Map();
  private purchasableItems: PurchasableItem[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): MockWalletService {
    if (!MockWalletService.instance) {
      MockWalletService.instance = new MockWalletService();
    }
    return MockWalletService.instance;
  }

  private initializeMockData() {
    // Mock purchasable items
    this.purchasableItems = [
      {
        id: 'item_1',
        type: 'session',
        name: 'Individual Therapy Session',
        description: 'One-on-one therapy session with licensed therapist',
        price: 60,
        currency: 'EUR',
        isActive: true,
        metadata: {
          durationMinutes: 60,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item_2',
        type: 'package',
        name: '5 Session Package',
        description: 'Package of 5 therapy sessions with 10% discount',
        price: 270,
        currency: 'EUR',
        isActive: true,
        metadata: {
          sessionsIncluded: 5,
          durationMinutes: 60,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item_3',
        type: 'service',
        name: 'AI Therapy Report',
        description: 'Comprehensive AI-generated therapy progress report',
        price: 15,
        currency: 'EUR',
        isActive: true,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item_4',
        type: 'feature',
        name: 'Premium Exercises Library',
        description: 'Access to advanced therapeutic exercises for 1 month',
        price: 20,
        currency: 'EUR',
        isActive: true,
        metadata: {
          features: ['Advanced exercises', 'Video guides', 'Progress tracking'],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private getOrCreateWallet(userId: string): Wallet {
    if (!this.wallets.has(userId)) {
      const wallet: Wallet = {
        id: userId,
        userId,
        balance: 100, // Start with 100 EUR for testing
        currency: 'EUR',
        isActive: true,
        isPaused: false,
        totalCredits: 100,
        totalDebits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.wallets.set(userId, wallet);
      
      // Create initial transaction
      const initialTx: WalletTransaction = {
        id: `tx_${Date.now()}_1`,
        userId,
        type: 'credit',
        amount: 100,
        balanceAfter: 100,
        status: 'completed',
        description: 'Welcome bonus',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.transactions.set(userId, [initialTx]);
    }
    return this.wallets.get(userId)!;
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    return this.getOrCreateWallet(userId);
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = this.getOrCreateWallet(userId);
    return wallet.balance;
  }

  async pauseWallet(userId: string, reason: string): Promise<void> {
    const wallet = this.getOrCreateWallet(userId);
    wallet.isPaused = true;
    wallet.pauseReason = reason;
    wallet.updatedAt = new Date().toISOString();
  }

  async unpauseWallet(userId: string): Promise<void> {
    const wallet = this.getOrCreateWallet(userId);
    wallet.isPaused = false;
    wallet.pauseReason = undefined;
    wallet.updatedAt = new Date().toISOString();
  }

  async getTransactions(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const txs = this.transactions.get(userId) || [];
    return txs.slice(0, limit);
  }

  async addCredit(
    userId: string,
    amount: number,
    description: string,
    metadata?: any
  ): Promise<WalletTransaction> {
    const wallet = this.getOrCreateWallet(userId);
    
    if (wallet.isPaused) {
      throw new Error('Wallet is paused');
    }

    wallet.balance += amount;
    wallet.totalCredits += amount;
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();

    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'credit',
      amount,
      balanceAfter: wallet.balance,
      status: 'completed',
      description,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userTxs = this.transactions.get(userId) || [];
    this.transactions.set(userId, [transaction, ...userTxs]);

    return transaction;
  }

  async deductAmount(
    userId: string,
    amount: number,
    description: string,
    metadata?: any
  ): Promise<WalletTransaction> {
    const wallet = this.getOrCreateWallet(userId);
    
    if (wallet.isPaused) {
      throw new Error('Wallet is paused');
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    wallet.balance -= amount;
    wallet.totalDebits += amount;
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();

    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'debit',
      amount: -amount, // Negative for debit
      balanceAfter: wallet.balance,
      status: 'completed',
      description,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userTxs = this.transactions.get(userId) || [];
    this.transactions.set(userId, [transaction, ...userTxs]);

    return transaction;
  }

  async getPurchasableItems(): Promise<PurchasableItem[]> {
    return this.purchasableItems.filter(item => item.isActive);
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
    const wallet = this.getOrCreateWallet(userId);
    const item = this.purchasableItems.find(i => i.id === itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    if (!item.isActive) {
      throw new Error('Item is not available for purchase');
    }

    const totalPrice = item.price * quantity;
    const discountAmount = totalPrice * (discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    if (wallet.balance < finalPrice) {
      throw new Error('Insufficient balance');
    }

    // Deduct from wallet
    await this.deductAmount(userId, finalPrice, `Purchase: ${item.name}`, {
      itemId,
      itemName: item.name,
      quantity,
    });

    // Create purchase record
    const purchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: 'Mock User', // Would come from user service
      itemId,
      itemType: item.type,
      itemName: item.name,
      quantity,
      unitPrice: item.price,
      totalPrice,
      discountApplied: discountPercentage,
      finalPrice,
      currency: 'EUR',
      status: 'completed',
      paymentMethod: 'wallet',
      isFulfilled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userPurchases = this.purchases.get(userId) || [];
    this.purchases.set(userId, [purchase, ...userPurchases]);

    return purchase;
  }

  async canAfford(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance >= amount;
  }

  async isWalletActive(userId: string): Promise<boolean> {
    const wallet = this.getOrCreateWallet(userId);
    return wallet.isActive && !wallet.isPaused;
  }
}

/**
 * Firestore Wallet Service Implementation
 */
class FirestoreWalletService implements IWalletService {
  private static instance: FirestoreWalletService;

  private constructor() {}

  static getInstance(): FirestoreWalletService {
    if (!FirestoreWalletService.instance) {
      FirestoreWalletService.instance = new FirestoreWalletService();
    }
    return FirestoreWalletService.instance;
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
      return null;
    }

    const data = walletSnap.data();
    return {
      ...data,
      id: walletSnap.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      lastTransactionAt: data.lastTransactionAt?.toDate?.()?.toISOString() || data.lastTransactionAt,
    } as Wallet;
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.getWallet(userId);
    return wallet?.balance || 0;
  }

  async pauseWallet(userId: string, reason: string): Promise<void> {
    const { getFirestore, doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    const db = getFirestore();
    const walletRef = doc(db, 'wallets', userId);
    
    await updateDoc(walletRef, {
      isPaused: true,
      pauseReason: reason,
      updatedAt: serverTimestamp(),
    });
  }

  async unpauseWallet(userId: string): Promise<void> {
    const { getFirestore, doc, updateDoc, serverTimestamp, deleteField } = await import('firebase/firestore');
    const db = getFirestore();
    const walletRef = doc(db, 'wallets', userId);
    
    await updateDoc(walletRef, {
      isPaused: false,
      pauseReason: deleteField(),
      updatedAt: serverTimestamp(),
    });
  }

  async getTransactions(userId: string, limit: number = 50): Promise<WalletTransaction[]> {
    const { getFirestore, collection, query, where, orderBy, limit: fbLimit, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const txRef = collection(db, 'wallets', userId, 'transactions');
    const q = query(txRef, orderBy('createdAt', 'desc'), fbLimit(limit));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    } as WalletTransaction));
  }

  async addCredit(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production
    // For now, throwing error to prevent direct manipulation
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async deductAmount(userId: string, amount: number, description: string, metadata?: any): Promise<WalletTransaction> {
    // This should be done via Cloud Function in production
    throw new Error('Direct wallet modification not allowed. Use Cloud Functions or admin interface.');
  }

  async getPurchasableItems(): Promise<PurchasableItem[]> {
    const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const itemsRef = collection(db, 'purchasableItems');
    const q = query(itemsRef, where('isActive', '==', true));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    } as PurchasableItem));
  }

  async getPurchases(userId: string): Promise<Purchase[]> {
    const { getFirestore, collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
    const db = getFirestore();
    const purchasesRef = collection(db, 'purchases');
    const q = query(purchasesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      fulfilledAt: doc.data().fulfilledAt?.toDate?.()?.toISOString() || doc.data().fulfilledAt,
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
 * Get the active wallet service implementation
 */
export async function getWalletService(): Promise<IWalletService> {
  if (USE_MOCK_DATA) {
    return MockWalletService.getInstance();
  } else {
    return FirestoreWalletService.getInstance();
  }
}

// Export default for convenience
const walletService = USE_MOCK_DATA
  ? MockWalletService.getInstance()
  : FirestoreWalletService.getInstance();

export default walletService;
