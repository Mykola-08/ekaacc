


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."calculate_user_engagement_score"("user_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    score NUMERIC := 0;
    session_count INTEGER;
    content_interactions INTEGER;
    login_frequency NUMERIC;
    subscription_status TEXT;
BEGIN
    -- Count therapy sessions
    SELECT COUNT(*) INTO session_count 
    FROM public.appointments 
    WHERE user_id = $1 AND status = 'completed';
    
    -- Count content interactions
    SELECT COUNT(*) INTO content_interactions 
    FROM public.user_content_interactions 
    WHERE user_id = $1;
    
    -- Calculate login frequency (last 30 days)
    SELECT COUNT(*)::NUMERIC / 30 INTO login_frequency
    FROM public.user_interactions 
    WHERE user_id = $1 
    AND interaction_type = 'session_start' 
    AND timestamp >= NOW() - INTERVAL '30 days';
    
    -- Get subscription status
    SELECT status INTO subscription_status
    FROM public.subscriptions 
    WHERE user_id = $1 AND status = 'active';
    
    -- Calculate score
    score := 
        (session_count * 10) + 
        (content_interactions * 2) + 
        (login_frequency * 20) +
        CASE WHEN subscription_status = 'active' THEN 50 ELSE 0 END;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$_$;


ALTER FUNCTION "public"."calculate_user_engagement_score"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_insights"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM predictive_insights
  WHERE expires_at < NOW();
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_insights"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_payment_requests"() RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM payment_requests 
    WHERE status = 'pending' 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;


ALTER FUNCTION "public"."cleanup_expired_payment_requests"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_old_analytics_data"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Delete analytics events older than 2 years
    DELETE FROM public.analytics_events 
    WHERE timestamp < NOW() - INTERVAL '2 years';
    
    -- Delete user interactions older than 1 year
    DELETE FROM public.user_interactions 
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    -- Archive old notifications
    DELETE FROM public.notifications 
    WHERE created_at < NOW() - INTERVAL '6 months' 
    AND is_read = true;
END;
$$;


ALTER FUNCTION "public"."cleanup_old_analytics_data"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_account"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO public.user_accounts (
        id,
        email,
        full_name,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NOW(),
        NOW()
    );
    
    -- Create default communication preferences
    INSERT INTO public.communication_preferences (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_user_account"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_wallet"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO wallets (user_id, balance, currency, is_active)
    VALUES (NEW.id, 0.00, 'EUR', true);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_user_wallet"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    INSERT INTO public.user_role_assignments (user_id, role_id)
    VALUES (NEW.id, (SELECT id FROM public.user_roles WHERE name = 'user'));
    
    INSERT INTO public.audit_logs (user_id, action, resource_type, details)
    VALUES (NEW.id, 'user.created', 'user', jsonb_build_object('email', NEW.email));
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_published_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.is_published = true AND OLD.is_published = false THEN
        NEW.published_at = now();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_published_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_subscription_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.subscription_history (
            subscription_id,
            user_id,
            action,
            previous_status,
            new_status,
            previous_tier_id,
            new_tier_id,
            created_at,
            created_by
        ) VALUES (
            NEW.id,
            NEW.user_id,
            'updated',
            OLD.status,
            NEW.status,
            OLD.tier_id,
            NEW.tier_id,
            NOW(),
            auth.uid()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."track_subscription_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_auth_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_auth_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_behavioral_patterns_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_behavioral_patterns_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_payment_requests_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_payment_requests_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_purchasable_items_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_purchasable_items_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_purchases_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_purchases_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_wallet_transactions_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_wallet_transactions_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_wallets_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_wallets_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" NOT NULL,
    "recipients" "text",
    "recipient_ids" "uuid"[],
    "priority" "text" DEFAULT 'medium'::"text",
    "is_active" boolean DEFAULT true,
    "created_by" "uuid",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."appointments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_type" "text" NOT NULL,
    "practitioner" "text" NOT NULL,
    "date" "date" NOT NULL,
    "time" "text" NOT NULL,
    "price" numeric(10,2),
    "duration" integer DEFAULT 60,
    "notes" "text",
    "preferences" "jsonb",
    "is_first_time" boolean DEFAULT false,
    "status" "text" DEFAULT 'upcoming'::"text",
    "rating" integer,
    "feedback_id" "uuid",
    "guest_email" "text",
    "guest_phone" "text",
    "guest_name" "text",
    "is_guest" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "service_id" "uuid",
    "practitioner_id" "uuid",
    "location" "text",
    "meeting_link" "text",
    "preparation_notes" "text",
    "follow_up_notes" "text",
    "session_outcome" "text",
    "next_session_recommended" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "cancelled_at" timestamp with time zone,
    "cancelled_reason" "text",
    "cancelled_by" "uuid"
);


ALTER TABLE "public"."appointments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "resource_type" "text",
    "resource_id" "text",
    "details" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."behavioral_patterns" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pattern_type" character varying(50) NOT NULL,
    "confidence_score" numeric(3,2) NOT NULL,
    "evidence" "text"[] NOT NULL,
    "severity" character varying(10) NOT NULL,
    "first_detected" timestamp with time zone DEFAULT "now"(),
    "last_updated" timestamp with time zone DEFAULT "now"(),
    "status" character varying(20) DEFAULT 'active'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "behavioral_patterns_confidence_score_check" CHECK ((("confidence_score" >= (0)::numeric) AND ("confidence_score" <= (1)::numeric))),
    CONSTRAINT "behavioral_patterns_pattern_type_check" CHECK ((("pattern_type")::"text" = ANY ((ARRAY['engagement_decline'::character varying, 'mood_deterioration'::character varying, 'session_frequency_drop'::character varying, 'crisis_pattern'::character varying, 'positive_progress'::character varying, 'goal_achievement'::character varying, 'adherence_increase'::character varying])::"text"[]))),
    CONSTRAINT "behavioral_patterns_severity_check" CHECK ((("severity")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::"text"[]))),
    CONSTRAINT "behavioral_patterns_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'resolved'::character varying, 'archived'::character varying])::"text"[])))
);


