-- Migration: External Services Catalog (Square & Stripe)
-- Description: Normalized tables for storing Square and Stripe service/product data
-- Created: 2025-11-21

-- ==================== EXTERNAL SERVICE PROVIDERS TABLE ====================
-- Tracks which external payment/booking platforms are integrated
CREATE TABLE IF NOT EXISTS external_service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name VARCHAR(50) NOT NULL UNIQUE CHECK (provider_name IN ('square', 'stripe', 'auth0', 'other')),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    api_version VARCHAR(50),
    last_sync_at TIMESTAMPTZ,
    sync_status VARCHAR(50) CHECK (sync_status IN ('idle', 'syncing', 'success', 'error')),
    sync_error TEXT,
    config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== EXTERNAL PRODUCTS TABLE ====================
-- Normalized storage for products/services from external platforms
CREATE TABLE IF NOT EXISTS external_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES external_service_providers(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL, -- Stripe product ID or Square catalog object ID
    internal_service_id UUID REFERENCES services(id) ON DELETE SET NULL, -- Link to internal services table
    
    -- Product Details
    name VARCHAR(500) NOT NULL,
    description TEXT,
    product_type VARCHAR(100), -- 'service', 'good', 'subscription', etc.
    category VARCHAR(200),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata from external service
    external_data JSONB DEFAULT '{}', -- Full JSON from external API
    images TEXT[], -- Array of image URLs
    
    -- Sync tracking
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT external_products_provider_external_id_unique UNIQUE (provider_id, external_id)
);

-- ==================== EXTERNAL PRICES TABLE ====================
-- Normalized storage for pricing from external platforms
CREATE TABLE IF NOT EXISTS external_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES external_service_providers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES external_products(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL, -- Stripe price ID or Square variation ID
    
    -- Price Details
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP', 'CAD', 'AUD')),
    
    -- Pricing Type
    pricing_type VARCHAR(50) NOT NULL CHECK (pricing_type IN ('one_time', 'recurring', 'usage_based', 'tiered')),
    
    -- Recurring Details (for subscriptions)
    recurring_interval VARCHAR(20) CHECK (recurring_interval IN ('day', 'week', 'month', 'year')),
    recurring_interval_count INTEGER CHECK (recurring_interval_count > 0),
    trial_period_days INTEGER CHECK (trial_period_days >= 0),
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    external_data JSONB DEFAULT '{}',
    
    -- Sync tracking
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT external_prices_provider_external_id_unique UNIQUE (provider_id, external_id)
);

-- ==================== EXTERNAL CUSTOMERS TABLE ====================
-- Normalized storage for customer data from external platforms
CREATE TABLE IF NOT EXISTS external_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES external_service_providers(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL, -- Stripe customer ID or Square customer ID
    internal_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Customer Details
    email VARCHAR(320),
    name VARCHAR(500),
    phone VARCHAR(50),
    
    -- Address
    address JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    
    -- Metadata
    external_data JSONB DEFAULT '{}',
    
    -- Sync tracking
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT external_customers_provider_external_id_unique UNIQUE (provider_id, external_id)
);

-- ==================== EXTERNAL SUBSCRIPTIONS TABLE ====================
-- Normalized storage for subscription data from external platforms
CREATE TABLE IF NOT EXISTS external_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES external_service_providers(id) ON DELETE CASCADE,
    external_id VARCHAR(255) NOT NULL, -- Stripe subscription ID
    customer_id UUID NOT NULL REFERENCES external_customers(id) ON DELETE CASCADE,
    price_id UUID REFERENCES external_prices(id) ON DELETE SET NULL,
    internal_subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Subscription Status
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid', 'paused')),
    
    -- Period
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    
    -- Trial
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Cancellation
    canceled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Metadata
    external_data JSONB DEFAULT '{}',
    
    -- Sync tracking
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_version INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT external_subscriptions_provider_external_id_unique UNIQUE (provider_id, external_id)
);

