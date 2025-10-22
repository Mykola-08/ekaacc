# Wallet, Payment, Loyalty & Referral System Implementation

## Overview

This document provides a comprehensive guide to the newly implemented financial and rewards system for the Eka mental health platform.

## ✅ Completed Components

### 1. Type Definitions (`src/lib/wallet-types.ts`)

**Status:** ✅ Complete

Defines TypeScript types for:

- **Wallet System**: `Wallet`, `WalletTransaction`, `TransactionType`, `TransactionStatus`
- **Payment System**: `PaymentRequest`, `PaymentMethod`, `PaymentStatus`
- **Loyalty Program**: `LoyaltyProgram`, `LoyaltyTier`, `LoyaltyPointsTransaction`, `LoyaltyReward`, `LOYALTY_TIERS`
- **Referral System**: `Referral`, `ReferralCode`, `ReferralSettings`, `ReferralStatus`
- **Purchases**: `Purchase`, `PurchasableItem`, `PurchaseStatus`
- **Registration**: `RegistrationData`, `RegistrationResult`, `RegistrationMethod`

**Key Features:**

- 5 loyalty tiers (Bronze → Diamond) with progressive benefits
- Support for Bizum and Cash payment methods
- Comprehensive transaction tracking
- Full type safety with Timestamp support

---

### 2. Database Schema (`docs/firestore-database-schema.md`)

**Status:** ✅ Complete

Defines 12 Firestore collections:

1. `/users/{userId}` - User profiles with registration method tracking
2. `/wallets/{walletId}` - User wallets (walletId === userId)
3. `/wallets/{walletId}/transactions/{transactionId}` - Transaction history (subcollection)
4. `/paymentRequests/{requestId}` - Bizum/Cash payment requests
5. `/loyaltyPrograms/{userId}` - Loyalty enrollment and tier tracking
6. `/loyaltyPrograms/{userId}/pointsTransactions/{transactionId}` - Points history (subcollection)
7. `/loyaltyRewards/{rewardId}` - Rewards catalog
8. `/referralCodes/{codeId}` - User referral codes
9. `/referrals/{referralId}` - Referral tracking
10. `/purchases/{purchaseId}` - Service/feature purchases
11. `/purchasableItems/{itemId}` - Catalog of purchasable items
12. `/settings/referralSettings` - Global referral configuration

**Includes:**

- Required composite indexes for efficient queries
- Migration strategy for existing users
- Environment variables configuration
- Cloud Functions architecture requirements

---

### 3. Firestore Security Rules (`firestore.rules`)

**Status:** ✅ Complete

**New Security Rules Added:**

- **Wallets**: Read-only for users, write-only via Cloud Functions
- **Transactions**: Immutable history, system-created only
- **Payment Requests**: Users create, Admins/Therapists confirm
- **Loyalty Programs**: Users enroll, system manages points
- **Referrals**: Fully automated, Cloud Function controlled
- **Purchases**: System-created, staff-fulfilled
- **Catalogs**: Public read, admin write

**Helper Functions:**

- `isAdmin()` - Checks admin role
- `isTherapist()` - Checks therapist role
- Role-based access control throughout

**Security Principles:**

- Prevent direct balance manipulation
- Immutable transaction history
- Role-based confirmations
- Denormalization for efficient authorization

---

### 4. Wallet Service (`src/services/wallet-service.ts`)

**Status:** ✅ Complete

**Interface (`IWalletService`):**

```typescript
- getWallet(userId): Get wallet details
- getBalance(userId): Get current balance
- pauseWallet(userId, reason): Pause wallet (admin)
- unpauseWallet(userId): Unpause wallet
- getTransactions(userId, limit?): Get transaction history
- addCredit(userId, amount, description, metadata?): Add funds
- deductAmount(userId, amount, description, metadata?): Deduct funds
- getPurchasableItems(): Get catalog
- getPurchases(userId): Get purchase history
- createPurchase(userId, itemId, quantity, discount?): Make purchase
- canAfford(userId, amount): Check balance
- isWalletActive(userId): Check wallet status
```