ALTER TABLE "public"."behavioral_patterns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."behavioral_triggers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trigger_name" character varying(100) NOT NULL,
    "trigger_type" character varying(50) NOT NULL,
    "trigger_conditions" "jsonb" NOT NULL,
    "target_content" "jsonb" NOT NULL,
    "priority" integer DEFAULT 1,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."behavioral_triggers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."billing_info" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "billing_name" "text" NOT NULL,
    "billing_email" "text" NOT NULL,
    "billing_address" "jsonb" NOT NULL,
    "tax_id" "text",
    "payment_methods" "jsonb" DEFAULT '[]'::"jsonb",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."billing_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communication_preferences" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email_notifications" boolean DEFAULT true,
    "push_notifications" boolean DEFAULT true,
    "sms_notifications" boolean DEFAULT false,
    "marketing_emails" boolean DEFAULT false,
    "therapy_reminders" boolean DEFAULT true,
    "subscription_alerts" boolean DEFAULT true,
    "system_updates" boolean DEFAULT true,
    "quiet_hours_start" time without time zone,
    "quiet_hours_end" time without time zone,
    "timezone" "text" DEFAULT 'UTC'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."communication_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "is_published" boolean DEFAULT false,
    "published_at" timestamp with time zone,
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "views_count" integer DEFAULT 0,
    "is_featured" boolean DEFAULT false,
    "is_anonymous" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."community_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversion_funnels" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "funnel_name" "text" NOT NULL,
    "funnel_type" "text" NOT NULL,
    "steps" "jsonb" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."conversion_funnels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "appointment_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "tags" "jsonb" DEFAULT '[]'::"jsonb",
    "comments" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "feedback_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."funnel_tracking" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "funnel_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "current_step" integer DEFAULT 1,
    "entered_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "abandoned_at" timestamp with time zone,
    "abandonment_reason" "text",
    "conversion_value" numeric(10,2),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."funnel_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "total_days" integer DEFAULT 20,
    "days_completed" integer DEFAULT 0,
    "progress" integer DEFAULT 0,
    "status" "text" DEFAULT 'in-progress'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."message_threads" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "subject" "text" NOT NULL,
    "thread_type" "text" NOT NULL,
    "participant_ids" "uuid"[] NOT NULL,
    "is_group" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_archived" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_message_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."message_threads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "thread_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "message_type" "text" DEFAULT 'text'::"text",
    "attachments" "jsonb" DEFAULT '[]'::"jsonb",
    "is_read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "edited_at" timestamp with time zone,
    "edited_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "template_name" "text" NOT NULL,
    "template_type" "text" NOT NULL,
    "subject_template" "text",
    "content_template" "text" NOT NULL,
    "variables" "jsonb" DEFAULT '[]'::"jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notification_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "user_name" "text" DEFAULT 'Unknown User'::"text" NOT NULL,
    "user_email" "text",
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "method" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "description" "text" NOT NULL,
    "proof_image_url" "text",
    "proof_text" "text",
    "metadata" "jsonb",
    "confirmed_by" "uuid",
    "confirmed_by_name" "text",
    "confirmed_by_role" "text",
    "rejection_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "confirmed_at" timestamp with time zone,
    "expires_at" timestamp with time zone NOT NULL,
    CONSTRAINT "payment_requests_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "payment_requests_confirmed_by_role_check" CHECK (("confirmed_by_role" = ANY (ARRAY['Admin'::"text", 'Therapist'::"text"]))),
    CONSTRAINT "payment_requests_method_check" CHECK (("method" = ANY (ARRAY['bizum'::"text", 'cash'::"text"]))),
    CONSTRAINT "payment_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'user_confirmed'::"text", 'confirmed'::"text", 'rejected'::"text", 'cancelled'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."payment_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text",
    "status" "text" NOT NULL,
    "payment_method" "text",
    "stripe_payment_intent_id" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "resource" "text" NOT NULL,
    "action" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."predictive_insights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "insight_type" character varying(50) NOT NULL,
    "probability" numeric(3,2) NOT NULL,
    "contributing_factors" "text"[] NOT NULL,
    "recommended_actions" "text"[] NOT NULL,
    "timeframe" character varying(20) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone NOT NULL,
    "is_read" boolean DEFAULT false,
    "is_dismissed" boolean DEFAULT false,
    CONSTRAINT "predictive_insights_insight_type_check" CHECK ((("insight_type")::"text" = ANY ((ARRAY['potential_crisis'::character varying, 'relapse_risk'::character varying, 'treatment_resistance'::character varying, 'engagement_decline'::character varying, 'positive_outcome'::character varying])::"text"[]))),
    CONSTRAINT "predictive_insights_probability_check" CHECK ((("probability" >= (0)::numeric) AND ("probability" <= (1)::numeric))),
    CONSTRAINT "predictive_insights_timeframe_check" CHECK ((("timeframe")::"text" = ANY ((ARRAY['immediate'::character varying, 'short_term'::character varying, 'long_term'::character varying])::"text"[])))
);


ALTER TABLE "public"."predictive_insights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotional_content_variants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "page_id" "uuid",
    "variant_name" character varying(100) NOT NULL,
    "target_audience" "jsonb",
    "hero_headline" character varying(300),
    "hero_subheadline" character varying(500),
    "hero_cta_text" character varying(100),
    "hero_cta_url" character varying(300),
    "benefits_headline" character varying(300),
    "benefits_list" "jsonb"[],
    "social_proof" "jsonb",
    "urgency_elements" "jsonb",
    "personalization_elements" "jsonb",
    "conversion_elements" "jsonb",
    "is_active" boolean DEFAULT true,
    "conversion_rate" numeric(5,4),
    "views_count" integer DEFAULT 0,
    "conversions_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."promotional_content_variants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotional_interactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "page_id" "uuid",
    "variant_id" "uuid",
    "interaction_type" character varying(50) NOT NULL,
    "interaction_data" "jsonb",
    "session_id" character varying(100),
    "user_agent" "text",
    "ip_address" "inet",
    "timestamp" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."promotional_interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotional_pages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" character varying(100) NOT NULL,
    "title" character varying(200) NOT NULL,
    "subtitle" character varying(300),
    "persona_id" "uuid",
    "page_type" character varying(50) NOT NULL,
    "hero_config" "jsonb" NOT NULL,
    "content_blocks" "jsonb"[] NOT NULL,
    "design_config" "jsonb" NOT NULL,
    "seo_config" "jsonb",
    "is_active" boolean DEFAULT true,
    "conversion_goals" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."promotional_pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchasable_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "category" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "purchasable_items_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."purchasable_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "discount_percentage" numeric(5,2) DEFAULT 0 NOT NULL,
    "total_amount" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "fulfilled_at" timestamp with time zone,
    CONSTRAINT "purchases_discount_percentage_check" CHECK ((("discount_percentage" >= (0)::numeric) AND ("discount_percentage" <= (100)::numeric))),
    CONSTRAINT "purchases_quantity_check" CHECK (("quantity" > 0)),
    CONSTRAINT "purchases_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'cancelled'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recommendations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "recommended_sessions" "jsonb" DEFAULT '[]'::"jsonb",
    "focus_areas" "jsonb" DEFAULT '[]'::"jsonb",
    "practitioner_match" "jsonb" DEFAULT '[]'::"jsonb",
    "session_timing" "text",
    "intensity" "text",
    "next_steps" "jsonb" DEFAULT '[]'::"jsonb",
    "insights" "jsonb" DEFAULT '[]'::"jsonb",
    "personalization_score" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resource_libraries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category_id" "uuid",
    "is_public" boolean DEFAULT true,
    "requires_subscription" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."resource_libraries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."services" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric DEFAULT 0 NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text",
    "duration" integer DEFAULT 60,
    "category" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_notes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "appointment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notes" "text" NOT NULL,
    "mood_before" "text",
    "mood_after" "text",
    "stress_level_before" integer,
    "stress_level_after" integer,
    "homework_assigned" "jsonb" DEFAULT '[]'::"jsonb",
    "next_session_goals" "text",
    "is_private" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "session_notes_stress_level_after_check" CHECK ((("stress_level_after" >= 1) AND ("stress_level_after" <= 10))),
    CONSTRAINT "session_notes_stress_level_before_check" CHECK ((("stress_level_before" >= 1) AND ("stress_level_before" <= 10)))
);


