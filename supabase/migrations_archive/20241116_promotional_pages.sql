-- Promotional Landing Pages Database Schema
-- Advanced personalization and user targeting system

-- User persona types for targeted promotional content
CREATE TABLE user_personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    target_demographics JSONB,
    pain_points TEXT[],
    goals TEXT[],
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotional landing page templates
CREATE TABLE promotional_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    persona_id UUID REFERENCES user_personas(id),
    page_type VARCHAR(50) NOT NULL, -- 'business', 'student', 'sport', 'office_worker', 'neck_pain', etc.
    hero_config JSONB NOT NULL, -- Hero section configuration
    content_blocks JSONB[] NOT NULL, -- Array of content block configurations
    design_config JSONB NOT NULL, -- Design principles and styling
    seo_config JSONB,
    is_active BOOLEAN DEFAULT true,
    conversion_goals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User personalization data
CREATE TABLE user_personalization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES user_personas(id),
    primary_concerns TEXT[],
    lifestyle_factors JSONB,
    work_environment VARCHAR(100),
    physical_activity_level VARCHAR(50),
    stress_levels JSONB,
    preferred_communication_style VARCHAR(50),
    motivational_triggers TEXT[],
    barriers_to_entry TEXT[],
    personalization_score INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotional content variants for A/B testing and personalization
CREATE TABLE promotional_content_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES promotional_pages(id) ON DELETE CASCADE,
    variant_name VARCHAR(100) NOT NULL,
    target_audience JSONB, -- Audience targeting criteria
    hero_headline VARCHAR(300),
    hero_subheadline VARCHAR(500),
    hero_cta_text VARCHAR(100),
    hero_cta_url VARCHAR(300),
    benefits_headline VARCHAR(300),
    benefits_list JSONB[],
    social_proof JSONB,
    urgency_elements JSONB,
    personalization_elements JSONB,
    conversion_elements JSONB,
    is_active BOOLEAN DEFAULT true,
    conversion_rate DECIMAL(5,4),
    views_count INTEGER DEFAULT 0,
    conversions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions with promotional pages
CREATE TABLE promotional_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    page_id UUID REFERENCES promotional_pages(id),
    variant_id UUID REFERENCES promotional_content_variants(id),
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'scroll', 'time_spent', 'conversion'
    interaction_data JSONB,
    session_id VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavioral triggers for dynamic content
CREATE TABLE behavioral_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_name VARCHAR(100) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL, -- 'time_on_page', 'scroll_depth', 'exit_intent', 'inactivity'
    trigger_conditions JSONB NOT NULL,
    target_content JSONB NOT NULL,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User journey mapping
CREATE TABLE user_journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    journey_name VARCHAR(200),
    current_stage VARCHAR(100),
    journey_data JSONB,
    conversion_probability DECIMAL(5,4),
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default user personas
INSERT INTO user_personas (name, description, target_demographics, pain_points, goals, preferences) VALUES
('business_professional', 'Busy executives and entrepreneurs seeking efficient wellness solutions', 
'{"age_range": "25-55", "income": "high", "lifestyle": "busy", "location": "urban"}', 
ARRAY['time_constraints', 'work_stress', 'poor_work_life_balance', 'sedentary_lifestyle'], 
ARRAY['quick_sessions', 'flexible_scheduling', 'stress_relief', 'productivity_enhancement'], 
'{"preferred_session_length": "30-45min", "communication_style": "direct", "motivation": "results_driven"}'),

('student', 'College students and young adults dealing with academic stress and life transitions', 
'{"age_range": "18-25", "income": "low_to_medium", "lifestyle": "academic", "location": "campus"}', 
ARRAY['academic_stress', 'anxiety', 'peer_pressure', 'future_uncertainty', 'financial_constraints'], 
ARRAY['stress_management', 'confidence_building', 'academic_performance', 'career_guidance'], 
'{"preferred_session_length": "45-60min", "communication_style": "supportive", "motivation": "growth_oriented"}'),

('athlete', 'Sports enthusiasts and professional athletes focused on performance optimization', 
'{"age_range": "18-40", "income": "medium_to_high", "lifestyle": "active", "location": "varied"}', 
ARRAY['performance_anxiety', 'injury_recovery', 'competition_pressure', 'mental_blocks'], 
ARRAY['mental_toughness', 'focus_enhancement', 'injury_coping', 'performance_optimization'], 
'{"preferred_session_length": "60-90min", "communication_style": "goal_oriented", "motivation": "performance_driven"}'),

('office_worker', 'Office employees dealing with ergonomic issues and workplace stress', 
'{"age_range": "25-50", "income": "medium", "lifestyle": "sedentary", "location": "suburban"}', 
ARRAY['back_pain', 'neck_pain', 'eye_strain', 'workplace_stress', 'poor_posture'], 
ARRAY['pain_relief', 'stress_reduction', 'better_posture', 'workplace_wellness'], 
'{"preferred_session_length": "30-45min", "communication_style": "practical", "motivation": "health_improvement"}'),

('neck_pain_sufferer', 'Individuals specifically dealing with chronic neck and shoulder pain', 
'{"age_range": "30-65", "income": "varied", "lifestyle": "affected_by_pain", "location": "varied"}', 
ARRAY['chronic_neck_pain', 'limited_mobility', 'sleep_disruption', 'concentration_issues', 'emotional_distress'], 
ARRAY['pain_reduction', 'improved_mobility', 'better_sleep', 'daily_function_improvement'], 
'{"preferred_session_length": "45-60min", "communication_style": "empathetic", "motivation": "pain_relief"}'),

