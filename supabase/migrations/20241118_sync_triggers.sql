-- =====================================================
-- Database Triggers for Automatic Sync Queue Population
-- =====================================================
-- Description: Automatically creates sync queue entries when data changes
-- Version: 1.0
-- Date: 2024-11-18
-- =====================================================

-- Function to create sync queue entry for appointments
CREATE OR REPLACE FUNCTION create_appointment_sync_queue_entry()
RETURNS TRIGGER AS $$
DECLARE
    payload JSONB;
    queue_id UUID;
BEGIN
    -- Only create sync entries if Square integration is enabled
    IF current_setting('app.square_integration_enabled', true) = 'true' THEN
        -- Build payload based on operation
        IF TG_OP = 'DELETE' THEN
            payload = jsonb_build_object(
                'id', OLD.id,
                'operation', 'delete',
                'entity_type', 'appointment'
            );
        ELSE
            payload = jsonb_build_object(
                'id', NEW.id,
                'user_id', NEW.user_id,
                'therapist_id', NEW.therapist_id,
                'start_time', NEW.start_time,
                'end_time', NEW.end_time,
                'status', NEW.status,
                'type', NEW.type,
                'location', NEW.location,
                'is_online', NEW.is_online,
                'notes', NEW.notes,
                'metadata', NEW.metadata,
                'operation', CASE WHEN TG_OP = 'INSERT' THEN 'create' ELSE 'update' END,
                'entity_type', 'appointment'
            );
        END IF;

        -- Create sync queue entry
        INSERT INTO sync_queue (
            entity_type,
            entity_id,
            operation,
            direction,
            external_system,
            payload,
            status
        )
        VALUES (
            'appointment',
            COALESCE(NEW.id, OLD.id),
            CASE 
                WHEN TG_OP = 'INSERT' THEN 'create'
                WHEN TG_OP = 'UPDATE' THEN 'update'
                WHEN TG_OP = 'DELETE' THEN 'delete'
            END,
            'to_external',
            'square',
            payload,
            'pending'
        );
    END IF;

    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create sync queue entry for user profiles (customers)
CREATE OR REPLACE FUNCTION create_customer_sync_queue_entry()
RETURNS TRIGGER AS $$
DECLARE
    payload JSONB;
    user_email TEXT;
    user_phone TEXT;
BEGIN
    -- Only create sync entries if Square integration is enabled
    IF current_setting('app.square_integration_enabled', true) = 'true' THEN
        -- Get user email and phone from auth.users
        SELECT email, raw_user_meta_data->>'phone' INTO user_email, user_phone
        FROM auth.users 
        WHERE id = COALESCE(NEW.user_id, OLD.user_id);

        -- Build payload based on operation
        IF TG_OP = 'DELETE' THEN
            payload = jsonb_build_object(
                'id', OLD.id,
                'operation', 'delete',
                'entity_type', 'customer'
            );
        ELSE
            payload = jsonb_build_object(
                'id', NEW.id,
                'user_id', NEW.user_id,
                'username', NEW.username,
                'full_name', NEW.full_name,
                'email', user_email,
                'phone', user_phone,
                'date_of_birth', NEW.date_of_birth,
                'gender', NEW.gender,
                'address', NEW.address,
                'emergency_contact', NEW.emergency_contact,
                'operation', CASE WHEN TG_OP = 'INSERT' THEN 'create' ELSE 'update' END,
                'entity_type', 'customer'
            );
        END IF;

        -- Create sync queue entry
        INSERT INTO sync_queue (
            entity_type,
            entity_id,
            operation,
            direction,
            external_system,
            payload,
            status
        )
        VALUES (
            'customer',
            COALESCE(NEW.id, OLD.id),
            CASE 
                WHEN TG_OP = 'INSERT' THEN 'create'
                WHEN TG_OP = 'UPDATE' THEN 'update'
                WHEN TG_OP = 'DELETE' THEN 'delete'
            END,
            'to_external',
            'square',
            payload,
            'pending'
        );
    END IF;

    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if sync metadata exists and create if needed
CREATE OR REPLACE FUNCTION ensure_sync_metadata_exists()
RETURNS TRIGGER AS $$
DECLARE
    external_id TEXT;
