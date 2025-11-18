-- Complete Schema Migration: Add Missing Tables and Functions
-- This migration adds all tables and functions needed for existing code to work

-- ==============================================
-- MISSING CORE TABLES (CRITICAL FOR FUNCTIONS)
-- ==============================================

-- Donations table (referenced in supabase-data-service.ts:572)
CREATE TABLE IF NOT EXISTS "public"."donations" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT DEFAULT 'USD',
    "donor_name" TEXT,
    "donor_email" TEXT,
    "donor_message" TEXT,
    "is_anonymous" BOOLEAN DEFAULT false,
    "payment_status" TEXT DEFAULT 'pending',
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table (referenced in supabase-data-service.ts:371-381)
CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "report_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB DEFAULT '{}',
    "status" TEXT DEFAULT 'pending',
    "generated_by" UUID REFERENCES auth.users(id),
    "generated_at" TIMESTAMPTZ,
    "file_path" TEXT,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table (referenced in multiple files)
CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "therapist_name" TEXT,
    "appointment_id" UUID REFERENCES appointments(id) ON DELETE CASCADE,
    "session_type" TEXT NOT NULL,
    "status" TEXT DEFAULT 'scheduled',
    "scheduled_start_time" TIMESTAMPTZ NOT NULL,
    "scheduled_end_time" TIMESTAMPTZ NOT NULL,
    "actual_start_time" TIMESTAMPTZ,
    "actual_end_time" TIMESTAMPTZ,
    "duration_minutes" INTEGER,
    "session_notes" TEXT,
    "client_notes" TEXT,
    "recording_url" TEXT,
    "recording_status" TEXT DEFAULT 'not_recorded',
    "cancellation_reason" TEXT,
    "cancellation_time" TIMESTAMPTZ,
    "no_show" BOOLEAN DEFAULT false,
    "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
    "feedback" TEXT,
    "cost" DECIMAL(10,2),
    "payment_status" TEXT DEFAULT 'pending',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Mood logs table (referenced in ai-sdk-next-service.ts:559)
CREATE TABLE IF NOT EXISTS "public"."mood_logs" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "mood_rating" INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
    "mood_type" TEXT,
    "notes" TEXT,
    "triggers" TEXT[],
    "context" JSONB DEFAULT '{}',
    "is_significant" BOOLEAN DEFAULT false,
    "logged_at" TIMESTAMPTZ DEFAULT NOW(),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Products table (referenced in admin components and Stripe sync)
CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "stripe_product_id" TEXT UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'service',
    "category" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "billing_cycle" TEXT,
    "features" JSONB DEFAULT '[]',
    "images" TEXT[],
    "metadata" JSONB DEFAULT '{}',
    "is_active" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "availability" TEXT DEFAULT 'available',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table (referenced in fx-templates.ts)
CREATE TABLE IF NOT EXISTS "public"."templates" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "variables" JSONB DEFAULT '[]',
    "is_active" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "usage_count" INTEGER DEFAULT 0,
    "created_by" UUID REFERENCES auth.users(id),
    "tags" TEXT[],
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- User settings table (referenced in fx-service.ts)
CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    "theme" TEXT DEFAULT 'light',
    "language" TEXT DEFAULT 'en',
    "timezone" TEXT DEFAULT 'UTC',
    "currency" TEXT DEFAULT 'USD',
    "date_format" TEXT DEFAULT 'MM/DD/YYYY',
    "time_format" TEXT DEFAULT '12h',
    "notifications_enabled" BOOLEAN DEFAULT true,
    "email_notifications" BOOLEAN DEFAULT true,
    "push_notifications" BOOLEAN DEFAULT true,
    "sms_notifications" BOOLEAN DEFAULT false,
    "privacy_level" TEXT DEFAULT 'standard',
    "data_sharing" BOOLEAN DEFAULT false,
    "analytics_enabled" BOOLEAN DEFAULT true,
    "auto_backup" BOOLEAN DEFAULT true,
    "settings" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Therapist profiles table (referenced in admin reports and notifications)
CREATE TABLE IF NOT EXISTS "public"."therapist_profiles" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    "license_number" TEXT,
    "license_state" TEXT,
    "license_expiry" DATE,
    "specializations" TEXT[],
    "therapy_types" TEXT[],
    "experience_years" INTEGER,
    "education" JSONB DEFAULT '[]',
    "certifications" JSONB DEFAULT '[]',
    "languages" TEXT[],
    "hourly_rate" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'USD',
    "availability" JSONB DEFAULT '{}',
    "bio" TEXT,
    "profile_image" TEXT,
    "is_verified" BOOLEAN DEFAULT false,
    "verification_status" TEXT DEFAULT 'pending',
    "is_available" BOOLEAN DEFAULT true,
    "accepting_new_clients" BOOLEAN DEFAULT true,
    "average_rating" DECIMAL(3,2) DEFAULT 0.00,
    "total_reviews" INTEGER DEFAULT 0,
    "total_sessions" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- SYNC TABLES (FOR BIDIRECTIONAL SYNC SERVICE)