('new_parent', 'Parents adjusting to life with a new baby, dealing with sleep deprivation and stress', 
'{"age_range": "25-40", "income": "medium", "lifestyle": "parenting", "location": "suburban"}', 
ARRAY['sleep_deprivation', 'parental_stress', 'identity_changes', 'relationship_strain', 'time_management'], 
ARRAY['stress_management', 'better_sleep', 'parenting_confidence', 'relationship_support'], 
'{"preferred_session_length": "30-45min", "communication_style": "nurturing", "motivation": "family_wellbeing"}'),

('senior_citizen', 'Older adults seeking to maintain mental wellness and quality of life', 
'{"age_range": "60+", "income": "fixed", "lifestyle": "retired", "location": "varied"}', 
ARRAY['loneliness', 'health_anxiety', 'life_transitions', 'loss_grief', 'technology_overwhelm'], 
ARRAY['companionship', 'life_satisfaction', 'coping_skills', 'technology_comfort'], 
'{"preferred_session_length": "45-60min", "communication_style": "patient", "motivation": "quality_of_life"}'),

('caregiver', 'Individuals caring for sick or elderly family members', 
'{"age_range": "35-65", "income": "varied", "lifestyle": "caregiving", "location": "home_based"}', 
ARRAY['caregiver_burnout', 'emotional_exhaustion', 'guilt', 'isolation', 'role_confusion'], 
ARRAY['self_care', 'emotional_support', 'boundary_setting', 'stress_relief'], 
'{"preferred_session_length": "45-60min", "communication_style": "supportive", "motivation": "sustainability"}'),

('creative_professional', 'Artists, writers, designers dealing with creative blocks and performance pressure', 
'{"age_range": "25-50", "income": "variable", "lifestyle": "creative", "location": "urban"}', 
ARRAY['creative_blocks', 'perfectionism', 'imposter_syndrome', 'income_instability', 'deadline_pressure'], 
ARRAY['creativity_enhancement', 'confidence_building', 'stress_management', 'focus_improvement'], 
'{"preferred_session_length": "60-90min", "communication_style": "creative", "motivation": "artistic_growth"}'),

('healthcare_worker', 'Medical professionals dealing with burnout and emotional trauma', 
'{"age_range": "26-60", "income": "medium_to_high", "lifestyle": "demanding", "location": "hospital_based"}', 
ARRAY['burnout', 'compassion_fatigue', 'trauma_exposure', 'work_life_balance', 'moral_distress'], 
ARRAY['burnout_prevention', 'trauma_processing', 'work_life_balance', 'emotional_resilience'], 
'{"preferred_session_length": "45-60min", "communication_style": "professional", "motivation": "professional_sustainability"}'),

('entrepreneur', 'Startup founders and business owners facing uncertainty and isolation', 
'{"age_range": "25-55", "income": "variable", "lifestyle": "entrepreneurial", "location": "varied"}', 
ARRAY['uncertainty_stress', 'isolation', 'decision_fatigue', 'failure_fear', 'workaholism'], 
ARRAY['stress_management', 'decision_support', 'networking_confidence', 'failure_resilience'], 
'{"preferred_session_length": "60-90min", "communication_style": "strategic", "motivation": "business_success"}'),

('lgbtq_plus', 'LGBTQ+ individuals seeking affirming mental health support', 
'{"age_range": "18-50", "income": "varied", "lifestyle": "diverse", "location": "varied"}', 
ARRAY['identity_exploration', 'discrimination_stress', 'family_rejection', 'minority_stress', 'coming_out_anxiety'], 
ARRAY['identity_affirmation', 'coping_skills', 'self_acceptance', 'community_connection'], 
'{"preferred_session_length": "45-75min", "communication_style": "affirming", "motivation": "authenticity"}'),

('veteran', 'Military veterans transitioning to civilian life and processing service experiences', 
'{"age_range": "25-65", "income": "varied", "lifestyle": "transitioning", "location": "varied"}', 
ARRAY['ptsd', 'transition_stress', 'identity_loss', 'civilian_adjustment', 'service_trauma'], 
ARRAY['trauma_processing', 'transition_support', 'identity_rebuilding', 'coping_skills'], 
'{"preferred_session_length": "60-90min", "communication_style": "direct", "motivation": "successful_transition"}'),

('chronic_illness', 'Individuals managing long-term health conditions', 
'{"age_range": "25-70", "income": "varied", "lifestyle": "health_focused", "location": "varied"}', 
ARRAY['health_anxiety', 'identity_changes', 'relationship_strain', 'financial_stress', 'medication_side_effects'], 
ARRAY['illness_acceptance', 'coping_strategies', 'identity_integration', 'relationship_maintenance'], 
'{"preferred_session_length": "45-75min", "communication_style": "empathetic", "motivation": "disease_management"}');

-- Grant permissions
GRANT SELECT ON user_personas TO anon, authenticated;
GRANT SELECT ON promotional_pages TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_personalization TO authenticated;
GRANT SELECT ON promotional_content_variants TO anon, authenticated;
GRANT SELECT, INSERT ON promotional_interactions TO authenticated;
GRANT SELECT ON behavioral_triggers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON user_journeys TO authenticated;