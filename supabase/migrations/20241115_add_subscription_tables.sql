-- Update subscriptions table to match the expected structure
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('loyalty', 'vip')),
ADD COLUMN IF NOT EXISTS interval TEXT CHECK (interval IN ('monthly', 'yearly')),
ADD COLUMN IF NOT EXISTS price NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR',
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing subscriptions to use the new structure
UPDATE subscriptions 
SET 
  type = CASE 
    WHEN plan_type = 'basic' THEN 'loyalty'::text
    WHEN plan_type = 'premium' THEN 'vip'::text
    ELSE 'loyalty'::text
  END,
  interval = 'monthly',
  price = CASE 
    WHEN plan_type = 'basic' THEN 9.99
    WHEN plan_type = 'premium' THEN 49.99
    ELSE 9.99
  END,
  currency = 'EUR',
  start_date = created_at,
  end_date = current_period_end,
  cancel_at_period_end = FALSE
WHERE type IS NULL;

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('loyalty', 'vip')),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  yearly_price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  stripe_monthly_price_id TEXT,
  stripe_yearly_price_id TEXT,
  stripe_product_id TEXT,
  benefits TEXT[] DEFAULT '{}',
  features JSONB NOT NULL DEFAULT '{}',
  badge JSONB NOT NULL DEFAULT '{}',
  color TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  "order" INTEGER DEFAULT 0,
  popular_badge BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(type)
);

-- Create subscription_usage table
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('loyalty', 'vip')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  loyalty_points_earned INTEGER DEFAULT 0,
  loyalty_points_spent INTEGER DEFAULT 0,
  loyalty_discount_used NUMERIC(10,2) DEFAULT 0,
  sessions_used INTEGER DEFAULT 0,
  sessions_remaining INTEGER DEFAULT 0,
  personal_therapist_assigned BOOLEAN DEFAULT FALSE,
  group_sessions_attended INTEGER DEFAULT 0,
  reports_generated INTEGER DEFAULT 0,
  themes_used TEXT[] DEFAULT '{}',
  current_theme TEXT,
  rewards_claimed JSONB DEFAULT '[]',
  total_rewards_value NUMERIC(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subscription_id, user_id, type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_type ON subscriptions(type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_type ON subscriptions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_type ON subscription_tiers(type);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_active ON subscription_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON subscription_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON subscription_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_type ON subscription_usage(type);

-- Enable Row Level Security on new tables
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscription_tiers
CREATE POLICY "Anyone can view active subscription tiers" ON subscription_tiers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage subscription tiers" ON subscription_tiers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create RLS policies for subscription_usage
CREATE POLICY "Users can view own subscription usage" ON subscription_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription usage" ON subscription_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all subscription usage" ON subscription_usage
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON subscription_tiers TO anon, authenticated;
GRANT SELECT ON subscription_usage TO authenticated;
GRANT UPDATE ON subscription_usage TO authenticated;

-- Insert default subscription tiers
INSERT INTO subscription_tiers (
  type, name, display_name, description, monthly_price, yearly_price, currency,
  benefits, features, badge, color, icon, "order", popular_badge
) VALUES 
(
  'loyalty', 'loyal', 'Loyal Member', 'Enhanced loyalty rewards and exclusive discounts',
  9.99, 99.99, 'EUR',
  ARRAY['2x loyalty points on all purchases', 'Additional 10% discount on services', 'Priority customer support', 'Early access to new features', 'Exclusive loyalty rewards', '5 premium themes included'],
  '{"loyaltyPointsMultiplier": 2, "loyaltyDiscountPercentage": 10, "prioritySupport": true, "earlyAccess": true, "themeCount": 5}',
  '{"text": "LOYAL", "bgColor": "bg-amber-500", "textColor": "text-white", "icon": "star", "gradient": false, "pulse": false}',
  '#f59e0b', 'star', 1, false
),
(
  'vip', 'vip', 'VIP Premium', 'Complete access to all premium features and unlimited sessions',
  49.99, 499.99, 'EUR',
  ARRAY['Unlimited therapy sessions', 'Personal dedicated therapist', 'Access to group therapy sessions', 'Advanced AI insights & reports', 'Monthly progress reports', 'All premium themes unlocked', 'VIP community access', 'Exclusive VIP events', 'Priority booking', 'Ad-free experience'],
  '{"unlimitedSessions": true, "personalTherapist": true, "groupSessions": true, "aiInsightsAdvanced": true, "monthlyReports": true, "customThemes": true, "themeCount": 999, "exclusiveContent": true, "exerciseLibraryFull": true, "communityAccess": true, "vipEvents": true, "earlyAccess": true, "adFree": true, "dataExport": true, "loyaltyPointsMultiplier": 1.5, "prioritySupport": true}',
  '{"text": "VIP", "bgColor": "bg-gradient-to-r from-purple-600 to-pink-600", "textColor": "text-white", "icon": "crown", "gradient": true, "pulse": true}',
  '#9333ea', 'crown', 2, true
)
ON CONFLICT (type) DO NOTHING;