-- ==============================================

-- Sync metadata table
CREATE TABLE IF NOT EXISTS "public"."sync_metadata" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "table_name" TEXT NOT NULL,
    "record_id" UUID NOT NULL,
    "external_id" TEXT,
    "external_system" TEXT NOT NULL,
    "sync_status" TEXT DEFAULT 'pending',
    "last_sync_time" TIMESTAMPTZ,
    "sync_direction" TEXT NOT NULL,
    "conflict_resolution" TEXT DEFAULT 'last_write_wins',
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("table_name", "record_id", "external_system")
);

-- Sync queue table
CREATE TABLE IF NOT EXISTS "public"."sync_queue" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "table_name" TEXT NOT NULL,
    "record_id" UUID NOT NULL,
    "operation" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "external_system" TEXT NOT NULL,
    "priority" INTEGER DEFAULT 1,
    "retry_count" INTEGER DEFAULT 0,
    "max_retries" INTEGER DEFAULT 3,
    "status" TEXT DEFAULT 'pending',
    "error_message" TEXT,
    "scheduled_for" TIMESTAMPTZ DEFAULT NOW(),
    "processed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Sync statistics table
CREATE TABLE IF NOT EXISTS "public"."sync_statistics" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "external_system" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "sync_date" DATE NOT NULL,
    "total_records" INTEGER DEFAULT 0,
    "synced_records" INTEGER DEFAULT 0,
    "failed_records" INTEGER DEFAULT 0,
    "conflict_resolutions" INTEGER DEFAULT 0,
    "avg_sync_time_ms" INTEGER,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("external_system", "table_name", "sync_date")
);

-- Sync conflicts table
CREATE TABLE IF NOT EXISTS "public"."sync_conflicts" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "table_name" TEXT NOT NULL,
    "record_id" UUID NOT NULL,
    "external_id" TEXT,
    "external_system" TEXT NOT NULL,
    "local_data" JSONB NOT NULL,
    "external_data" JSONB NOT NULL,
    "conflict_type" TEXT NOT NULL,
    "resolution" TEXT,
    "resolved_by" UUID REFERENCES auth.users(id),
    "resolved_at" TIMESTAMPTZ,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- OPTIONAL TABLES (DOCUMENTED BUT NOT CRITICAL)
-- ==============================================

-- Bookings view (maps to appointments)
CREATE OR REPLACE VIEW "public"."bookings" AS
SELECT 
    a.id,
    a.user_id,
    a.practitioner as therapist_name,
    a.date as booking_date,
    a.time as booking_time,
    a.duration,
    a.status,
    a.session_type as type,
    a.notes,
    a.created_at,
    a.updated_at
FROM appointments a;

-- Progress entries table
CREATE TABLE IF NOT EXISTS "public"."progress_entries" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "goal_id" UUID REFERENCES goals(id) ON DELETE CASCADE,
    "entry_type" TEXT NOT NULL,
    "value" DECIMAL(10,2),
    "unit" TEXT,
    "notes" TEXT,
    "mood_rating" INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    "tags" TEXT[],
    "is_significant" BOOLEAN DEFAULT false,
    "logged_at" TIMESTAMPTZ DEFAULT NOW(),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS "public"."activities" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "activity_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER,
    "difficulty_level" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "is_completed" BOOLEAN DEFAULT false,
    "completed_at" TIMESTAMPTZ,
    "scheduled_for" TIMESTAMPTZ,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Post comments table
CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "post_id" UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "parent_comment_id" UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "is_edited" BOOLEAN DEFAULT false,
    "edited_at" TIMESTAMPTZ,
    "is_deleted" BOOLEAN DEFAULT false,
    "likes_count" INTEGER DEFAULT 0,
    "replies_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Post reactions table
CREATE TABLE IF NOT EXISTS "public"."post_reactions" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "post_id" UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "reaction_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("post_id", "user_id", "reaction_type")
);

-- Loyalty system tables
CREATE TABLE IF NOT EXISTS "public"."loyalty_points" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "points_balance" INTEGER DEFAULT 0,
    "total_earned" INTEGER DEFAULT 0,
    "total_redeemed" INTEGER DEFAULT 0,
    "tier_level" TEXT DEFAULT 'bronze',
    "last_activity" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("user_id")
);

CREATE TABLE IF NOT EXISTS "public"."loyalty_transactions" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "transaction_type" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "related_entity_type" TEXT,
    "related_entity_id" UUID,
    "balance_after" INTEGER NOT NULL,
    "expired_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Referral system tables
CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "referrer_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "referred_email" TEXT NOT NULL,
    "referred_user_id" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    "referral_code" TEXT UNIQUE,
    "status" TEXT DEFAULT 'pending',
    "reward_points" INTEGER DEFAULT 0,
    "converted_at" TIMESTAMPTZ,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."rewards" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "cost_points" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "valid_from" TIMESTAMPTZ,
    "valid_until" TIMESTAMPTZ,
    "max_quantity" INTEGER,
    "claimed_quantity" INTEGER DEFAULT 0,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."reward_redemptions" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "reward_id" UUID REFERENCES rewards(id) ON DELETE CASCADE,
    "points_used" INTEGER NOT NULL,
    "redemption_code" TEXT,
    "status" TEXT DEFAULT 'pending',
    "redeemed_at" TIMESTAMPTZ DEFAULT NOW(),
    "expires_at" TIMESTAMPTZ,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics and tracking tables
CREATE TABLE IF NOT EXISTS "public"."promotional_page_views" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "page_id" UUID REFERENCES promotional_pages(id) ON DELETE CASCADE,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    "session_id" TEXT,
    "view_duration" INTEGER,
    "scroll_depth" DECIMAL(5,2),
    "clicked_elements" JSONB DEFAULT '[]',
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip_address" INET,
    "viewed_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."community_categories" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT DEFAULT '#6366f1',
    "icon" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "sort_order" INTEGER DEFAULT 0,
    "post_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "public"."onboarding_progress" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    "current_step" TEXT DEFAULT 'welcome',
    "completed_steps" TEXT[] DEFAULT '{}',
    "step_data" JSONB DEFAULT '{}',
    "overall_progress" INTEGER DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
    "is_completed" BOOLEAN DEFAULT false,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- RPC FUNCTIONS
-- ==============================================

-- Transaction management functions
CREATE OR REPLACE FUNCTION "public"."begin_transaction"()
RETURNS TEXT
LANGUAGE "plpgsql"
AS $$
DECLARE
    tx_id TEXT;
BEGIN
    tx_id := gen_random_uuid()::TEXT;
    PERFORM pg_advisory_xact_lock(hashtext(tx_id));
    RETURN tx_id;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."commit_transaction"("tx_id" TEXT)
RETURNS BOOLEAN
LANGUAGE "plpgsql"
AS $$
BEGIN
    PERFORM pg_advisory_unlock(hashtext($1));
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."rollback_transaction"("tx_id" TEXT)
RETURNS BOOLEAN
LANGUAGE "plpgsql"
AS $$
BEGIN
    PERFORM pg_advisory_unlock(hashtext($1));
    RETURN true;
END;
$$;

-- Sync statistics function
CREATE OR REPLACE FUNCTION "public"."record_sync_stat"(
    "p_external_system" TEXT,
    "p_table_name" TEXT,
    "p_records_synced" INTEGER,
    "p_sync_time_ms" INTEGER,
    "p_success" BOOLEAN
)
RETURNS VOID
LANGUAGE "plpgsql"
AS $$
BEGIN
    INSERT INTO sync_statistics (
        external_system,
        table_name,
        sync_date,
        total_records,
        synced_records,
        avg_sync_time_ms
    ) VALUES (
        $1,
        $2,
        CURRENT_DATE,
        $3,
        CASE WHEN $5 THEN $3 ELSE 0 END,
        $4
    )
    ON CONFLICT (external_system, table_name, sync_date)
    DO UPDATE SET
        total_records = sync_statistics.total_records + $3,
        synced_records = sync_statistics.synced_records + CASE WHEN $5 THEN $3 ELSE 0 END,
        failed_records = sync_statistics.failed_records + CASE WHEN $5 THEN 0 ELSE $3 END,
        avg_sync_time_ms = (sync_statistics.avg_sync_time_ms + $4) / 2,
        updated_at = NOW();
END;
$$;

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS "idx_donations_user_id" ON "donations" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_donations_status" ON "donations" ("payment_status");
CREATE INDEX IF NOT EXISTS "idx_donations_created_at" ON "donations" ("created_at");

CREATE INDEX IF NOT EXISTS "idx_reports_user_id" ON "reports" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_reports_type" ON "reports" ("report_type");
CREATE INDEX IF NOT EXISTS "idx_reports_status" ON "reports" ("status");
CREATE INDEX IF NOT EXISTS "idx_reports_created_at" ON "reports" ("created_at");

CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_appointment_id" ON "sessions" ("appointment_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_status" ON "sessions" ("status");
CREATE INDEX IF NOT EXISTS "idx_sessions_scheduled_time" ON "sessions" ("scheduled_start_time");

CREATE INDEX IF NOT EXISTS "idx_mood_logs_user_id" ON "mood_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_mood_logs_rating" ON "mood_logs" ("mood_rating");
CREATE INDEX IF NOT EXISTS "idx_mood_logs_logged_at" ON "mood_logs" ("logged_at");

