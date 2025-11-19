-- Add category to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'updates';

-- Update create_notification function to include category
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR,
    p_title VARCHAR,
    p_message TEXT,
    p_link VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}',
    p_category VARCHAR DEFAULT 'updates'
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, link, metadata, category)
    VALUES (p_user_id, p_type, p_title, p_message, p_link, p_metadata, p_category)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;