ALTER TABLE "public"."session_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "therapy_type_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "duration_minutes" integer NOT NULL,
    "structure" "jsonb" DEFAULT '{}'::"jsonb",
    "materials_needed" "jsonb" DEFAULT '[]'::"jsonb",
    "objectives" "jsonb" DEFAULT '[]'::"jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."session_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_history" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "action" "text" NOT NULL,
    "previous_status" "text",
    "new_status" "text",
    "previous_tier_id" "uuid",
    "new_tier_id" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."subscription_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_tiers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "name" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "monthly_price" numeric(10,2) NOT NULL,
    "yearly_price" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "stripe_monthly_price_id" "text",
    "stripe_yearly_price_id" "text",
    "stripe_product_id" "text",
    "benefits" "text"[] DEFAULT '{}'::"text"[],
    "features" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "badge" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "color" "text" NOT NULL,
    "icon" "text",
    "is_active" boolean DEFAULT true,
    "order" integer DEFAULT 0,
    "popular_badge" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "limitations" "jsonb" DEFAULT '{}'::"jsonb",
    "trial_days" integer DEFAULT 0,
    "grace_period_days" integer DEFAULT 3,
    "is_public" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    CONSTRAINT "subscription_tiers_type_check" CHECK (("type" = ANY (ARRAY['loyalty'::"text", 'vip'::"text"])))
);


ALTER TABLE "public"."subscription_tiers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "current_period_start" timestamp with time zone NOT NULL,
    "current_period_end" timestamp with time zone NOT NULL,
    "loyalty_points_earned" integer DEFAULT 0,
    "loyalty_points_spent" integer DEFAULT 0,
    "loyalty_discount_used" numeric(10,2) DEFAULT 0,
    "sessions_used" integer DEFAULT 0,
    "sessions_remaining" integer DEFAULT 0,
    "personal_therapist_assigned" boolean DEFAULT false,
    "group_sessions_attended" integer DEFAULT 0,
    "reports_generated" integer DEFAULT 0,
    "themes_used" "text"[] DEFAULT '{}'::"text"[],
    "current_theme" "text",
    "rewards_claimed" "jsonb" DEFAULT '[]'::"jsonb",
    "total_rewards_value" numeric(10,2) DEFAULT 0,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "subscription_usage_type_check" CHECK (("type" = ANY (ARRAY['loyalty'::"text", 'vip'::"text"])))
);


ALTER TABLE "public"."subscription_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "interval" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "stripe_price_id" "text",
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "trial_end_date" timestamp with time zone,
    "cancel_at_period_end" boolean DEFAULT false,
    "created_by" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tier_id" "uuid",
    "payment_method" "text",
    "payment_status" "text" DEFAULT 'pending'::"text",
    "auto_renew" boolean DEFAULT true,
    "renewal_reminder_sent" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "subscriptions_interval_check" CHECK (("interval" = ANY (ARRAY['monthly'::"text", 'yearly'::"text"]))),
    CONSTRAINT "subscriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'cancelled'::"text", 'expired'::"text", 'pending'::"text", 'past_due'::"text"]))),
    CONSTRAINT "subscriptions_type_check" CHECK (("type" = ANY (ARRAY['loyalty'::"text", 'vip'::"text"])))
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_configurations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."system_configurations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."therapy_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "color" "text",
    "is_active" boolean DEFAULT true,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."therapy_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."therapy_types" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "duration_minutes" integer DEFAULT 60,
    "price" numeric(10,2),
    "currency" "text" DEFAULT 'EUR'::"text",
    "is_active" boolean DEFAULT true,
    "requires_subscription" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."therapy_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_content_interactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content_id" "uuid" NOT NULL,
    "interaction_type" "text" NOT NULL,
    "interaction_data" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_content_interactions_interaction_type_check" CHECK (("interaction_type" = ANY (ARRAY['view'::"text", 'like'::"text", 'save'::"text", 'share'::"text", 'complete'::"text"])))
);


ALTER TABLE "public"."user_content_interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_feature_assignments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "feature_flag_id" "uuid" NOT NULL,
    "is_enabled" boolean DEFAULT true,
    "assigned_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."user_feature_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_interactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "interaction_type" character varying(50) NOT NULL,
    "page_path" "text",
    "element_id" "text",
    "metadata" "jsonb",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    "session_id" "text" NOT NULL,
    "device_type" character varying(20) NOT NULL,
    "user_agent" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_account_id" "uuid",
    "session_duration" integer,
    "bounce_rate" numeric(5,2),
    "conversion_data" "jsonb" DEFAULT '{}'::"jsonb",
    "ab_test_variant" "text",
    "device_info" "jsonb" DEFAULT '{}'::"jsonb",
    "location_info" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "user_interactions_device_type_check" CHECK ((("device_type")::"text" = ANY ((ARRAY['desktop'::character varying, 'mobile'::character varying, 'tablet'::character varying])::"text"[]))),
    CONSTRAINT "user_interactions_interaction_type_check" CHECK ((("interaction_type")::"text" = ANY ((ARRAY['session_start'::character varying, 'session_end'::character varying, 'page_view'::character varying, 'button_click'::character varying, 'form_submission'::character varying, 'message_sent'::character varying, 'appointment_booked'::character varying, 'exercise_completed'::character varying, 'mood_logged'::character varying, 'crisis_interaction'::character varying])::"text"[])))
);