CREATE INDEX IF NOT EXISTS "idx_products_stripe_id" ON "products" ("stripe_product_id");
CREATE INDEX IF NOT EXISTS "idx_products_type" ON "products" ("type");
CREATE INDEX IF NOT EXISTS "idx_products_active" ON "products" ("is_active");

CREATE INDEX IF NOT EXISTS "idx_templates_type" ON "templates" ("type");
CREATE INDEX IF NOT EXISTS "idx_templates_category" ON "templates" ("category");
CREATE INDEX IF NOT EXISTS "idx_templates_active" ON "templates" ("is_active");

CREATE INDEX IF NOT EXISTS "idx_user_settings_user_id" ON "user_settings" ("user_id");

CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_user_id" ON "therapist_profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_verified" ON "therapist_profiles" ("is_verified");
CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_available" ON "therapist_profiles" ("is_available");

-- Sync table indexes
CREATE INDEX IF NOT EXISTS "idx_sync_metadata_table_record" ON "sync_metadata" ("table_name", "record_id");
CREATE INDEX IF NOT EXISTS "idx_sync_metadata_external" ON "sync_metadata" ("external_system", "external_id");
CREATE INDEX IF NOT EXISTS "idx_sync_metadata_status" ON "sync_metadata" ("sync_status");

CREATE INDEX IF NOT EXISTS "idx_sync_queue_status" ON "sync_queue" ("status", "scheduled_for");
CREATE INDEX IF NOT EXISTS "idx_sync_queue_system" ON "sync_queue" ("external_system", "table_name");
CREATE INDEX IF NOT EXISTS "idx_sync_queue_priority" ON "sync_queue" ("priority", "created_at");

CREATE INDEX IF NOT EXISTS "idx_sync_stats_system_date" ON "sync_statistics" ("external_system", "sync_date");
CREATE INDEX IF NOT EXISTS "idx_sync_conflicts_record" ON "sync_conflicts" ("table_name", "record_id");

-- Optional table indexes
CREATE INDEX IF NOT EXISTS "idx_progress_entries_user_goal" ON "progress_entries" ("user_id", "goal_id");
CREATE INDEX IF NOT EXISTS "idx_progress_entries_type" ON "progress_entries" ("entry_type");
CREATE INDEX IF NOT EXISTS "idx_progress_entries_logged" ON "progress_entries" ("logged_at");

CREATE INDEX IF NOT EXISTS "idx_activities_user_type" ON "activities" ("user_id", "activity_type");
CREATE INDEX IF NOT EXISTS "idx_activities_completed" ON "activities" ("is_completed");
CREATE INDEX IF NOT EXISTS "idx_activities_scheduled" ON "activities" ("scheduled_for");

CREATE INDEX IF NOT EXISTS "idx_post_comments_post" ON "post_comments" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_post_comments_parent" ON "post_comments" ("parent_comment_id");
CREATE INDEX IF NOT EXISTS "idx_post_comments_user" ON "post_comments" ("user_id");

CREATE INDEX IF NOT EXISTS "idx_post_reactions_post_user" ON "post_reactions" ("post_id", "user_id");
CREATE INDEX IF NOT EXISTS "idx_post_reactions_type" ON "post_reactions" ("reaction_type");

CREATE INDEX IF NOT EXISTS "idx_loyalty_points_user" ON "loyalty_points" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_loyalty_points_tier" ON "loyalty_points" ("tier_level");

CREATE INDEX IF NOT EXISTS "idx_loyalty_transactions_user" ON "loyalty_transactions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_loyalty_transactions_type" ON "loyalty_transactions" ("transaction_type");
CREATE INDEX IF NOT EXISTS "idx_loyalty_transactions_created" ON "loyalty_transactions" ("created_at");

CREATE INDEX IF NOT EXISTS "idx_referrals_referrer" ON "referrals" ("referrer_id");
CREATE INDEX IF NOT EXISTS "idx_referrals_email" ON "referrals" ("referred_email");
CREATE INDEX IF NOT EXISTS "idx_referrals_status" ON "referrals" ("status");
CREATE INDEX IF NOT EXISTS "idx_referrals_code" ON "referrals" ("referral_code");

CREATE INDEX IF NOT EXISTS "idx_rewards_active" ON "rewards" ("is_active", "valid_from", "valid_until");
CREATE INDEX IF NOT EXISTS "idx_rewards_type" ON "rewards" ("type");

CREATE INDEX IF NOT EXISTS "idx_reward_redemptions_user" ON "reward_redemptions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_reward_redemptions_reward" ON "reward_redemptions" ("reward_id");
CREATE INDEX IF NOT EXISTS "idx_reward_redemptions_status" ON "reward_redemptions" ("status");

-- Full text search indexes
CREATE INDEX IF NOT EXISTS "idx_messages_fts" ON "messages" USING gin(to_tsvector('english', "content"));
CREATE INDEX IF NOT EXISTS "idx_community_posts_fts" ON "community_posts" USING gin(to_tsvector('english', "title" || ' ' || "content"));
CREATE INDEX IF NOT EXISTS "idx_post_comments_fts" ON "post_comments" USING gin(to_tsvector('english', "content"));

