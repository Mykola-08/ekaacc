-- Migration: Missing Tables for Therapy Platform
-- Description: Creates missing tables for services, user_preferences, subscriptions, and community_posts
-- Created: 2024-11-16

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== SERVICES TABLE ====================
-- Therapy service catalog for different types of therapy services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL CHECK (category IN ('individual', 'couples', 'group', 'family', 'child', 'adolescent', 'corporate')),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 180),
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP')),
    therapist_specialization VARCHAR(200),
    target_audience VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    requires_approval BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT services_name_category_unique UNIQUE (name, category)
);

-- ==================== USER PREFERENCES TABLE ====================
-- User-specific preferences and settings for personalization
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('patient', 'therapist', 'admin')),
    goals TEXT[] DEFAULT '{}',
    concerns TEXT[] DEFAULT '{}',
    preferred_communication VARCHAR(50) DEFAULT 'email' CHECK (preferred_communication IN ('email', 'sms', 'push', 'in_app')),
    preferred_therapy_type VARCHAR(100),
    preferred_session_duration INTEGER CHECK (preferred_session_duration IN (30, 45, 60, 90, 120)),
    preferred_therapist_gender VARCHAR(20) CHECK (preferred_therapist_gender IN ('male', 'female', 'non_binary', 'no_preference')),
    language_preference VARCHAR(10) NOT NULL DEFAULT 'en',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    notification_frequency VARCHAR(20) DEFAULT 'daily' CHECK (notification_frequency IN ('real_time', 'daily', 'weekly', 'monthly', 'never')),
    notify_tips BOOLEAN DEFAULT true,
    notify_reminders BOOLEAN DEFAULT true,
    notify_achievements BOOLEAN DEFAULT true,
    notify_community BOOLEAN DEFAULT true,
    privacy_level VARCHAR(20) DEFAULT 'standard' CHECK (privacy_level IN ('minimal', 'standard', 'enhanced', 'maximum')),
    theme_preference VARCHAR(20) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    accessibility_needs TEXT[] DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_preferences_user_id_unique UNIQUE (user_id)
);

-- ==================== SUBSCRIPTIONS TABLE ====================
-- User subscription management and billing information
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused')),
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'loyal', 'vip', 'custom')),
    tier_id UUID REFERENCES subscription_tiers(id) ON DELETE SET NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    cancel_reason TEXT,
    auto_renew BOOLEAN DEFAULT true,
    payment_method_id VARCHAR(255),
    payment_failure_count INTEGER DEFAULT 0 CHECK (payment_failure_count >= 0),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id),
    CONSTRAINT subscriptions_stripe_subscription_id_unique UNIQUE (stripe_subscription_id)
);

-- ==================== COMMUNITY POSTS TABLE ====================
-- Community forum posts and discussions
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general' CHECK (category IN ('general', 'success_stories', 'questions', 'resources', 'support', 'announcements')),
    tags TEXT[] DEFAULT '{}',
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    replies_count INTEGER DEFAULT 0 CHECK (replies_count >= 0),
    views_count INTEGER DEFAULT 0 CHECK (views_count >= 0),
    is_approved BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== INDEXES FOR PERFORMANCE ====================

-- Services indexes
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_name_trgm ON services USING gin (name gin_trgm_ops);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_role ON user_preferences(role);
CREATE INDEX idx_user_preferences_language ON user_preferences(language_preference);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_period ON subscriptions(current_period_start, current_period_end);

-- Community posts indexes
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_is_approved ON community_posts(is_approved);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_likes ON community_posts(likes DESC);
CREATE INDEX idx_community_posts_title_trgm ON community_posts USING gin (title gin_trgm_ops);
CREATE INDEX idx_community_posts_tags ON community_posts USING gin (tags);

-- ==================== TRIGGERS FOR UPDATED_AT ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Services RLS policies
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- User preferences RLS policies
CREATE POLICY "Users can view their own preferences" ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all preferences" ON user_preferences FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Subscriptions RLS policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Service role can manage subscriptions" ON subscriptions FOR ALL
    USING (auth.jwt() ->> 'role' = 'service');

-- Community posts RLS policies
CREATE POLICY "Community posts are viewable by authenticated users" ON community_posts FOR SELECT
    USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can create community posts" ON community_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON community_posts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all community posts" ON community_posts FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- ==================== GRANT PERMISSIONS ====================

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON services TO anon;
GRANT SELECT ON services TO authenticated;
GRANT ALL ON services TO authenticated;

GRANT SELECT ON user_preferences TO authenticated;
GRANT INSERT ON user_preferences TO authenticated;
GRANT UPDATE ON user_preferences TO authenticated;
GRANT DELETE ON user_preferences TO authenticated;

GRANT SELECT ON subscriptions TO authenticated;
GRANT INSERT ON subscriptions TO authenticated;
GRANT UPDATE ON subscriptions TO authenticated;

GRANT SELECT ON community_posts TO anon;
GRANT SELECT ON community_posts TO authenticated;
GRANT INSERT ON community_posts TO authenticated;
GRANT UPDATE ON community_posts TO authenticated;
GRANT DELETE ON community_posts TO authenticated;

-- ==================== INITIAL DATA SEEDING ====================

-- Insert default therapy services
INSERT INTO services (name, description, category, duration_minutes, base_price, currency, therapist_specialization, target_audience, is_active) VALUES
('Individual Therapy Session', 'One-on-one therapy session with a licensed therapist focusing on your specific needs and goals', 'individual', 50, 50.00, 'EUR', 'General therapy, CBT, anxiety, depression', 'Adults seeking personal therapy', true),
('Couples Therapy Session', 'Therapy session designed to help couples improve communication and resolve conflicts', 'couples', 60, 80.00, 'EUR', 'Couples counseling, relationship therapy', 'Couples in relationships', true),
('Family Therapy Session', 'Therapy involving multiple family members to address family dynamics and relationships', 'family', 75, 90.00, 'EUR', 'Family systems therapy, relationship counseling', 'Families seeking group therapy', true),
('Child Therapy Session', 'Specialized therapy for children using age-appropriate techniques and approaches', 'child', 45, 45.00, 'EUR', 'Child psychology, play therapy', 'Children ages 4-12', true),
('Adolescent Therapy Session', 'Therapy specifically designed for teenagers dealing with adolescent challenges', 'adolescent', 50, 50.00, 'EUR', 'Adolescent psychology, developmental therapy', 'Teenagers ages 13-18', true),
('Group Therapy Session', 'Therapy session with multiple participants sharing similar concerns', 'group', 90, 35.00, 'EUR', 'Group therapy facilitation', 'Adults comfortable with group settings', true),
('Corporate Wellness Session', 'Workplace-focused therapy and wellness programs for employees', 'corporate', 60, 120.00, 'EUR', 'Occupational psychology, workplace wellness', 'Corporate employees and teams', true),
('Emergency Crisis Session', 'Immediate support for individuals in crisis or experiencing acute distress', 'individual', 30, 75.00, 'EUR', 'Crisis intervention, emergency psychology', 'Individuals in acute distress', true);