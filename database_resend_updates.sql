-- Add new notification preference columns
ALTER TABLE user_notification_settings 
ADD COLUMN IF NOT EXISTS product_updates_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS promotional_email BOOLEAN DEFAULT true;

-- Update existing rows to have these defaults (if they were null, but default handles new ones)
UPDATE user_notification_settings 
SET product_updates_email = true 
WHERE product_updates_email IS NULL;

UPDATE user_notification_settings 
SET promotional_email = true 
WHERE promotional_email IS NULL;
