/**
 * @file Wallet, Payment, Loyalty, and Referral Types
 * @description Type definitions for the internal wallet system, payment processing,
 * loyalty program, and referral system.
 */

// Using Supabase - Date type instead of Firebase Timestamp
type Timestamp = Date;

// ==========================================
// WALLET TYPES
// ==========================================

export type TransactionType = 
  | 'credit'           // Money added to wallet
  | 'debit'            // Money removed from wallet
  | 'purchase'         // Service/feature purchase
  | 'refund'           // Refund from cancelled service
  | 'payment_confirmed'// Payment request confirmed
  | 'loyalty_reward'   // Loyalty program reward
  | 'referral_reward'  // Referral program reward
  | 'admin_adjustment' // Manual adjustment by admin
  | 'promotion';       // Promotional credit

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // Positive for credit, negative for debit
  balanceAfter: number;
  status: TransactionStatus;
  description: string;
  metadata?: {
    serviceId?: string;
    serviceName?: string;
    sessionId?: string;
    paymentRequestId?: string;
    referralId?: string;
    loyaltyRewardId?: string;
    adminId?: string;
    adminNote?: string;
    [key: string]: any;
  };
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  createdBy?: string; // User ID who initiated the transaction
}

export interface Wallet {
  id: string; // Same as userId
  userId: string;
  balance: number;
  currency: 'EUR';
  isActive: boolean;
  isPaused: boolean; // Can be paused by admin
  pauseReason?: string;
  totalCredits: number; // Lifetime total credits
  totalDebits: number; // Lifetime total debits
  lastTransactionAt?: Timestamp | string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// ==========================================
// PAYMENT TYPES
// ==========================================

export type PaymentMethod = 'bizum' | 'cash' | 'wallet';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'expired';

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: 'EUR';
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  proofImageUrl?: string; // Screenshot of Bizum transfer or receipt
  proofText?: string; // Transaction reference or notes
  
  // Confirmation
  confirmedBy?: string; // Admin or Therapist user ID
  confirmedByName?: string;
  confirmedByRole?: 'Admin' | 'Therapist';
  confirmedAt?: Timestamp | string;
  rejectionReason?: string;
  
  // Metadata
  metadata?: {
    reference?: string;
    bizumPhone?: string;
    notes?: string;
    [key: string]: any;
  };
  
  // Timestamps
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  expiresAt?: Timestamp | string; // Auto-expire after X days
}

// ==========================================
// LOYALTY PROGRAM TYPES
// ==========================================

export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type LoyaltyPointAction = 
  | 'session_completed'
  | 'service_purchased'
  | 'referral_success'
  | 'review_submitted'
  | 'milestone_reached'
  | 'birthday_bonus'
  | 'anniversary_bonus'
  | 'admin_bonus'
  | 'points_redeemed';

export interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  minPoints: number;
  maxPoints: number | null; // null for highest tier
  benefits: string[];
  discountPercentage: number; // Discount on services
  pointsMultiplier: number; // Earn X points per euro spent
  rewardMultiplier: number; // Bonus multiplier for rewards
}

export const LOYALTY_TIERS: LoyaltyTierConfig[] = [
  {
    tier: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    benefits: ['Basic support', 'Birthday bonus'],
    discountPercentage: 0,
    pointsMultiplier: 1,
    rewardMultiplier: 1,
  },
  {
    tier: 'Silver',
    minPoints: 500,
    maxPoints: 1499,
    benefits: ['Priority support', '5% discount', 'Birthday bonus', 'Free monthly exercise'],
    discountPercentage: 5,
    pointsMultiplier: 1.2,
    rewardMultiplier: 1.1,
  },
  {
    tier: 'Gold',
    minPoints: 1500,
    maxPoints: 4999,
    benefits: ['Priority support', '10% discount', 'Birthday bonus', 'Free monthly session', 'Early access to new services'],
    discountPercentage: 10,
    pointsMultiplier: 1.5,
    rewardMultiplier: 1.25,
  },
  {
    tier: 'Platinum',
    minPoints: 5000,
    maxPoints: 9999,
    benefits: ['VIP support', '15% discount', 'Birthday bonus', 'Free monthly session', 'Personal therapy plan', 'Exclusive events'],
    discountPercentage: 15,
    pointsMultiplier: 2,
    rewardMultiplier: 1.5,
  },
  {
    tier: 'Diamond',
    minPoints: 10000,
    maxPoints: null,
    benefits: ['Dedicated support', '20% discount', 'Birthday bonus', '2 free monthly sessions', 'Personal therapy plan', 'Exclusive events', 'Concierge service'],
    discountPercentage: 20,
    pointsMultiplier: 2.5,
    rewardMultiplier: 2,
  },
];

export interface LoyaltyPointsTransaction {
  id: string;
  userId: string;
  action: LoyaltyPointAction;
  points: number; // Positive for earning, negative for redemption
  balanceAfter: number;
  description: string;
  metadata?: {
    sessionId?: string;
    serviceId?: string;
    referralId?: string;
    rewardId?: string;
    adminId?: string;
    [key: string]: any;
  };
  createdAt: Timestamp | string;
}