-- JSONB indexes for metadata fields
CREATE INDEX IF NOT EXISTS "idx_donations_metadata" ON "donations" USING gin("metadata");
CREATE INDEX IF NOT EXISTS "idx_reports_data" ON "reports" USING gin("data");
CREATE INDEX IF NOT EXISTS "idx_mood_logs_context" ON "mood_logs" USING gin("context");
CREATE INDEX IF NOT EXISTS "idx_products_features" ON "products" USING gin("features");
CREATE INDEX IF NOT EXISTS "idx_products_metadata" ON "products" USING gin("metadata");
CREATE INDEX IF NOT EXISTS "idx_templates_content" ON "templates" USING gin("content");
CREATE INDEX IF NOT EXISTS "idx_user_settings_settings" ON "user_settings" USING gin("settings");
CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_education" ON "therapist_profiles" USING gin("education");
CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_certifications" ON "therapist_profiles" USING gin("certifications");
CREATE INDEX IF NOT EXISTS "idx_therapist_profiles_availability" ON "therapist_profiles" USING gin("availability");

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all new tables
ALTER TABLE "donations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mood_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "therapist_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sync_metadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sync_queue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sync_statistics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sync_conflicts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "progress_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "post_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "post_reactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loyalty_points" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loyalty_transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "referrals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rewards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reward_redemptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "promotional_page_views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "community_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_progress" ENABLE ROW LEVEL SECURITY;

