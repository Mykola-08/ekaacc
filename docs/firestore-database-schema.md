# Firestore Database Schema

## Overview

This document defines the complete Firestore database structure for the Eka mental health platform, including wallet management, payments, loyalty programs, and referral systems.

## Collections Structure

### 1. `/users/{userId}` - User Profiles

**Purpose:** Core user information and profile data

```typescript
{
  id: string;
  uid: string;
  email: string;
  name: string;
  displayName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role: 'Patient' | 'Therapist' | 'Admin';
  initials: string;
  
  // Profile
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: {...};
  
  // Registration
  registrationMethod: 'self' | 'admin-created' | 'therapist-created';
  createdBy?: string; // User ID of admin/therapist
  emailVerified: boolean;
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}
```

**Security Rules:**

- User can read/write their own document
- Admins can read/write all user documents
- Therapists can read patient documents assigned to them

---

### 2. `/wallets/{walletId}` - User Wallets

**Purpose:** Internal wallet for each user (walletId === userId)

```typescript
{
  id: string; // Same as userId
  userId: string;
  balance: number; // Current balance in EUR
  currency: 'EUR';
  isActive: boolean;
  isPaused: boolean;
  pauseReason?: string;
  
  // Statistics
  totalCredits: number;
  totalDebits: number;
  lastTransactionAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Security Rules:**

- User can read their own wallet
- Only system/admins can write to wallet (through Cloud Functions)
- Prevent direct balance manipulation

---

### 3. `/wallets/{walletId}/transactions/{transactionId}` - Wallet Transactions

**Purpose:** Transaction history for wallet (subcollection of wallets)

```typescript
{
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'purchase' | 'refund' | 'payment_confirmed' | 'loyalty_reward' | 'referral_reward' | 'admin_adjustment' | 'promotion';
  amount: number; // Positive for credit, negative for debit
  balanceAfter: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  description: string;
  
  metadata: {
    serviceId?: string;
    serviceName?: string;
    sessionId?: string;
    paymentRequestId?: string;
    referralId?: string;
    loyaltyRewardId?: string;
    adminId?: string;
    adminNote?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
}
```

**Indexes Required:**

- `userId` ASC, `createdAt` DESC
- `status` ASC, `createdAt` DESC
- `type` ASC, `createdAt` DESC

---

### 4. `/paymentRequests/{requestId}` - Payment Requests

**Purpose:** Track Bizum and cash payment requests

```typescript
{
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: 'EUR';
  method: 'bizum' | 'cash';
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'expired';
  description: string;
  
  // Proof
  proofImageUrl?: string; // Bizum screenshot/receipt
  proofText?: string; // Reference number
  
  // Confirmation
  confirmedBy?: string; // Admin/Therapist ID
  confirmedByName?: string;
  confirmedByRole?: 'Admin' | 'Therapist';
  confirmedAt?: Timestamp;
  rejectionReason?: string;
  
  metadata: {
    reference?: string;
    bizumPhone?: string;
    notes?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp; // Auto-expire after 7 days
}
```

**Indexes Required:**

- `status` ASC, `createdAt` DESC
- `userId` ASC, `createdAt` DESC
- `confirmedBy` ASC, `confirmedAt` DESC

**Security Rules:**

- User can create payment requests
- User can read their own requests
- Admins/Therapists can read all requests
- Only Admins/Therapists can update status

---

### 5. `/loyaltyPrograms/{userId}` - Loyalty Program Enrollment

**Purpose:** Track user loyalty program enrollment and tier

```typescript
{
  id: string; // Same as userId
  userId: string;
  isEnrolled: boolean;
  enrolledAt?: Timestamp;
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  totalPoints: number; // Current balance
  lifetimePoints: number; // All-time earned
  pointsToNextTier: number; // Calculated
  lastActivityAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 6. `/loyaltyPrograms/{userId}/pointsTransactions/{transactionId}` - Loyalty Points History

**Purpose:** Track earning and spending of loyalty points (subcollection)

```typescript
{
  id: string;
  userId: string;
  action: 'session_completed' | 'service_purchased' | 'referral_success' | 'review_submitted' | 'milestone_reached' | 'birthday_bonus' | 'anniversary_bonus' | 'admin_bonus' | 'points_redeemed';
  points: number; // Positive for earning, negative for redemption
  balanceAfter: number;
  description: string;
  
  metadata: {
    sessionId?: string;
    serviceId?: string;
    referralId?: string;
    rewardId?: string;
    adminId?: string;
  };
  
  createdAt: Timestamp;
}
```

**Indexes Required:**

- `userId` ASC, `createdAt` DESC
- `action` ASC, `createdAt` DESC

---

### 7. `/loyaltyRewards/{rewardId}` - Loyalty Rewards Catalog

**Purpose:** Available rewards users can redeem with points

```typescript
{
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  walletValue: number; // EUR value
  minTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  isActive: boolean;
  category: 'discount' | 'service' | 'credit' | 'exclusive';
  imageUrl?: string;
  expiryDays?: number;
  stock?: number; // null = unlimited
  sortOrder: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Security Rules:**

- All authenticated users can read active rewards
- Only admins can create/update rewards

---

### 8. `/referralCodes/{codeId}` - Referral Codes

**Purpose:** Unique referral codes for each user

```typescript
{
  id: string;
  code: string; // Unique code (e.g., "JOHN2024ABC")
  userId: string; // Referrer
  userName: string;
  isActive: boolean;
  usageLimit?: number; // null = unlimited
  usageCount: number;
  expiresAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required:**

- `code` ASC (unique)
- `userId` ASC, `isActive` ASC

---

### 9. `/referrals/{referralId}` - Referral Tracking

**Purpose:** Track referrals and reward distribution

```typescript
{
  id: string;
  referralCode: string;
  referrerId: string; // User who shared
  referrerName: string;
  refereeId: string; // New user
  refereeName: string;
  refereeEmail: string;
  status: 'pending' | 'registered' | 'completed' | 'expired' | 'cancelled';
  
  // Rewards
  referrerRewardAmount: number; // EUR
  referrerRewardPoints: number;
  refereeRewardAmount: number; // EUR
  refereeRewardPoints: number;
  
  // Reward status
  referrerRewardPaid: boolean;
  refereeRewardPaid: boolean;
  rewardsPaidAt?: Timestamp;
  
  // Completion
  completionRequirement?: string;
  completedAt?: Timestamp;
  
  registeredAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required:**

- `referrerId` ASC, `createdAt` DESC
- `refereeId` ASC
- `status` ASC, `createdAt` DESC

---

### 10. `/settings/referralSettings` - Referral Program Configuration

**Purpose:** Global referral program settings (singleton document)

```typescript
{
  isEnabled: boolean;
  referrerRewardAmount: number; // EUR
  referrerRewardPoints: number;
  refereeRewardAmount: number; // EUR
  refereeRewardPoints: number;
  requiresCompletion: boolean;
  completionRequirement: string; // e.g., "Complete first session"
  codePrefix: string; // e.g., "EKA"
  codeLength: number;
  allowCustomCodes: boolean;
  
  updatedAt: Timestamp;
  updatedBy: string; // Admin ID
}
```

---

### 11. `/purchases/{purchaseId}` - Service/Feature Purchases

**Purpose:** Track all purchases made with wallet

```typescript
{
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemType: 'service' | 'session' | 'package' | 'feature' | 'subscription';
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountApplied: number; // Percentage
  finalPrice: number;
  currency: 'EUR';
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  paymentMethod: 'wallet';
  transactionId?: string; // Link to wallet transaction
  
  // Fulfillment
  isFulfilled: boolean;
  fulfilledAt?: Timestamp;
  fulfilledBy?: string;
  
  metadata: {
    loyaltyPointsEarned?: number;
    sessionId?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required:**

- `userId` ASC, `createdAt` DESC
- `status` ASC, `createdAt` DESC

---

### 12. `/purchasableItems/{itemId}` - Catalog of Purchasable Items

**Purpose:** Services, packages, features available for purchase

```typescript
{
  id: string;
  type: 'service' | 'session' | 'package' | 'feature' | 'subscription';
  name: string;
  description: string;
  price: number; // EUR
  currency: 'EUR';
  isActive: boolean;
  requiresApproval?: boolean;
  
  metadata: {
    serviceId?: string;
    durationMinutes?: number;
    sessionsIncluded?: number;
    features?: string[];
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## Firestore Indexes Required

Create these composite indexes in Firebase Console:

1. **wallets/{walletId}/transactions**
   - userId (Ascending) + createdAt (Descending)
   - status (Ascending) + createdAt (Descending)
   - type (Ascending) + createdAt (Descending)

2. **paymentRequests**
   - status (Ascending) + createdAt (Descending)
   - userId (Ascending) + createdAt (Descending)
   - confirmedBy (Ascending) + confirmedAt (Descending)

3. **loyaltyPrograms/{userId}/pointsTransactions**
   - userId (Ascending) + createdAt (Descending)
   - action (Ascending) + createdAt (Descending)

4. **referrals**
   - referrerId (Ascending) + createdAt (Descending)
   - status (Ascending) + createdAt (Descending)

5. **referralCodes**
   - code (Ascending) - Mark as Unique
   - userId (Ascending) + isActive (Ascending)

6. **purchases**
   - userId (Ascending) + createdAt (Descending)
   - status (Ascending) + createdAt (Descending)

---

## Cloud Functions Needed

Due to Firestore's async nature and security requirements, implement these Cloud Functions:

1. **processPaymentConfirmation** - Triggered when payment request status changes to 'confirmed'
   - Add funds to wallet
   - Create transaction record
   - Send notification

2. **processWalletPurchase** - Handle purchases from wallet
   - Check balance
   - Deduct amount
   - Create transaction
   - Apply loyalty points

3. **processReferralCompletion** - When referee completes requirement
   - Update referral status
   - Credit both wallets
   - Award loyalty points

4. **updateLoyaltyTier** - Triggered on points changes
   - Calculate current tier
   - Update user tier
   - Send tier upgrade notification

5. **createUserWallet** - Triggered on user creation
   - Initialize wallet with 0 balance
   - Initialize loyalty program (not enrolled)
   - Generate referral code

6. **expirePaymentRequests** - Scheduled function (daily)
   - Find pending requests older than 7 days
   - Mark as expired

---

## Migration Strategy

1. Add wallet to all existing users (Cloud Function)
2. Initialize loyalty programs (not enrolled by default)
3. Generate referral codes for existing users
4. Set up referral settings with default values
5. Create initial purchasable items catalog

---

## Environment Variables Required

```env
# Payment Configuration
PAYMENT_EXPIRY_DAYS=7
DEFAULT_WALLET_BALANCE=0

# Referral Configuration
REFERRAL_CODE_PREFIX=EKA
REFERRAL_CODE_LENGTH=8
REFERRER_REWARD_EUR=10
REFERRER_REWARD_POINTS=100
REFEREE_REWARD_EUR=5
REFEREE_REWARD_POINTS=50

# Loyalty Configuration
LOYALTY_POINTS_PER_EUR=10
LOYALTY_TIER_UPGRADE_NOTIFICATION=true
```