**Mock Implementation:**

- ✅ In-memory wallet storage
- ✅ 100 EUR welcome bonus for testing
- ✅ 4 sample purchasable items
- ✅ Complete transaction tracking
- ✅ Balance validation
- ✅ Wallet pause/unpause

**Firestore Implementation:**

- ✅ Full Firestore integration
- ✅ Prevents direct wallet modification (Cloud Functions only)
- ✅ Async-safe with Timestamp conversion
- ✅ Comprehensive error handling
- ⚠️ Purchase creation requires Cloud Functions (security)

**Data Switching:**

- Controlled by `NEXT_PUBLIC_USE_MOCK_DATA` environment variable
- Seamless switching between mock and production

---

### 5. Payment Service (`src/services/payment-service.ts`)

**Status:** ✅ Complete

**Interface (`IPaymentService`):**

```typescript
- createPaymentRequest(userId, amount, method, description, proof?, metadata?): Create request
- getPaymentRequest(requestId): Get single request
- getUserPaymentRequests(userId): Get user's requests
- getPendingPaymentRequests(): Get all pending (Admin/Therapist)
- confirmPaymentRequest(requestId, confirmedBy, name, role): Confirm payment
- rejectPaymentRequest(requestId, confirmedBy, name, role, reason): Reject payment
- cancelPaymentRequest(requestId, userId): User cancels
```

**Mock Implementation:**

- ✅ In-memory payment request storage
- ✅ 2 sample requests (pending, confirmed)
- ✅ Full confirmation/rejection workflow
- ✅ 7-day auto-expiry
- ✅ Console logging for wallet credit simulation

**Firestore Implementation:**

- ✅ Full Firestore integration
- ✅ Server timestamps for consistency
- ✅ Status validation
- ✅ Authorization checks
- ✅ Triggers for Cloud Functions (documented)

**Payment Flow:**

1. User creates payment request (Bizum/Cash)
2. User uploads proof (screenshot, reference)
3. Request appears in Admin/Therapist dashboard
4. Staff confirms/rejects
5. On confirmation → Cloud Function credits wallet
6. User receives notification

---

## 🚧 Pending Implementation

### 6. Loyalty Service

**Status:** Not Started
**Priority:** High

**Required Components:**

- `src/services/loyalty-service.ts`
- Enrollment management
- Points calculation
- Tier upgrades
- Rewards redemption
- Points transactions

**Key Features to Implement:**

- Automatic tier calculation
- Points earning on purchases (10 points per EUR spent)
- Tier-based discount application
- Rewards catalog management
- Birthday/anniversary bonuses

---

### 7. Referral Service

**Status:** Not Started
**Priority:** High

**Required Components:**

- `src/services/referral-service.ts`
- Unique code generation
- Referral tracking
- Reward distribution
- Code validation

**Key Features to Implement:**

- Generate unique codes (prefix + random)
- Track referrals from registration
- Award rewards on completion
- Dashboard for referrers
- Invitation sharing

---

### 8. Registration Service

**Status:** Not Started
**Priority:** Critical

**Required Components:**

- Enhanced `src/firebase/auth.ts`
- `src/services/registration-service.ts`
- Multi-role registration UI
- Email verification flow
- Initial wallet creation

**Registration Methods:**

1. **Self-Registration** (Patients only)
   - Email verification required
   - Referral code optional
   - Auto-create wallet with 0 balance
   - Auto-generate referral code

2. **Admin-Created Accounts** (All roles)
   - No password initially (temporary generated)
   - Email with setup link
   - Skip email verification
   - Optional initial wallet balance

3. **Therapist-Created Accounts** (Patients only)
   - Similar to admin-created
   - Restricted to patient role
   - Link to creating therapist

