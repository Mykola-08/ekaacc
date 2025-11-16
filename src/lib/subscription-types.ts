// Subscription and theme management types

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionType = 'loyalty' | 'vip';
export type VIPTier = 'silver' | 'gold' | 'platinum';
export type LoyaltyTier = 'member' | 'elite';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due';
export type SubscriptionInterval = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  interval: SubscriptionInterval;
  
  // Pricing
  price: number; // Monthly or yearly price
  currency: string;
  
  // Stripe integration
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripePriceId?: string;
  
  // Dates
  startDate: Date | Timestamp | string;
  endDate: Date | Timestamp | string;
  cancelledAt?: Date | Timestamp | string;
  trialEndDate?: Date | Timestamp | string;
  
  // Billing
  currentPeriodStart: Date | Timestamp | string;
  currentPeriodEnd: Date | Timestamp | string;
  cancelAtPeriodEnd: boolean;
  
  // Metadata
  createdAt: Date | Timestamp | string;
  updatedAt: Date | Timestamp | string;
  createdBy?: string; // User or Admin ID
  notes?: string; // Admin notes
}

export interface SubscriptionTier {
  id: string;
  type: SubscriptionType;
  name: string;
  displayName: string;
  description: string;
  
  // Pricing
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  
  // Stripe IDs
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  stripeProductId?: string;
  
  // Benefits
  benefits: string[];
  features: SubscriptionFeatures;
  
  // Display
  badge: SubscriptionBadge;
  color: string; // Primary color for this tier
  icon?: string;
  
  // Settings
  isActive: boolean;
  order: number; // Display order
  popularBadge?: boolean; // Show "Most Popular" badge
  
  createdAt: Date | Timestamp | string;
  updatedAt: Date | Timestamp | string;
}

export interface VIPTierDetails extends SubscriptionTier {
  vipLevel: VIPTier;
  requirements?: {
    minimumSpend?: number;
    minimumSessions?: number;
    minimumDuration?: number; // months
    invitationOnly?: boolean;
  };
  privileges: {
    priorityBooking: boolean;
    dedicatedSupport: boolean;
    exclusiveContent: boolean;
    earlyAccess: boolean;
    customFeatures: boolean;
    whiteLabel: boolean;
  };
  limits: {
    maxSessionsPerMonth: number;
    maxGroupSessions: number;
    maxReports: number;
    maxStorageGB: number;
  };
}

export interface LoyaltyTierDetails extends SubscriptionTier {
  loyaltyLevel: LoyaltyTier;
  pointsMultiplier: number;
  discountPercentage: number;
  rewards: {
    birthdayBonus: boolean;
    referralBonus: number;
    milestoneRewards: boolean;
    exclusiveEvents: boolean;
  };
  requirements?: {
    minimumPoints?: number;
    minimumDuration?: number; // months
    referralCount?: number;
  };
}

export interface SubscriptionFeatures {
  // Loyalty Program Benefits
  loyaltyPointsMultiplier?: number; // 1.5x, 2x, etc.
  loyaltyDiscountPercentage?: number; // Additional discount on top of tier
  prioritySupport?: boolean;
  
  // VIP Benefits
  unlimitedSessions?: boolean;
  sessionLimit?: number; // Max sessions per month
  personalTherapist?: boolean;
  groupSessions?: boolean;
  aiInsightsAdvanced?: boolean;
  monthlyReports?: boolean;
  
  // Design & Themes
  customThemes?: boolean;
  premiumThemes?: string[]; // Array of theme IDs
  themeCount?: number; // Number of themes unlocked
  
  // Content Access
  exclusiveContent?: boolean;
  exerciseLibraryFull?: boolean;
  communityAccess?: boolean;
  vipEvents?: boolean;
  
  // Other Features
  earlyAccess?: boolean; // New features
  adFree?: boolean;
  dataExport?: boolean;
  customBranding?: boolean;
}

export interface SubscriptionBadge {
  text: string; // "LOYAL", "VIP", "PREMIUM"
  bgColor: string; // Tailwind class or hex
  textColor: string;
  icon?: string; // Icon name
  gradient?: boolean;
  pulse?: boolean; // Animated pulse effect
}

export interface SubscriptionUsage {
  subscriptionId: string;
  userId: string;
  type: SubscriptionType;
  
  // Usage tracking
  currentPeriodStart: Date | Timestamp | string;
  currentPeriodEnd: Date | Timestamp | string;
  
