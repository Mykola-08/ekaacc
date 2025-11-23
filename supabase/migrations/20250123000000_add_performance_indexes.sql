-- Performance optimization indexes for frequently queried tables
-- Generated as part of performance improvement initiative

-- AI Interactions - frequently queried by user_id and timestamp
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_timestamp 
ON ai_interactions(user_id, created_at DESC)
WHERE created_at IS NOT NULL;

-- AI User Profiles - queried by user_id
CREATE INDEX IF NOT EXISTS idx_ai_user_profiles_user 
ON ai_user_profiles(user_id)
WHERE user_id IS NOT NULL;

-- Sync Metadata - queried by external_id and entity_type
CREATE INDEX IF NOT EXISTS idx_sync_metadata_external 
ON sync_metadata(external_id, entity_type, external_system)
WHERE external_id IS NOT NULL AND entity_type IS NOT NULL;

-- User Interactions - queried by user_id and timestamp
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_timestamp 
ON user_interactions(user_id, timestamp DESC)
WHERE timestamp IS NOT NULL;

-- AI Insights - queried by user_id for recent insights
CREATE INDEX IF NOT EXISTS idx_ai_insights_user 
ON ai_insights(user_id, created_at DESC)
WHERE user_id IS NOT NULL;

-- Appointments - queried by user_id and status
CREATE INDEX IF NOT EXISTS idx_appointments_user_status 
ON appointments(user_id, status)
WHERE user_id IS NOT NULL;

-- Community Posts - queried by status and created_at for listing
CREATE INDEX IF NOT EXISTS idx_community_posts_status_created 
ON community_posts(status, created_at DESC)
WHERE status IS NOT NULL;

-- Subscriptions - queried by user_id and status
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status)
WHERE user_id IS NOT NULL;

-- Comment: These indexes will significantly improve query performance for:
-- 1. User activity tracking and analytics
-- 2. AI personalization queries
-- 3. Sync operations
-- 4. Community features
-- 5. Subscription management
--
-- Note: Indexes have WHERE clauses to exclude NULL values and reduce index size
-- Monitor index usage with: SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
