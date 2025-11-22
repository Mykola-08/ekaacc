-- Migration: Product Types and Bookings Explanation
-- Description: Add product types reference table and bookings explanation for better categorization
-- Created: 2025-11-21

-- ==================== PRODUCT TYPES TABLE ====================
-- Reference table for standardized product/service types
CREATE TABLE IF NOT EXISTS product_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_code VARCHAR(50) NOT NULL UNIQUE,
    type_name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) CHECK (category IN ('therapy', 'wellness', 'subscription', 'package', 'consultation', 'specialty', 'other')),
    icon VARCHAR(100), -- Icon name or emoji for UI
    color VARCHAR(50), -- Color code for UI styling
    is_bookable BOOLEAN DEFAULT true, -- Can this type be booked directly
    requires_consultation BOOLEAN DEFAULT false, -- Requires consultation before booking
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==================== BOOKING EXPLANATIONS TABLE ====================
-- Stores explanations, guidelines, and information about different booking types
CREATE TABLE IF NOT EXISTS booking_explanations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    
    -- Booking guidelines
    what_to_expect TEXT, -- What the client should expect
    preparation_instructions TEXT, -- How to prepare for the session
    duration_info TEXT, -- Information about duration
    cancellation_policy TEXT, -- Cancellation policy
    
    -- Pricing & availability
    pricing_notes TEXT,
    availability_notes TEXT,
    
    -- FAQs
    faqs JSONB DEFAULT '[]', -- Array of {question, answer} objects
    
    -- Additional info
    contraindications TEXT, -- When NOT to book this service
    benefits TEXT[], -- Array of key benefits
    recommended_for TEXT[], -- Array of recommended conditions/situations
    
    -- Media
    images TEXT[], -- Array of image URLs
    video_url TEXT,
    
    -- Localization
    language VARCHAR(10) DEFAULT 'en',
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    display_priority INTEGER DEFAULT 0,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT booking_explanations_product_type_language_unique UNIQUE (product_type_id, language)
);

-- ==================== PRODUCT TYPE MAPPINGS TABLE ====================
-- Maps external products to internal product types
CREATE TABLE IF NOT EXISTS product_type_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
    
    -- External mapping
    external_product_id UUID REFERENCES external_products(id) ON DELETE CASCADE,
    
    -- Internal mapping
    internal_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    
    -- Mapping metadata
    mapping_confidence DECIMAL(3,2) CHECK (mapping_confidence >= 0 AND mapping_confidence <= 1), -- 0.0 to 1.0
    mapping_source VARCHAR(50) CHECK (mapping_source IN ('manual', 'automatic', 'ai_suggested', 'user_input')),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure only one mapping per external product
    CONSTRAINT product_type_mappings_external_unique UNIQUE (external_product_id),
    -- Ensure only one mapping per internal service
    CONSTRAINT product_type_mappings_internal_unique UNIQUE (internal_service_id)
);

-- ==================== INDEXES ====================