  // Loyalty usage
  loyaltyPointsEarned?: number;
  loyaltyPointsSpent?: number;
  loyaltyDiscountUsed?: number; // Total EUR saved
  
  // VIP usage
  sessionsUsed?: number;
  sessionsRemaining?: number;
  personalTherapistAssigned?: boolean;
  groupSessionsAttended?: number;
  reportsGenerated?: number;
  
  // Theme usage
  themesUsed?: string[]; // Array of theme IDs used
  currentTheme?: string;
  
  // Rewards claimed
  rewardsClaimed?: SubscriptionReward[];
  totalRewardsValue?: number;
  
  lastUpdated: Date | Timestamp | string;
}

export interface VIPTierUsage {
  subscriptionId: string;
  userId: string;
  vipLevel: VIPTier;
  
  // Session tracking
  sessionsUsedThisMonth: number;
  sessionsRemainingThisMonth: number;
  totalSessionsUsed: number;
  
  // Group sessions
  groupSessionsAttended: number;
  groupSessionsRemaining: number;
  
  // Reports and insights
  reportsGenerated: number;
  reportsRemaining: number;
  aiInsightsUsed: number;
  
  // Storage usage
  storageUsedGB: number;
  storageLimitGB: number;
  
  // Support interactions
  supportTickets: number;
  supportPriority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Feature usage
  featuresUsed: {
    personalTherapist: boolean;
    customBranding: boolean;
    whiteLabel: boolean;
    apiAccess: boolean;
  };
  
  // Progress tracking
  milestonesAchieved: string[];
  achievements: string[];
  
  lastActivity: Date | Timestamp | string;
  lastUpdated: Date | Timestamp | string;
}

export interface LoyaltyTierUsage {
  subscriptionId: string;
  userId: string;
  loyaltyLevel: LoyaltyTier;
  
  // Points tracking
  totalPointsEarned: number;
  totalPointsSpent: number;
  currentPointsBalance: number;
  pointsMultiplier: number;
  
  // Discount tracking
  totalDiscountsReceived: number;
  discountPercentage: number;
  
  // Referral tracking
  referralsMade: number;
  successfulReferrals: number;
  referralRewards: number;
  
  // Activity tracking
  loginStreak: number;
  longestStreak: number;
  lastLoginDate: Date | Timestamp | string;
  
  // Reward tracking
  rewardsClaimed: number;
  rewardsValue: number;
  milestoneRewards: string[];
  
  // Event participation
  eventsAttended: number;
  exclusiveEvents: string[];
  
  // Anniversary and birthday tracking
  memberSince: Date | Timestamp | string;
  birthdayBonusClaimed: boolean;
  anniversaryBonusClaimed: boolean;
  
  // Tier progression
  tierProgress: number;
  nextTierRequirements: {
    pointsNeeded: number;
    referralsNeeded: number;
    durationNeeded: number;
  };
  
  lastUpdated: Date | Timestamp | string;
}

export interface SubscriptionReward {
  id: string;
  subscriptionId: string;
  subscriptionType: SubscriptionType;
  
  name: string;
  description: string;
  value: number; // Monetary value
  
  claimedAt: Date | Timestamp | string;
  claimedBy: string; // User ID
  
  rewardType: 'discount' | 'free_session' | 'points' | 'feature_unlock' | 'gift' | 'other';
  rewardData?: any; // Additional data specific to reward type
}

// ============================================================================
// Theme System Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeCategory = 'default' | 'premium' | 'seasonal' | 'custom';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ThemeCategory;
  
  // Access control
  isPublic: boolean; // Available to all users
  requiredSubscription?: SubscriptionType; // 'loyalty' or 'vip'
  requiredSubscriptionActive?: boolean;
  
  // Theme colors (CSS variables)
  colors: ThemeColors;
  
  // Preview
  previewImage?: string;
  thumbnailImage?: string;
  
  // Metadata
  author?: string;
  version?: string;
  createdAt: Date | Timestamp | string;
  updatedAt: Date | Timestamp | string;
  
  // Settings
  isActive: boolean;
  order: number;
  featured?: boolean;
}

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Background colors
  background: string;
  foreground: string;
  
  // Muted colors
  muted: string;
  mutedForeground: string;
  
  // Accent colors
  accent: string;
  accentForeground: string;
  
  // Destructive colors
  destructive: string;
  destructiveForeground: string;
  
  // Border and input
  border: string;
  input: string;
  ring: string;
  
  // Card colors
  card: string;
  cardForeground: string;
  
  // Popover colors
  popover: string;
  popoverForeground: string;
  
  // Additional custom colors
  sidebar?: string;
  sidebarForeground?: string;
  header?: string;
  headerForeground?: string;
}

