# Implemented Feature Documentation (2026-01-15)

## 1. Loyalty & Rewards System
**File**: `server/loyalty/service.ts`
**Table**: `user_rewards_balance`, `reward_transaction`
**Features**:
- Track User Balance (Current & Lifetime)
- Transaction History (Earned, Redeemed, Expired)
- Atomic RPC (`increment_points`) ensures concurrency safety.
- Expiration logic capability via `expires_at`.

## 2. Referral System
**File**: `server/referral/service.ts`
**Table**: `referral_code`, `referral_usage`
**Features**:
- Unique referral codes per user.
- Tracking of `pending` vs `completed` referrals.
- Double-sided rewards (Referrer + Referee).
- Self-referral prevention.

## 3. Calendar Sync (2-Way)
**File**: `server/calendar/service.ts`
**Table**: `calendar_connection`, `external_calendar_event`
**Features**:
- Stores OAuth tokens (Access + Refresh) securely.
- Shadow table `external_calendar_event` for conflict detection.
- Supports blocking off booking slots based on external busy time.

## 4. Admin Universal Control
**File**: `server/admin/universal-service.ts`
**Features**:
- **Impersonation**: Placeholder for acting as user.
- **Force Cancel**: Admin override for cancellations/refunds.
- **Point Adjustments**: Manual correction of loyalty balances.
- **Data Access**: Privileged access to full user lists.

## 5. Booking Enhancements
**Features**:
- Reservation Hold (`reservation_expires_at` in schema).
- Unified Booking fields for cross-app compatibility.
- Waitlist support (existing in schema).


## 6. Wallet & Payments System
**File**: server/wallet/service.ts
**Migration**: SUPABASE_MIGRATION_WALLET_PRODUCTS_AND_VERIFICATION.sql
**Features**:
- **Digital Wallet**: Store user currency balance (cents).
- **Top-Ups**: Pre-configured products (50�, 100�, 200�) seeded in DB.
- **Transactions**: Full history of deposits and purchases.

## 7. The Verificator (Manual Payment Proofs)
**File**: server/payment/verification-service.ts
**Table**: payment_proof
**Features**:
- **Upload Proof**: Users upload images/receipts for transfers/cash.
- **Admin Review**: Staff verify or reject proofs via Dashboard.
- **Auto-Credit**: Approval automatically marks booking as PAID or credits Wallet.

## 8. Unified Catalog
**File**: server/catalog/service.ts
**Features**:
- **Types**: Distinguishes 'service' (bookings) from 'wallet_credit' (products).
- **Metadata**: Extended schema for product-specific fields (bonus credits, etc).