ALTER TABLE "public"."user_interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_journey_steps" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "journey_type" "text" NOT NULL,
    "step_name" "text" NOT NULL,
    "step_order" integer NOT NULL,
    "step_data" "jsonb" DEFAULT '{}'::"jsonb",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "time_spent_seconds" integer,
    "success" boolean DEFAULT true,
    "error_message" "text"
);


ALTER TABLE "public"."user_journey_steps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_journeys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "journey_name" character varying(200),
    "current_stage" character varying(100),
    "journey_data" "jsonb",
    "conversion_probability" numeric(5,4),
    "last_interaction" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_journeys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" NOT NULL,
    "priority" "text" DEFAULT 'medium'::"text",
    "is_read" boolean DEFAULT false,
    "admin_notification_id" "uuid",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_personalization" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "persona_id" "uuid",
    "primary_concerns" "text"[],
    "lifestyle_factors" "jsonb",
    "work_environment" character varying(100),
    "physical_activity_level" character varying(50),
    "stress_levels" "jsonb",
    "preferred_communication_style" character varying(50),
    "motivational_triggers" "text"[],
    "barriers_to_entry" "text"[],
    "personalization_score" integer DEFAULT 0,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_personalization" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_personas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "target_demographics" "jsonb",
    "pain_points" "text"[],
    "goals" "text"[],
    "preferences" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_personas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'system'::"text",
    "language" "text" DEFAULT 'en'::"text",
    "timezone" "text" DEFAULT 'UTC'::"text",
    "email_notifications" boolean DEFAULT true,
    "push_notifications" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "full_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_role_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"(),
    "assigned_by" "uuid"
);


ALTER TABLE "public"."user_role_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "wallet_id" "uuid" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "type" "text" NOT NULL,
    "description" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "wallet_transactions_type_check" CHECK (("type" = ANY (ARRAY['credit'::"text", 'debit'::"text"])))
);


ALTER TABLE "public"."wallet_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "balance" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "currency" "text" DEFAULT 'EUR'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "is_paused" boolean DEFAULT false NOT NULL,
    "pause_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_transaction_at" timestamp with time zone,
    CONSTRAINT "wallets_balance_check" CHECK (("balance" >= (0)::numeric))
);


ALTER TABLE "public"."wallets" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_notifications"
    ADD CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."behavioral_patterns"
    ADD CONSTRAINT "behavioral_patterns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."behavioral_triggers"
    ADD CONSTRAINT "behavioral_triggers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_info"
    ADD CONSTRAINT "billing_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communication_preferences"
    ADD CONSTRAINT "communication_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communication_preferences"
    ADD CONSTRAINT "communication_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversion_funnels"
    ADD CONSTRAINT "conversion_funnels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."funnel_tracking"
    ADD CONSTRAINT "funnel_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message_threads"
    ADD CONSTRAINT "message_threads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_templates"
    ADD CONSTRAINT "notification_templates_template_name_key" UNIQUE ("template_name");



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."predictive_insights"
    ADD CONSTRAINT "predictive_insights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotional_content_variants"
    ADD CONSTRAINT "promotional_content_variants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotional_interactions"
    ADD CONSTRAINT "promotional_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotional_pages"
    ADD CONSTRAINT "promotional_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotional_pages"
    ADD CONSTRAINT "promotional_pages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."purchasable_items"
    ADD CONSTRAINT "purchasable_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."resource_libraries"
    ADD CONSTRAINT "resource_libraries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_permission_id_key" UNIQUE ("role_id", "permission_id");



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_notes"
    ADD CONSTRAINT "session_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_templates"
    ADD CONSTRAINT "session_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_history"
    ADD CONSTRAINT "subscription_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_tiers"
    ADD CONSTRAINT "subscription_tiers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_tiers"
    ADD CONSTRAINT "subscription_tiers_type_key" UNIQUE ("type");



ALTER TABLE ONLY "public"."subscription_usage"
    ADD CONSTRAINT "subscription_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_usage"
    ADD CONSTRAINT "subscription_usage_subscription_id_user_id_type_key" UNIQUE ("subscription_id", "user_id", "type");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_configurations"
    ADD CONSTRAINT "system_configurations_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."system_configurations"
    ADD CONSTRAINT "system_configurations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."therapy_categories"
    ADD CONSTRAINT "therapy_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."therapy_categories"
    ADD CONSTRAINT "therapy_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."therapy_types"
    ADD CONSTRAINT "therapy_types_category_id_name_key" UNIQUE ("category_id", "name");



ALTER TABLE ONLY "public"."therapy_types"
    ADD CONSTRAINT "therapy_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_content_interactions"
    ADD CONSTRAINT "user_content_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_content_interactions"
    ADD CONSTRAINT "user_content_interactions_user_id_content_id_interaction_ty_key" UNIQUE ("user_id", "content_id", "interaction_type");



ALTER TABLE ONLY "public"."user_feature_assignments"
    ADD CONSTRAINT "user_feature_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_feature_assignments"
    ADD CONSTRAINT "user_feature_assignments_user_id_feature_flag_id_key" UNIQUE ("user_id", "feature_flag_id");



ALTER TABLE ONLY "public"."user_interactions"
    ADD CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_journey_steps"
    ADD CONSTRAINT "user_journey_steps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_journey_steps"
    ADD CONSTRAINT "user_journey_steps_user_id_journey_type_step_name_key" UNIQUE ("user_id", "journey_type", "step_name");