export interface UserThemePreference {
  userId: string;
  currentTheme: string; // Theme ID
  themeMode: ThemeMode; // light, dark, auto
  customThemes?: string[]; // Array of custom theme IDs created by user
  
  // Settings
  autoSwitchTheme?: boolean;
  lightThemeId?: string;
  darkThemeId?: string;
  
  updatedAt: Date | Timestamp | string;
}

// ============================================================================
// Stripe Payment Types
// ============================================================================

export interface StripePaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  
  // Subscription details
  subscriptionType?: SubscriptionType;
  subscriptionInterval?: SubscriptionInterval;
  
  stripePaymentIntentId: string;
  clientSecret: string;
  
  metadata?: Record<string, string>;
  
  createdAt: Date | Timestamp | string;
  updatedAt: Date | Timestamp | string;
}

export interface StripeCheckoutSession {
  id: string;
  userId: string;
  subscriptionTierId: string;
  interval: SubscriptionInterval;
  
  stripeSessionId: string;
  stripeCustomerId?: string;
  
  status: 'open' | 'complete' | 'expired';
  successUrl: string;
  cancelUrl: string;
  
  createdAt: Date | Timestamp | string;
  expiresAt: Date | Timestamp | string;
}

// ============================================================================
// Admin Management Types
// ============================================================================

export interface SubscriptionManagement {
  userId: string;
  userName: string;
  userEmail: string;
  
  activeSubscriptions: Subscription[];
  subscriptionHistory: Subscription[];
  
  totalSpent: number;
  totalRewardsValue: number;
  
  // Quick actions
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  canRenew: boolean;
}

export interface SubscriptionAction {
  action: 'grant' | 'revoke' | 'cancel' | 'renew' | 'upgrade' | 'downgrade' | 'extend';
  subscriptionId?: string;
  userId: string;
  subscriptionType?: SubscriptionType;
  
  // Action details
  reason?: string;
  notes?: string;
  duration?: number; // Days to extend
  newEndDate?: Date | Timestamp | string;
  
  performedBy: string; // Admin ID
  performedAt: Date | Timestamp | string;
}

export interface TierAuditLog {
  id: string;
  userId: string;
  adminId: string;
  action: 'tier_assigned' | 'tier_removed' | 'tier_upgraded' | 'tier_downgraded' | 'benefit_granted' | 'benefit_revoked';
  
  // Tier information
  previousTier?: string;
  newTier?: string;
  tierType: 'vip' | 'loyalty';
  
  // Details
  reason: string;
  notes?: string;
  metadata?: {
    previousBenefits?: string[];
    newBenefits?: string[];
    requirementsMet?: boolean;
    automatic?: boolean;
  };
  
  // Timestamps
  createdAt: Date | Timestamp | string;
  expiresAt?: Date | Timestamp | string;
}

