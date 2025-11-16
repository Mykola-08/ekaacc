-- Create missing users table (as a view or table)
-- Since user_profiles already exists, we'll create a users view that references auth.users
CREATE OR REPLACE VIEW public.users AS
SELECT 
    au.id,
    au.email,
    up.name,
    up.phone,
    up.date_of_birth,
    up.avatar_url,
    up.created_at,
    up.updated_at
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.user_id;

-- Grant permissions for the users view
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.users TO authenticated;

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    duration INTEGER DEFAULT 60,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions for services table
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.services TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions for notifications table
GRANT SELECT ON public.notifications TO anon;
GRANT SELECT ON public.notifications TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Insert some sample services
INSERT INTO public.services (name, description, price, category) VALUES
('Individual Therapy Session', 'One-on-one therapy session with a licensed therapist', 80.00, 'therapy'),
('Group Therapy Session', 'Group therapy session with multiple participants', 40.00, 'therapy'),
('Couples Therapy', 'Therapy session for couples', 120.00, 'therapy'),
('Initial Consultation', 'First consultation to assess needs', 50.00, 'consultation'),
('Crisis Support', 'Emergency mental health support', 100.00, 'support')
ON CONFLICT DO NOTHING;

-- Create RLS policies for the new tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Services RLS policies
CREATE POLICY "Services are viewable by everyone" ON public.services
    FOR SELECT USING (is_active = true);

CREATE POLICY "Services can be managed by authenticated users" ON public.services
    FOR ALL TO authenticated USING (true);

-- Notifications RLS policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON public.notifications
    FOR ALL TO authenticated USING (auth.uid() = user_id);