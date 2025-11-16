import { TierValidationService } from '../services/tier-validation-service';
import { getSubscriptionService } from '../services/subscription-service';
import type { VIPTier, LoyaltyTier, VIPTierDetails, LoyaltyTierDetails } from '../lib/subscription-types';

// Mock the subscription service
jest.mock('../services/subscription-service');

describe('TierValidationService', () => {
  let validationService: TierValidationService;
  let mockSubscriptionService: jest.Mocked<any>;

  beforeEach(() => {
    mockSubscriptionService = {
      getUserSubscriptions: jest.fn(),
      getUserSubscriptionSummary: jest.fn(),
      getActiveSubscription: jest.fn(),
      hasActiveSubscription: jest.fn(),
      getSubscriptionTiers: jest.fn(),
      getSubscriptionTier: jest.fn(),
      getSubscriptionUsage: jest.fn(),
      updateUsage: jest.fn(),
      createSubscription: jest.fn(),
      cancelSubscription: jest.fn(),
      renewSubscription: jest.fn(),
      grantSubscription: jest.fn(),
      revokeSubscription: jest.fn(),
      getAllSubscriptions: jest.fn(),
    };

    (getSubscriptionService as jest.Mock).mockResolvedValue(mockSubscriptionService);
    validationService = new TierValidationService(mockSubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateVIPTierEligibility', () => {
    const mockUserId = 'test-user-123';

    it('should validate VIP Silver tier eligibility successfully', async () => {
      // Mock user data for Silver tier eligibility
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 299.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 12,
            sessionsRemaining: 3,
            reportsGenerated: 2,
            storageUsedGB: 1.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateVIPTierEligibility(mockUserId, 'silver');

      expect(result.isValid).toBe(true);
      expect(result.requirementsMet).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
      expect(result.currentMetrics.totalSpend).toBeGreaterThan(0);
      expect(result.currentMetrics.totalSessions).toBe(12);
    });

    it('should reject VIP Gold tier when requirements are not met', async () => {
      // Mock user data that doesn't meet Gold requirements
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 99.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 3,
            sessionsRemaining: 12,
            reportsGenerated: 1,
            storageUsedGB: 0.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateVIPTierEligibility(mockUserId, 'gold');

      expect(result.isValid).toBe(false);
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements.length).toBeGreaterThan(0);
    });

    it('should validate VIP Platinum tier with invitation requirement', async () => {
      // Mock user data for Platinum tier
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 999.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 12 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 35,
            sessionsRemaining: -10, // unlimited
            reportsGenerated: 15,
            storageUsedGB: 45,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateVIPTierEligibility(mockUserId, 'platinum');

      expect(result.isValid).toBe(false); // Should fail due to invitation requirement
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements.length).toBeGreaterThan(0);
    });

    it('should handle invalid VIP tier name', async () => {
      const result = await validationService.validateVIPTierEligibility(mockUserId, 'invalid-tier' as VIPTier);
      
      expect(result.isValid).toBe(false);
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements).toContain('Invalid tier specified');
    });
  });

  describe('validateLoyaltyTierEligibility', () => {
    const mockUserId = 'test-user-456';

    it('should validate Loyalty Member tier eligibility successfully', async () => {
      // Mock user data for Member tier eligibility
      const mockSubscriptions = [
        {
          id: 'sub-loyalty-1',
          userId: mockUserId,
          type: 'loyalty',
          status: 'active',
          interval: 'monthly',
          price: 9.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: true,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: mockSubscriptions[0],
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          loyalty: {
            subscriptionId: 'sub-loyalty-1',
            userId: mockUserId,
            type: 'loyalty',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyaltyPointsEarned: 250,
            loyaltyPointsSpent: 50,
            loyaltyDiscountUsed: 15.5,
            themesUsed: ['default', 'ocean'],
            currentTheme: 'ocean',
            rewardsClaimed: [],
            totalRewardsValue: 0,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateLoyaltyTierEligibility(mockUserId, 'member');

      expect(result.isValid).toBe(true);
      expect(result.requirementsMet).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
      expect(result.currentMetrics.loyaltyPoints).toBe(250);
    });

    it('should validate Loyalty Elite tier eligibility successfully', async () => {
      // Mock user data for Elite tier eligibility
      const mockSubscriptions = [
        {
          id: 'sub-loyalty-1',
          userId: mockUserId,
          type: 'loyalty',
          status: 'active',
          interval: 'monthly',
          price: 9.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 8 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: true,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: mockSubscriptions[0],
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          loyalty: {
            subscriptionId: 'sub-loyalty-1',
            userId: mockUserId,
            type: 'loyalty',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyaltyPointsEarned: 1200,
            loyaltyPointsSpent: 300,
            loyaltyDiscountUsed: 45.5,
            themesUsed: ['default', 'ocean', 'forest'],
            currentTheme: 'forest',
            rewardsClaimed: [],
            totalRewardsValue: 0,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateLoyaltyTierEligibility(mockUserId, 'elite');

      expect(result.isValid).toBe(true);
      expect(result.requirementsMet).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
      expect(result.currentMetrics.loyaltyPoints).toBe(1200);
    });

    it('should reject Loyalty Elite tier when requirements are not met', async () => {
      // Mock user data that doesn't meet Elite requirements
      const mockSubscriptions = [
        {
          id: 'sub-loyalty-1',
          userId: mockUserId,
          type: 'loyalty',
          status: 'active',
          interval: 'monthly',
          price: 9.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: true,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: mockSubscriptions[0],
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          loyalty: {
            subscriptionId: 'sub-loyalty-1',
            userId: mockUserId,
            type: 'loyalty',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyaltyPointsEarned: 300,
            loyaltyPointsSpent: 100,
            loyaltyDiscountUsed: 10.5,
            themesUsed: ['default'],
            currentTheme: 'default',
            rewardsClaimed: [],
            totalRewardsValue: 0,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.validateLoyaltyTierEligibility(mockUserId, 'elite');

      expect(result.isValid).toBe(false);
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements.length).toBeGreaterThan(0);
    });

    it('should handle invalid Loyalty tier name', async () => {
      const result = await validationService.validateLoyaltyTierEligibility(mockUserId, 'invalid-tier' as LoyaltyTier);
      
      expect(result.isValid).toBe(false);
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements).toContain('Invalid tier specified');
    });
  });

  describe('canUpgradeToVIPTier', () => {
    const mockUserId = 'test-user-789';

    it('should allow upgrade from Silver to Gold when eligible', async () => {
      // Mock eligibility for Gold - need to meet Gold requirements: €500 spend, 20 sessions, 3 months, 2 referrals
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 799.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 25,
            sessionsRemaining: -10, // unlimited
            reportsGenerated: 8,
            storageUsedGB: 15,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.canUpgradeToVIPTier(mockUserId, 'silver', 'gold');

      expect(result).toBe(true);
    });

    it('should allow upgrade when no current tier exists', async () => {
      // Mock no current VIP tier but eligible for Silver - need €100 spend, 5 sessions, 1 month
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'basic',
          status: 'active',
          interval: 'monthly',
          price: 129.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sub-2',
          userId: mockUserId,
          type: 'basic',
          status: 'active',
          interval: 'monthly',
          price: 99.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          basic: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'basic',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 8,
            sessionsRemaining: 2,
            reportsGenerated: 1,
            storageUsedGB: 1.0,
            lastUpdated: new Date().toISOString(),
          },
          basic2: {
            subscriptionId: 'sub-2',
            userId: mockUserId,
            type: 'basic',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 12,
            sessionsRemaining: 3,
            reportsGenerated: 2,
            storageUsedGB: 1.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.canUpgradeToVIPTier(mockUserId, null, 'silver');

      expect(result).toBe(true);
    });
  });

  describe('canUpgradeToLoyaltyTier', () => {
    const mockUserId = 'test-user-456';

    it('should allow upgrade from Member to Elite when eligible', async () => {
      // Mock eligibility for Elite - need 1000 points, 3 months duration, 3 referrals
      const mockSubscriptions = [
        {
          id: 'sub-loyalty-1',
          userId: mockUserId,
          type: 'loyalty',
          status: 'active',
          interval: 'monthly',
          price: 9.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: true,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: mockSubscriptions[0],
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          loyalty: {
            subscriptionId: 'sub-loyalty-1',
            userId: mockUserId,
            type: 'loyalty',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyaltyPointsEarned: 1200,
            loyaltyPointsSpent: 200,
            loyaltyDiscountUsed: 30.5,
            themesUsed: ['default', 'ocean'],
            currentTheme: 'ocean',
            rewardsClaimed: [],
            totalRewardsValue: 0,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.canUpgradeToLoyaltyTier(mockUserId, 'member', 'elite');

      expect(result).toBe(true);
    });
  });

  describe('getVIPTierProgress', () => {
    const mockUserId = 'test-user-202';

    it('should calculate progress towards VIP Silver tier', async () => {
      // Mock user data showing partial progress - not meeting all Silver requirements
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'basic',
          status: 'active',
          interval: 'monthly',
          price: 49.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          basic: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'basic',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 2,
            sessionsRemaining: 3,
            reportsGenerated: 0,
            storageUsedGB: 0.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.getVIPTierProgress(mockUserId, 'silver');

      expect(result.progress).toBeGreaterThan(0);
      expect(result.progress).toBeLessThan(100);
      expect(Array.isArray(result.nextRequirements)).toBe(true);
      expect(result.nextRequirements.length).toBeGreaterThan(0);
    });

    it('should return 100% progress when tier requirements are met', async () => {
      // Mock user data meeting Silver requirements
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 299.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 15,
            sessionsRemaining: 0,
            reportsGenerated: 8,
            storageUsedGB: 4.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.getVIPTierProgress(mockUserId, 'silver');

      expect(result.progress).toBe(100);
      expect(result.nextRequirements).toHaveLength(0);
    });
  });

  describe('getLoyaltyTierProgress', () => {
    const mockUserId = 'test-user-303';

    it('should calculate progress towards Loyalty Elite tier', async () => {
      // Mock user data showing partial progress
      const mockSubscriptions = [
        {
          id: 'sub-loyalty-1',
          userId: mockUserId,
          type: 'loyalty',
          status: 'active',
          interval: 'monthly',
          price: 9.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: true,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: mockSubscriptions[0],
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          loyalty: {
            subscriptionId: 'sub-loyalty-1',
            userId: mockUserId,
            type: 'loyalty',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            loyaltyPointsEarned: 600,
            loyaltyPointsSpent: 150,
            loyaltyDiscountUsed: 25.5,
            themesUsed: ['default', 'ocean'],
            currentTheme: 'ocean',
            rewardsClaimed: [],
            totalRewardsValue: 0,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const result = await validationService.getLoyaltyTierProgress(mockUserId, 'elite');

      expect(result.progress).toBeGreaterThan(0);
      expect(result.progress).toBeLessThan(100);
      expect(Array.isArray(result.nextRequirements)).toBe(true);
      expect(result.nextRequirements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    const mockUserId = 'test-user-404';

    it('should handle service errors gracefully', async () => {
      mockSubscriptionService.getUserSubscriptions.mockRejectedValue(new Error('Service error'));

      await expect(
        validationService.validateVIPTierEligibility(mockUserId, 'silver')
      ).rejects.toThrow('Service error');
    });

    it('should handle missing subscription data', async () => {
      mockSubscriptionService.getUserSubscriptions.mockResolvedValue([]);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue({
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: false,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: null,
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {}
      });

      const result = await validationService.validateVIPTierEligibility(mockUserId, 'silver');

      expect(result.isValid).toBe(false);
      expect(result.requirementsMet).toBe(false);
      expect(result.missingRequirements.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Caching', () => {
    const mockUserId = 'test-user-505';

    it('should efficiently handle multiple validation calls', async () => {
      const mockSubscriptions = [
        {
          id: 'sub-1',
          userId: mockUserId,
          type: 'vip',
          status: 'active',
          interval: 'monthly',
          price: 299.99,
          currency: 'EUR',
          startDate: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];

      const mockSubscriptionSummary = {
        userId: mockUserId,
        hasLoyalty: false,
        hasVIP: true,
        hasBoth: false,
        loyaltySubscription: null,
        vipSubscription: mockSubscriptions[0],
        totalBenefits: {},
        combinedBadges: [],
        availableThemes: [],
        usageSummary: {
          vip: {
            subscriptionId: 'sub-1',
            userId: mockUserId,
            type: 'vip',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            sessionsUsed: 15,
            sessionsRemaining: 0,
            reportsGenerated: 8,
            storageUsedGB: 4.5,
            lastUpdated: new Date().toISOString(),
          }
        }
      };

      mockSubscriptionService.getUserSubscriptions.mockResolvedValue(mockSubscriptions);
      mockSubscriptionService.getUserSubscriptionSummary.mockResolvedValue(mockSubscriptionSummary);

      const startTime = Date.now();
      
      // Make multiple concurrent calls
      const results = await Promise.all([
        validationService.validateVIPTierEligibility(mockUserId, 'silver'),
        validationService.validateVIPTierEligibility(mockUserId, 'gold'),
        validationService.validateVIPTierEligibility(mockUserId, 'platinum'),
      ]);

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(results).toHaveLength(3);
      expect(totalTime).toBeLessThan(1000); // Should complete within 1 second
      expect(mockSubscriptionService.getUserSubscriptions).toHaveBeenCalledTimes(3);
    });
  });
});