export interface TierRequirements {
  vip?: {
    silver?: {
      minimumSpend?: number;
      minimumSessions?: number;
      minimumDuration?: number;
      requirements?: string[];
    };
    gold?: {
      minimumSpend?: number;
      minimumSessions?: number;
      minimumDuration?: number;
      referralCount?: number;
      requirements?: string[];
    };
    platinum?: {
      minimumSpend?: number;
      minimumSessions?: number;
      minimumDuration?: number;
      referralCount?: number;
      invitationOnly?: boolean;
      requirements?: string[];
    };
  };
  loyalty?: {
    member?: {
      minimumPoints?: number;
      minimumDuration?: number;
      loginStreak?: number;
      requirements?: string[];
    };
    elite?: {
      minimumPoints?: number;
      minimumDuration?: number;
      referralCount?: number;
      loginStreak?: number;
      exclusiveEvents?: number;
      requirements?: string[];
    };
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export interface SubscriptionStats {
  totalActive: number;
  totalCancelled: number;
  totalExpired: number;
  
  loyaltySubscriptions: number;
  vipSubscriptions: number;
  bothSubscriptions: number;
  
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  yearlyRecurringRevenue: number;
  
  averageSubscriptionValue: number;
  churnRate: number;
}

export interface UserSubscriptionSummary {
  userId: string;
  hasLoyalty: boolean;
  hasVIP: boolean;
  hasBoth: boolean;
  
  loyaltySubscription?: Subscription;
  vipSubscription?: Subscription;
  
  totalBenefits: SubscriptionFeatures;
  combinedBadges: SubscriptionBadge[];
  
  availableThemes: Theme[];
  currentTheme?: Theme;
  
  usageSummary: {
    loyalty?: SubscriptionUsage;
    vip?: SubscriptionUsage;
  };
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_SUBSCRIPTION_TIERS: Omit<SubscriptionTier, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'loyalty',
    name: 'loyal',
    displayName: 'Loyal Member',
    description: 'Enhanced loyalty rewards and exclusive discounts',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    currency: 'EUR',
    benefits: [
      '2x loyalty points on all purchases',
      'Additional 10% discount on services',
      'Priority customer support',
      'Early access to new features',
      'Exclusive loyalty rewards',
      '5 premium themes included',
    ],
    features: {
      loyaltyPointsMultiplier: 2,
      loyaltyDiscountPercentage: 10,
      prioritySupport: true,
      earlyAccess: true,
      premiumThemes: [],
      themeCount: 5,
    },
    badge: {
      text: 'LOYAL',
      bgColor: 'bg-amber-500',
      textColor: 'text-white',
      icon: 'star',
      gradient: false,
      pulse: false,
    },
    color: '#f59e0b',
    isActive: true,
    order: 1,
    popularBadge: false,
  },
  {
    type: 'vip',
    name: 'vip',
    displayName: 'VIP Premium',
    description: 'Complete access to all premium features and unlimited sessions',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    currency: 'EUR',
    benefits: [
      'Unlimited therapy sessions',
      'Personal dedicated therapist',
      'Access to group therapy sessions',
      'Advanced AI insights & reports',
      'Monthly progress reports',
      'All premium themes unlocked',
      'VIP community access',
      'Exclusive VIP events',
      'Priority booking',
      'Ad-free experience',
    ],
    features: {
      unlimitedSessions: true,
      personalTherapist: true,
      groupSessions: true,
      aiInsightsAdvanced: true,
      monthlyReports: true,
      customThemes: true,
      premiumThemes: [],
      themeCount: 999,
      exclusiveContent: true,
      exerciseLibraryFull: true,
      communityAccess: true,
      vipEvents: true,
      earlyAccess: true,
      adFree: true,
      dataExport: true,
      loyaltyPointsMultiplier: 1.5,
      prioritySupport: true,
    },
    badge: {
      text: 'VIP',
      bgColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white',
      icon: 'crown',
      gradient: true,
      pulse: true,
    },
    color: '#9333ea',
    isActive: true,
    order: 2,
    popularBadge: true,
  },
];

export const EXTENDED_VIP_TIERS: Omit<VIPTierDetails, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'vip',
    name: 'vip-silver',
    displayName: 'VIP Silver',
    description: 'Entry-level VIP with enhanced features and priority support',
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    currency: 'EUR',
    benefits: [
      '15 therapy sessions per month',
      'Priority customer support',
      'Access to premium themes',
      'Basic AI insights',
      'Monthly progress reports',
      'VIP community access',
      'Early access to new features',
      '5% loyalty point bonus',
    ],
    features: {
      sessionLimit: 15,
      prioritySupport: true,
      premiumThemes: [],
      themeCount: 10,
      aiInsightsAdvanced: true,
      monthlyReports: true,
      communityAccess: true,
      vipEvents: true,
      earlyAccess: true,
      loyaltyPointsMultiplier: 1.5,
    },
    badge: {
      text: 'VIP SILVER',
      bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
      textColor: 'text-white',
      icon: 'star',
      gradient: true,
      pulse: false,
    },
    color: '#9ca3af',
    isActive: true,
    order: 3,
    popularBadge: false,
    vipLevel: 'silver',
    requirements: {
      minimumSpend: 100,
      minimumSessions: 5,
      minimumDuration: 1,
    },
    privileges: {
      priorityBooking: true,
      dedicatedSupport: false,
      exclusiveContent: false,
      earlyAccess: true,
      customFeatures: false,
      whiteLabel: false,
    },
    limits: {
      maxSessionsPerMonth: 15,
      maxGroupSessions: 2,
      maxReports: 2,
      maxStorageGB: 5,
    },
  },
  {
    type: 'vip',
    name: 'vip-gold',
    displayName: 'VIP Gold',
    description: 'Mid-tier VIP with enhanced features and personal therapist access',
    monthlyPrice: 79.99,
    yearlyPrice: 799.99,
    currency: 'EUR',
    benefits: [
      'Unlimited therapy sessions',
      'Personal dedicated therapist',
      'Access to group therapy sessions',
      'Advanced AI insights & reports',
      'All premium themes unlocked',
      'VIP community access',
      'Exclusive VIP events',
      'Priority booking and support',
      'Custom branding options',
      '10% loyalty point bonus',
    ],
    features: {
      unlimitedSessions: true,
      personalTherapist: true,
      groupSessions: true,
      aiInsightsAdvanced: true,
      monthlyReports: true,
      customThemes: true,
      premiumThemes: [],
      themeCount: 999,
      exclusiveContent: true,
      exerciseLibraryFull: true,
      communityAccess: true,
      vipEvents: true,
      earlyAccess: true,
      customBranding: true,
      loyaltyPointsMultiplier: 2,
      prioritySupport: true,
    },
    badge: {
      text: 'VIP GOLD',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      textColor: 'text-white',
      icon: 'crown',
      gradient: true,
      pulse: true,
    },
    color: '#eab308',
    isActive: true,
    order: 4,
    popularBadge: true,
    vipLevel: 'gold',
    requirements: {
      minimumSpend: 500,
      minimumSessions: 20,
      minimumDuration: 3,
      referralCount: 2,
    },
    privileges: {
      priorityBooking: true,
      dedicatedSupport: true,
      exclusiveContent: true,
      earlyAccess: true,
      customFeatures: true,
      whiteLabel: false,
    },
    limits: {
      maxSessionsPerMonth: 999,
      maxGroupSessions: 10,
      maxReports: 10,
      maxStorageGB: 50,
    },
  },
  {
    type: 'vip',
    name: 'vip-platinum',
    displayName: 'VIP Platinum',
    description: 'Elite VIP tier with unlimited everything and white-label solutions',
    monthlyPrice: 149.99,
    yearlyPrice: 1499.99,
    currency: 'EUR',
    benefits: [
      'Unlimited therapy sessions',
      'Personal dedicated therapist team',
      'Unlimited group therapy sessions',
      'Advanced AI insights & custom reports',
      'All premium and custom themes',
      'VIP community and events access',
      'White-label solutions',
      'API access for integrations',
      'Dedicated account manager',
      '15% loyalty point bonus',
      'Exclusive platinum events',
    ],
    features: {
      unlimitedSessions: true,
      personalTherapist: true,
      groupSessions: true,
      aiInsightsAdvanced: true,
      monthlyReports: true,
      customThemes: true,
      premiumThemes: [],
      themeCount: 999,
      exclusiveContent: true,
      exerciseLibraryFull: true,
      communityAccess: true,
      vipEvents: true,
      earlyAccess: true,
      dataExport: true,
      customBranding: true,
      loyaltyPointsMultiplier: 2.5,
      prioritySupport: true,
    },
    badge: {
      text: 'VIP PLATINUM',
      bgColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white',
      icon: 'crown',
      gradient: true,
      pulse: true,
    },
    color: '#9333ea',
    isActive: true,
    order: 5,
    popularBadge: false,
    vipLevel: 'platinum',
    requirements: {
      minimumSpend: 1500,
      minimumSessions: 50,
      minimumDuration: 6,
      referralCount: 5,
      invitationOnly: true,
    },
    privileges: {
      priorityBooking: true,
      dedicatedSupport: true,
      exclusiveContent: true,
      earlyAccess: true,
      customFeatures: true,
      whiteLabel: true,
    },
    limits: {
      maxSessionsPerMonth: 999,
      maxGroupSessions: 999,
      maxReports: 999,
      maxStorageGB: 200,
    },
  },
];

