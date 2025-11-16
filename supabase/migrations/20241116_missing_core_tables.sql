-- Migration: Missing Core Tables for Therapy Platform
-- Description: Creates essential missing tables for wallets, payments, behavioral tracking, AI personalization, tiering, billing, and content management
-- Created: 2024-11-16

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== WALLET AND PAYMENT SYSTEM ====================

-- Wallets table for user financial accounts
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_paused BOOLEAN NOT NULL DEFAULT false,
    pause_reason TEXT,
    last_transaction_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT wallets_user_id_unique UNIQUE (user_id)
);

-- Wallet transactions for tracking all financial movements
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount != 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit', 'refund', 'adjustment')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    reference_id VARCHAR(100), -- For external payment references
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Purchasable items catalog
CREATE TABLE purchasable_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('session', 'subscription', 'resource', 'tool', 'course')),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP')),
    category VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User purchases tracking
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES purchasable_items(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    metadata JSONB DEFAULT '{}',
    fulfilled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment requests for manual payment processing (Bizum, Cash)
CREATE TABLE payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(200) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    method VARCHAR(20) NOT NULL CHECK (method IN ('bizum', 'cash', 'bank_transfer')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'user_confirmed', 'confirmed', 'rejected', 'cancelled', 'expired')),
    description TEXT NOT NULL,
    proof_image_url TEXT,
    proof_text TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    confirmed_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES auth.users(id),
    confirmed_by_name VARCHAR(200),
    confirmed_by_role VARCHAR(50),
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== USER PROFILES AND ROLES ====================

-- User profiles extension
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(200),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    is_therapist BOOLEAN NOT NULL DEFAULT false,
    therapist_verified BOOLEAN NOT NULL DEFAULT false,
    license_number VARCHAR(100),
    years_of_experience INTEGER CHECK (years_of_experience >= 0),
    specialties TEXT[], -- Array of specialty strings
    education TEXT[], -- Array of education entries
    certifications TEXT[], -- Array of certification strings
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id),
    CONSTRAINT user_profiles_email_unique UNIQUE (email)
);

-- User roles system
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'therapist', 'admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);

-- Custom roles for flexible permission system
CREATE TABLE custom_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}', -- JSON object with permission flags
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role assignment audit log
CREATE TABLE role_assignments_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('assigned', 'revoked', 'updated')),
    role_type VARCHAR(50) NOT NULL,
    role_name VARCHAR(100),
    performed_by UUID REFERENCES auth.users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== TIER AND SUBSCRIPTION SYSTEM ====================

-- User tiers for loyalty/VIP programs
CREATE TABLE user_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_type VARCHAR(20) NOT NULL CHECK (tier_type IN ('free', 'loyal', 'vip')),
    tier_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deactivated_at TIMESTAMPTZ,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_tiers_user_id_unique UNIQUE (user_id)
);

-- Tier assignment audit log
CREATE TABLE tier_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('assigned', 'revoked', 'updated')),
    tier_type VARCHAR(20) NOT NULL,
    tier_name VARCHAR(100),
    performed_by UUID REFERENCES auth.users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscription tiers configuration
CREATE TABLE subscription_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('free', 'loyal', 'vip')),
    benefits JSONB NOT NULL DEFAULT '[]', -- Array of benefit objects
    requirements JSONB NOT NULL DEFAULT '{}', -- Requirements for tier
    monthly_price DECIMAL(10,2),
    yearly_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscription usage tracking
CREATE TABLE subscription_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    session_count INTEGER DEFAULT 0 CHECK (session_count >= 0),
    ai_interactions INTEGER DEFAULT 0 CHECK (ai_interactions >= 0),
    themes_accessed TEXT[] DEFAULT '{}',
    rewards_earned INTEGER DEFAULT 0 CHECK (rewards_earned >= 0),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT subscription_usage_subscription_id_period_unique UNIQUE (subscription_id, period_start, period_end)
);

-- ==================== BEHAVIORAL TRACKING AND ANALYTICS ====================

