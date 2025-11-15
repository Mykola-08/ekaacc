-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile_data JSONB,
  subscription_status TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  is_premium BOOLEAN DEFAULT FALSE,
  referral_code TEXT,
  referred_by TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_data JSONB NOT NULL,
  mood_rating INTEGER,
  notes TEXT,
  duration INTEGER
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  reward_claimed BOOLEAN DEFAULT FALSE,
  UNIQUE(referrer_id, referred_id)
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_is_approved ON community_posts(is_approved);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON users
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create RLS policies for sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all subscriptions" ON subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create RLS policies for referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Create RLS policies for community posts
CREATE POLICY "Anyone can view approved posts" ON community_posts
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all posts" ON community_posts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon, authenticated;
GRANT INSERT ON users TO anon, authenticated;
GRANT UPDATE ON users TO authenticated;

GRANT SELECT ON sessions TO authenticated;
GRANT INSERT ON sessions TO authenticated;
GRANT UPDATE ON sessions TO authenticated;

GRANT SELECT ON subscriptions TO authenticated;
GRANT INSERT ON subscriptions TO authenticated;
GRANT UPDATE ON subscriptions TO authenticated;

GRANT SELECT ON referrals TO authenticated;
GRANT INSERT ON referrals TO authenticated;
GRANT UPDATE ON referrals TO authenticated;

GRANT SELECT ON community_posts TO anon, authenticated;
GRANT INSERT ON community_posts TO authenticated;
GRANT UPDATE ON community_posts TO authenticated;