export const EXTENDED_LOYALTY_TIERS: Omit<LoyaltyTierDetails, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'loyalty',
    name: 'loyalty-member',
    displayName: 'Loyalty Member',
    description: 'Basic loyalty tier with points and discounts',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'EUR',
    benefits: [
      '1.5x loyalty points on all purchases',
      '5% discount on services',
      'Access to loyalty rewards',
      'Birthday bonus',
      'Member-only content',
      'Basic referral bonus',
    ],
    features: {
      loyaltyPointsMultiplier: 1.5,
      loyaltyDiscountPercentage: 5,
      prioritySupport: false,
      earlyAccess: false,
      premiumThemes: [],
      themeCount: 2,
    },
    badge: {
      text: 'MEMBER',
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      icon: 'heart',
      gradient: false,
      pulse: false,
    },
    color: '#3b82f6',
    isActive: true,
    order: 1,
    popularBadge: false,
    loyaltyLevel: 'member',
    pointsMultiplier: 1.5,
    discountPercentage: 5,
    rewards: {
      birthdayBonus: true,
      referralBonus: 10,
      milestoneRewards: true,
      exclusiveEvents: false,
    },
    requirements: {
      minimumPoints: 0,
      minimumDuration: 0,
    },
  },
  {
    type: 'loyalty',
    name: 'loyalty-elite',
    displayName: 'Loyalty Elite',
    description: 'Premium loyalty tier with enhanced rewards and exclusive benefits',
    monthlyPrice: 14.99,
    yearlyPrice: 149.99,
    currency: 'EUR',
    benefits: [
      '3x loyalty points on all purchases',
      '15% discount on services',
      'Premium loyalty rewards',
      'Enhanced birthday bonus',
      'Exclusive elite events',
      'Premium referral bonus',
      'Priority customer support',
      'Early access to new features',
      'Exclusive elite content',
      'Milestone rewards',
    ],
    features: {
      loyaltyPointsMultiplier: 3,
      loyaltyDiscountPercentage: 15,
      prioritySupport: true,
      earlyAccess: true,
      premiumThemes: [],
      themeCount: 15,
    },
    badge: {
      text: 'ELITE',
      bgColor: 'bg-gradient-to-r from-red-500 to-orange-500',
      textColor: 'text-white',
      icon: 'gem',
      gradient: true,
      pulse: true,
    },
    color: '#ef4444',
    isActive: true,
    order: 2,
    popularBadge: true,
    loyaltyLevel: 'elite',
    pointsMultiplier: 3,
    discountPercentage: 15,
    rewards: {
      birthdayBonus: true,
      referralBonus: 25,
      milestoneRewards: true,
      exclusiveEvents: true,
    },
    requirements: {
      minimumPoints: 1000,
      minimumDuration: 3,
      referralCount: 3,
    },
  },
];

