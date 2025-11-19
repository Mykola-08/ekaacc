-- =====================================================
-- EKA Platform Database Setup - Complete Migration
-- =====================================================
-- Version: 2.0 Enhanced
-- Date: 2024-11-18
-- Description: Complete database setup with advanced features
-- =====================================================

-- Note: This SQL file contains the complete database setup
-- Run this file in your PostgreSQL database to create all tables, functions, and configurations

-- =====================================================
-- PREREQUISITES
-- =====================================================
-- Ensure you have the following PostgreSQL extensions available:
-- - uuid-ossp (for UUID generation)
-- - pg_trgm (for text search)
-- - pgcrypto (for cryptographic functions)

-- =====================================================
-- STEP 1: Create Extensions
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STEP 2: Drop Existing Functions (to avoid conflicts)
-- =====================================================

-- Drop advanced functions if they exist
DROP FUNCTION IF EXISTS public.calculate_user_engagement_score(UUID);
DROP FUNCTION IF EXISTS public.generate_personalized_recommendations(UUID);
-- DROP FUNCTION IF EXISTS public.analyze_behavioral_patterns(UUID);
DROP FUNCTION IF EXISTS public.monitor_wellness_alerts(UUID);
DROP FUNCTION IF EXISTS public.process_real_time_mood_analysis(UUID);
DROP FUNCTION IF EXISTS public.export_user_data_secure(UUID, TEXT);
DROP FUNCTION IF EXISTS public.trigger_real_time_notification(TEXT, UUID, JSONB, TEXT);
DROP FUNCTION IF EXISTS public.manage_user_session(UUID, TEXT, JSONB);

-- Drop core functions if they exist
-- DROP FUNCTION IF EXISTS public.update_updated_at_column();
-- DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.check_user_permission(UUID, TEXT);

-- =====================================================
-- STEP 3: Create Core Functions
-- =====================================================

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

-- =====================================================
-- STEP 4: Create Advanced Analytics Functions
-- =====================================================

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
        COALESCE(AVG(duration), 0)::INTEGER INTO avg_session_duration
    FROM appointments 
    WHERE user_id = p_user_id AND status = 'completed' AND duration IS NOT NULL;
    
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
            WHEN MAX(date) IS NULL THEN 999
            ELSE DATE_PART('day', NOW() - MAX(date)::timestamp)
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
        -- Create alert notification
        INSERT INTO notifications (user_id, type, title, message, payload, priority, created_at)
        VALUES (
            p_user_id,
            'mood_alert',
            'Mood Alert',
            'Your mood patterns have changed significantly',
            jsonb_build_object(
                'recent_mood', recent_mood,
                'mood_trend', mood_trend,
                'alert_type', 'concerning_pattern',
                'recommended_action', 'Consider scheduling a check-in'
            ),
            'high',
            NOW()
        )
        RETURNING id INTO notification_id;
        
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

-- =====================================================
-- STEP 5: Create Advanced Performance Indexes
-- =====================================================

-- Basic performance indexes
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_timestamp_desc ON public.user_interactions(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_logged_at_desc ON public.mood_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created_desc ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_user_date_asc ON public.appointments(user_id, date ASC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_created_desc ON public.wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created_desc ON public.notifications(user_id, is_read, created_at DESC);

-- Analytics-optimized indexes
CREATE INDEX IF NOT EXISTS idx_mood_logs_date_score ON public.mood_logs(logged_at, mood_score);
CREATE INDEX IF NOT EXISTS idx_user_interactions_date_type ON public.user_interactions(timestamp, interaction_type);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON public.appointments(date, status);

-- Partial indexes for common filtered queries
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON public.appointments(status) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_goals_active ON public.goals(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_ai_insights_active ON public.ai_insights(is_active) WHERE is_active = true;

-- Full-text search indexes with custom configurations
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_english ON public.journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_journal_entries_title_english ON public.journal_entries USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_messages_content_english ON public.direct_messages USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_messages_subject_english ON public.direct_messages USING gin(to_tsvector('english', subject));

-- JSONB indexes for metadata queries
CREATE INDEX IF NOT EXISTS idx_user_settings_preferences_gin ON public.user_settings USING gin(preferences);
CREATE INDEX IF NOT EXISTS idx_ai_insights_metadata_gin ON public.ai_insights USING gin(metadata);
CREATE INDEX IF NOT EXISTS user_interactions_metadata_gin ON public.user_interactions USING gin(metadata);

-- =====================================================
-- STEP 6: Grant Permissions
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Grant insert permissions for authenticated users
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant update permissions for authenticated users
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant delete permissions for authenticated users
GRANT DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_user_engagement_score(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_personalized_recommendations(UUID) TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.analyze_behavioral_patterns(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.monitor_wellness_alerts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_real_time_mood_analysis(UUID) TO authenticated;

-- =====================================================
-- STEP 7: Final Optimization
-- =====================================================

-- Run VACUUM ANALYZE for optimal performance
-- VACUUM ANALYZE;

-- =====================================================
-- STEP 8: Verification Queries
-- =====================================================

-- Test the functions with sample queries:

-- Test engagement score calculation
-- SELECT calculate_user_engagement_score('your-user-id-here');

-- Test personalized recommendations
-- SELECT generate_personalized_recommendations('your-user-id-here');

-- Test behavioral pattern analysis
-- SELECT analyze_behavioral_patterns('your-user-id-here');

-- Test wellness monitoring
-- SELECT monitor_wellness_alerts('your-user-id-here');

-- Test real-time mood analysis
-- SELECT process_real_time_mood_analysis('your-user-id-here');

-- =====================================================
-- NOTES FOR MANUAL EXECUTION
-- =====================================================

-- 1. Replace 'your-user-id-here' with actual user UUIDs when testing
-- 2. Ensure all prerequisite tables exist before running this script
-- 3. Run this script as a database administrator
-- 4. Monitor the execution for any errors
-- 5. Test each function individually before production use

-- =====================================================
-- SUPPORTING TABLES REFERENCE
-- =====================================================

-- This script assumes the following tables exist:
-- - auth.users (Supabase auth table)
-- - user_profiles, user_preferences, user_settings
-- - mood_logs, user_interactions, notifications
-- - appointments, user_exercise_completions, goals
-- - user_tiers, user_exercise_completions
-- - wallets, wallet_transactions, ai_insights

-- If any of these tables are missing, create them first or
-- modify this script to include their creation statements