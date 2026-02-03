-- Fix Performance Advisor: Unindexed foreign keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_logs_actor_id ON public.activity_logs(actor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_admin_notes_author_id ON public.admin_notes(author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_booking_booked_by_profile_id ON public.booking(booked_by_profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_channel_id ON public.chat_messages(channel_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_participants_profile_id ON public.chat_participants(profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_parent_comment_id ON public.comments(parent_comment_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_memberships_profile_id ON public.memberships(profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_proof_booking_id ON public.payment_proof(booking_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_proof_user_id ON public.payment_proof(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_proof_verified_by ON public.payment_proof(verified_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_proof_wallet_transaction_id ON public.payment_proof(wallet_transaction_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_relationships_to_profile_id ON public.relationships(to_profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_author_profile_id ON public.reviews(author_profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_therapist_profile_id ON public.reviews(therapist_profile_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_onboarding_answers_question_id ON public.user_onboarding_answers(question_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);

-- Fix Security Advisor: Function Search Path Mutable
ALTER FUNCTION public.get_current_staff_id() SET search_path = public;
ALTER FUNCTION public.verify_payment_proof(uuid, uuid, text, text) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.pay_booking_with_wallet(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.top_up_wallet(uuid, integer, text, text) SET search_path = public;

-- Fix Security Advisor: RLS Disabled in Public
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;

-- Note: Policies for the above tables need to be defined based on business logic. 
-- Enabling RLS is the first step to security, preventing unauthorized access by default.

-- Fix Performance Advisor: Auth RLS Initialization Plan
-- Optimizing policies to use (select auth.uid()) instead of auth.uid() directly

-- wallets
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING ((select auth.uid()) = profile_id);

-- wallet_transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (wallet_id = (select auth.uid()));

-- payment_proof
DROP POLICY IF EXISTS "Users can view own proofs" ON public.payment_proof;
CREATE POLICY "Users can view own proofs" ON public.payment_proof FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can upload own proofs" ON public.payment_proof;
CREATE POLICY "Users can upload own proofs" ON public.payment_proof FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- staff
DROP POLICY IF EXISTS "Staff can edit own profile" ON public.staff;
CREATE POLICY "Staff can edit own profile" ON public.staff FOR UPDATE USING ((select auth.uid()) = auth_user_id);

-- user_rewards_balance
DROP POLICY IF EXISTS "Users view own balance" ON public.user_rewards_balance;
CREATE POLICY "Users view own balance" ON public.user_rewards_balance FOR SELECT USING ((select auth.uid()) = user_id);

-- app_notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.app_notifications;
CREATE POLICY "Users can view their own notifications" ON public.app_notifications FOR SELECT USING ((select auth.uid()) = recipient_id);


-- Complex policies optimization
-- staff: Admins manage staff
DROP POLICY IF EXISTS "Admins manage staff" ON public.staff;
CREATE POLICY "Admins manage staff" ON public.staff FOR ALL USING (
  EXISTS ( 
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ur.id = ura.role_id
    WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin'
  )
);

-- error_logs: Admins can view error logs
DROP POLICY IF EXISTS "Admins can view error logs" ON public.error_logs;
CREATE POLICY "Admins can view error logs" ON public.error_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (select auth.uid()) AND profiles.role = 'therapist'
  )
);

-- activity_logs: Admins view all activity
DROP POLICY IF EXISTS "Admins view all activity" ON public.activity_logs;
CREATE POLICY "Admins view all activity" ON public.activity_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_id = (select auth.uid()) AND profiles.role = ANY (ARRAY['admin'::user_role, 'therapist'::user_role])
  )
);

-- admin_notes: Admins view all notes
DROP POLICY IF EXISTS "Admins view all notes" ON public.admin_notes;
CREATE POLICY "Admins view all notes" ON public.admin_notes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.auth_id = (select auth.uid()) AND profiles.role = ANY (ARRAY['admin'::user_role, 'therapist'::user_role])
  )
);

-- payment_proof: Staff can manage all proofs
DROP POLICY IF EXISTS "Staff can manage all proofs" ON public.payment_proof;
CREATE POLICY "Staff can manage all proofs" ON public.payment_proof FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ur.id = ura.role_id
    WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY (ARRAY['admin', 'staff', 'therapist'])
  )
);

-- service_translations: Admins manage translations
DROP POLICY IF EXISTS "Admins manage translations" ON public.service_translations;
CREATE POLICY "Admins manage translations" ON public.service_translations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_role_assignments ura
    JOIN user_roles ur ON ur.id = ura.role_id
    WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin'
  )
);
