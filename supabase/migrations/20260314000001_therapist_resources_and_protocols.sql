-- Migration to add Therapist Resources, Clinical Protocols, and Session Constellation Support

-- 1. Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Markdown or HTML
    category TEXT NOT NULL CHECK (category IN ('article', 'video', 'exercise', 'meditation', 'protocol', 'worksheet', 'kinesiology')),
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone" 
    ON public.resources FOR SELECT 
    USING (true);

CREATE POLICY "Resources are insertable by admins and therapists" 
    ON public.resources FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp 
            WHERE rp.user_id = auth.uid() 
            AND rp.role IN ('admin', 'therapist')
        )
    );

CREATE POLICY "Resources are updatable by author or admins" 
    ON public.resources FOR UPDATE 
    USING (
        auth.uid() = author_id 
        OR EXISTS (
            SELECT 1 FROM public.role_permissions rp 
            WHERE rp.user_id = auth.uid() AND rp.role = 'admin'
        )
    );

-- 2. Clinical Protocols Table (for Kinesiology, etc.)
CREATE TABLE IF NOT EXISTS public.clinical_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    modality TEXT DEFAULT 'kinesiology',
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb, -- Store the structured protocol steps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clinical_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Protocols are viewable by therapists" 
    ON public.clinical_protocols FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.role_permissions rp 
            WHERE rp.user_id = auth.uid() 
            AND rp.role IN ('admin', 'therapist')
        )
    );

-- 3. Systemic Constellations Table (tied to booking/session)
CREATE TABLE IF NOT EXISTS public.session_constellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL, -- references bookings/appointments
    therapist_id UUID NOT NULL REFERENCES auth.users(id),
    patient_id UUID NOT NULL REFERENCES auth.users(id),
    roles JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { id, name, represents, details, is_resolved }
    environment_notes TEXT,
    healing_phrases JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_constellations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their own session constellations" 
    ON public.session_constellations FOR ALL 
    USING (auth.uid() = therapist_id);

-- Drop triggers if they exist then recreate
DROP TRIGGER IF EXISTS update_resources_updated_at ON public.resources;
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_protocols_updated_at ON public.clinical_protocols;
CREATE TRIGGER update_protocols_updated_at
BEFORE UPDATE ON public.clinical_protocols
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_constellations_updated_at ON public.session_constellations;
CREATE TRIGGER update_constellations_updated_at
BEFORE UPDATE ON public.session_constellations
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