ALTER TABLE ONLY "public"."user_journeys"
    ADD CONSTRAINT "user_journeys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_personalization"
    ADD CONSTRAINT "user_personalization_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_personas"
    ADD CONSTRAINT "user_personas_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."user_personas"
    ADD CONSTRAINT "user_personas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."user_role_assignments"
    ADD CONSTRAINT "user_role_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_role_assignments"
    ADD CONSTRAINT "user_role_assignments_user_id_role_id_key" UNIQUE ("user_id", "role_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "wallets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "wallets_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_admin_notifications_created_at" ON "public"."admin_notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_admin_notifications_is_active" ON "public"."admin_notifications" USING "btree" ("is_active");



CREATE INDEX "idx_appointments_date" ON "public"."appointments" USING "btree" ("date");



CREATE INDEX "idx_appointments_practitioner" ON "public"."appointments" USING "btree" ("practitioner");



CREATE INDEX "idx_appointments_status" ON "public"."appointments" USING "btree" ("status");



CREATE INDEX "idx_appointments_user" ON "public"."appointments" USING "btree" ("user_id");



CREATE INDEX "idx_appointments_user_id" ON "public"."appointments" USING "btree" ("user_id");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_user_id" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_behavioral_patterns_composite" ON "public"."behavioral_patterns" USING "btree" ("user_id", "status", "severity");



CREATE INDEX "idx_behavioral_patterns_pattern_type" ON "public"."behavioral_patterns" USING "btree" ("pattern_type");



CREATE INDEX "idx_behavioral_patterns_severity" ON "public"."behavioral_patterns" USING "btree" ("severity");



CREATE INDEX "idx_behavioral_patterns_status" ON "public"."behavioral_patterns" USING "btree" ("status");



CREATE INDEX "idx_behavioral_patterns_user_id" ON "public"."behavioral_patterns" USING "btree" ("user_id");



CREATE UNIQUE INDEX "idx_billing_info_default" ON "public"."billing_info" USING "btree" ("user_id") WHERE ("is_default" = true);



CREATE INDEX "idx_community_posts_category" ON "public"."community_posts" USING "btree" ("category");



CREATE INDEX "idx_community_posts_created_at" ON "public"."community_posts" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_community_posts_is_featured" ON "public"."community_posts" USING "btree" ("is_featured") WHERE ("is_featured" = true);



CREATE INDEX "idx_community_posts_is_published" ON "public"."community_posts" USING "btree" ("is_published");



CREATE INDEX "idx_community_posts_likes_count" ON "public"."community_posts" USING "btree" ("likes_count" DESC);



CREATE INDEX "idx_community_posts_published_at" ON "public"."community_posts" USING "btree" ("published_at" DESC);



CREATE INDEX "idx_community_posts_user_id" ON "public"."community_posts" USING "btree" ("user_id");



CREATE INDEX "idx_feedback_appointment_id" ON "public"."feedback" USING "btree" ("appointment_id");



CREATE INDEX "idx_feedback_user_id" ON "public"."feedback" USING "btree" ("user_id");



CREATE INDEX "idx_funnel_tracking_user" ON "public"."funnel_tracking" USING "btree" ("user_id");



CREATE INDEX "idx_goals_status" ON "public"."goals" USING "btree" ("status");



CREATE INDEX "idx_goals_user_id" ON "public"."goals" USING "btree" ("user_id");



CREATE INDEX "idx_messages_created" ON "public"."messages" USING "btree" ("created_at");



CREATE INDEX "idx_messages_sender" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_messages_thread" ON "public"."messages" USING "btree" ("thread_id");



CREATE INDEX "idx_messages_unread" ON "public"."messages" USING "btree" ("is_read") WHERE ("is_read" = false);



CREATE INDEX "idx_payment_requests_created_at" ON "public"."payment_requests" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_payment_requests_expires_at" ON "public"."payment_requests" USING "btree" ("expires_at");



CREATE INDEX "idx_payment_requests_status" ON "public"."payment_requests" USING "btree" ("status");



CREATE INDEX "idx_payment_requests_user_id" ON "public"."payment_requests" USING "btree" ("user_id");



CREATE INDEX "idx_payments_created_at" ON "public"."payments" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_payments_user_id" ON "public"."payments" USING "btree" ("user_id");



CREATE INDEX "idx_predictive_insights_expires_at" ON "public"."predictive_insights" USING "btree" ("expires_at");



CREATE INDEX "idx_predictive_insights_insight_type" ON "public"."predictive_insights" USING "btree" ("insight_type");



CREATE INDEX "idx_predictive_insights_timeframe" ON "public"."predictive_insights" USING "btree" ("timeframe");



CREATE INDEX "idx_predictive_insights_unread" ON "public"."predictive_insights" USING "btree" ("user_id", "is_read", "is_dismissed") WHERE (("is_read" = false) AND ("is_dismissed" = false));



CREATE INDEX "idx_predictive_insights_user_id" ON "public"."predictive_insights" USING "btree" ("user_id");



CREATE INDEX "idx_purchasable_items_category" ON "public"."purchasable_items" USING "btree" ("category");



CREATE INDEX "idx_purchasable_items_is_active" ON "public"."purchasable_items" USING "btree" ("is_active");



CREATE INDEX "idx_purchases_created_at" ON "public"."purchases" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_purchases_item_id" ON "public"."purchases" USING "btree" ("item_id");



CREATE INDEX "idx_purchases_status" ON "public"."purchases" USING "btree" ("status");



CREATE INDEX "idx_purchases_user_id" ON "public"."purchases" USING "btree" ("user_id");



CREATE INDEX "idx_role_permissions_permission_id" ON "public"."role_permissions" USING "btree" ("permission_id");



CREATE INDEX "idx_role_permissions_role_id" ON "public"."role_permissions" USING "btree" ("role_id");



CREATE INDEX "idx_session_notes_appointment" ON "public"."session_notes" USING "btree" ("appointment_id");



CREATE INDEX "idx_subscription_tiers_active" ON "public"."subscription_tiers" USING "btree" ("is_active");



CREATE INDEX "idx_subscription_tiers_type" ON "public"."subscription_tiers" USING "btree" ("type");



CREATE INDEX "idx_subscription_usage_subscription_id" ON "public"."subscription_usage" USING "btree" ("subscription_id");



CREATE INDEX "idx_subscription_usage_type" ON "public"."subscription_usage" USING "btree" ("type");



CREATE INDEX "idx_subscription_usage_user_id" ON "public"."subscription_usage" USING "btree" ("user_id");



CREATE INDEX "idx_subscriptions_end_date" ON "public"."subscriptions" USING "btree" ("end_date");



CREATE INDEX "idx_subscriptions_status" ON "public"."subscriptions" USING "btree" ("status");



CREATE INDEX "idx_subscriptions_tier" ON "public"."subscriptions" USING "btree" ("tier_id");



CREATE INDEX "idx_subscriptions_type" ON "public"."subscriptions" USING "btree" ("type");



CREATE INDEX "idx_subscriptions_user" ON "public"."subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_subscriptions_user_id" ON "public"."subscriptions" USING "btree" ("user_id");



CREATE INDEX "idx_subscriptions_user_type" ON "public"."subscriptions" USING "btree" ("user_id", "type");



CREATE INDEX "idx_system_configurations_key" ON "public"."system_configurations" USING "btree" ("key");



CREATE INDEX "idx_user_content_interactions_user_content" ON "public"."user_content_interactions" USING "btree" ("user_id", "content_id");



CREATE INDEX "idx_user_interactions_composite" ON "public"."user_interactions" USING "btree" ("user_id", "interaction_type", "timestamp" DESC);



CREATE INDEX "idx_user_interactions_interaction_type" ON "public"."user_interactions" USING "btree" ("interaction_type");



CREATE INDEX "idx_user_interactions_session_id" ON "public"."user_interactions" USING "btree" ("session_id");



CREATE INDEX "idx_user_interactions_timestamp" ON "public"."user_interactions" USING "btree" ("timestamp" DESC);



CREATE INDEX "idx_user_interactions_user_id" ON "public"."user_interactions" USING "btree" ("user_id");



CREATE INDEX "idx_user_interactions_user_timestamp" ON "public"."user_interactions" USING "btree" ("user_id", "timestamp");



CREATE INDEX "idx_user_notifications_created_at" ON "public"."user_notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_user_notifications_is_read" ON "public"."user_notifications" USING "btree" ("is_read");



CREATE INDEX "idx_user_notifications_user_id" ON "public"."user_notifications" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_username" ON "public"."user_profiles" USING "btree" ("username");



CREATE INDEX "idx_user_role_assignments_role_id" ON "public"."user_role_assignments" USING "btree" ("role_id");



CREATE INDEX "idx_user_role_assignments_user_id" ON "public"."user_role_assignments" USING "btree" ("user_id");



CREATE INDEX "idx_wallet_transactions_created_at" ON "public"."wallet_transactions" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_wallet_transactions_user_id" ON "public"."wallet_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_wallet_transactions_wallet_id" ON "public"."wallet_transactions" USING "btree" ("wallet_id");



CREATE INDEX "idx_wallets_is_active" ON "public"."wallets" USING "btree" ("is_active");



CREATE INDEX "idx_wallets_user_id" ON "public"."wallets" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "set_community_posts_published_at" BEFORE UPDATE ON "public"."community_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_published_at"();



CREATE OR REPLACE TRIGGER "track_subscription_changes_trigger" AFTER UPDATE ON "public"."subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."track_subscription_changes"();



CREATE OR REPLACE TRIGGER "trigger_update_behavioral_patterns_updated_at" BEFORE UPDATE ON "public"."behavioral_patterns" FOR EACH ROW EXECUTE FUNCTION "public"."update_behavioral_patterns_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_payment_requests_updated_at" BEFORE UPDATE ON "public"."payment_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_payment_requests_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_purchasable_items_updated_at" BEFORE UPDATE ON "public"."purchasable_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_purchasable_items_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_purchases_updated_at" BEFORE UPDATE ON "public"."purchases" FOR EACH ROW EXECUTE FUNCTION "public"."update_purchases_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_wallet_transactions_updated_at" BEFORE UPDATE ON "public"."wallet_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_wallet_transactions_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_wallets_updated_at" BEFORE UPDATE ON "public"."wallets" FOR EACH ROW EXECUTE FUNCTION "public"."update_wallets_updated_at"();



CREATE OR REPLACE TRIGGER "update_admin_notifications_updated_at" BEFORE UPDATE ON "public"."admin_notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_appointments_updated_at" BEFORE UPDATE ON "public"."appointments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_community_posts_updated_at" BEFORE UPDATE ON "public"."community_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_goals_updated_at" BEFORE UPDATE ON "public"."goals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notification_templates_updated_at" BEFORE UPDATE ON "public"."notification_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_recommendations_updated_at" BEFORE UPDATE ON "public"."recommendations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subscription_tiers_updated_at" BEFORE UPDATE ON "public"."subscription_tiers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subscriptions_updated_at" BEFORE UPDATE ON "public"."subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_system_configurations_updated_at" BEFORE UPDATE ON "public"."system_configurations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_notifications_updated_at" BEFORE UPDATE ON "public"."user_notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_preferences_updated_at" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_auth_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_auth_updated_at_column"();



ALTER TABLE ONLY "public"."admin_notifications"
    ADD CONSTRAINT "admin_notifications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."behavioral_patterns"
    ADD CONSTRAINT "behavioral_patterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."funnel_tracking"
    ADD CONSTRAINT "funnel_tracking_funnel_id_fkey" FOREIGN KEY ("funnel_id") REFERENCES "public"."conversion_funnels"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_edited_by_fkey" FOREIGN KEY ("edited_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."message_threads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_confirmed_by_fkey" FOREIGN KEY ("confirmed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."payment_requests"
    ADD CONSTRAINT "payment_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."predictive_insights"
    ADD CONSTRAINT "predictive_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promotional_content_variants"
    ADD CONSTRAINT "promotional_content_variants_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."promotional_pages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promotional_interactions"
    ADD CONSTRAINT "promotional_interactions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "public"."promotional_pages"("id");



ALTER TABLE ONLY "public"."promotional_interactions"
    ADD CONSTRAINT "promotional_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."promotional_interactions"
    ADD CONSTRAINT "promotional_interactions_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."promotional_content_variants"("id");



ALTER TABLE ONLY "public"."promotional_pages"
    ADD CONSTRAINT "promotional_pages_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "public"."user_personas"("id");



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."purchasable_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."purchases"
    ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recommendations"
    ADD CONSTRAINT "recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."resource_libraries"
    ADD CONSTRAINT "resource_libraries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_notes"
    ADD CONSTRAINT "session_notes_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_templates"
    ADD CONSTRAINT "session_templates_therapy_type_id_fkey" FOREIGN KEY ("therapy_type_id") REFERENCES "public"."therapy_types"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscription_history"
    ADD CONSTRAINT "subscription_history_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."subscription_history"
    ADD CONSTRAINT "subscription_history_new_tier_id_fkey" FOREIGN KEY ("new_tier_id") REFERENCES "public"."subscription_tiers"("id");



ALTER TABLE ONLY "public"."subscription_history"
    ADD CONSTRAINT "subscription_history_previous_tier_id_fkey" FOREIGN KEY ("previous_tier_id") REFERENCES "public"."subscription_tiers"("id");



ALTER TABLE ONLY "public"."subscription_history"
    ADD CONSTRAINT "subscription_history_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscription_usage"
    ADD CONSTRAINT "subscription_usage_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscription_usage"
    ADD CONSTRAINT "subscription_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "public"."subscription_tiers"("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."therapy_types"
    ADD CONSTRAINT "therapy_types_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."therapy_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_interactions"
    ADD CONSTRAINT "user_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_journeys"
    ADD CONSTRAINT "user_journeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_admin_notification_id_fkey" FOREIGN KEY ("admin_notification_id") REFERENCES "public"."admin_notifications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_personalization"
    ADD CONSTRAINT "user_personalization_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "public"."user_personas"("id");



ALTER TABLE ONLY "public"."user_personalization"
    ADD CONSTRAINT "user_personalization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_role_assignments"
    ADD CONSTRAINT "user_role_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_role_assignments"
    ADD CONSTRAINT "user_role_assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."user_roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_role_assignments"
    ADD CONSTRAINT "user_role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin can manage all subscription usage" ON "public"."subscription_usage" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin can manage all subscriptions" ON "public"."subscriptions" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin can manage subscription tiers" ON "public"."subscription_tiers" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can manage admin_notifications" ON "public"."admin_notifications" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can manage all payments" ON "public"."payments" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can manage notification_templates" ON "public"."notification_templates" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can manage role assignments" ON "public"."user_role_assignments" USING ((EXISTS ( SELECT 1
   FROM ("public"."user_role_assignments" "ura"
     JOIN "public"."user_roles" ON (("user_roles"."id" = "ura"."role_id")))
  WHERE (("ura"."user_id" = "auth"."uid"()) AND ("user_roles"."name" = 'admin'::"text")))));



CREATE POLICY "Admins can manage system_configurations" ON "public"."system_configurations" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can view all audit logs" ON "public"."audit_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."user_role_assignments"
     JOIN "public"."user_roles" ON (("user_roles"."id" = "user_role_assignments"."role_id")))
  WHERE (("user_role_assignments"."user_id" = "auth"."uid"()) AND ("user_roles"."name" = 'admin'::"text")))));