export const DEFAULT_THEMES: Omit<Theme, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'default',
    displayName: 'Default',
    description: 'Classic Eka theme',
    category: 'default',
    isPublic: true,
    colors: {
      primary: '#6366f1',
      primaryForeground: '#ffffff',
      secondary: '#f1f5f9',
      secondaryForeground: '#0f172a',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
      accent: '#f1f5f9',
      accentForeground: '#0f172a',
      destructive: '#ef4444',
      destructiveForeground: '#ffffff',
      border: '#e2e8f0',
      input: '#e2e8f0',
      ring: '#6366f1',
      card: '#ffffff',
      cardForeground: '#0f172a',
      popover: '#ffffff',
      popoverForeground: '#0f172a',
    },
    isActive: true,
    order: 1,
    featured: false,
  },
  {
    name: 'ocean',
    displayName: 'Ocean Blue',
    description: 'Calming ocean-inspired theme',
    category: 'premium',
    isPublic: false,
    requiredSubscription: 'loyalty',
    colors: {
      primary: '#0ea5e9',
      primaryForeground: '#ffffff',
      secondary: '#e0f2fe',
      secondaryForeground: '#075985',
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      muted: '#e0f2fe',
      mutedForeground: '#0369a1',
      accent: '#7dd3fc',
      accentForeground: '#075985',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: '#bae6fd',
      input: '#bae6fd',
      ring: '#0ea5e9',
      card: '#ffffff',
      cardForeground: '#0c4a6e',
      popover: '#ffffff',
      popoverForeground: '#0c4a6e',
    },
    isActive: true,
    order: 2,
    featured: true,
  },
  {
    name: 'sunset',
    displayName: 'Sunset Glow',
    description: 'Warm sunset colors for evening sessions',
    category: 'premium',
    isPublic: false,
    requiredSubscription: 'vip',
    colors: {
      primary: '#f97316',
      primaryForeground: '#ffffff',
      secondary: '#ffedd5',
      secondaryForeground: '#7c2d12',
      background: '#fff7ed',
      foreground: '#7c2d12',
      muted: '#ffedd5',
      mutedForeground: '#9a3412',
      accent: '#fed7aa',
      accentForeground: '#7c2d12',
      destructive: '#dc2626',
      destructiveForeground: '#ffffff',
      border: '#fed7aa',
      input: '#fed7aa',
      ring: '#f97316',
      card: '#ffffff',
      cardForeground: '#7c2d12',
      popover: '#ffffff',
      popoverForeground: '#7c2d12',
    },
    isActive: true,
    order: 3,
    featured: true,
  },
];
