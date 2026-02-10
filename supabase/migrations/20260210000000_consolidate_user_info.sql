-- Migration to consolidate user info into auth.users and create family_members table

-- 1. Create family_members table (to save managed profiles)
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Parent
    full_name TEXT NOT NULL,
    dob DATE,
    relationship TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'family_members' 
        AND policyname = 'Users can manage their family members'
    ) THEN
        CREATE POLICY "Users can manage their family members" 
        ON public.family_members
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 2. Migrate Roles
DO $$
DECLARE
    role_record RECORD;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        FOR role_record IN 
            EXECUTE 'SELECT ura.user_id, ur.name as role_name FROM public.user_role_assignments ura JOIN public.user_roles ur ON ura.role_id = ur.id'
        LOOP
            UPDATE auth.users
            SET raw_app_meta_data = 
                COALESCE(raw_app_meta_data, '{}'::jsonb) || 
                jsonb_build_object('role', role_record.role_name)
            WHERE id = role_record.user_id;
        END LOOP;
    END IF;
END $$;

-- 3. Migrate Profile Data
DO $$
DECLARE
    p_record RECORD;
    parent_auth_id UUID;
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        FOR p_record IN EXECUTE 'SELECT * FROM public.profiles' LOOP
            
            -- Case A: Main User Profile
            IF p_record.auth_id IS NOT NULL THEN
                UPDATE auth.users
                SET raw_user_meta_data = 
                    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                    jsonb_strip_nulls(jsonb_build_object(
                        'first_name', p_record.first_name,
                        'last_name', p_record.last_name,
                        'full_name', COALESCE(p_record.first_name || ' ' || p_record.last_name, p_record.full_name),
                        'phone', p_record.phone,
                        'avatar_url', p_record.avatar_url,
                        'stripe_customer_id', p_record.stripe_customer_id,
                        'trust_score', p_record.trust_score
                    ))
                WHERE id = p_record.auth_id;
            
            -- Case B: Managed/Family Profile
            ELSIF p_record.managed_by IS NOT NULL THEN
                EXECUTE 'SELECT auth_id FROM public.profiles WHERE id = $1 LIMIT 1' 
                INTO parent_auth_id 
                USING p_record.managed_by;

                IF parent_auth_id IS NOT NULL THEN
                    INSERT INTO public.family_members (id, user_id, full_name, dob, relationship, created_at)
                    VALUES (
                        p_record.id,
                        parent_auth_id,
                        COALESCE(p_record.full_name, p_record.first_name || ' ' || p_record.last_name),
                        NULL, 
                        COALESCE(p_record.metadata->>'relationship', 'Family Member'),
                        p_record.created_at
                    )
                    ON CONFLICT (id) DO NOTHING;
                END IF;
            END IF;

        END LOOP;
    END IF;
END $$;

-- 4. Migrate Wallets
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
        ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'wallets' AND column_name = 'profile_id') THEN
            UPDATE public.wallets w
            SET user_id = p.auth_id
            FROM public.profiles p
            WHERE w.profile_id = p.id AND p.auth_id IS NOT NULL;
        END IF;
    END IF;
END $$;

-- 5. Fix Bookings (Ensure customer_reference_id is populated from profiles)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'booking') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'booking' AND column_name = 'profile_id') THEN
            UPDATE public.booking b
            SET customer_reference_id = p.auth_id
            FROM public.profiles p
            WHERE b.profile_id = p.id 
              AND p.auth_id IS NOT NULL 
              AND b.customer_reference_id IS NULL;
        END IF;
        
        -- Ideally drop check constraints or foreign keys on booking.profile_id
        BEGIN
            ALTER TABLE public.booking DROP CONSTRAINT IF EXISTS booking_profile_id_fkey;
        EXCEPTION WHEN OTHERS THEN NULL; END;
    END IF;
END $$;

-- 6. Drop redundant tables (and constraints)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
        BEGIN
            ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_profile_id_fkey;
        EXCEPTION WHEN OTHERS THEN NULL; END;
    END IF;
END $$;

DROP TABLE IF EXISTS public.user_role_assignments CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 7. Create views
CREATE OR REPLACE VIEW public.users_view WITH (security_invoker = false) AS
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'first_name' || ' ' || raw_user_meta_data->>'last_name') as full_name,
    raw_user_meta_data->>'avatar_url' as avatar_url,
    raw_user_meta_data->>'phone' as phone,
    raw_user_meta_data->>'trust_score' as trust_score,
    raw_app_meta_data->>'role' as role
FROM auth.users;

GRANT SELECT ON public.users_view TO authenticated;

-- Admin User Lookup (Exposes Email and Private fields to Service Role only)
CREATE OR REPLACE VIEW public.admin_user_lookup WITH (security_invoker = false) AS
SELECT 
    id, 
    email, 
    last_sign_in_at,
    created_at,
    raw_user_meta_data, 
    raw_app_meta_data
FROM auth.users;

REVOKE ALL ON public.admin_user_lookup FROM anon, authenticated;
GRANT SELECT ON public.admin_user_lookup TO service_role;