CREATE POLICY "All can read active system_configurations" ON "public"."system_configurations" FOR SELECT USING (("is_active" = true));



CREATE POLICY "All can read notification_templates" ON "public"."notification_templates" FOR SELECT USING (true);



CREATE POLICY "Anyone can view active subscription tiers" ON "public"."subscription_tiers" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view purchasable items" ON "public"."purchasable_items" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Authenticated users can view all payment requests" ON "public"."payment_requests" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Only admins can manage permissions" ON "public"."permissions" USING ((EXISTS ( SELECT 1
   FROM ("public"."user_role_assignments"
     JOIN "public"."user_roles" ON (("user_roles"."id" = "user_role_assignments"."role_id")))
  WHERE (("user_role_assignments"."user_id" = "auth"."uid"()) AND ("user_roles"."name" = 'admin'::"text")))));



CREATE POLICY "Only admins can manage role permissions" ON "public"."role_permissions" USING ((EXISTS ( SELECT 1
   FROM ("public"."user_role_assignments"
     JOIN "public"."user_roles" ON (("user_roles"."id" = "user_role_assignments"."role_id")))
  WHERE (("user_role_assignments"."user_id" = "auth"."uid"()) AND ("user_roles"."name" = 'admin'::"text")))));



CREATE POLICY "Only admins can manage roles" ON "public"."user_roles" USING ((EXISTS ( SELECT 1
   FROM ("public"."user_role_assignments"
     JOIN "public"."user_roles" "user_roles_1" ON (("user_roles_1"."id" = "user_role_assignments"."role_id")))
  WHERE (("user_role_assignments"."user_id" = "auth"."uid"()) AND ("user_roles_1"."name" = 'admin'::"text")))));



