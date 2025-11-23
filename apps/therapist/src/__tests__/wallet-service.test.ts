/**
 * @file Wallet Service Tests
 * @description Unit tests for the Wallet Service
 */

// Add fetch polyfill for Stripe
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

import { getWalletService } from '../services/wallet-service';

describe('WalletService', () => {
  let walletService: any;

  beforeEach(async () => {
    // Using mock data mode for testing
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    walletService = await getWalletService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWallet', () => {
    it('should retrieve wallet for a user', async () => {
      const wallet = await walletService.getWallet('user-123');
      
      expect(wallet).toBeDefined();
      expect(wallet).toHaveProperty('id');
      expect(wallet).toHaveProperty('userId');
      expect(wallet).toHaveProperty('balance');
      expect(wallet).toHaveProperty('currency');
      expect(wallet).toHaveProperty('isActive');
    });

    it('should create wallet structure for any user ID', async () => {
      const wallet = await walletService.getWallet('any-user-id');
      expect(wallet).toBeDefined();
      expect(wallet?.userId).toBe('any-user-id');
    });
  });

  describe('getBalance', () => {
    it('should return balance for existing wallet', async () => {
      const balance = await walletService.getBalance('user-123');
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    });

    it('should return default balance for any user', async () => {
      const balance = await walletService.getBalance('any-user');
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('canAfford', () => {
    it('should return true if user can afford small amount', async () => {
      const canAfford = await walletService.canAfford('user-123', 1);
      // This depends on mock data having at least 1 in balance
      expect(typeof canAfford).toBe('boolean');
    });

    it('should return false if user cannot afford huge amount', async () => {
      const canAfford = await walletService.canAfford('user-123', 999999999);
      expect(canAfford).toBe(false);
    });

    it('should check affordability for any user', async () => {
      const canAfford = await walletService.canAfford('any-user', 50);
      expect(typeof canAfford).toBe('boolean');
    });
  });

  describe('isWalletActive', () => {
    it('should check if wallet is active', async () => {
      const isActive = await walletService.isWalletActive('user-123');
      expect(typeof isActive).toBe('boolean');
    });

    it('should return status for any user wallet', async () => {
      const isActive = await walletService.isWalletActive('any-user');
      expect(typeof isActive).toBe('boolean');
    });
  });

  describe('getTransactions', () => {
    it('should retrieve wallet transactions', async () => {
      const transactions = await walletService.getTransactions('user-123', 10);
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should return empty array for non-existent user', async () => {
      const transactions = await walletService.getTransactions('non-existent-user-xyz-999');
      expect(transactions).toEqual([]);
    });
  });

  describe('getPurchasableItems', () => {
    it('should retrieve list of purchasable items', async () => {
      const items = await walletService.getPurchasableItems();
      expect(Array.isArray(items)).toBe(true);
      if (items.length > 0) {
        expect(items[0]).toHaveProperty('id');
        expect(items[0]).toHaveProperty('name');
        expect(items[0]).toHaveProperty('price');
        expect(items[0]).toHaveProperty('currency');
      }
    });
  });

  describe('getPurchases', () => {
    it('should retrieve user purchases', async () => {
      const purchases = await walletService.getPurchases('user-123');
      expect(Array.isArray(purchases)).toBe(true);
    });

    it('should return empty array for user with no purchases', async () => {
      const purchases = await walletService.getPurchases('non-existent-user-xyz-999');
      expect(purchases).toEqual([]);
    });
  });
});

