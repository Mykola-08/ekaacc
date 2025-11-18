-- Complete Database Setup for EKA Platform
-- Version: 1.0
-- Date: 2024-11-18
-- Description: Comprehensive database setup with all functions, triggers, and RLS policies

-- ==================== EXTENSIONS ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== CORE FUNCTIONS ====================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, username, full_name, created_at, updated_at)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NOW(),
        NOW()
    );
    
    -- Create user preferences
    INSERT INTO public.user_preferences (user_id, theme, language, timezone, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'theme', 'system'),
        COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
        COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
        NOW(),
        NOW()
    );
    
    -- Create user settings
    INSERT INTO public.user_settings (user_id, preferences, privacy_settings, notification_settings, created_at, last_updated)
    VALUES (
        NEW.id,
        '{}'::jsonb,
        '{}'::jsonb,
        '{}'::jsonb,
        NOW(),
        NOW()
    );
    
    -- Assign default user role
    INSERT INTO public.user_role_assignments (user_id, role_id, assigned_at, assigned_by)
    SELECT NEW.id, id, NOW(), NEW.id
    FROM public.user_roles 
    WHERE name = 'user';
    
    -- Create audit log entry
    INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, details, timestamp, created_at)
    VALUES (
        NEW.id, 
        'user.created', 
        'user', 
        NEW.id::text,
        jsonb_build_object('email', NEW.email, 'provider', NEW.raw_user_meta_data->>'provider'),
        NOW(),
        NOW()
    );
    
    -- Create wallet for user
    INSERT INTO public.wallets (user_id, balance, currency, is_active, created_at, updated_at)
    VALUES (NEW.id, 0.00, 'EUR', true, NOW(), NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check user permission
CREATE OR REPLACE FUNCTION check_user_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_role_assignments ura
        JOIN public.user_roles ur ON ura.role_id = ur.id
        JOIN public.role_permissions rp ON rp.role_id = ur.id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ura.user_id = $1 
        AND ur.is_active = true
        AND p.name = $2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user tier
CREATE OR REPLACE FUNCTION get_user_tier(user_id UUID)
RETURNS TABLE(tier_type TEXT, tier_name TEXT, is_active BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT ut.tier_type::text, ut.tier_name::text, ut.is_active
    FROM public.user_tiers ut
    WHERE ut.user_id = $1 AND ut.is_active = true
    ORDER BY ut.assigned_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log user interaction
CREATE OR REPLACE FUNCTION log_user_interaction(
    p_user_id UUID,
    p_interaction_type TEXT,
    p_page_path TEXT,
    p_element_id TEXT DEFAULT NULL,
    p_element_text TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_session_id TEXT DEFAULT NULL,
    p_device_type TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    interaction_id UUID;
BEGIN
    INSERT INTO public.user_interactions (
        user_id, interaction_type, page_path, element_id, element_text, 
        metadata, session_id, device_type, user_agent, referrer, 
        timestamp, created_at
    )
    VALUES (
        p_user_id, p_interaction_type, p_page_path, p_element_id, p_element_text,
        p_metadata, p_session_id, p_device_type, p_user_agent, p_referrer,
        NOW(), NOW()
    )
    RETURNING id INTO interaction_id;
    
    RETURN interaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create AI insight
CREATE OR REPLACE FUNCTION create_ai_insight(
    p_user_id UUID,
    p_insight_id TEXT,
    p_type TEXT,
    p_title TEXT,
    p_description TEXT,
    p_confidence DECIMAL,
    p_action_items JSONB DEFAULT '[]'::jsonb,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    insight_uuid UUID;
BEGIN
    INSERT INTO public.ai_insights (
        user_id, insight_id, type, title, description, confidence,
        action_items, metadata, is_active, expires_at, created_at, updated_at
    )
    VALUES (
        p_user_id, p_insight_id, p_type, p_title, p_description, p_confidence,
        p_action_items, p_metadata, true, p_expires_at, NOW(), NOW()
    )
    RETURNING id INTO insight_uuid;
    
    RETURN insight_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process wallet transaction
CREATE OR REPLACE FUNCTION process_wallet_transaction(
    p_user_id UUID,
    p_amount DECIMAL,
    p_type TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_reference_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    wallet_rec RECORD;
    new_balance DECIMAL;
    transaction_id UUID;
BEGIN
    -- Get user wallet
    SELECT * INTO wallet_rec
    FROM public.wallets
    WHERE user_id = p_user_id AND is_active = true
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active wallet not found for user %', p_user_id;
    END IF;
    
    -- Calculate new balance
    IF p_type = 'credit' THEN
        new_balance := wallet_rec.balance + p_amount;
    ELSIF p_type = 'debit' OR p_type = 'refund' THEN
        new_balance := wallet_rec.balance - ABS(p_amount);
        IF new_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', wallet_rec.balance, ABS(p_amount);
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid transaction type: %', p_type;
    END IF;
    
    -- Update wallet balance
    UPDATE public.wallets
    SET balance = new_balance, last_transaction_at = NOW(), updated_at = NOW()
    WHERE id = wallet_rec.id;
    
    -- Create transaction record
    INSERT INTO public.wallet_transactions (
        wallet_id, user_id, amount, type, description, metadata, reference_id, created_at, updated_at
    )
    VALUES (
        wallet_rec.id, p_user_id, p_amount, p_type, p_description, p_metadata, p_reference_id, NOW(), NOW()
    )
    RETURNING id INTO transaction_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update behavioral pattern
CREATE OR REPLACE FUNCTION update_behavioral_pattern(
    p_user_id UUID,
    p_pattern_type TEXT,
    p_confidence_score DECIMAL,
    p_evidence JSONB DEFAULT '[]'::jsonb,
    p_severity TEXT DEFAULT 'low',
    p_status TEXT DEFAULT 'active'
)
RETURNS UUID AS $$
DECLARE
    pattern_id UUID;
BEGIN
    -- Update existing pattern or create new one
    INSERT INTO public.behavioral_patterns (
        user_id, pattern_type, confidence_score, evidence, severity, status, first_detected, last_updated, created_at
    )
    VALUES (
        p_user_id, p_pattern_type, p_confidence_score, p_evidence, p_severity, p_status, NOW(), NOW(), NOW()
    )
    ON CONFLICT (user_id, pattern_type) 
    DO UPDATE SET
        confidence_score = EXCLUDED.confidence_score,
        evidence = EXCLUDED.evidence,
        severity = EXCLUDED.severity,
        status = EXCLUDED.status,
        last_updated = NOW()
    RETURNING id INTO pattern_id;
    
    RETURN pattern_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_payload JSONB DEFAULT '{}'::jsonb,
    p_priority TEXT DEFAULT 'medium',
    p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id, type, title, message, payload, priority, expires_at, created_at
    )
    VALUES (
        p_user_id, p_type, p_title, p_message, p_payload, p_priority, p_expires_at, NOW()
    )
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update user tier
CREATE OR REPLACE FUNCTION update_user_tier(
    p_user_id UUID,
    p_tier_type TEXT,
    p_tier_name TEXT,
    p_assigned_by UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    tier_id UUID;
BEGIN
    -- Deactivate existing tiers
    UPDATE public.user_tiers
    SET is_active = false, deactivated_at = NOW(), updated_at = NOW()
    WHERE user_id = p_user_id AND is_active = true;
    
    -- Create new tier assignment
    INSERT INTO public.user_tiers (
        user_id, tier_type, tier_name, is_active, assigned_by, assigned_at, reason, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_tier_type, p_tier_name, true, p_assigned_by, NOW(), p_reason, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO tier_id;
    
    -- Log tier assignment
    INSERT INTO public.tier_audit_logs (
        user_id, action, tier_type, tier_name, performed_by, reason, metadata, timestamp, created_at
    )
    VALUES (
        p_user_id, 'assigned', p_tier_type, p_tier_name, p_assigned_by, p_reason, p_metadata, NOW(), NOW()
    );
    
    RETURN tier_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log mood entry
CREATE OR REPLACE FUNCTION log_mood_entry(
    p_user_id UUID,
    p_mood TEXT,
    p_mood_score INTEGER,
    p_energy_level INTEGER DEFAULT NULL,
    p_stress_level INTEGER DEFAULT NULL,
    p_sleep_quality INTEGER DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_factors TEXT[] DEFAULT '{}',
    p_tags TEXT[] DEFAULT '{}',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    mood_id UUID;
BEGIN
    INSERT INTO public.mood_logs (
        user_id, mood, mood_score, energy_level, stress_level, sleep_quality, 
        notes, factors, tags, metadata, logged_at, created_at
    )
    VALUES (
        p_user_id, p_mood, p_mood_score, p_energy_level, p_stress_level, p_sleep_quality,
        p_notes, p_factors, p_tags, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO mood_id;
    
    RETURN mood_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create journal entry
CREATE OR REPLACE FUNCTION create_journal_entry(
    p_user_id UUID,
    p_title TEXT DEFAULT NULL,
    p_content TEXT,
    p_mood TEXT DEFAULT NULL,
    p_mood_score INTEGER DEFAULT NULL,
    p_tags TEXT[] DEFAULT '{}',
    p_is_private BOOLEAN DEFAULT true,
    p_ai_analysis JSONB DEFAULT '{}'::jsonb,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    entry_id UUID;
BEGIN
    INSERT INTO public.journal_entries (
        user_id, title, content, mood, mood_score, tags, is_private, ai_analysis, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_title, p_content, p_mood, p_mood_score, p_tags, p_is_private, p_ai_analysis, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO entry_id;
    
    RETURN entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create goal
CREATE OR REPLACE FUNCTION create_goal(
    p_user_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_category TEXT DEFAULT 'general',
    p_target_date DATE DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    goal_id UUID;
BEGIN
    INSERT INTO public.goals (
        user_id, title, description, category, target_date, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_title, p_description, p_category, p_target_date, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO goal_id;
    
    RETURN goal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update goal progress
CREATE OR REPLACE FUNCTION update_goal_progress(
    p_goal_id UUID,
    p_progress_percentage DECIMAL,
    p_is_achieved BOOLEAN DEFAULT false,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.goals
    SET 
        progress_percentage = p_progress_percentage,
        is_achieved = p_is_achieved,
        achieved_at = CASE WHEN p_is_achieved THEN NOW() ELSE achieved_at END,
        status = CASE WHEN p_is_achieved THEN 'completed' ELSE status END,
        metadata = metadata || p_metadata,
        updated_at = NOW()
    WHERE id = p_goal_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Send message
CREATE OR REPLACE FUNCTION send_message(
    p_sender_id UUID,
    p_recipient_id UUID,
    p_subject TEXT DEFAULT NULL,
    p_content TEXT,
    p_message_type TEXT DEFAULT 'direct',
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    message_id UUID;
BEGIN
    -- Validate sender and recipient are different
    IF p_sender_id = p_recipient_id THEN
        RAISE EXCEPTION 'Sender and recipient cannot be the same';
    END IF;
    
    INSERT INTO public.messages (
        sender_id, recipient_id, subject, content, message_type, metadata, created_at, updated_at
    )
    VALUES (
        p_sender_id, p_recipient_id, p_subject, p_content, p_message_type, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO message_id;
    
    -- Create notification for recipient
    PERFORM create_notification(
        p_recipient_id,
        'info',
        COALESCE(p_subject, 'New Message'),
        'You have received a new message',
        jsonb_build_object('message_id', message_id, 'sender_id', p_sender_id),
        'medium',
        NOW() + INTERVAL '7 days'
    );
    
    RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark message as read
CREATE OR REPLACE FUNCTION mark_message_as_read(p_message_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.messages
    SET 
        is_read = true,
        read_at = NOW(),
        updated_at = NOW()
    WHERE id = p_message_id AND recipient_id = p_user_id AND is_read = false;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create appointment
CREATE OR REPLACE FUNCTION create_appointment(
    p_user_id UUID,
    p_therapist_id UUID,
    p_title TEXT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_type TEXT DEFAULT 'therapy',
    p_location TEXT DEFAULT NULL,
    p_is_online BOOLEAN DEFAULT false,
    p_notes TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    appointment_id UUID;
BEGIN
    -- Validate time range
    IF p_end_time <= p_start_time THEN
        RAISE EXCEPTION 'End time must be after start time';
    END IF;
    
    INSERT INTO public.appointments (
        user_id, therapist_id, title, start_time, end_time, type, location, is_online, notes, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_therapist_id, p_title, p_start_time, p_end_time, p_type, p_location, p_is_online, p_notes, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO appointment_id;
    
    -- Create notifications
    PERFORM create_notification(
        p_user_id,
        'info',
        'Appointment Scheduled',
        'Your appointment has been scheduled',
        jsonb_build_object('appointment_id', appointment_id),
        'medium',
        p_start_time
    );
    
    PERFORM create_notification(
        p_therapist_id,
        'info',
        'New Appointment',
        'You have a new appointment scheduled',
        jsonb_build_object('appointment_id', appointment_id),
        'medium',
        p_start_time
    );
    
    RETURN appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Complete appointment
CREATE OR REPLACE FUNCTION complete_appointment(p_appointment_id UUID, p_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
    appointment_rec RECORD;
BEGIN
    -- Get appointment details
    SELECT * INTO appointment_rec
    FROM public.appointments
    WHERE id = p_appointment_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Update appointment status
    UPDATE public.appointments
    SET 
        status = 'completed',
        notes = COALESCE(notes || '\n\n' || p_notes, p_notes),
        updated_at = NOW()
    WHERE id = p_appointment_id;
    
    -- Create follow-up notification
    PERFORM create_notification(
        appointment_rec.user_id,
        'success',
        'Appointment Completed',
        'Your therapy session has been completed',
        jsonb_build_object('appointment_id', p_appointment_id),
        'low',
        NOW() + INTERVAL '1 hour'
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create assessment
CREATE OR REPLACE FUNCTION create_assessment(
    p_user_id UUID,
    p_title TEXT,
    p_type TEXT,
    p_questions JSONB DEFAULT '[]'::jsonb,
    p_completed_by UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    assessment_id UUID;
BEGIN
    INSERT INTO public.assessments (
        user_id, title, type, questions, completed_by, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_title, p_type, p_questions, p_completed_by, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO assessment_id;
    
    RETURN assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Complete assessment
CREATE OR REPLACE FUNCTION complete_assessment(
    p_assessment_id UUID,
    p_responses JSONB,
    p_scores JSONB DEFAULT '{}'::jsonb,
    p_interpretation TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.assessments
    SET 
        responses = p_responses,
        scores = p_scores,
        interpretation = p_interpretation,
        is_completed = true,
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_assessment_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log behavioral pattern
CREATE OR REPLACE FUNCTION log_behavioral_pattern(
    p_user_id UUID,
    p_pattern_type TEXT,
    p_confidence_score DECIMAL,
    p_evidence JSONB DEFAULT '[]'::jsonb,
    p_severity TEXT DEFAULT 'low',
    p_status TEXT DEFAULT 'active'
)
RETURNS UUID AS $$
DECLARE
    pattern_id UUID;
BEGIN
    INSERT INTO public.behavioral_patterns (
        user_id, pattern_type, confidence_score, evidence, severity, status, first_detected, last_updated, created_at
    )
    VALUES (
        p_user_id, p_pattern_type, p_confidence_score, p_evidence, p_severity, p_status, NOW(), NOW(), NOW()
    )
    ON CONFLICT (user_id, pattern_type) 
    DO UPDATE SET
        confidence_score = EXCLUDED.confidence_score,
        evidence = EXCLUDED.evidence,
        severity = EXCLUDED.severity,
        status = EXCLUDED.status,
        last_updated = NOW()
    RETURNING id INTO pattern_id;
    
    RETURN pattern_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create predictive insight
CREATE OR REPLACE FUNCTION create_predictive_insight(
    p_user_id UUID,
    p_insight_type TEXT,
    p_probability DECIMAL,
    p_contributing_factors JSONB DEFAULT '[]'::jsonb,
    p_recommended_actions JSONB DEFAULT '[]'::jsonb,
    p_timeframe TEXT DEFAULT 'medium_term',
    p_confidence DECIMAL DEFAULT 0.8,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    insight_id UUID;
BEGIN
    INSERT INTO public.predictive_insights (
        user_id, insight_type, probability, contributing_factors, recommended_actions,
        timeframe, confidence, expires_at, metadata, created_at, updated_at
    )
    VALUES (
        p_user_id, p_insight_type, p_probability, p_contributing_factors, p_recommended_actions,
        p_timeframe, p_confidence, p_expires_at, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO insight_id;
    
    RETURN insight_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log system error
CREATE OR REPLACE FUNCTION log_system_error(
    p_level TEXT,
    p_message TEXT,
    p_context JSONB DEFAULT '{}'::jsonb,
    p_error_stack TEXT DEFAULT NULL,
    p_request_id TEXT DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.system_logs (
        level, message, context, error_stack, request_id, user_id, ip_address, user_agent, timestamp, created_at
    )
    VALUES (
        p_level, p_message, p_context, p_error_stack, p_request_id, p_user_id, p_ip_address, p_user_agent, NOW(), NOW()
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Audit user action
CREATE OR REPLACE FUNCTION audit_user_action(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id, old_values, new_values,
        ip_address, user_agent, session_id, metadata, timestamp, created_at
    )
    VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values,
        p_ip_address, p_user_agent, p_session_id, p_metadata, NOW(), NOW()
    )
    RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user dashboard data
CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'profile', (SELECT to_jsonb(up) FROM public.user_profiles up WHERE up.id = p_user_id),
        'preferences', (SELECT to_jsonb(upr) FROM public.user_preferences upr WHERE upr.user_id = p_user_id),
        'wallet', (SELECT to_jsonb(w) FROM public.wallets w WHERE w.user_id = p_user_id),
        'tier', (SELECT to_jsonb(t) FROM public.user_tiers t WHERE t.user_id = p_user_id AND t.is_active = true),
        'recent_mood', (SELECT to_jsonb(ml) FROM public.mood_logs ml WHERE ml.user_id = p_user_id ORDER BY ml.logged_at DESC LIMIT 1),
        'active_goals', (SELECT jsonb_agg(to_jsonb(g)) FROM public.goals g WHERE g.user_id = p_user_id AND g.status = 'active'),
        'recent_journal', (SELECT to_jsonb(je) FROM public.journal_entries je WHERE je.user_id = p_user_id ORDER BY je.created_at DESC LIMIT 1),
        'upcoming_appointment', (SELECT to_jsonb(a) FROM public.appointments a WHERE a.user_id = p_user_id AND a.status = 'scheduled' ORDER BY a.start_time ASC LIMIT 1),
        'unread_notifications', (SELECT COUNT(*) FROM public.notifications n WHERE n.user_id = p_user_id AND n.is_read = false),
        'unread_messages', (SELECT COUNT(*) FROM public.messages m WHERE m.recipient_id = p_user_id AND m.is_read = false)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get therapist dashboard data
CREATE OR REPLACE FUNCTION get_therapist_dashboard_data(p_therapist_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'profile', (SELECT to_jsonb(up) FROM public.user_profiles up WHERE up.id = p_therapist_id),
        'today_appointments', (SELECT jsonb_agg(to_jsonb(a)) FROM public.appointments a WHERE a.therapist_id = p_therapist_id AND a.status = 'scheduled' AND DATE(a.start_time) = CURRENT_DATE ORDER BY a.start_time ASC),
        'total_patients', (SELECT COUNT(DISTINCT a.user_id) FROM public.appointments a WHERE a.therapist_id = p_therapist_id AND a.status = 'completed'),
        'recent_assessments', (SELECT jsonb_agg(to_jsonb(asst)) FROM public.assessments asst WHERE asst.completed_by = p_therapist_id ORDER BY asst.created_at DESC LIMIT 5),
        'pending_appointments', (SELECT COUNT(*) FROM public.appointments a WHERE a.therapist_id = p_therapist_id AND a.status = 'scheduled'),
        'completed_sessions_today', (SELECT COUNT(*) FROM public.appointments a WHERE a.therapist_id = p_therapist_id AND a.status = 'completed' AND DATE(a.updated_at) = CURRENT_DATE)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate user report
CREATE OR REPLACE FUNCTION generate_user_report(
    p_user_id UUID,
    p_report_type TEXT,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    report_data JSONB;
    start_dt DATE;
    end_dt DATE;
BEGIN
    -- Set default date range if not provided
    start_dt := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
    end_dt := COALESCE(p_end_date, CURRENT_DATE);
    
    SELECT jsonb_build_object(
        'user_id', p_user_id,
        'report_type', p_report_type,
        'date_range', jsonb_build_object('start', start_dt, 'end', end_dt),
        'mood_summary', (
            SELECT jsonb_build_object(
                'average_score', AVG(mood_score),
                'mood_distribution', jsonb_object_agg(mood, count)
            )
            FROM (
                SELECT mood, mood_score, COUNT(*) as count
                FROM public.mood_logs 
                WHERE user_id = p_user_id AND logged_at::date BETWEEN start_dt AND end_dt
                GROUP BY mood, mood_score
            ) mood_stats
        ),
        'journal_entries', (
            SELECT COUNT(*) 
            FROM public.journal_entries 
            WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt
        ),
        'goals_progress', (
            SELECT jsonb_build_object(
                'total_goals', COUNT(*),
                'completed_goals', COUNT(*) FILTER (WHERE status = 'completed'),
                'average_progress', AVG(progress_percentage)
            )
            FROM public.goals 
            WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt
        ),
        'appointments', (
            SELECT jsonb_build_object(
                'total_appointments', COUNT(*),
                'completed_appointments', COUNT(*) FILTER (WHERE status = 'completed'),
                'cancelled_appointments', COUNT(*) FILTER (WHERE status = 'cancelled')
            )
            FROM public.appointments 
            WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt
        ),
        'exercises_completed', (
            SELECT COUNT(*) 
            FROM public.user_exercise_completions 
            WHERE user_id = p_user_id AND completed_at::date BETWEEN start_dt AND end_dt
        )
    ) INTO report_data;
    
    RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== TRIGGERS ====================

-- Trigger: Handle new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update timestamps on all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallet_transactions_updated_at BEFORE UPDATE ON public.wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_tiers_updated_at BEFORE UPDATE ON public.user_tiers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mood_logs_updated_at BEFORE UPDATE ON public.mood_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_behavioral_patterns_updated_at BEFORE UPDATE ON public.behavioral_patterns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictive_insights_updated_at BEFORE UPDATE ON public.predictive_insights
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Audit wallet transaction (trigger wrapper)
CREATE OR REPLACE FUNCTION audit_wallet_transaction()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.audit_user_action(
        NEW.user_id,
        'wallet.transaction.created',
        'wallet_transaction',
        NEW.id::text,
        NULL,
        to_jsonb(NEW.*),
        NULL,
        NULL,
        NULL,
        jsonb_build_object('amount', NEW.amount, 'type', NEW.type)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Audit user tier change (trigger wrapper)
CREATE OR REPLACE FUNCTION audit_user_tier_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.audit_user_action(
        NEW.user_id,
        'user.tier.assigned',
        'user_tier',
        NEW.id::text,
        NULL,
        to_jsonb(NEW.*),
        NULL,
        NULL,
        NULL,
        jsonb_build_object('tier_type', NEW.tier_type, 'tier_name', NEW.tier_name)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Audit mood entry (trigger wrapper)
CREATE OR REPLACE FUNCTION audit_mood_entry()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.audit_user_action(
        NEW.user_id,
        'mood.logged',
        'mood_log',
        NEW.id::text,
        NULL,
        to_jsonb(NEW.*),
        NULL,
        NULL,
        NULL,
        jsonb_build_object('mood', NEW.mood, 'mood_score', NEW.mood_score)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Audit wallet transactions
CREATE TRIGGER audit_wallet_transactions
    AFTER INSERT ON public.wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION public.audit_wallet_transaction();

-- Trigger: Audit user tier changes
CREATE TRIGGER audit_user_tier_changes
    AFTER INSERT ON public.user_tiers
    FOR EACH ROW EXECUTE FUNCTION public.audit_user_tier_change();

-- Trigger: Audit mood entries
CREATE TRIGGER audit_mood_entries
    AFTER INSERT ON public.mood_logs
    FOR EACH ROW EXECUTE FUNCTION public.audit_mood_entry();

-- Function: Create notification for new message (trigger wrapper)
CREATE OR REPLACE FUNCTION notify_new_message_func()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_notification(
        NEW.recipient_id,
        'info',
        'New Message',
        'You have received a new message',
        jsonb_build_object('message_id', NEW.id, 'sender_id', NEW.sender_id),
        'medium',
        NOW() + INTERVAL '7 days'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create notification for appointment scheduled (user)
CREATE OR REPLACE FUNCTION notify_appointment_scheduled_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_notification(
        NEW.user_id,
        'info',
        'Appointment Scheduled',
        'Your appointment has been scheduled',
        jsonb_build_object('appointment_id', NEW.id, 'start_time', NEW.start_time),
        'medium',
        NEW.start_time
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create notification for appointment scheduled (therapist)
CREATE OR REPLACE FUNCTION notify_appointment_scheduled_therapist_func()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.create_notification(
        NEW.therapist_id,
        'info',
        'New Appointment',
        'You have a new appointment scheduled',
        jsonb_build_object('appointment_id', NEW.id, 'start_time', NEW.start_time),
        'medium',
        NEW.start_time
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create notification on new message
CREATE TRIGGER notify_new_message
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.notify_new_message_func();

-- Trigger: Create notification on appointment scheduled
CREATE TRIGGER notify_appointment_scheduled
    AFTER INSERT ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.notify_appointment_scheduled_user();

-- Trigger: Create notification on appointment scheduled (therapist)
CREATE TRIGGER notify_appointment_scheduled_therapist
    AFTER INSERT ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.notify_appointment_scheduled_therapist_func();

-- Trigger: Update user personalization on interaction
CREATE TRIGGER update_personalization_on_interaction
    AFTER INSERT ON public.user_interactions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_personalization(NEW.user_id);

-- Function: Update user personalization (helper for trigger)
CREATE OR REPLACE FUNCTION update_user_personalization(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Update AI personalization profile based on recent interactions
    UPDATE public.ai_personalization_profiles
    SET 
        behavior_patterns = behavior_patterns || jsonb_build_object(
            'last_interaction', NOW(),
            'interaction_count', (SELECT COUNT(*) FROM public.user_interactions WHERE user_id = p_user_id AND timestamp > NOW() - INTERVAL '24 hours')
        ),
        last_updated = NOW()
    WHERE user_id = p_user_id;
    
    -- Create profile if it doesn't exist
    IF NOT FOUND THEN
        INSERT INTO public.ai_personalization_profiles (user_id, behavior_patterns, preferences, wellness_insights, adaptive_settings, last_updated, created_at)
        VALUES (
            p_user_id,
            jsonb_build_object('interaction_count', 1, 'last_interaction', NOW()),
            '{}'::jsonb,
            '{}'::jsonb,
            '{}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== INITIAL DATA ====================

-- Insert default roles
INSERT INTO public.user_roles (name, description, is_active, created_at) VALUES
    ('admin', 'Full system administrator with all permissions', true, NOW()),
    ('user', 'Regular user with basic permissions', true, NOW()),
    ('moderator', 'Content moderator with limited administrative permissions', true, NOW()),
    ('therapist', 'Licensed therapist with patient management permissions', true, NOW());

-- Insert default permissions
INSERT INTO public.permissions (name, resource, action, description, created_at) VALUES
    ('users.read', 'users', 'read', 'Read user information', NOW()),
    ('users.write', 'users', 'write', 'Create and update users', NOW()),
    ('users.delete', 'users', 'delete', 'Delete users', NOW()),
    ('roles.read', 'roles', 'read', 'Read roles and permissions', NOW()),
    ('roles.write', 'roles', 'write', 'Create and update roles', NOW()),
    ('roles.delete', 'roles', 'delete', 'Delete roles', NOW()),
    ('content.read', 'content', 'read', 'Read content', NOW()),
    ('content.write', 'content', 'write', 'Create and update content', NOW()),
    ('content.delete', 'content', 'delete', 'Delete content', NOW()),
    ('admin.access', 'admin', 'access', 'Access admin panel', NOW()),
    ('wallet.read', 'wallet', 'read', 'Read wallet information', NOW()),
    ('wallet.write', 'wallet', 'write', 'Create wallet transactions', NOW()),
    ('appointments.read', 'appointments', 'read', 'Read appointment information', NOW()),
    ('appointments.write', 'appointments', 'write', 'Create and update appointments', NOW()),
    ('appointments.delete', 'appointments', 'delete', 'Delete appointments', NOW()),
    ('therapy.read', 'therapy', 'read', 'Read therapy session data', NOW()),
    ('therapy.write', 'therapy', 'write', 'Create and update therapy sessions', NOW()),
    ('ai.read', 'ai', 'read', 'Read AI insights', NOW()),
    ('ai.write', 'ai', 'write', 'Create AI insights', NOW()),
    ('analytics.read', 'analytics', 'read', 'Read analytics data', NOW()),
    ('analytics.write', 'analytics', 'write', 'Create analytics reports', NOW());

-- Assign permissions to admin role
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'admin'),
    id, 
    NOW()
FROM public.permissions;

-- Assign basic permissions to user role
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'user'),
    id, 
    NOW()
FROM public.permissions 
WHERE name IN ('users.read', 'content.read', 'content.write', 'wallet.read', 'wallet.write', 'appointments.read', 'appointments.write', 'therapy.read', 'ai.read');

-- Assign moderator permissions
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'moderator'),
    id, 
    NOW()
FROM public.permissions 
WHERE name IN ('users.read', 'content.read', 'content.write', 'content.delete', 'analytics.read');

-- Assign therapist permissions
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
    (SELECT id FROM public.user_roles WHERE name = 'therapist'),
    id, 
    NOW()
FROM public.permissions 
WHERE name IN ('users.read', 'content.read', 'content.write', 'appointments.read', 'appointments.write', 'therapy.read', 'therapy.write', 'ai.read');

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, type, benefits, requirements, monthly_price, yearly_price, currency, sort_order, is_active, created_at, updated_at) VALUES
('Free', 'free', '[{"feature": "Basic therapy sessions", "limit": 3}, {"feature": "Community access"}, {"feature": "Basic mood tracking"}]', '{"min_sessions": 0, "max_sessions": 3}', 0.00, 0.00, 'EUR', 1, true, NOW(), NOW()),
('Loyal', 'loyal', '[{"feature": "Unlimited therapy sessions"}, {"feature": "AI insights"}, {"feature": "Advanced analytics"}, {"feature": "Priority support"}]', '{"min_sessions": 10, "subscription_months": 3}', 29.99, 299.99, 'EUR', 2, true, NOW(), NOW()),
('VIP', 'vip', '[{"feature": "Everything in Loyal"}, {"feature": "Personalized AI coach"}, {"feature": "Exclusive content"}, {"feature": "Direct therapist access"}, {"feature": "Premium features"}]', '{"min_sessions": 25, "subscription_months": 6}', 59.99, 599.99, 'EUR', 3, true, NOW(), NOW());

-- Insert default exercises
INSERT INTO public.exercises (title, description, category, difficulty_level, duration_minutes, instructions, is_active, created_at, updated_at) VALUES
('Mindful Breathing', 'A simple breathing exercise to reduce stress and increase awareness', 'breathing', 'beginner', 5, '1. Find a comfortable position. 2. Close your eyes. 3. Focus on your breath. 4. Count to 4 while inhaling, hold for 4, exhale for 4.', true, NOW(), NOW()),
('Body Scan Meditation', 'Progressive relaxation technique focusing on different body parts', 'mindfulness', 'beginner', 10, '1. Lie down comfortably. 2. Start from your toes. 3. Progressively focus on each body part. 4. Notice sensations without judgment.', true, NOW(), NOW()),
('Gratitude Journaling', 'Write down three things you are grateful for today', 'journaling', 'beginner', 10, '1. Get your journal. 2. Write three things you are grateful for. 3. Reflect on why you are grateful for each.', true, NOW(), NOW()),
('Cognitive Restructuring', 'Challenge and reframe negative thoughts', 'cognitive', 'intermediate', 15, '1. Identify negative thought. 2. Examine evidence for and against. 3. Generate balanced alternative thought. 4. Practice new thought.', true, NOW(), NOW()),
('Progressive Muscle Relaxation', 'Systematic tensing and relaxing of muscle groups', 'physical', 'beginner', 15, '1. Start with your feet. 2. Tense muscles for 5 seconds. 3. Release and relax for 10 seconds. 4. Move up through each muscle group.', true, NOW(), NOW());

-- Insert default purchasable items
INSERT INTO public.purchasable_items (type, name, description, price, currency, category, metadata, is_active, created_at, updated_at) VALUES
('session', 'Individual Therapy Session', 'One-on-one therapy session with a licensed therapist', 50.00, 'EUR', 'therapy', '{"duration": 50, "session_type": "individual"}', true, NOW(), NOW()),
('session', 'Couples Therapy Session', 'Therapy session for couples', 80.00, 'EUR', 'therapy', '{"duration": 60, "session_type": "couples"}', true, NOW(), NOW()),
('subscription', 'Monthly Premium Access', 'Monthly subscription with premium features', 29.99, 'EUR', 'subscription', '{"billing_cycle": "monthly", "tier": "loyal"}', true, NOW(), NOW()),
('resource', 'Mindfulness Guide', 'Comprehensive mindfulness and meditation guide', 15.00, 'EUR', 'resource', '{"format": "pdf", "pages": 50}', true, NOW(), NOW()),
('tool', 'Anxiety Assessment Tool', 'Professional anxiety assessment and tracking tool', 25.00, 'EUR', 'assessment', '{"validations": ["clinical", "research"], "duration": 20}', true, NOW(), NOW());

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchasable_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_personalization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS Policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (public.check_user_permission(auth.uid(), 'users.write'));

-- User Preferences RLS Policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all preferences" ON public.user_preferences
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'users.read'));

-- User Settings RLS Policies
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (user_id = auth.uid());

-- Wallets RLS Policies
CREATE POLICY "Users can view own wallet" ON public.wallets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all wallets" ON public.wallets
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'wallet.read'));

-- Wallet Transactions RLS Policies
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'wallet.read'));

-- Appointments RLS Policies
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (user_id = auth.uid() OR therapist_id = auth.uid());

CREATE POLICY "Users can create own appointments" ON public.appointments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Therapists can update their appointments" ON public.appointments
    FOR UPDATE USING (therapist_id = auth.uid());

CREATE POLICY "Admins can manage all appointments" ON public.appointments
    FOR ALL USING (public.check_user_permission(auth.uid(), 'appointments.write'));

-- Journal Entries RLS Policies
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
    FOR SELECT USING (user_id = auth.uid() OR is_private = false);

CREATE POLICY "Users can create own journal entries" ON public.journal_entries
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own journal entries" ON public.journal_entries
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient journal entries" ON public.journal_entries
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- Goals RLS Policies
CREATE POLICY "Users can manage own goals" ON public.goals
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient goals" ON public.goals
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- Mood Logs RLS Policies
CREATE POLICY "Users can view own mood logs" ON public.mood_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own mood logs" ON public.mood_logs
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Therapists can view patient mood logs" ON public.mood_logs
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- Messages RLS Policies
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Notifications RLS Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- AI Insights RLS Policies
CREATE POLICY "Users can view own AI insights" ON public.ai_insights
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient AI insights" ON public.ai_insights
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- AI Personalization Profiles RLS Policies
CREATE POLICY "Users can view own personalization profile" ON public.ai_personalization_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient personalization profiles" ON public.ai_personalization_profiles
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- Behavioral Patterns RLS Policies
CREATE POLICY "Users can view own behavioral patterns" ON public.behavioral_patterns
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient behavioral patterns" ON public.behavioral_patterns
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- Predictive Insights RLS Policies
CREATE POLICY "Users can view own predictive insights" ON public.predictive_insights
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Therapists can view patient predictive insights" ON public.predictive_insights
    FOR SELECT USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        )
    );

-- User Interactions RLS Policies
CREATE POLICY "Users can view own interactions" ON public.user_interactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all interactions" ON public.user_interactions
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'analytics.read'));

-- Assessments RLS Policies
CREATE POLICY "Users can view own assessments" ON public.assessments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own assessments" ON public.assessments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Therapists can manage patient assessments" ON public.assessments
    FOR ALL USING (
        user_id IN (
            SELECT a.user_id 
            FROM public.appointments a 
            WHERE a.therapist_id = auth.uid() AND a.status = 'completed'
        ) OR completed_by = auth.uid()
    );

-- User Tiers RLS Policies
CREATE POLICY "Users can view own tiers" ON public.user_tiers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all tiers" ON public.user_tiers
    FOR ALL USING (public.check_user_permission(auth.uid(), 'admin.access'));

-- Subscription Tiers RLS Policies
CREATE POLICY "Anyone can view subscription tiers" ON public.subscription_tiers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription tiers" ON public.subscription_tiers
    FOR ALL USING (public.check_user_permission(auth.uid(), 'admin.access'));

-- Audit Logs RLS Policies
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'admin.access'));

-- System Logs RLS Policies
CREATE POLICY "Admins can view system logs" ON public.system_logs
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'admin.access'));

-- ==================== GRANTS ====================

-- Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- ==================== INDEXES ====================

-- Create additional performance indexes
CREATE INDEX IF NOT EXISTS idx_user_interactions_timestamp_desc ON public.user_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_mood_logs_logged_at_desc ON public.mood_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_desc ON public.journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS appointments_start_time_asc ON public.appointments(start_time ASC);
CREATE INDEX IF NOT EXISTS messages_created_at_desc ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_created_at_desc ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS ai_insights_created_at_desc ON public.ai_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS behavioral_patterns_last_updated_desc ON public.behavioral_patterns(last_updated DESC);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_appointments_user_status ON public.appointments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist_status ON public.appointments(therapist_id, status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_type ON public.wallet_transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_logged_at ON public.mood_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS journal_entries_user_private ON public.journal_entries(user_id, is_private);
CREATE INDEX IF NOT EXISTS messages_user_read ON public.messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS notifications_user_read ON public.notifications(user_id, is_read);

-- Full text search indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_fts ON public.journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_journal_entries_title_fts ON public.journal_entries USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_messages_content_fts ON public.messages USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_messages_subject_fts ON public.messages USING gin(to_tsvector('english', subject));

-- ==================== ADVANCED FUNCTIONS ====================

-- Function: Calculate user engagement score
CREATE OR REPLACE FUNCTION calculate_user_engagement_score(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    score_data JSONB;
    total_interactions INTEGER;
    recent_interactions INTEGER;
    avg_session_duration INTEGER;
    feature_usage JSONB;
BEGIN
    -- Calculate various engagement metrics
    SELECT 
        COUNT(*) INTO total_interactions
    FROM user_interactions 
    WHERE user_id = p_user_id;
    
    SELECT 
        COUNT(*) INTO recent_interactions
    FROM user_interactions 
    WHERE user_id = p_user_id AND timestamp > NOW() - INTERVAL '7 days';
    
    -- Calculate average session duration (in minutes)
    SELECT 
        COALESCE(AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60), 0)::INTEGER INTO avg_session_duration
    FROM appointments 
    WHERE user_id = p_user_id AND status = 'completed' AND end_time IS NOT NULL;
    
    -- Feature usage breakdown
    SELECT jsonb_build_object(
        'mood_tracking', COUNT(*) FILTER (WHERE interaction_type = 'mood_logged'),
        'journal_entries', COUNT(*) FILTER (WHERE interaction_type = 'journal_created'),
        'appointments', COUNT(*) FILTER (WHERE interaction_type = 'appointment_scheduled'),
        'exercises', COUNT(*) FILTER (WHERE interaction_type = 'exercise_completed'),
        'goals', COUNT(*) FILTER (WHERE interaction_type = 'goal_updated')
    ) INTO feature_usage
    FROM user_interactions 
    WHERE user_id = p_user_id;
    
    -- Calculate overall engagement score (0-100)
    score_data := jsonb_build_object(
        'user_id', p_user_id,
        'total_interactions', total_interactions,
        'recent_interactions', recent_interactions,
        'avg_session_duration_minutes', avg_session_duration,
        'feature_usage', feature_usage,
        'engagement_score', CASE 
            WHEN total_interactions = 0 THEN 0
            WHEN recent_interactions > 20 AND avg_session_duration > 30 THEN 90
            WHEN recent_interactions > 10 AND avg_session_duration > 20 THEN 70
            WHEN recent_interactions > 5 THEN 50
            ELSE 30
        END,
        'last_calculated', NOW()
    );
    
    RETURN score_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Generate personalized recommendations
CREATE OR REPLACE FUNCTION generate_personalized_recommendations(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    recommendations JSONB := '[]'::jsonb;
    user_tier TEXT;
    recent_mood_score INTEGER;
    goal_count INTEGER;
    exercise_completion_rate DECIMAL;
BEGIN
    -- Get user tier
    SELECT tier_type INTO user_tier FROM user_tiers WHERE user_id = p_user_id AND is_active = true LIMIT 1;
    
    -- Get recent mood data
    SELECT mood_score INTO recent_mood_score FROM mood_logs WHERE user_id = p_user_id ORDER BY logged_at DESC LIMIT 1;
    
    -- Get goal statistics
    SELECT COUNT(*) INTO goal_count FROM goals WHERE user_id = p_user_id AND status = 'active';
    
    -- Calculate exercise completion rate
    SELECT 
        CASE 
            WHEN COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') = 0 THEN 0
            ELSE (COUNT(*) FILTER (WHERE completed_at IS NOT NULL AND created_at > NOW() - INTERVAL '30 days'))::DECIMAL / 
                 COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') * 100
        END INTO exercise_completion_rate
    FROM user_exercise_completions WHERE user_id = p_user_id;
    
    -- Generate recommendations based on user data
    IF recent_mood_score < 4 THEN
        recommendations := recommendations || jsonb_build_object(
            'type', 'mood_support',
            'priority', 'high',
            'title', 'Mood Support Recommended',
            'description', 'Consider scheduling a therapy session or trying mood-boosting exercises',
            'action_items', ARRAY['Schedule therapy session', 'Try breathing exercises', 'Practice gratitude journaling']
        );
    END IF;
    
    IF goal_count < 3 THEN
        recommendations := recommendations || jsonb_build_object(
            'type', 'goal_setting',
            'priority', 'medium',
            'title', 'Set More Goals',
            'description', 'Setting small, achievable goals can improve motivation and progress tracking',
            'action_items', ARRAY['Set 2-3 weekly goals', 'Track daily progress', 'Celebrate small wins']
        );
    END IF;
    
    IF exercise_completion_rate < 50 THEN
        recommendations := recommendations || jsonb_build_object(
            'type', 'exercise_engagement',
            'priority', 'medium',
            'title', 'Increase Exercise Participation',
            'description', 'Regular wellness exercises can significantly improve mental health outcomes',
            'action_items', ARRAY['Start with 5-minute exercises', 'Set daily reminders', 'Track completion streak']
        );
    END IF;
    
    -- Add tier-specific recommendations
    IF user_tier = 'free' THEN
        recommendations := recommendations || jsonb_build_object(
            'type', 'upgrade_opportunity',
            'priority', 'low',
            'title', 'Upgrade for More Features',
            'description', 'Consider upgrading to access unlimited therapy sessions and AI insights',
            'action_items', ARRAY['Review subscription options', 'Compare plan benefits', 'Start free trial']
        );
    END IF;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'recommendations', recommendations,
        'generated_at', NOW(),
        'based_on', jsonb_build_object(
            'recent_mood_score', recent_mood_score,
            'active_goals', goal_count,
            'exercise_completion_rate', exercise_completion_rate,
            'user_tier', user_tier
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Analyze behavioral patterns with ML insights
CREATE OR REPLACE FUNCTION analyze_behavioral_patterns(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    analysis_data JSONB;
    pattern_insights JSONB := '[]'::jsonb;
    mood_trend JSONB;
    activity_correlation JSONB;
    risk_factors JSONB := '[]'::jsonb;
BEGIN
    -- Analyze mood trends over time
    SELECT jsonb_build_object(
        'trend', CASE 
            WHEN AVG(mood_score) FILTER (WHERE logged_at > NOW() - INTERVAL '7 days') > 
                 AVG(mood_score) FILTER (WHERE logged_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') THEN 'improving'
            WHEN AVG(mood_score) FILTER (WHERE logged_at > NOW() - INTERVAL '7 days') < 
                 AVG(mood_score) FILTER (WHERE logged_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days') THEN 'declining'
            ELSE 'stable'
        END,
        'volatility', STDDEV(mood_score)::DECIMAL(10,2),
        'avg_recent', AVG(mood_score) FILTER (WHERE logged_at > NOW() - INTERVAL '7 days'),
        'avg_previous', AVG(mood_score) FILTER (WHERE logged_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'))
    INTO mood_trend
    FROM mood_logs WHERE user_id = p_user_id;
    
    -- Analyze activity correlations
    SELECT jsonb_build_object(
        'exercise_mood_correlation', 
        CASE WHEN COUNT(*) FILTER (WHERE ue.completed_at IS NOT NULL) > 0 THEN
            CORR(ue.mood_score_after, ml.mood_score)
        ELSE 0 END,
        'journal_frequency', COUNT(*) FILTER (WHERE je.created_at > NOW() - INTERVAL '7 days')::DECIMAL / 7,
        'appointment_attendance_rate',
        CASE WHEN COUNT(*) > 0 THEN 
            COUNT(*) FILTER (WHERE a.status = 'completed')::DECIMAL / COUNT(*) * 100
        ELSE 0 END)
    INTO activity_correlation
    FROM appointments a
    LEFT JOIN user_exercise_completions ue ON ue.user_id = a.user_id
    LEFT JOIN mood_logs ml ON ml.user_id = a.user_id
    LEFT JOIN journal_entries je ON je.user_id = a.user_id
    WHERE a.user_id = p_user_id;
    
    -- Identify risk factors
    IF mood_trend->>'trend' = 'declining' AND (mood_trend->>'volatility')::DECIMAL > 2 THEN
        risk_factors := risk_factors || jsonb_build_object(
            'type', 'mood_instability',
            'severity', 'moderate',
            'description', 'Significant mood decline with high volatility detected'
        );
    END IF;
    
    IF (activity_correlation->>'appointment_attendance_rate')::DECIMAL < 50 THEN
        risk_factors := risk_factors || jsonb_build_object(
            'type', 'low_engagement',
            'severity', 'mild',
            'description', 'Low appointment attendance may indicate engagement issues'
        );
    END IF;
    
    -- Generate pattern insights
    pattern_insights := pattern_insights || jsonb_build_object(
        'type', 'mood_trend_analysis',
        'data', mood_trend,
        'confidence', 0.85
    );
    
    pattern_insights := pattern_insights || jsonb_build_object(
        'type', 'activity_correlation',
        'data', activity_correlation,
        'confidence', 0.75
    );
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'analysis_timestamp', NOW(),
        'mood_trend', mood_trend,
        'activity_correlation', activity_correlation,
        'risk_factors', risk_factors,
        'pattern_insights', pattern_insights,
        'recommendations', CASE 
            WHEN risk_factors != '[]'::jsonb THEN 
                ARRAY['Schedule check-in session', 'Increase monitoring frequency', 'Consider intervention']
            ELSE ARRAY['Continue current routine', 'Maintain regular check-ins']
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Create advanced analytics report
CREATE OR REPLACE FUNCTION create_advanced_analytics_report(
    p_user_id UUID,
    p_report_type TEXT DEFAULT 'comprehensive',
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    report_data JSONB;
    start_dt DATE;
    end_dt DATE;
    engagement_metrics JSONB;
    wellness_trends JSONB;
    therapy_effectiveness JSONB;
    ai_insights_summary JSONB;
BEGIN
    -- Set default date range if not provided
    start_dt := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '30 days');
    end_dt := COALESCE(p_end_date, CURRENT_DATE);
    
    -- Calculate engagement metrics
    SELECT calculate_user_engagement_score(p_user_id) INTO engagement_metrics;
    
    -- Analyze wellness trends
    SELECT jsonb_build_object(
        'mood_trend', (
            SELECT jsonb_agg(jsonb_build_object(
                'date', DATE(logged_at),
                'avg_score', AVG(mood_score),
                'entry_count', COUNT(*)
            ) ORDER BY DATE(logged_at))
            FROM mood_logs 
            WHERE user_id = p_user_id AND logged_at::date BETWEEN start_dt AND end_dt
            GROUP BY DATE(logged_at)
        ),
        'journal_activity', (
            SELECT jsonb_agg(jsonb_build_object(
                'date', DATE(created_at),
                'entry_count', COUNT(*)
            ) ORDER BY DATE(created_at))
            FROM journal_entries 
            WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt
            GROUP BY DATE(created_at)
        ),
        'exercise_completion', (
            SELECT jsonb_agg(jsonb_build_object(
                'date', DATE(completed_at),
                'completion_count', COUNT(*)
            ) ORDER BY DATE(completed_at))
            FROM user_exercise_completions 
            WHERE user_id = p_user_id AND completed_at::date BETWEEN start_dt AND end_dt
            GROUP BY DATE(completed_at)
        )
    ) INTO wellness_trends;
    
    -- Analyze therapy effectiveness
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*) FILTER (WHERE status = 'completed'),
        'avg_session_rating', AVG(COALESCE(session_rating, 0)),
        'session_frequency', COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / 30,
        'therapist_changes', COUNT(DISTINCT therapist_id),
        'completion_rate', CASE 
            WHEN COUNT(*) > 0 THEN COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100
            ELSE 0 
        END
    ) INTO therapy_effectiveness
    FROM appointments 
    WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt;
    
    -- Summarize AI insights
    SELECT jsonb_build_object(
        'total_insights', COUNT(*),
        'high_confidence_insights', COUNT(*) FILTER (WHERE confidence > 0.8),
        'insight_types', jsonb_object_agg(type, count) 
    ) INTO ai_insights_summary
    FROM (
        SELECT type, COUNT(*) as count
        FROM ai_insights 
        WHERE user_id = p_user_id AND created_at::date BETWEEN start_dt AND end_dt
        GROUP BY type
    ) insight_counts;
    
    -- Compile comprehensive report
    report_data := jsonb_build_object(
        'user_id', p_user_id,
        'report_type', p_report_type,
        'date_range', jsonb_build_object('start', start_dt, 'end', end_dt),
        'generated_at', NOW(),
        'engagement_metrics', engagement_metrics,
        'wellness_trends', wellness_trends,
        'therapy_effectiveness', therapy_effectiveness,
        'ai_insights_summary', ai_insights_summary,
        'recommendations', generate_personalized_recommendations(p_user_id)->'recommendations'
    );
    
    RETURN report_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Real-time wellness monitoring
CREATE OR REPLACE FUNCTION monitor_wellness_alerts(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    alerts JSONB := '[]'::jsonb;
    recent_mood_count INTEGER;
    severe_mood_count INTEGER;
    appointment_gap_days INTEGER;
    journal_gap_days INTEGER;
BEGIN
    -- Check for low mood tracking frequency
    SELECT COUNT(*) INTO recent_mood_count
    FROM mood_logs 
    WHERE user_id = p_user_id AND logged_at > NOW() - INTERVAL '7 days';
    
    IF recent_mood_count < 3 THEN
        alerts := alerts || jsonb_build_object(
            'type', 'low_mood_tracking',
            'severity', 'mild',
            'message', 'Low mood tracking frequency detected',
            'recommendation', 'Consider tracking mood daily for better insights'
        );
    END IF;
    
    -- Check for concerning mood scores
    SELECT COUNT(*) INTO severe_mood_count
    FROM mood_logs 
    WHERE user_id = p_user_id AND logged_at > NOW() - INTERVAL '3 days' AND mood_score <= 2;
    
    IF severe_mood_count >= 2 THEN
        alerts := alerts || jsonb_build_object(
            'type', 'concerning_mood_trend',
            'severity', 'high',
            'message', 'Multiple low mood scores detected recently',
            'recommendation', 'Consider scheduling a check-in session'
        );
    END IF;
    
    -- Check for long gaps between appointments
    SELECT 
        CASE 
            WHEN MAX(start_time) IS NULL THEN 999
            ELSE DATE_PART('day', NOW() - MAX(start_time))
        END INTO appointment_gap_days
    FROM appointments 
    WHERE user_id = p_user_id AND status = 'completed';
    
    IF appointment_gap_days > 14 THEN
        alerts := alerts || jsonb_build_object(
            'type', 'long_appointment_gap',
            'severity', 'moderate',
            'message', 'Long gap since last appointment detected',
            'recommendation', 'Consider scheduling a follow-up session'
        );
    END IF;
    
    -- Check for gaps in journaling
    SELECT 
        CASE 
            WHEN MAX(created_at) IS NULL THEN 999
            ELSE DATE_PART('day', NOW() - MAX(created_at))
        END INTO journal_gap_days
    FROM journal_entries 
    WHERE user_id = p_user_id;
    
    IF journal_gap_days > 7 THEN
        alerts := alerts || jsonb_build_object(
            'type', 'journal_gap',
            'severity', 'mild',
            'message', 'Long gap since last journal entry',
            'recommendation', 'Consider resuming regular journaling practice'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'monitoring_timestamp', NOW(),
        'alerts', alerts,
        'alert_count', jsonb_array_length(alerts),
        'highest_severity', CASE 
            WHEN alerts @> '[{"severity": "high"}]' THEN 'high'
            WHEN alerts @> '[{"severity": "moderate"}]' THEN 'moderate'
            WHEN alerts @> '[{"severity": "mild"}]' THEN 'mild'
            ELSE 'none'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Advanced data export with privacy controls
CREATE OR REPLACE FUNCTION export_user_data_secure(p_user_id UUID, p_export_type TEXT DEFAULT 'full')
RETURNS JSONB AS $$
DECLARE
    export_data JSONB;
    data_summary JSONB;
    privacy_level TEXT;
BEGIN
    -- Determine privacy level based on user preferences
    SELECT 
        CASE 
            WHEN privacy_settings->>'data_export_level' = 'minimal' THEN 'minimal'
            WHEN privacy_settings->>'data_export_level' = 'standard' THEN 'standard'
            ELSE 'full'
        END INTO privacy_level
    FROM user_settings 
    WHERE user_id = p_user_id;
    
    -- Build export data based on privacy level
    IF privacy_level = 'minimal' THEN
        export_data := jsonb_build_object(
            'user_profile', (SELECT to_jsonb(up) FROM user_profiles up WHERE up.id = p_user_id),
            'export_timestamp', NOW(),
            'privacy_level', privacy_level
        );
    ELSIF privacy_level = 'standard' THEN
        export_data := jsonb_build_object(
            'user_profile', (SELECT to_jsonb(up) FROM user_profiles up WHERE up.id = p_user_id),
            'preferences', (SELECT to_jsonb(upr) FROM user_preferences upr WHERE upr.user_id = p_user_id),
            'goals', (SELECT jsonb_agg(to_jsonb(g)) FROM goals g WHERE g.user_id = p_user_id),
            'export_timestamp', NOW(),
            'privacy_level', privacy_level
        );
    ELSE -- full export
        export_data := jsonb_build_object(
            'user_profile', (SELECT to_jsonb(up) FROM user_profiles up WHERE up.id = p_user_id),
            'preferences', (SELECT to_jsonb(upr) FROM user_preferences upr WHERE upr.user_id = p_user_id),
            'settings', (SELECT to_jsonb(us) FROM user_settings us WHERE us.user_id = p_user_id),
            'mood_logs', (SELECT jsonb_agg(to_jsonb(ml)) FROM mood_logs ml WHERE ml.user_id = p_user_id),
            'journal_entries', (SELECT jsonb_agg(to_jsonb(je)) FROM journal_entries je WHERE je.user_id = p_user_id),
            'goals', (SELECT jsonb_agg(to_jsonb(g)) FROM goals g WHERE g.user_id = p_user_id),
            'appointments', (SELECT jsonb_agg(to_jsonb(a)) FROM appointments a WHERE a.user_id = p_user_id),
            'export_timestamp', NOW(),
            'privacy_level', privacy_level
        );
    END IF;
    
    -- Create data summary
    data_summary := jsonb_build_object(
        'total_records', jsonb_array_length(export_data->'mood_logs') + 
                        jsonb_array_length(export_data->'journal_entries') + 
                        jsonb_array_length(export_data->'goals'),
        'export_size_bytes', length(export_data::text),
        'privacy_level', privacy_level,
        'export_date', CURRENT_DATE
    );
    
    -- Log the export for audit purposes
    PERFORM audit_user_action(
        p_user_id,
        'data.export',
        'user_data',
        p_user_id::text,
        NULL,
        data_summary,
        NULL,
        NULL,
        NULL,
        jsonb_build_object('export_type', p_export_type, 'privacy_level', privacy_level)
    );
    
    RETURN jsonb_build_object(
        'export_data', export_data,
        'data_summary', data_summary,
        'audit_log_id', (SELECT id FROM audit_logs WHERE user_id = p_user_id AND action = 'data.export' ORDER BY timestamp DESC LIMIT 1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== VIEWS ====================

-- View: User dashboard summary
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT 
    up.id as user_id,
    up.full_name,
    up.username,
    w.balance as wallet_balance,
    ut.tier_type,
    ut.tier_name,
    (SELECT COUNT(*) FROM mood_logs ml WHERE ml.user_id = up.id AND ml.logged_at > NOW() - INTERVAL '7 days') as mood_entries_this_week,
    (SELECT AVG(mood_score) FROM mood_logs ml WHERE ml.user_id = up.id AND ml.logged_at > NOW() - INTERVAL '7 days') as avg_mood_score_this_week,
    (SELECT COUNT(*) FROM journal_entries je WHERE je.user_id = up.id AND je.created_at > NOW() - INTERVAL '7 days') as journal_entries_this_week,
    (SELECT COUNT(*) FROM goals g WHERE g.user_id = up.id AND g.status = 'active') as active_goals,
    (SELECT COUNT(*) FROM appointments a WHERE a.user_id = up.id AND a.status = 'scheduled') as upcoming_appointments,
    (SELECT COUNT(*) FROM notifications n WHERE n.user_id = up.id AND n.is_read = false) as unread_notifications,
    (SELECT COUNT(*) FROM messages m WHERE m.recipient_id = up.id AND m.is_read = false) as unread_messages
FROM user_profiles up
LEFT JOIN wallets w ON w.user_id = up.id
LEFT JOIN user_tiers ut ON ut.user_id = up.id AND ut.is_active = true
WHERE up.id = auth.uid();

-- View: Therapist dashboard summary
CREATE OR REPLACE VIEW therapist_dashboard_summary AS
SELECT 
    up.id as therapist_id,
    up.full_name,
    up.username,
    (SELECT COUNT(DISTINCT a.user_id) FROM appointments a WHERE a.therapist_id = up.id AND a.status = 'completed') as total_patients,
    (SELECT COUNT(*) FROM appointments a WHERE a.therapist_id = up.id AND a.status = 'scheduled' AND DATE(a.start_time) = CURRENT_DATE) as todays_appointments,
    (SELECT COUNT(*) FROM appointments a WHERE a.therapist_id = up.id AND a.status = 'scheduled') as pending_appointments,
    (SELECT COUNT(*) FROM appointments a WHERE a.therapist_id = up.id AND a.status = 'completed' AND DATE(a.updated_at) = CURRENT_DATE) as completed_sessions_today,
    (SELECT COUNT(*) FROM assessments asst WHERE asst.completed_by = up.id AND asst.created_at > NOW() - INTERVAL '7 days') as recent_assessments,
    (SELECT AVG(DATE_PART('hour', a.end_time - a.start_time)) FROM appointments a WHERE a.therapist_id = up.id AND a.status = 'completed' AND a.created_at > NOW() - INTERVAL '30 days') as avg_session_duration
FROM user_profiles up
WHERE up.id = auth.uid() AND EXISTS (
    SELECT 1 FROM user_role_assignments ura 
    JOIN user_roles ur ON ura.role_id = ur.id 
    WHERE ura.user_id = up.id AND ur.name = 'therapist'
);

-- View: User wellness summary
CREATE OR REPLACE VIEW user_wellness_summary AS
SELECT 
    up.id as user_id,
    up.full_name,
    -- Mood statistics
    (SELECT AVG(mood_score) FROM mood_logs ml WHERE ml.user_id = up.id AND ml.logged_at > NOW() - INTERVAL '30 days') as avg_mood_score_30d,
    (SELECT COUNT(*) FROM mood_logs ml WHERE ml.user_id = up.id AND ml.logged_at > NOW() - INTERVAL '30 days') as mood_entries_30d,
    -- Goal progress
    (SELECT COUNT(*) FROM goals g WHERE g.user_id = up.id) as total_goals,
    (SELECT COUNT(*) FROM goals g WHERE g.user_id = up.id AND g.status = 'completed') as completed_goals,
    (SELECT AVG(progress_percentage) FROM goals g WHERE g.user_id = up.id AND g.status = 'active') as avg_goal_progress,
    -- Journal activity
    (SELECT COUNT(*) FROM journal_entries je WHERE je.user_id = up.id AND je.created_at > NOW() - INTERVAL '30 days') as journal_entries_30d,
    -- Exercise completion
    (SELECT COUNT(*) FROM user_exercise_completions uec JOIN exercises e ON uec.exercise_id = e.id WHERE uec.user_id = up.id AND uec.completed_at > NOW() - INTERVAL '30 days') as exercises_completed_30d,
    -- Appointment activity
    (SELECT COUNT(*) FROM appointments a WHERE a.user_id = up.id AND a.status = 'completed' AND a.created_at > NOW() - INTERVAL '30 days') as completed_sessions_30d,
    -- Current streaks
    (SELECT COUNT(*) FROM (
        SELECT DATE(logged_at) as log_date,
               LAG(DATE(logged_at)) OVER (ORDER BY DATE(logged_at)) as prev_date
        FROM mood_logs 
        WHERE user_id = up.id 
        ORDER BY DATE(logged_at) DESC
    ) streaks WHERE log_date - prev_date = INTERVAL '1 day') as mood_streak
FROM user_profiles up
WHERE up.id = auth.uid();

-- ==================== ADVANCED INDEXES AND PERFORMANCE OPTIMIZATIONS ====================

-- Advanced performance indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_timestamp_desc ON public.user_interactions(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_logged_at_desc ON public.mood_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created_desc ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_user_start_time_asc ON public.appointments(user_id, start_time ASC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_created_desc ON public.wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created_desc ON public.notifications(user_id, is_read, created_at DESC);

-- Composite indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_mood_logs_date_score ON public.mood_logs(DATE(logged_at), mood_score);
CREATE INDEX IF NOT EXISTS idx_user_interactions_date_type ON public.user_interactions(DATE(timestamp), interaction_type);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON public.appointments(DATE(start_time), status);

-- Partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON public.appointments(status) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_goals_active ON public.goals(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_ai_insights_active ON public.ai_insights(is_active) WHERE is_active = true;

-- Advanced full-text search indexes with custom configurations
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_english ON public.journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_journal_entries_title_english ON public.journal_entries USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_messages_content_english ON public.messages USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_messages_subject_english ON public.messages USING gin(to_tsvector('english', subject));

-- JSONB indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_user_settings_preferences_gin ON public.user_settings USING gin(preferences);
CREATE INDEX IF NOT EXISTS idx_ai_insights_metadata_gin ON public.ai_insights USING gin(metadata);
CREATE INDEX IF NOT EXISTS user_interactions_metadata_gin ON public.user_interactions USING gin(metadata);

-- ==================== REAL-TIME CAPABILITIES ====================

-- Function: Enable real-time notifications with webhooks
CREATE OR REPLACE FUNCTION trigger_real_time_notification(
    p_event_type TEXT,
    p_user_id UUID,
    p_data JSONB,
    p_priority TEXT DEFAULT 'medium'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
    webhook_payload JSONB;
BEGIN
    -- Create notification record
    INSERT INTO notifications (user_id, type, title, message, payload, priority, created_at)
    VALUES (
        p_user_id,
        p_event_type,
        CASE p_event_type
            WHEN 'mood_alert' THEN 'Mood Alert'
            WHEN 'appointment_reminder' THEN 'Appointment Reminder'
            WHEN 'goal_milestone' THEN 'Goal Milestone'
            WHEN 'exercise_streak' THEN 'Exercise Streak'
            ELSE 'Real-time Update'
        END,
        CASE p_event_type
            WHEN 'mood_alert' THEN 'Your mood patterns have changed significantly'
            WHEN 'appointment_reminder' THEN 'You have an upcoming appointment'
            WHEN 'goal_milestone' THEN 'You''ve reached a goal milestone'
            WHEN 'exercise_streak' THEN 'You''ve maintained an exercise streak'
            ELSE 'Real-time update available'
        END,
        p_data,
        p_priority,
        NOW()
    )
    RETURNING id INTO notification_id;
    
    -- Prepare webhook payload for external integrations
    webhook_payload := jsonb_build_object(
        'event_type', p_event_type,
        'user_id', p_user_id,
        'notification_id', notification_id,
        'timestamp', NOW(),
        'data', p_data,
        'priority', p_priority
    );
    
    -- Log the real-time event
    PERFORM log_system_error(
        'info',
        'Real-time notification triggered',
        webhook_payload,
        NULL,
        NULL,
        p_user_id,
        NULL,
        NULL
    );
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process real-time mood analysis
CREATE OR REPLACE FUNCTION process_real_time_mood_analysis(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    recent_mood JSONB;
    mood_trend JSONB;
    alert_data JSONB;
    notification_id UUID;
BEGIN
    -- Get recent mood data
    SELECT to_jsonb(ml) INTO recent_mood
    FROM mood_logs ml
    WHERE ml.user_id = p_user_id
    ORDER BY ml.logged_at DESC
    LIMIT 1;
    
    -- Analyze mood trend
    SELECT jsonb_build_object(
        'trend_direction', CASE 
            WHEN AVG(mood_score) > 6 THEN 'positive'
            WHEN AVG(mood_score) < 4 THEN 'concerning'
            ELSE 'neutral'
        END,
        'volatility', STDDEV(mood_score)::DECIMAL(10,2),
        'recent_avg', AVG(mood_score) FILTER (WHERE logged_at > NOW() - INTERVAL '3 days'),
        'previous_avg', AVG(mood_score) FILTER (WHERE logged_at BETWEEN NOW() - INTERVAL '7 days' AND NOW() - INTERVAL '3 days')
    ) INTO mood_trend
    FROM mood_logs 
    WHERE user_id = p_user_id AND logged_at > NOW() - INTERVAL '7 days';
    
    -- Check for concerning patterns
    IF mood_trend->>'trend_direction' = 'concerning' OR (mood_trend->>'volatility')::DECIMAL > 2.5 THEN
        -- Trigger real-time alert
        SELECT trigger_real_time_notification(
            'mood_alert',
            p_user_id,
            jsonb_build_object(
                'recent_mood', recent_mood,
                'mood_trend', mood_trend,
                'alert_type', 'concerning_pattern',
                'recommended_action', 'Consider scheduling a check-in'
            ),
            'high'
        ) INTO notification_id;
        
        alert_data := jsonb_build_object(
            'alert_triggered', true,
            'notification_id', notification_id,
            'reason', 'Concerning mood pattern detected',
            'recommended_actions', ARRAY['Schedule therapy session', 'Practice mood-boosting exercises', 'Contact support']
        );
    ELSE
        alert_data := jsonb_build_object(
            'alert_triggered', false,
            'mood_status', 'normal',
            'trend', mood_trend
        );
    END IF;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'analysis_timestamp', NOW(),
        'recent_mood', recent_mood,
        'mood_trend', mood_trend,
        'alert_data', alert_data
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Advanced session management with timeout handling
CREATE OR REPLACE FUNCTION manage_user_session(
    p_user_id UUID,
    p_action TEXT,
    p_session_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    session_info JSONB;
    active_sessions INTEGER;
    session_timeout INTERVAL;
BEGIN
    -- Configure session timeout based on user tier
    SELECT 
        CASE 
            WHEN ut.tier_type = 'vip' THEN INTERVAL '24 hours'
            WHEN ut.tier_type = 'loyal' THEN INTERVAL '12 hours'
            ELSE INTERVAL '6 hours'
        END INTO session_timeout
    FROM user_tiers ut
    WHERE ut.user_id = p_user_id AND ut.is_active = true
    LIMIT 1;
    
    IF p_action = 'start' THEN
        -- Count active sessions
        SELECT COUNT(*) INTO active_sessions
        FROM user_interactions 
        WHERE user_id = p_user_id 
        AND interaction_type = 'session_active' 
        AND timestamp > NOW() - session_timeout;
        
        -- Log session start
        PERFORM log_user_interaction(
            p_user_id,
            'session_start',
            '/dashboard',
            'session_manager',
            'User session started',
            jsonb_build_object(
                'active_sessions', active_sessions,
                'session_timeout', session_timeout,
                'tier_based_timeout', true
            ),
            NULL,
            NULL,
            NULL,
            NULL
        );
        
        session_info := jsonb_build_object(
            'session_started', true,
            'active_sessions', active_sessions + 1,
            'session_timeout', session_timeout,
            'session_id', gen_random_uuid()
        );
        
    ELSIF p_action = 'end' THEN
        -- Log session end
        PERFORM log_user_interaction(
            p_user_id,
            'session_end',
            '/logout',
            'session_manager',
            'User session ended',
            p_session_data,
            NULL,
            NULL,
            NULL,
            NULL
        );
        
        session_info := jsonb_build_object(
            'session_ended', true,
            'session_data', p_session_data,
            'session_duration', p_session_data->>'duration_minutes'
        );
        
    ELSIF p_action = 'check' THEN
        -- Check session validity
        SELECT COUNT(*) INTO active_sessions
        FROM user_interactions 
        WHERE user_id = p_user_id 
        AND interaction_type = 'session_active' 
        AND timestamp > NOW() - session_timeout;
        
        session_info := jsonb_build_object(
            'session_valid', active_sessions > 0,
            'active_sessions', active_sessions,
            'session_timeout', session_timeout,
            'check_timestamp', NOW()
        );
    END IF;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'action', p_action,
        'session_info', session_info,
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================== FINAL SETUP ====================

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_tier(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_interaction(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_ai_insight(UUID, TEXT, TEXT, TEXT, TEXT, DECIMAL, JSONB, JSONB, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_wallet_transaction(UUID, DECIMAL, TEXT, TEXT, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_behavioral_pattern(UUID, TEXT, DECIMAL, JSONB, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_notification(UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_tier(UUID, TEXT, TEXT, UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_mood_entry(UUID, TEXT, INTEGER, INTEGER, INTEGER, INTEGER, TEXT, TEXT[], TEXT[], JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_journal_entry(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT[], BOOLEAN, JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_goal(UUID, TEXT, TEXT, TEXT, DATE, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_goal_progress(UUID, DECIMAL, BOOLEAN, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_message(UUID, UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_message_as_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_appointment(UUID, UUID, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT, BOOLEAN, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_appointment(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_assessment(UUID, TEXT, TEXT, JSONB, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_assessment(UUID, JSONB, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_behavioral_pattern(UUID, TEXT, DECIMAL, JSONB, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_predictive_insight(UUID, TEXT, DECIMAL, JSONB, JSONB, TEXT, DECIMAL, TIMESTAMPTZ, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_system_error(TEXT, TEXT, JSONB, TEXT, TEXT, UUID, INET, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_user_action(UUID, TEXT, TEXT, TEXT, JSONB, JSONB, INET, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_dashboard_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_therapist_dashboard_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_user_report(UUID, TEXT, DATE, DATE) TO authenticated;

-- Grant execute on new advanced functions
GRANT EXECUTE ON FUNCTION public.calculate_user_engagement_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_personalized_recommendations(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.analyze_behavioral_patterns(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_advanced_analytics_report(UUID, TEXT, DATE, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.monitor_wellness_alerts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.export_user_data_secure(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_real_time_notification(TEXT, UUID, JSONB, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_real_time_mood_analysis(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.manage_user_session(UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_wallet_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_user_tier_change() TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_mood_entry() TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_new_message_func() TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_appointment_scheduled_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_appointment_scheduled_therapist_func() TO authenticated;

-- Final vacuum and analyze
VACUUM ANALYZE;