-- Donations policies
CREATE POLICY "Users can view own donations" ON "donations" FOR SELECT USING ("user_id" = auth.uid() OR auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Users can create own donations" ON "donations" FOR INSERT WITH CHECK ("user_id" = auth.uid());
CREATE POLICY "Admins can manage all donations" ON "donations" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Reports policies
CREATE POLICY "Users can view own reports" ON "reports" FOR SELECT USING ("user_id" = auth.uid() OR "generated_by" = auth.uid());
CREATE POLICY "Admins can manage all reports" ON "reports" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Sessions policies
CREATE POLICY "Users can view own sessions" ON "sessions" FOR SELECT USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage all sessions" ON "sessions" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Mood logs policies
CREATE POLICY "Users can manage own mood logs" ON "mood_logs" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Admins can view all mood logs" ON "mood_logs" FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Products policies
CREATE POLICY "Anyone can view active products" ON "products" FOR SELECT USING ("is_active" = true);
CREATE POLICY "Admins can manage products" ON "products" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Templates policies
CREATE POLICY "Anyone can view active templates" ON "templates" FOR SELECT USING ("is_active" = true);
CREATE POLICY "Admins can manage templates" ON "templates" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User settings policies
CREATE POLICY "Users can manage own settings" ON "user_settings" FOR ALL USING ("user_id" = auth.uid());

-- Therapist profiles policies
CREATE POLICY "Anyone can view verified therapist profiles" ON "therapist_profiles" FOR SELECT USING ("is_verified" = true);
CREATE POLICY "Therapists can manage own profile" ON "therapist_profiles" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage all therapist profiles" ON "therapist_profiles" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Sync tables policies (admin only)
CREATE POLICY "Admins can manage sync metadata" ON "sync_metadata" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage sync queue" ON "sync_queue" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view sync statistics" ON "sync_statistics" FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage sync conflicts" ON "sync_conflicts" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Optional tables policies
CREATE POLICY "Users can manage own progress entries" ON "progress_entries" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Admins can view all progress entries" ON "progress_entries" FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own activities" ON "activities" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Admins can view all activities" ON "activities" FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create post comments" ON "post_comments" FOR INSERT WITH CHECK ("user_id" = auth.uid());
CREATE POLICY "Anyone can view post comments" ON "post_comments" FOR SELECT USING ("is_deleted" = false);
CREATE POLICY "Users can edit own comments" ON "post_comments" FOR UPDATE USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage all comments" ON "post_comments" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own reactions" ON "post_reactions" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Anyone can view post reactions" ON "post_reactions" FOR SELECT USING (true);

CREATE POLICY "Users can view own loyalty points" ON "loyalty_points" FOR SELECT USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage loyalty points" ON "loyalty_points" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own loyalty transactions" ON "loyalty_transactions" FOR SELECT USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage loyalty transactions" ON "loyalty_transactions" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own referrals" ON "referrals" FOR ALL USING ("referrer_id" = auth.uid());
CREATE POLICY "Admins can manage all referrals" ON "referrals" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view active rewards" ON "rewards" FOR SELECT USING ("is_active" = true AND ("valid_until" IS NULL OR "valid_until" > NOW()));
CREATE POLICY "Admins can manage rewards" ON "rewards" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own reward redemptions" ON "reward_redemptions" FOR ALL USING ("user_id" = auth.uid());
CREATE POLICY "Admins can manage all reward redemptions" ON "reward_redemptions" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view promotional page views" ON "promotional_page_views" FOR SELECT USING (true);
CREATE POLICY "Admins can manage promotional page views" ON "promotional_page_views" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view community categories" ON "community_categories" FOR SELECT USING ("is_active" = true);
CREATE POLICY "Admins can manage community categories" ON "community_categories" FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage own onboarding progress" ON "onboarding_progress" FOR ALL USING ("user_id" = auth.uid());

-- ==============================================
-- TRIGGERS FOR UPDATED_AT FIELDS
-- ==============================================

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER "update_donations_updated_at" BEFORE UPDATE ON "donations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_reports_updated_at" BEFORE UPDATE ON "reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_sessions_updated_at" BEFORE UPDATE ON "sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_mood_logs_updated_at" BEFORE UPDATE ON "mood_logs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_templates_updated_at" BEFORE UPDATE ON "templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_user_settings_updated_at" BEFORE UPDATE ON "user_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_therapist_profiles_updated_at" BEFORE UPDATE ON "therapist_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_sync_metadata_updated_at" BEFORE UPDATE ON "sync_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_sync_queue_updated_at" BEFORE UPDATE ON "sync_queue" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_sync_statistics_updated_at" BEFORE UPDATE ON "sync_statistics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_sync_conflicts_updated_at" BEFORE UPDATE ON "sync_conflicts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_progress_entries_updated_at" BEFORE UPDATE ON "progress_entries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_activities_updated_at" BEFORE UPDATE ON "activities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_post_comments_updated_at" BEFORE UPDATE ON "post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_loyalty_points_updated_at" BEFORE UPDATE ON "loyalty_points" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_loyalty_transactions_updated_at" BEFORE UPDATE ON "loyalty_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_referrals_updated_at" BEFORE UPDATE ON "referrals" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_rewards_updated_at" BEFORE UPDATE ON "rewards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_reward_redemptions_updated_at" BEFORE UPDATE ON "reward_redemptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_community_categories_updated_at" BEFORE UPDATE ON "community_categories" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();
CREATE TRIGGER "update_onboarding_progress_updated_at" BEFORE UPDATE ON "onboarding_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

-- ==============================================
-- GRANT PERMISSIONS
-- ==============================================

-- Grant permissions on all new tables
GRANT SELECT ON "donations" TO "anon", "authenticated";
GRANT INSERT ON "donations" TO "authenticated";
GRANT UPDATE, DELETE ON "donations" TO "authenticated";

GRANT SELECT ON "reports" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "reports" TO "authenticated";

GRANT SELECT ON "sessions" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "sessions" TO "authenticated";

GRANT SELECT ON "mood_logs" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "mood_logs" TO "authenticated";

GRANT SELECT ON "products" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "products" TO "authenticated";

GRANT SELECT ON "templates" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "templates" TO "authenticated";

GRANT SELECT ON "user_settings" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "user_settings" TO "authenticated";

GRANT SELECT ON "therapist_profiles" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "therapist_profiles" TO "authenticated";

GRANT SELECT ON "sync_metadata" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "sync_metadata" TO "authenticated";

GRANT SELECT ON "sync_queue" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "sync_queue" TO "authenticated";

GRANT SELECT ON "sync_statistics" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "sync_statistics" TO "authenticated";

GRANT SELECT ON "sync_conflicts" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "sync_conflicts" TO "authenticated";

GRANT SELECT ON "progress_entries" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "progress_entries" TO "authenticated";

GRANT SELECT ON "activities" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "activities" TO "authenticated";

GRANT SELECT ON "post_comments" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "post_comments" TO "authenticated";

GRANT SELECT ON "post_reactions" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "post_reactions" TO "authenticated";

GRANT SELECT ON "loyalty_points" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "loyalty_points" TO "authenticated";

GRANT SELECT ON "loyalty_transactions" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "loyalty_transactions" TO "authenticated";

GRANT SELECT ON "referrals" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "referrals" TO "authenticated";

GRANT SELECT ON "rewards" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "rewards" TO "authenticated";

GRANT SELECT ON "reward_redemptions" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "reward_redemptions" TO "authenticated";

GRANT SELECT ON "promotional_page_views" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "promotional_page_views" TO "authenticated";

GRANT SELECT ON "community_categories" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "community_categories" TO "authenticated";

GRANT SELECT ON "onboarding_progress" TO "anon", "authenticated";
GRANT INSERT, UPDATE, DELETE ON "onboarding_progress" TO "authenticated";

-- Grant permissions on functions
GRANT EXECUTE ON FUNCTION "public"."begin_transaction"() TO "anon", "authenticated";
GRANT EXECUTE ON FUNCTION "public"."commit_transaction"(TEXT) TO "anon", "authenticated";
GRANT EXECUTE ON FUNCTION "public"."rollback_transaction"(TEXT) TO "anon", "authenticated";
GRANT EXECUTE ON FUNCTION "public"."record_sync_stat"(TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) TO "anon", "authenticated";

-- Grant permissions on views
GRANT SELECT ON "bookings" TO "anon", "authenticated";

-- Grant all permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA "public" TO "service_role";
GRANT ALL ON ALL SEQUENCES IN SCHEMA "public" TO "service_role";
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA "public" TO "service_role";

-- ==============================================
-- COOL OPTIONAL FEATURES
-- ==============================================

-- User dashboard summary view
CREATE OR REPLACE VIEW "public"."user_dashboard_summary" AS
SELECT 
    u.id as user_id,
    u.email,
    up.first_name,
    up.last_name,
    -- Session stats
    COALESCE(s.total_sessions, 0) as total_sessions,
    COALESCE(s.completed_sessions, 0) as completed_sessions,
    COALESCE(s.avg_rating, 0) as avg_session_rating,
    -- Mood stats
    COALESCE(m.avg_mood, 5) as avg_mood_rating,
    COALESCE(m.mood_entries, 0) as mood_entries_count,
    -- Goals
    COALESCE(g.total_goals, 0) as total_goals,
    COALESCE(g.completed_goals, 0) as completed_goals,
    -- Community
    COALESCE(cp.posts_count, 0) as community_posts,
    COALESCE(cm.comments_count, 0) as community_comments,
    -- Loyalty
    COALESCE(lp.points_balance, 0) as loyalty_points,
    lp.tier_level as loyalty_tier,
    -- Subscriptions
    sub.status as subscription_status,
    sub.tier as subscription_tier,
    -- Wallet
    COALESCE(w.balance, 0) as wallet_balance,
    -- Recent activity
    COALESCE(ui.last_activity, u.created_at) as last_activity,
    -- Account status
    CASE 
        WHEN sub.status = 'active' THEN 'premium'
        WHEN sub.status = 'trial' THEN 'trial'
        ELSE 'free'
    END as account_tier
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN (
    SELECT user_id, 
           COUNT(*) as total_sessions,
           COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
           AVG(rating) FILTER (WHERE rating IS NOT NULL) as avg_rating
    FROM sessions 
    GROUP BY user_id
) s ON u.id = s.user_id
LEFT JOIN (
    SELECT user_id, 
           AVG(mood_rating) as avg_mood,
           COUNT(*) as mood_entries
    FROM mood_logs 
    GROUP BY user_id
) m ON u.id = m.user_id
LEFT JOIN (
    SELECT user_id, 
           COUNT(*) as total_goals,
           COUNT(*) FILTER (WHERE status = 'completed') as completed_goals
    FROM goals 
    GROUP BY user_id
) g ON u.id = g.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as posts_count
    FROM community_posts 
    GROUP BY user_id
) cp ON u.id = cp.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as comments_count
    FROM post_comments 
    WHERE is_deleted = false
    GROUP BY user_id
) cm ON u.id = cm.user_id
LEFT JOIN loyalty_points lp ON u.id = lp.user_id
LEFT JOIN (
    SELECT user_id, status, tier, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM subscriptions 
    WHERE status IN ('active', 'trial')
) sub ON u.id = sub.user_id AND sub.rn = 1
LEFT JOIN wallets w ON u.id = w.user_id
LEFT JOIN (
    SELECT user_id, MAX(timestamp) as last_activity
    FROM user_interactions 
    GROUP BY user_id
) ui ON u.id = ui.user_id;

