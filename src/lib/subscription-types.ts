// Subscription and theme management types

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionType = 'loyalty' | 'vip';
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