export interface LoyaltyProgram {
  id: string; // Same as userId
  userId: string;
  isEnrolled: boolean;
  enrolledAt?: Timestamp | string;
  currentTier: LoyaltyTier;
  totalPoints: number; // Current points balance
  lifetimePoints: number; // All-time points earned
  pointsToNextTier: number; // Calculated field
  lastActivityAt?: Timestamp | string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  walletValue: number; // EUR value when redeemed
  minTier?: LoyaltyTier; // Minimum tier required
  isActive: boolean;
  category: 'discount' | 'service' | 'credit' | 'exclusive';
  imageUrl?: string;
  expiryDays?: number; // Days until reward expires after claiming
  stock?: number; // Limited quantity (null = unlimited)
  sortOrder: number;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// ==========================================
// REFERRAL PROGRAM TYPES
// ==========================================

export type ReferralStatus = 'pending' | 'registered' | 'completed' | 'expired' | 'cancelled';

export interface ReferralCode {
  id: string;
  code: string; // Unique referral code (e.g., "JOHN2024ABC")
  userId: string; // Referrer user ID
  userName: string;
  isActive: boolean;
  usageLimit?: number; // Max number of times code can be used (null = unlimited)
  usageCount: number;
  expiresAt?: Timestamp | string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface Referral {
  id: string;
  referralCode: string;
  referrerId: string; // User who shared the code
  referrerName: string;
  refereeId: string; // New user who used the code
  refereeName: string;
  refereeEmail: string;
  status: ReferralStatus;
  
  // Rewards
  referrerRewardAmount: number; // EUR credited to referrer wallet
  referrerRewardPoints: number; // Loyalty points for referrer
  refereeRewardAmount: number; // EUR credited to referee wallet
  refereeRewardPoints: number; // Loyalty points for referee
  
  // Reward status
  referrerRewardPaid: boolean;
  refereeRewardPaid: boolean;
  rewardsPaidAt?: Timestamp | string;
  
  // Completion requirements
  completionRequirement?: string; // e.g., "First session completed"
  completedAt?: Timestamp | string;
  
  // Timestamps
  registeredAt: Timestamp | string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface ReferralSettings {
  isEnabled: boolean;
  referrerRewardAmount: number; // EUR
  referrerRewardPoints: number; // Loyalty points
  refereeRewardAmount: number; // EUR
  refereeRewardPoints: number; // Loyalty points
  requiresCompletion: boolean; // Require first session/purchase to complete
  completionRequirement: string;
  codePrefix: string; // Prefix for generated codes
  codeLength: number;
  allowCustomCodes: boolean;
  updatedAt: Timestamp | string;
  updatedBy: string;
}

// ==========================================
// PURCHASABLE ITEMS TYPES
// ==========================================

export type PurchasableItemType = 'service' | 'session' | 'package' | 'feature' | 'subscription';
export type PurchaseStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

export interface PurchasableItem {
  id: string;
  type: PurchasableItemType;
  name: string;
  description: string;
  price: number; // EUR
  discountedPrice?: number; // After loyalty discount
  currency: 'EUR';
  isActive: boolean;
  requiresApproval?: boolean; // Admin/therapist approval needed
  metadata?: {
    serviceId?: string;
    durationMinutes?: number;
    sessionsIncluded?: number;
    features?: string[];
    [key: string]: any;
  };
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemType: PurchasableItemType;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number; // Percentage
  finalPrice: number;
  currency: 'EUR';
  status: PurchaseStatus;
  paymentMethod: 'wallet';
  transactionId?: string; // Link to wallet transaction
  
  // Fulfillment
  isFulfilled: boolean;
  fulfilledAt?: Timestamp | string;
  fulfilledBy?: string;
  
  // Metadata
  metadata?: {
    loyaltyPointsEarned?: number;
    sessionId?: string;
    [key: string]: any;
  };
  
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// ==========================================
// REGISTRATION TYPES
// ==========================================

export type RegistrationMethod = 'self' | 'admin-created' | 'therapist-created';

export interface RegistrationData {
  email: string;
  password?: string; // Not required for admin/therapist-created accounts
  name: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'Patient' | 'Therapist' | 'Admin';
  method: RegistrationMethod;
  createdBy?: string; // Admin or Therapist user ID
  createdByName?: string;
  sendWelcomeEmail: boolean;
  initialWalletBalance?: number; // Optional starting balance
  referralCode?: string; // Applied during registration
  metadata?: {
    notes?: string;
    [key: string]: any;
  };
}

export interface RegistrationResult {
  success: boolean;
  userId?: string;
  user?: any;
  walletId?: string;
  error?: string;
  requiresEmailVerification?: boolean;
  temporaryPassword?: string; // For admin/therapist-created accounts
}