-- User interactions tracking
CREATE TABLE user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('page_view', 'click', 'scroll', 'form_submit', 'video_play', 'download', 'share')),
    page_path VARCHAR(500) NOT NULL,
    element_id VARCHAR(100),
    element_text TEXT,
    metadata JSONB DEFAULT '{}',
    session_id VARCHAR(100),
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    user_agent TEXT,
    referrer VARCHAR(500),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Behavioral patterns analysis
CREATE TABLE behavioral_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('engagement_decline', 'high_activity', 'session_abandonment', 'feature_adoption', 'retention_risk')),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    evidence JSONB NOT NULL DEFAULT '[]', -- Array of evidence objects
    severity VARCHAR(10) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    first_detected TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Predictive insights for user behavior
CREATE TABLE predictive_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('churn_risk', 'upgrade_likelihood', 'engagement_boost', 'wellness_decline', 'therapy_progress')),
    probability DECIMAL(3,2) NOT NULL CHECK (probability >= 0 AND probability <= 1),
    contributing_factors JSONB NOT NULL DEFAULT '[]', -- Array of factor objects
    recommended_actions JSONB NOT NULL DEFAULT '[]', -- Array of action objects
    timeframe VARCHAR(20) NOT NULL CHECK (timeframe IN ('immediate', 'short_term', 'medium_term', 'long_term')),
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    expires_at TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== AI PERSONALIZATION ====================

-- AI personalization profiles
CREATE TABLE ai_personalization_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    behavior_patterns JSONB NOT NULL DEFAULT '{}',
    preferences JSONB NOT NULL DEFAULT '{}',
    wellness_insights JSONB NOT NULL DEFAULT '{}',
    adaptive_settings JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI generated insights
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_id VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('wellness', 'therapy', 'behavioral', 'progress', 'recommendation')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
    action_items JSONB NOT NULL DEFAULT '[]', -- Array of action items
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== BILLING AND INVOICING ====================

-- Billing transactions
CREATE TABLE billing_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount != 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    type VARCHAR(50) NOT NULL CHECK (type IN ('charge', 'refund', 'adjustment', 'credit')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    description TEXT NOT NULL,
    reference_id VARCHAR(100), -- External payment reference
    gateway VARCHAR(50), -- Payment gateway used
    gateway_transaction_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Billing invoices
CREATE TABLE billing_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== NOTIFICATIONS AND SETTINGS ====================

-- Notifications system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'reminder')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    payload JSONB DEFAULT '{}', -- Additional notification data
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User settings
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}', -- User preferences object
    privacy_settings JSONB NOT NULL DEFAULT '{}',
    notification_settings JSONB NOT NULL DEFAULT '{}',
    accessibility_settings JSONB NOT NULL DEFAULT '{}',
    theme_preferences JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== CONTENT AND ACTIVITY TABLES ====================

-- Appointments system
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID, -- Reference to therapy_sessions when implemented
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    type VARCHAR(50) DEFAULT 'therapy' CHECK (type IN ('therapy', 'consultation', 'follow_up', 'assessment')),
    location VARCHAR(200), -- Physical location or video link
    is_online BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT appointments_time_check CHECK (end_time > start_time)
);

-- User reports and assessments
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('progress', 'assessment', 'summary', 'discharge')),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Therapist or system
    is_generated BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    is_confidential BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Journal entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    mood VARCHAR(20) CHECK (mood IN ('excellent', 'good', 'neutral', 'bad', 'terrible')),
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    tags TEXT[] DEFAULT '{}',
    is_private BOOLEAN NOT NULL DEFAULT true,
    ai_analysis JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('wellness', 'therapy', 'habit', 'career', 'relationship', 'general')),
    target_date DATE,
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    is_achieved BOOLEAN NOT NULL DEFAULT false,
    achieved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercises and activities
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('mindfulness', 'cognitive', 'physical', 'breathing', 'journaling', 'general')),
    difficulty_level VARCHAR(10) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    instructions TEXT,
    media_urls JSONB DEFAULT '[]', -- Array of media URLs
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User exercise completions
CREATE TABLE user_exercise_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_minutes INTEGER CHECK (duration_minutes > 0),
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT user_exercise_completions_user_exercise_unique UNIQUE (user_id, exercise_id, completed_at)
);

