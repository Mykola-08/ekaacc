-- Migration: Add tenant features, expand knowledge base (exercises/supplements), and kinesiology tests

-- 1. Tenant Features Table
CREATE TABLE IF NOT EXISTS public.tenant_features (
    tenant_id text PRIMARY KEY,
    features JSONB NOT NULL DEFAULT '{
        "enable_kinesiology_module": false,
        "enable_community": false,
        "enable_supplements": false,
        "enable_custom_anamnesis": false
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users of the same tenant" ON public.tenant_features
    FOR SELECT
    USING (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) OR
        tenant_id = 'default'
    );

CREATE POLICY "Enable update for admins and therapists" ON public.tenant_features
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    )
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    );

CREATE POLICY "Enable insert for admins and therapists" ON public.tenant_features
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR
        ((SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist' AND tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()))
    );

CREATE TRIGGER update_tenant_features_updated_at BEFORE UPDATE ON public.tenant_features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Alter Exercises to support Global/SaaS tiers
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS tenant_id text DEFAULT 'global',
ADD COLUMN IF NOT EXISTS is_global boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS exercises_tenant_id_idx ON public.exercises(tenant_id);

-- Update RLS for exercises
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exercises;
CREATE POLICY "Enable read access for global or tenant" ON public.exercises
    FOR SELECT
    USING (
        is_global = true OR 
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert for therapists" ON public.exercises
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'therapist')
    );

CREATE POLICY "Enable update for owner therapist or admin" ON public.exercises
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR 
        (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND is_global = false)
    );

-- 3. Supplements Table
CREATE TABLE IF NOT EXISTS public.supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    dosage_instructions TEXT,
    tenant_id text DEFAULT 'global',
    is_global boolean DEFAULT true,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.supplements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for global or tenant" ON public.supplements
    FOR SELECT
    USING (
        is_global = true OR 
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid())
    );

CREATE POLICY "Enable insert for therapists" ON public.supplements
    FOR INSERT
    WITH CHECK (
        (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'therapist')
    );

CREATE POLICY "Enable update for owner therapist or admin" ON public.supplements
    FOR UPDATE
    USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' OR 
        (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND is_global = false)
    );

CREATE TRIGGER update_supplements_updated_at BEFORE UPDATE ON public.supplements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Kinesiology Tests Tracking
CREATE TABLE IF NOT EXISTS public.kinesiology_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tenant_id text NOT NULL,
    structural_corrections JSONB DEFAULT '[]',
    chemical_corrections JSONB DEFAULT '[]',
    emotional_corrections JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.kinesiology_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for tenant" ON public.kinesiology_tests
    FOR SELECT
    USING (tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Enable insert for therapist" ON public.kinesiology_tests
    FOR INSERT
    WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist'
    );

CREATE POLICY "Enable update for therapist" ON public.kinesiology_tests
    FOR UPDATE
    USING (
        tenant_id = (SELECT tenant_id FROM public.users WHERE id = auth.uid()) AND
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'therapist'
    );

CREATE TRIGGER update_kinesiology_tests_updated_at BEFORE UPDATE ON public.kinesiology_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
