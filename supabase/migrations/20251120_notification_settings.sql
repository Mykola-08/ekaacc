-- Create table for user notification settings
CREATE TABLE IF NOT EXISTS user_notification_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    marketing_email BOOLEAN DEFAULT TRUE,
    marketing_push BOOLEAN DEFAULT TRUE,
    marketing_in_app BOOLEAN DEFAULT TRUE,
    security_email BOOLEAN DEFAULT TRUE, -- Usually forced true in logic, but good to store
    security_push BOOLEAN DEFAULT TRUE,
    security_in_app BOOLEAN DEFAULT TRUE,
    updates_email BOOLEAN DEFAULT TRUE,
    updates_push BOOLEAN DEFAULT TRUE,
    updates_in_app BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own settings"
    ON user_notification_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_notification_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_notification_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation (automatically create settings)
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_notification_settings (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create settings on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_settings();
