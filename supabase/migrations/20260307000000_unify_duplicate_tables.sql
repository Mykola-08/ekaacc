-- ============================================================================
-- Migration: Unify Duplicate Tables
-- Purpose: Consolidate redundant tables to reduce data duplication
--
-- Summary of changes:
--   1. profiles ← user_profiles (view created)
--   2. services ← service (data migrated, view created)
--   3. audit_logs ← audit_events (view created)
--   4. Drop dead tables: ai_user_profiles, audit_log, activity_logs,
--      error_logs, transactions, posts, comments, user_notifications,
--      subscription_tiers, booking_legacy, payment_proof
-- ============================================================================

BEGIN;

-- =========================================================================
-- STEP 1: Add missing columns to `profiles` for user_profiles compatibility
-- =========================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_reason text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_until timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active timestamptz;

-- =========================================================================
-- STEP 2: Drop `user_profiles` table and create a backward-compat VIEW
-- =========================================================================
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE VIEW user_profiles WITH (security_invoker = true) AS
SELECT
  auth_id AS id,
  full_name AS username,
  full_name,
  avatar_url,
  bio,
  email,
  phone,
  role::text AS role,
  created_at,
  updated_at,
  stripe_customer_id,
  account_status,
  suspended_reason,
  suspended_until,
  last_active
FROM profiles
WHERE auth_id IS NOT NULL;

COMMENT ON VIEW user_profiles IS 'Backward-compatible view mapping to profiles table. auth_id is exposed as id.';

-- =========================================================================
-- STEP 3: Unify service tables - add columns to `services`, migrate data
-- =========================================================================
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
ALTER TABLE services ADD COLUMN IF NOT EXISTS stripe_product_id text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS stripe_price_id text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS version text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE services ADD COLUMN IF NOT EXISTS requires_identity_verification boolean DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS min_trust_score integer DEFAULT 0;

-- Migrate data from `service` → `services` (skip rows already in services)
INSERT INTO services (
  id, name, description, category, duration_minutes, base_price, currency,
  is_active, metadata, image_url, slug, type, tags, is_public,
  stripe_product_id, stripe_price_id, location, version, images,
  requires_identity_verification, min_trust_score, created_at, updated_at
)
SELECT
  s.id,
  s.name,
  s.description,
  COALESCE(s.category, 'general'),
  COALESCE(s.duration, 60),
  COALESCE(s.price::numeric / 100, 0),
  'EUR',
  COALESCE(s.active, true),
  s.metadata,
  s.image_url,
  s.slug,
  s.type,
  s.tags,
  COALESCE(s.is_public, true),
  s.stripe_product_id,
  s.stripe_price_id,
  s.location,
  s.version,
  s.images,
  COALESCE(s.requires_identity_verification, false),
  COALESCE(s.min_trust_score, 0),
  COALESCE(s.created_at, now()),
  now()
FROM service s
WHERE s.id NOT IN (SELECT id FROM services);

-- Re-point FKs from `service` → `services`
ALTER TABLE service_addon DROP CONSTRAINT IF EXISTS service_addon_service_id_fkey;
ALTER TABLE service_addon
  ADD CONSTRAINT service_addon_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id);

ALTER TABLE service_variant DROP CONSTRAINT IF EXISTS service_variant_service_id_fkey;
ALTER TABLE service_variant
  ADD CONSTRAINT service_variant_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id);

ALTER TABLE service_translations DROP CONSTRAINT IF EXISTS service_translations_service_id_fkey;
ALTER TABLE service_translations
  ADD CONSTRAINT service_translations_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id);

-- Remove booking_legacy FK before dropping service
ALTER TABLE booking_legacy DROP CONSTRAINT IF EXISTS booking_service_id_fkey;

-- Drop the old `service` table
DROP TABLE IF EXISTS service CASCADE;

-- Create backward-compat VIEW so code using .from('service') still works
CREATE VIEW service WITH (security_invoker = true) AS
SELECT
  id,
  created_at,
  name,
  description,
  (base_price * 100)::integer AS price,
  duration_minutes AS duration,
  image_url,
  location,
  version,
  is_active AS active,
  stripe_product_id,
  stripe_price_id,
  metadata,
  images,
  requires_identity_verification,
  min_trust_score,
  tags,
  is_public,
  slug,
  type,
  category
FROM services;

COMMENT ON VIEW service IS 'Backward-compatible view mapping to services table. Price is in cents (services stores euros).';

-- =========================================================================
-- STEP 4: Unify audit tables
-- =========================================================================
DROP TABLE IF EXISTS audit_events CASCADE;

CREATE VIEW audit_events WITH (security_invoker = true) AS
SELECT
  id,
  created_at,
  user_id AS actor_id,
  action AS event_type,
  resource_type,
  resource_id,
  COALESCE(details->>'severity', 'info') AS severity,
  details AS metadata,
  ip_address::text AS ip_address
FROM audit_logs;

COMMENT ON VIEW audit_events IS 'Backward-compatible view mapping to audit_logs table.';

-- Drop dead audit/activity tables
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;

-- =========================================================================
-- STEP 5: Drop dead tables (0 rows, 0 code references)
-- =========================================================================
DROP TABLE IF EXISTS ai_user_profiles CASCADE;
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Drop old community tables (code uses community_posts + post_comments)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- Drop user_notifications (app_notifications covers the same purpose)
DROP TABLE IF EXISTS user_notifications CASCADE;

-- Drop subscription_tiers (0 code refs, 0 rows)
-- First remove the FK from subscriptions
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_tier_id_fkey;
DROP TABLE IF EXISTS subscription_tiers CASCADE;

-- =========================================================================
-- STEP 6: Drop booking_legacy and its orphan dependents
-- =========================================================================
-- Remove FKs pointing to booking_legacy
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_booking_id_fkey;
ALTER TABLE payment_proof DROP CONSTRAINT IF EXISTS payment_proof_booking_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_fkey;

-- Re-point assignments and reviews to the new bookings table (nullable)
ALTER TABLE assignments
  ADD CONSTRAINT assignments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings(id);
ALTER TABLE reviews
  ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings(id);

-- Drop booking_legacy and payment_proof (both 0 rows)
DROP TABLE IF EXISTS payment_proof CASCADE;
DROP TABLE IF EXISTS booking_legacy CASCADE;

COMMIT;