CREATE POLICY "Services are viewable by everyone" ON "public"."services" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Services can be managed by authenticated users" ON "public"."services" TO "authenticated" USING (true);



CREATE POLICY "System can insert interactions" ON "public"."user_interactions" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can manage insights" ON "public"."predictive_insights" USING (true);



CREATE POLICY "System can manage patterns" ON "public"."behavioral_patterns" USING (true);



CREATE POLICY "Users can create own payment requests" ON "public"."payment_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create own purchases" ON "public"."purchases" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create own subscriptions" ON "public"."subscriptions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own appointments" ON "public"."appointments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own feedback" ON "public"."feedback" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own goals" ON "public"."goals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own posts" ON "public"."community_posts" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own appointments" ON "public"."appointments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own goals" ON "public"."goals" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own posts" ON "public"."community_posts" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own recommendations" ON "public"."recommendations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage own preferences" ON "public"."user_preferences" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their notifications" ON "public"."user_notifications" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own insights" ON "public"."predictive_insights" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own pending payment requests" ON "public"."payment_requests" FOR UPDATE USING ((("auth"."uid"() = "user_id") AND ("status" = ANY (ARRAY['pending'::"text", 'user_confirmed'::"text"]))));



CREATE POLICY "Users can update own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own subscription usage" ON "public"."subscription_usage" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own wallet" ON "public"."wallets" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own appointments" ON "public"."appointments" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own goals" ON "public"."goals" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own posts" ON "public"."community_posts" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own recommendations" ON "public"."recommendations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view active admin_notifications" ON "public"."admin_notifications" FOR SELECT USING ((("is_active" = true) AND (("expires_at" IS NULL) OR ("expires_at" > "now"()))));



CREATE POLICY "Users can view all profiles" ON "public"."user_profiles" FOR SELECT USING (true);



CREATE POLICY "Users can view own audit logs" ON "public"."audit_logs" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own insights" ON "public"."predictive_insights" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own interactions" ON "public"."user_interactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own patterns" ON "public"."behavioral_patterns" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own payment requests" ON "public"."payment_requests" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own purchases" ON "public"."purchases" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own role assignments" ON "public"."user_role_assignments" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view own subscription usage" ON "public"."subscription_usage" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own subscriptions" ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own wallet" ON "public"."wallets" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own wallet transactions" ON "public"."wallet_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view published posts" ON "public"."community_posts" FOR SELECT USING ((("is_published" = true) OR ("user_id" = "auth"."uid"())));



CREATE POLICY "Users can view their own appointments" ON "public"."appointments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own feedback" ON "public"."feedback" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own goals" ON "public"."goals" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own recommendations" ON "public"."recommendations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their payments" ON "public"."payments" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."appointments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."behavioral_patterns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."predictive_insights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchasable_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."purchases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_tiers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."system_configurations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_interactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_role_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wallet_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wallets" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_user_engagement_score"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_user_engagement_score"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_user_engagement_score"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_insights"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_insights"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_insights"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_payment_requests"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_payment_requests"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_payment_requests"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_old_analytics_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_old_analytics_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_old_analytics_data"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_account"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_account"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_account"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_wallet"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_wallet"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_wallet"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_published_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_published_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_published_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_subscription_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."track_subscription_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_subscription_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_auth_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_auth_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_auth_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_behavioral_patterns_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_behavioral_patterns_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_behavioral_patterns_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_payment_requests_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_payment_requests_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_payment_requests_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_purchasable_items_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_purchasable_items_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_purchasable_items_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_purchases_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_purchases_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_purchases_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_wallet_transactions_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_wallet_transactions_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_wallet_transactions_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_wallets_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_wallets_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_wallets_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_notifications" TO "anon";
GRANT ALL ON TABLE "public"."admin_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."appointments" TO "anon";
GRANT ALL ON TABLE "public"."appointments" TO "authenticated";
GRANT ALL ON TABLE "public"."appointments" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."behavioral_patterns" TO "anon";
GRANT ALL ON TABLE "public"."behavioral_patterns" TO "authenticated";
GRANT ALL ON TABLE "public"."behavioral_patterns" TO "service_role";



