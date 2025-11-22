/**
 * @file Referral Service Tests
 * @description Unit tests for the Referral Service
 */

import { getReferralService } from '../services/referral-service';

describe('ReferralService', () => {
  let referralService: any;

  beforeEach(async () => {
    // Using mock data mode for testing
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
    referralService = await getReferralService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReferralSettings', () => {
    it('should retrieve referral settings', async () => {
      const settings = await referralService.getReferralSettings();
      expect(settings).toBeDefined();
      expect(settings).toHaveProperty('isEnabled');
      expect(settings).toHaveProperty('referrerRewardAmount');
      expect(settings).toHaveProperty('refereeRewardAmount');
      expect(typeof settings.isEnabled).toBe('boolean');
    });

    it('should have valid reward amounts', async () => {
      const settings = await referralService.getReferralSettings();
      expect(typeof settings.referrerRewardAmount).toBe('number');
      expect(typeof settings.refereeRewardAmount).toBe('number');
      expect(settings.referrerRewardAmount).toBeGreaterThan(0);
      expect(settings.refereeRewardAmount).toBeGreaterThan(0);
    });
  });

  describe('generateReferralCode', () => {
    it('should generate a referral code for a user', async () => {
      const code = await referralService.generateReferralCode('user-123', 'Test User');
      expect(code).toBeDefined();
      expect(code).toHaveProperty('code');
      expect(code).toHaveProperty('userId');
      expect(code.userId).toBe('user-123');
      expect(typeof code.code).toBe('string');
      expect(code.code.length).toBeGreaterThan(0);
    });

    it('should generate different codes for different users', async () => {
      const code1 = await referralService.generateReferralCode('user-1', 'User One');
      const code2 = await referralService.generateReferralCode('user-2', 'User Two');
      
      expect(code1.code).not.toBe(code2.code);
      expect(code1.userId).not.toBe(code2.userId);
    });
  });

  describe('getReferralCode', () => {
    it('should retrieve referral code for a user', async () => {
      // First generate a code
      const generated = await referralService.generateReferralCode('user-456', 'User 456');
      
      // Then retrieve it
      const retrieved = await referralService.getReferralCode('user-456');
      expect(retrieved).toBeDefined();
      expect(retrieved?.code).toBe(generated.code);
    });

    it('should return null for user without referral code', async () => {
      const code = await referralService.getReferralCode('non-existent-user-xyz');
      expect(code).toBeNull();
    });
  });

  describe('validateReferralCode', () => {
    it('should validate a valid referral code', async () => {
      const generated = await referralService.generateReferralCode('user-789', 'User 789');
      
      const validation = await referralService.validateReferralCode(generated.code);
      expect(validation).toBeDefined();
      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject an invalid referral code', async () => {
      const validation = await referralService.validateReferralCode('INVALID-CODE-XYZ');
      expect(validation).toBeDefined();
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });
  });

  describe('getUserReferrals', () => {
    it('should retrieve user referrals', async () => {
      const referrals = await referralService.getUserReferrals('user-123');
      expect(Array.isArray(referrals)).toBe(true);
    });

    it('should return empty array for user with no referrals', async () => {
      const referrals = await referralService.getUserReferrals('brand-new-user-xyz');
      expect(referrals).toEqual([]);
    });
  });

  describe('getReferralStats', () => {
    it('should retrieve referral statistics', async () => {
      const stats = await referralService.getReferralStats('user-123');
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('totalReferrals');
      expect(stats).toHaveProperty('completedReferrals');
      expect(stats).toHaveProperty('pendingReferrals');
      expect(stats).toHaveProperty('totalRewardsEarned');
      expect(stats).toHaveProperty('totalPointsEarned');
      
      expect(typeof stats.totalReferrals).toBe('number');
      expect(typeof stats.completedReferrals).toBe('number');
      expect(typeof stats.pendingReferrals).toBe('number');
      expect(typeof stats.totalRewardsEarned).toBe('number');
      expect(typeof stats.totalPointsEarned).toBe('number');
    });

    it('should have non-negative statistics', async () => {
      const stats = await referralService.getReferralStats('user-123');
      expect(stats.totalReferrals).toBeGreaterThanOrEqual(0);
      expect(stats.completedReferrals).toBeGreaterThanOrEqual(0);
      expect(stats.pendingReferrals).toBeGreaterThanOrEqual(0);
      expect(stats.totalRewardsEarned).toBeGreaterThanOrEqual(0);
      expect(stats.totalPointsEarned).toBeGreaterThanOrEqual(0);
    });
  });
});
