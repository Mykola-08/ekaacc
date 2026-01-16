-- Fix Security Advisors and Missing RLS

-- 1. Move extensions to extensions schema to avoid public schema pollution
CREATE SCHEMA IF NOT EXISTS extensions;
-- We use DO block to avoid errors if extensions are already in the right schema or not installed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'btree_gist') THEN
        ALTER EXTENSION "btree_gist" SET SCHEMA extensions;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
        ALTER EXTENSION "vector" SET SCHEMA extensions;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        ALTER EXTENSION "pg_trgm" SET SCHEMA extensions;
    END IF;
END
$$;

-- Update database search path to include extensions
ALTER DATABASE postgres SET search_path TO public, extensions;

-- 2. Fix Security Definer Views (make them Security Invoker)
ALTER VIEW public.services_personalized SET (security_invoker = true);
ALTER VIEW public.view_unified_services SET (security_invoker = true);
ALTER VIEW public.services_360 SET (security_invoker = true);
ALTER VIEW public.services_therapy SET (security_invoker = true);
ALTER VIEW public.services_packs SET (security_invoker = true);

-- 3. Add RLS Policies for tables flagged as "RLS Enabled No Policy"

-- onboarding_questions
CREATE POLICY "Public can view active onboarding questions"
ON public.onboarding_questions FOR SELECT TO public
USING (is_active = true);

-- user_onboarding_answers
CREATE POLICY "Users can manage own onboarding answers"
ON public.user_onboarding_answers FOR ALL TO authenticated
USING (user_id = auth.uid());

-- profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth_id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth_id = auth.uid());

-- chat_channels
CREATE POLICY "Participants can view channels"
ON public.chat_channels FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE channel_id = id
        AND profile_id IN (
            SELECT id FROM public.profiles WHERE auth_id = auth.uid()
        )
    )
);

-- chat_participants
CREATE POLICY "Participants can view channel participants"
ON public.chat_participants FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.channel_id = channel_id
        AND cp.profile_id IN (
            SELECT id FROM public.profiles WHERE auth_id = auth.uid()
        )
    )
);

-- chat_messages
CREATE POLICY "Participants can view messages"
ON public.chat_messages FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE channel_id = chat_messages.channel_id
        AND profile_id IN (
            SELECT id FROM public.profiles WHERE auth_id = auth.uid()
        )
    )
);

CREATE POLICY "Participants can insert messages"
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (
    sender_id IN (
        SELECT id FROM public.profiles WHERE auth_id = auth.uid()
    )
    AND
    EXISTS (
        SELECT 1 FROM public.chat_participants
        WHERE channel_id = chat_messages.channel_id
        AND profile_id = chat_messages.sender_id
    )
);

-- reviews
CREATE POLICY "Public can view public reviews"
ON public.reviews FOR SELECT TO public
USING (is_public = true);

-- memberships
CREATE POLICY "Users view own memberships"
ON public.memberships FOR SELECT TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_id = auth.uid()));

-- relationships
CREATE POLICY "Users view own relationships"
ON public.relationships FOR SELECT TO authenticated
USING (
    from_profile_id IN (SELECT id FROM public.profiles WHERE auth_id = auth.uid()) OR
    to_profile_id IN (SELECT id FROM public.profiles WHERE auth_id = auth.uid())
);