GRANT ALL ON TABLE "public"."behavioral_triggers" TO "anon";
GRANT ALL ON TABLE "public"."behavioral_triggers" TO "authenticated";
GRANT ALL ON TABLE "public"."behavioral_triggers" TO "service_role";



GRANT ALL ON TABLE "public"."billing_info" TO "anon";
GRANT ALL ON TABLE "public"."billing_info" TO "authenticated";
GRANT ALL ON TABLE "public"."billing_info" TO "service_role";



GRANT ALL ON TABLE "public"."communication_preferences" TO "anon";
GRANT ALL ON TABLE "public"."communication_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."communication_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."community_posts" TO "anon";
GRANT ALL ON TABLE "public"."community_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."community_posts" TO "service_role";



GRANT ALL ON TABLE "public"."conversion_funnels" TO "anon";
GRANT ALL ON TABLE "public"."conversion_funnels" TO "authenticated";
GRANT ALL ON TABLE "public"."conversion_funnels" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."funnel_tracking" TO "anon";
GRANT ALL ON TABLE "public"."funnel_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."funnel_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON TABLE "public"."message_threads" TO "anon";
GRANT ALL ON TABLE "public"."message_threads" TO "authenticated";
GRANT ALL ON TABLE "public"."message_threads" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."notification_templates" TO "anon";
GRANT ALL ON TABLE "public"."notification_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_templates" TO "service_role";



GRANT ALL ON TABLE "public"."payment_requests" TO "anon";
GRANT ALL ON TABLE "public"."payment_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_requests" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."predictive_insights" TO "anon";
GRANT ALL ON TABLE "public"."predictive_insights" TO "authenticated";
GRANT ALL ON TABLE "public"."predictive_insights" TO "service_role";



GRANT ALL ON TABLE "public"."promotional_content_variants" TO "anon";
GRANT ALL ON TABLE "public"."promotional_content_variants" TO "authenticated";
GRANT ALL ON TABLE "public"."promotional_content_variants" TO "service_role";



GRANT ALL ON TABLE "public"."promotional_interactions" TO "anon";
GRANT ALL ON TABLE "public"."promotional_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."promotional_interactions" TO "service_role";



GRANT ALL ON TABLE "public"."promotional_pages" TO "anon";
GRANT ALL ON TABLE "public"."promotional_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."promotional_pages" TO "service_role";



GRANT ALL ON TABLE "public"."purchasable_items" TO "anon";
GRANT ALL ON TABLE "public"."purchasable_items" TO "authenticated";
GRANT ALL ON TABLE "public"."purchasable_items" TO "service_role";



GRANT ALL ON TABLE "public"."purchases" TO "anon";
GRANT ALL ON TABLE "public"."purchases" TO "authenticated";
GRANT ALL ON TABLE "public"."purchases" TO "service_role";



GRANT ALL ON TABLE "public"."recommendations" TO "anon";
GRANT ALL ON TABLE "public"."recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."resource_libraries" TO "anon";
GRANT ALL ON TABLE "public"."resource_libraries" TO "authenticated";
GRANT ALL ON TABLE "public"."resource_libraries" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."services" TO "anon";
GRANT ALL ON TABLE "public"."services" TO "authenticated";
GRANT ALL ON TABLE "public"."services" TO "service_role";



GRANT ALL ON TABLE "public"."session_notes" TO "anon";
GRANT ALL ON TABLE "public"."session_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."session_notes" TO "service_role";



GRANT ALL ON TABLE "public"."session_templates" TO "anon";
GRANT ALL ON TABLE "public"."session_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."session_templates" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_history" TO "anon";
GRANT ALL ON TABLE "public"."subscription_history" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_history" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_tiers" TO "anon";
GRANT ALL ON TABLE "public"."subscription_tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_tiers" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_usage" TO "anon";
GRANT ALL ON TABLE "public"."subscription_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_usage" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."system_configurations" TO "anon";
GRANT ALL ON TABLE "public"."system_configurations" TO "authenticated";
GRANT ALL ON TABLE "public"."system_configurations" TO "service_role";



GRANT ALL ON TABLE "public"."therapy_categories" TO "anon";
GRANT ALL ON TABLE "public"."therapy_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."therapy_categories" TO "service_role";



GRANT ALL ON TABLE "public"."therapy_types" TO "anon";
GRANT ALL ON TABLE "public"."therapy_types" TO "authenticated";
GRANT ALL ON TABLE "public"."therapy_types" TO "service_role";



GRANT ALL ON TABLE "public"."user_content_interactions" TO "anon";
GRANT ALL ON TABLE "public"."user_content_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_content_interactions" TO "service_role";



GRANT ALL ON TABLE "public"."user_feature_assignments" TO "anon";
GRANT ALL ON TABLE "public"."user_feature_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."user_feature_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."user_interactions" TO "anon";
GRANT ALL ON TABLE "public"."user_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_interactions" TO "service_role";



GRANT ALL ON TABLE "public"."user_journey_steps" TO "anon";
GRANT ALL ON TABLE "public"."user_journey_steps" TO "authenticated";
GRANT ALL ON TABLE "public"."user_journey_steps" TO "service_role";



GRANT ALL ON TABLE "public"."user_journeys" TO "anon";
GRANT ALL ON TABLE "public"."user_journeys" TO "authenticated";
GRANT ALL ON TABLE "public"."user_journeys" TO "service_role";



GRANT ALL ON TABLE "public"."user_notifications" TO "anon";
GRANT ALL ON TABLE "public"."user_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."user_personalization" TO "anon";
GRANT ALL ON TABLE "public"."user_personalization" TO "authenticated";
GRANT ALL ON TABLE "public"."user_personalization" TO "service_role";



GRANT ALL ON TABLE "public"."user_personas" TO "anon";
GRANT ALL ON TABLE "public"."user_personas" TO "authenticated";
GRANT ALL ON TABLE "public"."user_personas" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_role_assignments" TO "anon";
GRANT ALL ON TABLE "public"."user_role_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."wallet_transactions" TO "anon";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."wallets" TO "anon";
GRANT ALL ON TABLE "public"."wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."wallets" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