-- Daily analytics summary view
CREATE OR REPLACE VIEW "public"."daily_analytics_summary" AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    -- User registrations
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as new_users,
    -- Sessions
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as total_sessions,
    -- Donations
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as donations_count,
    SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as donations_total,
    -- Mood tracking
    AVG(mood_rating) FILTER (WHERE logged_at >= DATE_TRUNC('day', created_at)) as avg_mood,
    COUNT(*) FILTER (WHERE logged_at >= DATE_TRUNC('day', created_at)) as mood_entries,
    -- Community activity
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as community_posts,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as community_comments,
    -- Revenue (from subscriptions)
    SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('day', created_at)) as revenue_total
FROM (
    SELECT created_at, null::integer as mood_rating, null::decimal as amount FROM sessions
    UNION ALL
    SELECT created_at, null::integer as mood_rating, amount FROM donations
    UNION ALL
    SELECT logged_at as created_at, mood_rating, null::decimal as amount FROM mood_logs
    UNION ALL
    SELECT created_at, null::integer as mood_rating, null::decimal as amount FROM community_posts
    UNION ALL
    SELECT created_at, null::integer as mood_rating, null::decimal as amount FROM post_comments
    UNION ALL
    SELECT created_at, null::integer as mood_rating, amount FROM subscriptions WHERE status = 'completed'
) combined
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Therapist availability view
CREATE OR REPLACE VIEW "public"."therapist_availability" AS
SELECT 
    tp.user_id as therapist_id,
    up.first_name,
    up.last_name,
    tp.specializations,
    tp.therapy_types,
    tp.hourly_rate,
    tp.currency,
    tp.languages,
    tp.is_available,
    tp.accepting_new_clients,
    tp.average_rating,
    tp.total_reviews,
    tp.total_sessions,
    -- Calculate next available slots
    CASE 
        WHEN tp.is_available AND tp.accepting_new_clients THEN
            ARRAY[
                NOW() + INTERVAL '1 day',
                NOW() + INTERVAL '2 days',
                NOW() + INTERVAL '3 days'
            ]
        ELSE ARRAY[]::timestamptz[]
    END as next_available_slots,
    -- Recent session stats
    COALESCE(rs.recent_sessions, 0) as recent_sessions,
    COALESCE(rs.avg_recent_rating, 0) as avg_recent_rating
