-- =====================================================
-- Square Appointments Bidirectional Sync Tables
-- =====================================================
-- Description: Tables for tracking sync status between Square and Supabase
-- Version: 1.0
-- Date: 2024-11-18
-- =====================================================

-- Sync metadata table for tracking external system relationships
CREATE TABLE IF NOT EXISTS sync_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'booking', 'customer', 'therapist'
    local_id UUID NOT NULL, -- ID in our database
    external_id VARCHAR(255) NOT NULL, -- ID in Square
    external_system VARCHAR(50) NOT NULL DEFAULT 'square', -- 'square', 'stripe', etc.
    entity_status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'deleted', 'archived'
    sync_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'synced', 'error', 'conflict'
    last_sync_at TIMESTAMPTZ,
    last_sync_error TEXT,
    sync_version INTEGER NOT NULL DEFAULT 1, -- For optimistic locking
    external_data JSONB DEFAULT '{}', -- Store external system data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(entity_type, local_id, external_system),
    UNIQUE(entity_type, external_id, external_system)
);

-- Sync conflict resolution log
CREATE TABLE IF NOT EXISTS sync_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    local_id UUID NOT NULL,
    external_id VARCHAR(255) NOT NULL,
    external_system VARCHAR(50) NOT NULL DEFAULT 'square',
    conflict_type VARCHAR(50) NOT NULL, -- 'data_mismatch', 'deleted_remotely', 'deleted_locally'
    local_data JSONB NOT NULL,
    external_data JSONB NOT NULL,
    resolution_strategy VARCHAR(50), -- 'local_wins', 'external_wins', 'merge'
    resolved_data JSONB,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    INDEX idx_sync_conflicts_unresolved (resolved_at) WHERE resolved_at IS NULL
);

-- Sync queue for pending operations
CREATE TABLE IF NOT EXISTS sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    direction VARCHAR(20) NOT NULL, -- 'to_external', 'from_external'
    external_system VARCHAR(50) NOT NULL DEFAULT 'square',
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    error_message TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    INDEX idx_sync_queue_pending (status, scheduled_at) WHERE status = 'pending',
    INDEX idx_sync_queue_entity (entity_type, entity_id)
);

-- Sync statistics for monitoring
CREATE TABLE IF NOT EXISTS sync_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_system VARCHAR(50) NOT NULL DEFAULT 'square',
    entity_type VARCHAR(50) NOT NULL,
    sync_direction VARCHAR(20) NOT NULL, -- 'inbound', 'outbound'
    operation VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'
    success_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    conflict_count INTEGER NOT NULL DEFAULT 0,
    avg_sync_time_ms INTEGER,
    last_sync_at TIMESTAMPTZ,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(external_system, entity_type, sync_direction, operation, date)
);

-- Function to update sync_metadata timestamp
CREATE OR REPLACE FUNCTION update_sync_metadata_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update sync_queue timestamp
CREATE OR REPLACE FUNCTION update_sync_queue_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update sync_statistics timestamp
CREATE OR REPLACE FUNCTION update_sync_statistics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_sync_metadata_updated_at 
    BEFORE UPDATE ON sync_metadata 
    FOR EACH ROW EXECUTE FUNCTION update_sync_metadata_timestamp();

CREATE TRIGGER update_sync_queue_updated_at 
    BEFORE UPDATE ON sync_queue 
    FOR EACH ROW EXECUTE FUNCTION update_sync_queue_timestamp();

-- Function to record sync statistics
CREATE OR REPLACE FUNCTION record_sync_stat(
    p_external_system VARCHAR(50),
    p_entity_type VARCHAR(50),
    p_sync_direction VARCHAR(20),
    p_operation VARCHAR(20),
    p_success BOOLEAN,
    p_conflict BOOLEAN DEFAULT FALSE,
    p_sync_time_ms INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    stat_record RECORD;
BEGIN
    -- Get or create statistics record for today
    INSERT INTO sync_statistics (
        external_system, entity_type, sync_direction, operation, 
        success_count, error_count, conflict_count, avg_sync_time_ms, last_sync_at
    )
    VALUES (
        p_external_system, p_entity_type, p_sync_direction, p_operation,
        CASE WHEN p_success THEN 1 ELSE 0 END,
        CASE WHEN NOT p_success THEN 1 ELSE 0 END,
        CASE WHEN p_conflict THEN 1 ELSE 0 END,
        p_sync_time_ms,
        NOW()
    )
    ON CONFLICT (external_system, entity_type, sync_direction, operation, date)
    DO UPDATE SET
        success_count = sync_statistics.success_count + CASE WHEN p_success THEN 1 ELSE 0 END,
        error_count = sync_statistics.error_count + CASE WHEN NOT p_success THEN 1 ELSE 0 END,
        conflict_count = sync_statistics.conflict_count + CASE WHEN p_conflict THEN 1 ELSE 0 END,
        avg_sync_time_ms = CASE 
            WHEN p_sync_time_ms IS NOT NULL THEN 
                (sync_statistics.avg_sync_time_ms * (sync_statistics.success_count + sync_statistics.error_count - 1) + p_sync_time_ms) 
                / (sync_statistics.success_count + sync_statistics.error_count)
            ELSE sync_statistics.avg_sync_time_ms
        END,
        last_sync_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to create sync queue entry
CREATE OR REPLACE FUNCTION create_sync_queue_entry(
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_operation VARCHAR(20),
    p_direction VARCHAR(20),
    p_external_system VARCHAR(50) DEFAULT 'square',
    p_payload JSONB DEFAULT '{}',
    p_scheduled_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
    queue_id UUID;
BEGIN
    INSERT INTO sync_queue (
        entity_type, entity_id, operation, direction, 
        external_system, payload, scheduled_at
    )
    VALUES (
        p_entity_type, p_entity_id, p_operation, p_direction,
        p_external_system, p_payload, p_scheduled_at
    )
    RETURNING id INTO queue_id;
    
    RETURN queue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to resolve sync conflicts
CREATE OR REPLACE FUNCTION resolve_sync_conflict(
    p_conflict_id UUID,
    p_resolution_strategy VARCHAR(50),
    p_resolved_by UUID,
    p_resolved_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE sync_conflicts
    SET 
        resolution_strategy = p_resolution_strategy,
        resolved_data = COALESCE(p_resolved_data, resolved_data),
        resolved_at = NOW(),
        resolved_by = p_resolved_by
    WHERE id = p_conflict_id AND resolved_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_metadata TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_conflicts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_queue TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON sync_statistics TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sync_metadata_status ON sync_metadata(sync_status) WHERE sync_status IN ('pending', 'error');
CREATE INDEX IF NOT EXISTS idx_sync_metadata_entity ON sync_metadata(entity_type, local_id);
CREATE INDEX IF NOT EXISTS idx_sync_metadata_external ON sync_metadata(external_id, external_system);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_sync_statistics_date ON sync_statistics(date);

-- Enable RLS
ALTER TABLE sync_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own sync metadata" ON sync_metadata
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all sync data" ON sync_metadata
    FOR ALL USING (public.check_user_permission(auth.uid(), 'admin'));

CREATE POLICY "Users can view own sync conflicts" ON sync_conflicts
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all sync conflicts" ON sync_conflicts
    FOR ALL USING (public.check_user_permission(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sync queue" ON sync_queue
    FOR ALL USING (public.check_user_permission(auth.uid(), 'admin'));

CREATE POLICY "Admins can view sync statistics" ON sync_statistics
    FOR SELECT USING (public.check_user_permission(auth.uid(), 'admin'));