BEGIN
    -- Only process if Square integration is enabled
    IF current_setting('app.square_integration_enabled', true) = 'true' THEN
        -- Try to find existing sync metadata
        IF EXISTS (
            SELECT 1 FROM sync_metadata 
            WHERE entity_type = TG_TABLE_NAME 
            AND local_id = COALESCE(NEW.id, OLD.id)
            AND external_system = 'square'
        ) THEN
            -- Update existing sync metadata status
            UPDATE sync_metadata
            SET sync_status = 'pending',
                updated_at = NOW()
            WHERE entity_type = TG_TABLE_NAME 
            AND local_id = COALESCE(NEW.id, OLD.id)
            AND external_system = 'square';
        ELSE
            -- Create new sync metadata entry
            -- Try to get external ID from existing Square data or generate placeholder
            external_id := COALESCE(
                (SELECT external_id FROM sync_metadata WHERE local_id = COALESCE(NEW.id, OLD.id) AND entity_type = TG_TABLE_NAME LIMIT 1),
                'pending-' || COALESCE(NEW.id, OLD.id)::TEXT
            );

            INSERT INTO sync_metadata (
                entity_type,
                local_id,
                external_id,
                external_system,
                entity_status,
                sync_status,
                sync_version
            )
            VALUES (
                TG_TABLE_NAME,
                COALESCE(NEW.id, OLD.id),
                external_id,
                'square',
                'active',
                'pending',
                1
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for appointments table
CREATE TRIGGER trigger_appointment_sync_queue
    AFTER INSERT OR UPDATE OR DELETE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION create_appointment_sync_queue_entry();

CREATE TRIGGER trigger_appointment_sync_metadata
    AFTER INSERT ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION ensure_sync_metadata_exists();

-- Create triggers for user_profiles table (customers)
CREATE TRIGGER trigger_customer_sync_queue
    AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION create_customer_sync_queue_entry();

CREATE TRIGGER trigger_customer_sync_metadata
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION ensure_sync_metadata_exists();

-- Function to process sync queue
CREATE OR REPLACE FUNCTION process_sync_queue()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    queue_record RECORD;
    result JSONB;
BEGIN
    -- Process pending sync queue entries
    FOR queue_record IN
        SELECT * FROM sync_queue 
        WHERE status = 'pending' 
        AND scheduled_at <= NOW()
        ORDER BY created_at ASC
        LIMIT 100
    LOOP
        BEGIN
            -- Update status to processing
            UPDATE sync_queue 
            SET status = 'processing', 
                updated_at = NOW() 
            WHERE id = queue_record.id;

            -- Process the queue entry (this would call your sync service)
            -- For now, we'll simulate processing with a success result
            result := jsonb_build_object(
                'success', true,
                'message', 'Processed successfully',
                'processed_at', NOW()
            );

            -- Update status to completed
            UPDATE sync_queue 
            SET status = 'completed',
                processed_at = NOW(),
                updated_at = NOW()
            WHERE id = queue_record.id;

            processed_count := processed_count + 1;

        EXCEPTION WHEN OTHERS THEN
            -- Handle errors and retry logic
            UPDATE sync_queue 
            SET status = 'failed',
                error_message = SQLERRM,
                retry_count = retry_count + 1,
                updated_at = NOW()
            WHERE id = queue_record.id;

            -- If max retries reached, mark as permanently failed
            IF queue_record.retry_count >= queue_record.max_retries THEN
                UPDATE sync_queue 
                SET status = 'permanently_failed',
                    updated_at = NOW()
                WHERE id = queue_record.id;
            END IF;
        END;
    END LOOP;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old sync data
CREATE OR REPLACE FUNCTION cleanup_old_sync_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Delete sync queue entries older than 30 days that are completed
    DELETE FROM sync_queue 
    WHERE status = 'completed' 
    AND created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Delete sync statistics older than 90 days
    DELETE FROM sync_statistics 
    WHERE date < CURRENT_DATE - INTERVAL '90 days';

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_appointment_sync_queue_entry() TO authenticated;
GRANT EXECUTE ON FUNCTION create_customer_sync_queue_entry() TO authenticated;
GRANT EXECUTE ON FUNCTION ensure_sync_metadata_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION process_sync_queue() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_sync_data() TO authenticated;

-- Create indexes for sync queue processing
CREATE INDEX IF NOT EXISTS idx_sync_queue_processing ON sync_queue(status, scheduled_at, created_at)
WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_sync_metadata_pending ON sync_metadata(sync_status, updated_at)
WHERE sync_status IN ('pending', 'error');