-- Messages and communications
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(200),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'direct' CHECK (message_type IN ('direct', 'system', 'notification', 'announcement')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    is_deleted_by_sender BOOLEAN NOT NULL DEFAULT false,
    is_deleted_by_recipient BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Donations tracking
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional recipient
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    cause VARCHAR(200), -- Donation cause or campaign
    message TEXT,
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessments and evaluations
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('intake', 'progress', 'discharge', 'screening', 'evaluation')),
    questions JSONB NOT NULL DEFAULT '[]', -- Array of question objects
    responses JSONB DEFAULT '{}', -- User responses object
    scores JSONB DEFAULT '{}', -- Calculated scores object
    interpretation TEXT,
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Assessor
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Templates for various content types
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('assessment', 'report', 'exercise', 'message', 'form')),
    category VARCHAR(100),
    content JSONB NOT NULL, -- Template content structure
    description TEXT,
    is_system_template BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products for e-commerce integration
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'digital' CHECK (type IN ('digital', 'physical', 'service')),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    sku VARCHAR(100) UNIQUE,
    stripe_product_id VARCHAR(100), -- Stripe integration
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mood tracking
CREATE TABLE mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood VARCHAR(20) NOT NULL CHECK (mood IN ('excellent', 'good', 'neutral', 'bad', 'terrible')),
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    notes TEXT,
    factors TEXT[] DEFAULT '{}', -- Array of influencing factors
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== AUDIT AND SYSTEM LOGGING ====================

-- Audit logs for compliance and tracking
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- System logs for application monitoring
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
    message TEXT NOT NULL,
    context JSONB DEFAULT '{}',
    error_stack TEXT,
    request_id VARCHAR(100),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== INDEXES FOR PERFORMANCE ====================

-- Wallet indexes
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_is_active ON wallets(is_active);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

-- Payment indexes
CREATE INDEX idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_created_at ON payment_requests(created_at DESC);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- User management indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_role_assignments_log_user_id ON role_assignments_log(user_id);

-- Tier and subscription indexes
CREATE INDEX idx_user_tiers_user_id ON user_tiers(user_id);
CREATE INDEX idx_user_tiers_tier_type ON user_tiers(tier_type);
CREATE INDEX idx_tier_audit_logs_user_id ON tier_audit_logs(user_id);
CREATE INDEX idx_subscription_usage_user_id ON subscription_usage(user_id);
CREATE INDEX idx_subscription_usage_period ON subscription_usage(period_start, period_end);

-- Behavioral tracking indexes
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp DESC);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_behavioral_patterns_user_id ON behavioral_patterns(user_id);
CREATE INDEX idx_behavioral_patterns_type ON behavioral_patterns(pattern_type);
CREATE INDEX idx_predictive_insights_user_id ON predictive_insights(user_id);
CREATE INDEX idx_predictive_insights_type ON predictive_insights(insight_type);

-- AI personalization indexes
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_ai_insights_type ON ai_insights(type);

-- Content and activity indexes
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX idx_mood_logs_logged_at ON mood_logs(logged_at DESC);

-- Audit and system log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);

-- ==================== TRIGGERS FOR UPDATED_AT ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallet_transactions_updated_at BEFORE UPDATE ON wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at BEFORE UPDATE ON payment_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_roles_updated_at BEFORE UPDATE ON custom_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_tiers_updated_at BEFORE UPDATE ON user_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_tiers_updated_at BEFORE UPDATE ON subscription_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_behavioral_patterns_updated_at BEFORE UPDATE ON behavioral_patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictive_insights_updated_at BEFORE UPDATE ON predictive_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_personalization_profiles_updated_at BEFORE UPDATE ON ai_personalization_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON ai_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_transactions_updated_at BEFORE UPDATE ON billing_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_invoices_updated_at BEFORE UPDATE ON billing_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_logs_updated_at BEFORE UPDATE ON mood_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchasable_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_personalization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- ==================== INITIAL DATA SEEDING ====================

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, type, benefits, requirements, monthly_price, yearly_price, currency, sort_order) VALUES
('Free', 'free', '[{"feature": "Basic therapy sessions", "limit": 3}, {"feature": "Community access"}, {"feature": "Basic mood tracking"}]', '{"min_sessions": 0, "max_sessions": 3}', 0.00, 0.00, 'EUR', 1),
('Loyal', 'loyal', '[{"feature": "Unlimited therapy sessions"}, {"feature": "AI insights"}, {"feature": "Advanced analytics"}, {"feature": "Priority support"}]', '{"min_sessions": 10, "subscription_months": 3}', 29.99, 299.99, 'EUR', 2),
('VIP', 'vip', '[{"feature": "Everything in Loyal"}, {"feature": "Personalized AI coach"}, {"feature": "Exclusive content"}, {"feature": "Direct therapist access"}, {"feature": "Premium features"}]', '{"min_sessions": 25, "subscription_months": 6}', 59.99, 599.99, 'EUR', 3);