---

### 9. Admin Payment Confirmation UI

**Status:** Not Started
**Priority:** High

**Required Components:**

- `src/app/admin/payments/page.tsx`
- Payment request list with filters
- Proof image viewer
- Confirm/Reject actions
- Payment history

**Features:**

- Real-time pending requests count
- Filter by status, method, date
- View proof images in modal
- Confirmation dialog with reason
- Activity log

---

### 10. User Wallet Dashboard

**Status:** Not Started
**Priority:** High

**Required Components:**

- `src/app/(app)/wallet/page.tsx`
- Balance display
- Transaction history
- Payment request creation
- Purchase interface

**Features:**

- Current balance card
- Add funds button (creates payment request)
- Transaction history table with filters
- Quick purchase shortcuts
- Loyalty points display
- Referral code sharing

---

### 11. Loyalty Program UI

**Status:** Not Started
**Priority:** Medium

**Required Components:**

- `src/app/(app)/loyalty/page.tsx`
- Enrollment interface
- Tier progress display
- Rewards catalog
- Redemption flow

**Features:**

- Opt-in enrollment from settings
- Current tier badge with benefits
- Progress bar to next tier
- Rewards grid with filters
- Redemption cart
- Points history

---

### 12. Referral Program UI

**Status:** Not Started
**Priority:** Medium

**Required Components:**

- `src/app/(app)/referrals/page.tsx`
- Referral code display
- Invitation sharing
- Referral list
- Rewards tracking

**Features:**

- Personal referral code
- Share via email, social media
- Referral status table
- Rewards earned summary
- Leaderboard (optional)

---

## Cloud Functions Architecture

### Required Cloud Functions

#### 1. `processPaymentConfirmation`

**Trigger:** Firestore `paymentRequests` document update where `status` changes to 'confirmed'

**Actions:**

1. Get payment request data
2. Credit user wallet
3. Create wallet transaction record
4. Send notification to user
5. Update payment request with transaction ID

**Error Handling:**

- Idempotency check (prevent double-crediting)
- Rollback on failure
- Log errors for admin review

---

#### 2. `processWalletPurchase`

**Trigger:** HTTPS callable function

**Input:**

```typescript
{
  userId: string;
  itemId: string;
  quantity: number;
}
```

**Actions:**

1. Get user wallet and item details
2. Check balance and wallet status
3. Calculate loyalty discount
4. Atomic transaction:
   - Deduct from wallet
   - Create transaction record
   - Create purchase record
   - Award loyalty points
5. Return purchase confirmation

**Returns:**

```typescript
{
  success: boolean;
  purchase?: Purchase;
  error?: string;
}
```

---

#### 3. `processReferralCompletion`

**Trigger:** Firestore `referrals` document update where referee completes requirement

**Actions:**

1. Get referral and settings data
2. Credit both wallets (referrer & referee)
3. Award loyalty points to both
4. Update referral status to 'completed'
5. Send notifications to both users
6. Update referral code usage count

---

#### 4. `updateLoyaltyTier`

**Trigger:** Firestore `loyaltyPrograms/{userId}/pointsTransactions` onCreate

**Actions:**

1. Get updated points balance
2. Calculate new tier based on LOYALTY_TIERS
3. If tier changed:
   - Update user's current tier
   - Send tier upgrade notification
   - Log tier change

---

#### 5. `createUserWallet`

**Trigger:** Firestore `users` onCreate

**Actions:**

1. Create wallet document with 0 balance
2. Create loyalty program document (not enrolled)
3. Generate unique referral code
4. Create referral code document
5. Send welcome email

---

#### 6. `expirePaymentRequests`

**Trigger:** Cloud Scheduler (daily at 00:00 UTC)

**Actions:**

1. Query payment requests where:
   - `status` == 'pending'
   - `expiresAt` < now
2. Batch update to status 'expired'
3. Send notification to users
4. Log expired count

