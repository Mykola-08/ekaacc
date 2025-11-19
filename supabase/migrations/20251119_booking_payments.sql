-- Create Wallet Tables if they don't exist
CREATE TABLE IF NOT EXISTS "public"."wallets" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
    "balance" DECIMAL(10, 2) DEFAULT 0,
    "currency" TEXT DEFAULT 'EUR',
    "is_active" BOOLEAN DEFAULT true,
    "is_paused" BOOLEAN DEFAULT false,
    "pause_reason" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("user_id")
);

CREATE TABLE IF NOT EXISTS "public"."wallet_transactions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "wallet_id" UUID REFERENCES "public"."wallets"("id") ON DELETE CASCADE,
    "amount" DECIMAL(10, 2) NOT NULL,
    "type" TEXT NOT NULL, -- credit, debit
    "description" TEXT,
    "metadata" JSONB,
    "stripe_payment_intent_id" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Add payment configuration to teacher marketplace profiles
ALTER TABLE "public"."teacher_marketplace_profiles" 
ADD COLUMN IF NOT EXISTS "payment_policy" TEXT CHECK (payment_policy IN ('prepay_full', 'prepay_deposit', 'pay_at_place')) DEFAULT 'pay_at_place',
ADD COLUMN IF NOT EXISTS "deposit_percentage" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "accepted_payment_methods" TEXT[] DEFAULT ARRAY['card', 'wallet'];

-- Add payment and reputation fields to user profiles
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "stripe_customer_id" TEXT,
ADD COLUMN IF NOT EXISTS "reputation_score" INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS "no_show_count" INTEGER DEFAULT 0;

-- Add payment details to bookings
ALTER TABLE "public"."bookings" 
ADD COLUMN IF NOT EXISTS "payment_status" TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed', 'partially_paid')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "payment_method" TEXT,
ADD COLUMN IF NOT EXISTS "amount_paid" DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS "stripe_payment_intent_id" TEXT,
ADD COLUMN IF NOT EXISTS "deposit_amount" DECIMAL(10, 2) DEFAULT 0;

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_bookings_payment_status" ON "bookings" ("payment_status");
CREATE INDEX IF NOT EXISTS "idx_profiles_stripe_customer" ON "profiles" ("stripe_customer_id");
CREATE INDEX IF NOT EXISTS "idx_wallets_user_id" ON "wallets" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_wallet_transactions_wallet_id" ON "wallet_transactions" ("wallet_id");
