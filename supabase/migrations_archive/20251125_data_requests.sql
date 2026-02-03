-- Create data_requests table to track GDPR/CCPA requests
CREATE TABLE IF NOT EXISTS public.data_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if user is logged in
    email TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'access', 'deletion', 'rectification', 'portability', 'restriction', 'objection'
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_data_requests_email ON public.data_requests(email);
CREATE INDEX IF NOT EXISTS idx_data_requests_status ON public.data_requests(status);

-- Enable RLS
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own requests (by email match or user_id)
CREATE POLICY "Users can view their own requests"
    ON public.data_requests FOR SELECT
    USING (auth.uid() = user_id OR email = auth.jwt() ->> 'email');

-- Anyone can insert a request (public form)
CREATE POLICY "Anyone can insert requests"
    ON public.data_requests FOR INSERT
    WITH CHECK (true);

-- Only admins can update (this would need an admin role check, for now we'll leave it restricted or allow users to cancel)
-- For simplicity in this context, we'll allow users to update their own if needed, but usually these are processed by admins.

-- Function to update updated_at
CREATE TRIGGER set_data_requests_updated_at
    BEFORE UPDATE ON public.data_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