FROM therapist_profiles tp
LEFT JOIN user_profiles up ON tp.user_id = up.user_id
LEFT JOIN (
    SELECT therapist_id, 
           COUNT(*) as recent_sessions,
           AVG(rating) as avg_recent_rating
    FROM sessions 
    WHERE actual_start_time >= NOW() - INTERVAL '30 days'
    GROUP BY therapist_id
) rs ON tp.user_id = rs.therapist_id
WHERE tp.is_verified = true;

-- ==============================================
-- NOTIFICATION TRIGGERS (COOL FEATURE)
-- ==============================================

-- Function to create notification when session is completed
CREATE OR REPLACE FUNCTION "public"."notify_session_completed"()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO user_notifications (user_id, title, message, type, priority, created_at)
        VALUES (
            NEW.user_id,
            'Session Completed',
            'Your therapy session has been completed. Thank you for participating!',
            'session_update',
            'medium',
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for session completion notifications
CREATE TRIGGER "trigger_session_completed_notify"
    AFTER UPDATE ON "sessions"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."notify_session_completed"();

-- Function to create notification when mood is significantly low
CREATE OR REPLACE FUNCTION "public"."notify_low_mood"()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.mood_rating <= 3 AND NEW.is_significant = true THEN
        INSERT INTO user_notifications (user_id, title, message, type, priority, created_at)
        VALUES (
            NEW.user_id,
            'Low Mood Alert',
            'We noticed you\'re feeling down. Consider reaching out to your therapist or trying some self-care activities.',
            'wellness_alert',
            'high',
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trigger_low_mood_notify"
    AFTER INSERT ON "mood_logs"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."notify_low_mood"();

-- Function to create loyalty points when user completes activities
CREATE OR REPLACE FUNCTION "public"."award_loyalty_points"()
RETURNS TRIGGER AS $$
DECLARE
    points_to_award INTEGER;
    current_balance INTEGER;
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        -- Award points based on activity difficulty
        points_to_award := CASE 
            WHEN NEW.difficulty_level = 'easy' THEN 10
            WHEN NEW.difficulty_level = 'medium' THEN 25
            WHEN NEW.difficulty_level = 'hard' THEN 50
            ELSE 15
        END;
        
        -- Get current balance
        SELECT points_balance INTO current_balance
        FROM loyalty_points
        WHERE user_id = NEW.user_id;
        
        IF current_balance IS NULL THEN
            -- Create loyalty points record if it doesn't exist
            INSERT INTO loyalty_points (user_id, points_balance, total_earned)
            VALUES (NEW.user_id, points_to_award, points_to_award);
        ELSE
            -- Update existing balance
            UPDATE loyalty_points
            SET points_balance = current_balance + points_to_award,
                total_earned = total_earned + points_to_award,
                last_activity = NOW()
            WHERE user_id = NEW.user_id;
        END IF;
        
        -- Record the transaction
        INSERT INTO loyalty_transactions (user_id, transaction_type, points, description, balance_after, created_at)
        VALUES (
            NEW.user_id,
            'earned',
            points_to_award,
            'Completed activity: ' || NEW.title,
            current_balance + points_to_award,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for loyalty points award
CREATE TRIGGER "trigger_award_loyalty_points"
    AFTER UPDATE ON "activities"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."award_loyalty_points"();

-- ==============================================
-- FINAL PERMISSIONS UPDATE
-- ==============================================

-- Ensure all permissions are properly set
GRANT USAGE ON SCHEMA "public" TO "anon", "authenticated", "service_role";
GRANT CREATE ON SCHEMA "public" TO "authenticated", "service_role";

-- Reset default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO "anon", "authenticated";
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT INSERT, UPDATE, DELETE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT USAGE ON SEQUENCES TO "anon", "authenticated", "service_role";
ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO "anon", "authenticated", "service_role";