-- ==================== EXTERNAL SYNC LOG TABLE ====================
-- Track sync operations for auditing and debugging
CREATE TABLE IF NOT EXISTS external_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES external_service_providers(id) ON DELETE CASCADE,
    sync_type VARCHAR(100) NOT NULL, -- 'products', 'prices', 'customers', 'subscriptions'
    sync_operation VARCHAR(50) NOT NULL CHECK (sync_operation IN ('full_sync', 'incremental', 'single_item')),
    
    -- Sync Results
    status VARCHAR(50) NOT NULL CHECK (status IN ('started', 'in_progress', 'success', 'partial_success', 'failed')),
    items_processed INTEGER DEFAULT 0,
    items_created INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_deleted INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    
    -- Error Tracking
    error_message TEXT,
    error_details JSONB DEFAULT '{}',
    
    -- Timing
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    
    -- Metadata
    triggered_by VARCHAR(100), -- 'manual', 'scheduled', 'webhook', 'api'
    metadata JSONB DEFAULT '{}'
);

-- ==================== INDEXES ====================

-- External Products
CREATE INDEX IF NOT EXISTS idx_external_products_provider ON external_products(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_products_external_id ON external_products(external_id);
CREATE INDEX IF NOT EXISTS idx_external_products_internal_service ON external_products(internal_service_id);
CREATE INDEX IF NOT EXISTS idx_external_products_is_active ON external_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_external_products_name ON external_products USING gin(name gin_trgm_ops);

-- External Prices
CREATE INDEX IF NOT EXISTS idx_external_prices_provider ON external_prices(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_prices_product ON external_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_external_prices_external_id ON external_prices(external_id);
CREATE INDEX IF NOT EXISTS idx_external_prices_is_active ON external_prices(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_external_prices_currency ON external_prices(currency);

-- External Customers
CREATE INDEX IF NOT EXISTS idx_external_customers_provider ON external_customers(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_customers_external_id ON external_customers(external_id);
CREATE INDEX IF NOT EXISTS idx_external_customers_internal_user ON external_customers(internal_user_id);
CREATE INDEX IF NOT EXISTS idx_external_customers_email ON external_customers(email);

-- External Subscriptions
CREATE INDEX IF NOT EXISTS idx_external_subscriptions_provider ON external_subscriptions(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_subscriptions_customer ON external_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_external_subscriptions_status ON external_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_external_subscriptions_external_id ON external_subscriptions(external_id);

-- Sync Log
CREATE INDEX IF NOT EXISTS idx_external_sync_log_provider ON external_sync_log(provider_id);
CREATE INDEX IF NOT EXISTS idx_external_sync_log_started_at ON external_sync_log(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_external_sync_log_status ON external_sync_log(status);

-- ==================== FUNCTIONS ====================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_external_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

-- Updated at triggers
CREATE TRIGGER external_service_providers_updated_at
    BEFORE UPDATE ON external_service_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_external_services_updated_at();

CREATE TRIGGER external_products_updated_at
    BEFORE UPDATE ON external_products
    FOR EACH ROW
    EXECUTE FUNCTION update_external_services_updated_at();

CREATE TRIGGER external_prices_updated_at
    BEFORE UPDATE ON external_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_external_services_updated_at();

CREATE TRIGGER external_customers_updated_at
    BEFORE UPDATE ON external_customers
    FOR EACH ROW
    EXECUTE FUNCTION update_external_services_updated_at();

CREATE TRIGGER external_subscriptions_updated_at
    BEFORE UPDATE ON external_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_external_services_updated_at();

-- ==================== INITIAL DATA ====================

-- Insert provider records
INSERT INTO external_service_providers (provider_name, is_enabled, api_version, sync_status)
VALUES 
    ('stripe', true, 'v1', 'idle'),
    ('square', true, 'v2', 'idle')
ON CONFLICT (provider_name) DO NOTHING;

-- ==================== COMMENTS ====================

COMMENT ON TABLE external_service_providers IS 'Tracks integrated external payment and booking platforms';
COMMENT ON TABLE external_products IS 'Normalized storage for products/services from external platforms (Square, Stripe)';
COMMENT ON TABLE external_prices IS 'Normalized storage for pricing information from external platforms';
COMMENT ON TABLE external_customers IS 'Normalized storage for customer data from external platforms';
COMMENT ON TABLE external_subscriptions IS 'Normalized storage for subscription data from external platforms';
COMMENT ON TABLE external_sync_log IS 'Audit log for sync operations with external services';