-- Product Types
CREATE INDEX IF NOT EXISTS idx_product_types_category ON product_types(category);
CREATE INDEX IF NOT EXISTS idx_product_types_is_active ON product_types(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_types_type_code ON product_types(type_code);

-- Booking Explanations
CREATE INDEX IF NOT EXISTS idx_booking_explanations_product_type ON booking_explanations(product_type_id);
CREATE INDEX IF NOT EXISTS idx_booking_explanations_language ON booking_explanations(language);
CREATE INDEX IF NOT EXISTS idx_booking_explanations_is_published ON booking_explanations(is_published) WHERE is_published = true;

-- Product Type Mappings
CREATE INDEX IF NOT EXISTS idx_product_type_mappings_type ON product_type_mappings(product_type_id);
CREATE INDEX IF NOT EXISTS idx_product_type_mappings_external ON product_type_mappings(external_product_id);
CREATE INDEX IF NOT EXISTS idx_product_type_mappings_internal ON product_type_mappings(internal_service_id);
CREATE INDEX IF NOT EXISTS idx_product_type_mappings_is_active ON product_type_mappings(is_active) WHERE is_active = true;

-- ==================== FUNCTIONS ====================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_product_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

CREATE TRIGGER product_types_updated_at
    BEFORE UPDATE ON product_types
    FOR EACH ROW
    EXECUTE FUNCTION update_product_types_updated_at();

CREATE TRIGGER booking_explanations_updated_at
    BEFORE UPDATE ON booking_explanations
    FOR EACH ROW
    EXECUTE FUNCTION update_product_types_updated_at();

CREATE TRIGGER product_type_mappings_updated_at
    BEFORE UPDATE ON product_type_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_product_types_updated_at();

-- ==================== INITIAL DATA ====================

-- Insert standard product types
INSERT INTO product_types (type_code, type_name, description, category, icon, color, is_bookable, display_order) VALUES
    ('kinesiology', 'Kinesiology Session', 'Integrative therapy combining body, mind, and emotions', 'therapy', 'user', '#4F46E5', true, 1),
    ('massage-basic', 'Basic Massage', 'Traditional massage therapy for relaxation and muscle relief', 'therapy', 'activity', '#06B6D4', true, 2),
    ('massage-full', 'Full Massage', 'Comprehensive massage treatment including multiple techniques', 'therapy', 'activity', '#0EA5E9', true, 3),
    ('massage-premium', 'Premium Massage', 'Premium massage experience with extended time and advanced techniques', 'therapy', 'star', '#8B5CF6', true, 4),
    ('massage-vip', 'VIP Massage', 'Exclusive VIP massage service with personalized attention', 'wellness', 'crown', '#F59E0B', true, 5),
    ('constellations', 'Systemic Constellations', 'Family and systemic constellation therapy session', 'therapy', 'star', '#EC4899', true, 6),
    ('360-review', '360° Review', 'Comprehensive health assessment at physical, biochemical, and emotional levels', 'consultation', 'search', '#10B981', true, 7),
    ('muscle-relief', 'Muscle Tension Relief', 'Specialized 4-in-1 approach for muscle tension and pain relief', 'therapy', 'zap', '#EF4444', true, 8),
    ('movement-lesson', 'Movement Lesson', 'Specialized movement education sessions', 'specialty', 'move', '#14B8A6', true, 9),
    ('feldenkrais', 'Feldenkrais Method', 'Awareness through movement - Feldenkrais technique', 'specialty', 'waves', '#6366F1', true, 10),
    ('nutrition', 'Integrative Nutrition', 'Holistic approach to nutrition and wellness', 'wellness', 'apple', '#84CC16', true, 11),
    ('corporate', 'Corporate Services', 'Business and corporate wellness services', 'specialty', 'briefcase', '#64748B', true, 12),
    ('session-pack', 'Session Package', 'Multi-session package with savings', 'package', 'package', '#F97316', true, 13),
    ('subscription-bronze', 'Bronze Subscription', 'Entry-level monthly subscription with sessions and online consultations', 'subscription', 'medal', '#CD7F32', false, 14),
    ('subscription-silver', 'Silver Subscription', 'Mid-level monthly subscription with more sessions and priority booking', 'subscription', 'medal', '#C0C0C0', false, 15),
    ('subscription-gold', 'Gold Subscription', 'Premium monthly subscription with preferential attention and extended services', 'subscription', 'medal', '#FFD700', false, 16),
    ('subscription-diamond', 'Diamond Subscription', 'Ultimate tier with all services included', 'subscription', 'gem', '#B9F2FF', false, 17),
    ('vip-prive', 'EKA Privé VIP', 'Top tier VIP service with 24h support and home visits', 'subscription', 'star', '#FFD700', false, 18),
    ('free-consultation', 'Free Consultation', 'Complimentary initial consultation', 'consultation', 'message-circle', '#22C55E', true, 19),
    ('individual-session', 'Individual Session', 'Base individual therapy session (massage, kinesiology, osteobalance, emotions)', 'therapy', 'user', '#3B82F6', true, 20)
ON CONFLICT (type_code) DO NOTHING;

-- Insert booking explanations for key service types
INSERT INTO booking_explanations (product_type_id, title, short_description, full_description, what_to_expect, preparation_instructions, language) 
SELECT 
    pt.id,
    'Understanding ' || pt.type_name,
    'Learn about ' || pt.type_name || ' and what to expect during your session.',
    pt.description,
    'During your session, you will work one-on-one with a qualified practitioner in a calm, professional environment. Sessions are personalized to your specific needs and goals.',
    'Please arrive 5-10 minutes early. Wear comfortable clothing. Bring any relevant medical information or previous treatment notes. Stay hydrated before your session.',
    'en'
FROM product_types pt
WHERE pt.type_code IN ('kinesiology', 'massage-basic', 'constellations', '360-review', 'individual-session')
ON CONFLICT (product_type_id, language) DO NOTHING;

-- Update external products with product type references
DO $$
DECLARE
    stripe_provider_id UUID;
BEGIN
    -- Get Stripe provider ID
    SELECT id INTO stripe_provider_id FROM external_service_providers WHERE provider_name = 'stripe';
    
    IF stripe_provider_id IS NOT NULL THEN
        -- Link external products to product types via metadata
        UPDATE external_products ep
        SET metadata = jsonb_set(
            COALESCE(ep.metadata, '{}'::jsonb),
            '{suggested_type_code}',
            to_jsonb(CASE 
                WHEN ep.name ILIKE '%kinesiology%' THEN 'kinesiology'
                WHEN ep.name ILIKE '%massage%basic%' THEN 'massage-basic'
                WHEN ep.name ILIKE '%massage%full%' THEN 'massage-full'
                WHEN ep.name ILIKE '%massage%premium%' THEN 'massage-premium'
                WHEN ep.name ILIKE '%massage%vip%' THEN 'massage-vip'
                WHEN ep.name ILIKE '%constellation%' THEN 'constellations'
                WHEN ep.name ILIKE '%360%' OR ep.name ILIKE '%revision%' THEN '360-review'
                WHEN ep.name ILIKE '%muscle%tension%' THEN 'muscle-relief'
                WHEN ep.name ILIKE '%movement%' THEN 'movement-lesson'
                WHEN ep.name ILIKE '%feldenkrais%' THEN 'feldenkrais'
                WHEN ep.name ILIKE '%nutrici%' THEN 'nutrition'
                WHEN ep.name ILIKE '%corporat%' THEN 'corporate'
                WHEN ep.name ILIKE '%pack%' THEN 'session-pack'
                WHEN ep.name ILIKE '%bronze%' THEN 'subscription-bronze'
                WHEN ep.name ILIKE '%silver%' THEN 'subscription-silver'
                WHEN ep.name ILIKE '%gold%' THEN 'subscription-gold'
                WHEN ep.name ILIKE '%diamond%' THEN 'subscription-diamond'
                WHEN ep.name ILIKE '%priv%' OR ep.name ILIKE '%vip%' THEN 'vip-prive'
                WHEN ep.name ILIKE '%free%consult%' THEN 'free-consultation'
                WHEN ep.name ILIKE '%individual%' OR ep.name ILIKE '%sesión%' OR ep.name ILIKE '%session%' THEN 'individual-session'
                ELSE 'individual-session'
            END)
        )
        WHERE ep.provider_id = stripe_provider_id;
    END IF;
END $$;

-- ==================== VIEWS ====================

-- View for products with their types
CREATE OR REPLACE VIEW v_products_with_types AS
SELECT 
    ep.id as product_id,
    ep.name as product_name,
    ep.description,
    ep.product_type as external_product_type,
    pt.type_code,
    pt.type_name,
    pt.category,
    pt.icon,
    pt.color,
    pt.is_bookable,
    ep.is_active,
    provider.provider_name,
    ep.external_data->>'suggested_type_code' as suggested_type
FROM external_products ep
LEFT JOIN external_service_providers provider ON provider.id = ep.provider_id
LEFT JOIN product_types pt ON pt.type_code = ep.metadata->>'suggested_type_code'
WHERE ep.is_active = true;

-- ==================== COMMENTS ====================

COMMENT ON TABLE product_types IS 'Reference table for standardized product/service types across all platforms';
COMMENT ON TABLE booking_explanations IS 'Detailed explanations and guidelines for different booking types';
COMMENT ON TABLE product_type_mappings IS 'Maps external products and internal services to standardized product types';
COMMENT ON VIEW v_products_with_types IS 'Products with their associated type information for easy querying';

COMMENT ON COLUMN product_types.is_bookable IS 'Whether this type can be directly booked by customers';
COMMENT ON COLUMN product_types.requires_consultation IS 'Whether a consultation is required before booking this type';
COMMENT ON COLUMN booking_explanations.faqs IS 'JSON array of FAQ objects: [{question: string, answer: string}]';
COMMENT ON COLUMN product_type_mappings.mapping_confidence IS 'Confidence score 0.0-1.0 for automatic mappings';