-- Insert default custom roles
INSERT INTO custom_roles (name, description, permissions, is_system_role) VALUES
('therapist_basic', 'Basic therapist role with core permissions', '{"can_view_patients": true, "can_create_sessions": true, "can_write_notes": true, "can_view_reports": false}', true),
('therapist_advanced', 'Advanced therapist with reporting access', '{"can_view_patients": true, "can_create_sessions": true, "can_write_notes": true, "can_view_reports": true, "can_manage_assessments": true}', true),
('admin_basic', 'Basic admin role', '{"can_manage_users": true, "can_view_analytics": true, "can_manage_content": true, "can_view_payments": false}', true),
('admin_full', 'Full admin access', '{"can_manage_users": true, "can_view_analytics": true, "can_manage_content": true, "can_view_payments": true, "can_manage_tiers": true, "can_manage_roles": true}', true);

-- Insert sample purchasable items
INSERT INTO purchasable_items (type, name, description, price, currency, category, metadata) VALUES
('session', 'Individual Therapy Session', 'One-on-one therapy session with a licensed therapist', 50.00, 'EUR', 'therapy', '{"duration": 50, "session_type": "individual"}'),
('session', 'Couples Therapy Session', 'Therapy session for couples', 80.00, 'EUR', 'therapy', '{"duration": 60, "session_type": "couples"}'),
('subscription', 'Monthly Premium Access', 'Monthly subscription with premium features', 29.99, 'EUR', 'subscription', '{"billing_cycle": "monthly", "tier": "loyal"}'),
('resource', 'Mindfulness Guide', 'Comprehensive mindfulness and meditation guide', 15.00, 'EUR', 'resource', '{"format": "pdf", "pages": 50}'),
('tool', 'Anxiety Assessment Tool', 'Professional anxiety assessment and tracking tool', 25.00, 'EUR', 'assessment', '{"validations": ["clinical", "research"], "duration": 20}');

-- Insert sample exercises
INSERT INTO exercises (title, description, category, difficulty_level, duration_minutes, instructions) VALUES
('Mindful Breathing', 'A simple breathing exercise to reduce stress and increase awareness', 'breathing', 'beginner', 5, '1. Find a comfortable position. 2. Close your eyes. 3. Focus on your breath. 4. Count to 4 while inhaling, hold for 4, exhale for 4.'),
('Body Scan Meditation', 'Progressive relaxation technique focusing on different body parts', 'mindfulness', 'beginner', 10, '1. Lie down comfortably. 2. Start from your toes. 3. Progressively focus on each body part. 4. Notice sensations without judgment.'),
('Gratitude Journaling', 'Write down three things you are grateful for today', 'journaling', 'beginner', 10, '1. Get your journal. 2. Write three things you are grateful for. 3. Reflect on why you are grateful for each.'),
('Cognitive Restructuring', 'Challenge and reframe negative thoughts', 'cognitive', 'intermediate', 15, '1. Identify negative thought. 2. Examine evidence for and against. 3. Generate balanced alternative thought. 4. Practice new thought.'),
('Progressive Muscle Relaxation', 'Systematic tensing and relaxing of muscle groups', 'physical', 'beginner', 15, '1. Start with your feet. 2. Tense muscles for 5 seconds. 3. Release and relax for 10 seconds. 4. Move up through each muscle group.');