---

## Environment Variables

Add to `.env.local`:

```env
# Payment Configuration
NEXT_PUBLIC_PAYMENT_EXPIRY_DAYS=7
NEXT_PUBLIC_DEFAULT_WALLET_BALANCE=0

# Referral Configuration
NEXT_PUBLIC_REFERRAL_CODE_PREFIX=EKA
NEXT_PUBLIC_REFERRAL_CODE_LENGTH=8
NEXT_PUBLIC_REFERRER_REWARD_EUR=10
NEXT_PUBLIC_REFERRER_REWARD_POINTS=100
NEXT_PUBLIC_REFEREE_REWARD_EUR=5
NEXT_PUBLIC_REFEREE_REWARD_POINTS=50

# Loyalty Configuration
NEXT_PUBLIC_LOYALTY_POINTS_PER_EUR=10
NEXT_PUBLIC_LOYALTY_TIER_UPGRADE_NOTIFICATION=true

# Mock/Firestore Switching
NEXT_PUBLIC_USE_MOCK_DATA=true  # Set to 'false' for Firestore
```

---

## Testing Strategy

### Unit Tests

- ✅ Wallet service mock implementation
- ✅ Payment service mock implementation
- ⏳ Loyalty service (pending)
- ⏳ Referral service (pending)

### Integration Tests

- ⏳ Payment request → Wallet credit flow
- ⏳ Purchase → Wallet deduction → Loyalty points
- ⏳ Referral registration → Reward distribution
- ⏳ Tier upgrade → Discount application

### E2E Tests

- ⏳ Complete user registration with referral
- ⏳ Complete payment request → confirmation flow
- ⏳ Complete purchase from wallet
- ⏳ Complete loyalty enrollment → points earning → redemption

---

## Migration Checklist

### For Existing Users

- [ ] Create wallet for each existing user (0 balance)
- [ ] Create loyalty program document (not enrolled)
- [ ] Generate referral codes
- [ ] Initialize purchasable items catalog
- [ ] Set referral settings defaults

### Database Setup

- [ ] Deploy Firestore security rules
- [ ] Create composite indexes
- [ ] Deploy Cloud Functions
- [ ] Set up Cloud Scheduler for expiry job
- [ ] Configure environment variables

### UI Deployment

- [ ] Deploy admin payment confirmation UI
- [ ] Deploy user wallet dashboard
- [ ] Deploy loyalty program UI
- [ ] Deploy referral program UI
- [ ] Update navigation menus

---

## Next Steps

1. **Implement Loyalty Service** (High Priority)
2. **Implement Referral Service** (High Priority)
3. **Enhance Registration Flow** (Critical)
4. **Build Admin Payment UI** (High Priority)
5. **Build User Wallet UI** (High Priority)
6. **Deploy Cloud Functions** (Required for production)
7. **Migrate Existing Users** (One-time operation)
8. **Comprehensive Testing** (Before production)

---

## Summary

### ✅ Completed (5/12 tasks)

- Type definitions
- Database schema design
- Firestore security rules
- Wallet service (mock + Firestore)
- Payment service (mock + Firestore)

### 🚧 In Progress (0/12 tasks)

- None currently

### ⏳ Pending (7/12 tasks)

- Loyalty service
- Referral service
- Registration enhancement
- Admin payment UI
- User wallet UI
- Loyalty program UI
- Referral program UI

**Progress:** 42% Complete

**Estimated Remaining Time:**

- Services: 8-10 hours
- UIs: 12-15 hours
- Cloud Functions: 6-8 hours
- Testing: 4-6 hours
- **Total: 30-40 hours**

---

## Support & Documentation

For questions or issues:

1. Review this document
2. Check `docs/firestore-database-schema.md`
3. Review security rules in `firestore.rules`
4. Examine type definitions in `src/lib/wallet-types.ts`
5. Review service implementations in `src/services/`
