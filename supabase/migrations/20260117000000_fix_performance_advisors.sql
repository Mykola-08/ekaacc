-- Fix Performance Advisors (auth_rls_initplan & multiple_permissive_policies)

DO $$
BEGIN

  --------------------------------------------------------------------------------
  -- 1. FIX AUTH RLS INITPLAN (Wrap auth.uid() in (select ...))
  --------------------------------------------------------------------------------

  -- chat_channels
  DROP POLICY IF EXISTS "Participants can view channels" ON chat_channels;
  CREATE POLICY "Participants can view channels" ON chat_channels FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.channel_id = chat_channels.id
      AND chat_participants.profile_id IN (
        SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
      )
    )
  );

  -- chat_messages
  DROP POLICY IF EXISTS "Participants can insert messages" ON chat_messages;
  CREATE POLICY "Participants can insert messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (
    (sender_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
    ))
    AND
    (EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.channel_id = chat_messages.channel_id
      AND chat_participants.profile_id = chat_messages.sender_id
    ))
  );

  DROP POLICY IF EXISTS "Participants can view messages" ON chat_messages;
  CREATE POLICY "Participants can view messages" ON chat_messages FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.channel_id = chat_messages.channel_id
      AND chat_participants.profile_id IN (
        SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
      )
    )
  );

  -- chat_participants
  DROP POLICY IF EXISTS "Participants can view channel participants" ON chat_participants;
  CREATE POLICY "Participants can view channel participants" ON chat_participants FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp
      WHERE cp.channel_id = chat_participants.channel_id
      AND cp.profile_id IN (
        SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
      )
    )
  );

  -- memberships
  DROP POLICY IF EXISTS "Users view own memberships" ON memberships;
  CREATE POLICY "Users view own memberships" ON memberships FOR SELECT TO authenticated USING (
    profile_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
    )
  );

  -- profiles
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (
    auth_id = (select auth.uid())
  );

  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (
    auth_id = (select auth.uid())
  );

  -- relationships
  DROP POLICY IF EXISTS "Users view own relationships" ON relationships;
  CREATE POLICY "Users view own relationships" ON relationships FOR SELECT TO authenticated USING (
    (from_profile_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
    ))
    OR
    (to_profile_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
    ))
  );

  -- user_onboarding_answers
  DROP POLICY IF EXISTS "Users can manage own onboarding answers" ON user_onboarding_answers;
  CREATE POLICY "Users can manage own onboarding answers" ON user_onboarding_answers FOR ALL TO authenticated USING (
    profile_id IN (
      SELECT profiles.id FROM profiles WHERE profiles.auth_id = (select auth.uid())
    )
  );

  --------------------------------------------------------------------------------
  -- 2. FIX MULTIPLE PERMISSIVE POLICIES (Combine overlapping policies)
  --------------------------------------------------------------------------------

  -- community_posts
  -- Original: Admin (ALL), Authenticated (SELECT), User (INSERT, UPDATE)
  DROP POLICY IF EXISTS "Admins can manage all community posts" ON community_posts;
  DROP POLICY IF EXISTS "Community posts are viewable by authenticated users" ON community_posts;
  DROP POLICY IF EXISTS "Users can create community posts" ON community_posts;
  DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;

  CREATE POLICY "community_posts_select" ON community_posts FOR SELECT TO authenticated USING (
    true -- 'authenticated' role matches existing policy
  );

  CREATE POLICY "community_posts_insert" ON community_posts FOR INSERT TO authenticated WITH CHECK (
    ((auth.jwt() ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  CREATE POLICY "community_posts_update" ON community_posts FOR UPDATE TO authenticated USING (
    ((auth.jwt() ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  CREATE POLICY "community_posts_delete" ON community_posts FOR DELETE TO authenticated USING (
    ((auth.jwt() ->> 'role') = 'admin')
  );

  -- notification_templates
  -- Original: Admin (ALL), Admin (SELECT) -> Duplicate
  DROP POLICY IF EXISTS "Admins can view templates" ON notification_templates;
  -- Keep "Admins can manage templates" as it covers ALL.

  -- payment_proof
  -- Original: Staff (ALL), User (INSERT), User (SELECT)
  DROP POLICY IF EXISTS "Staff can manage all proofs" ON payment_proof;
  DROP POLICY IF EXISTS "Users can upload own proofs" ON payment_proof;
  DROP POLICY IF EXISTS "Users can view own proofs" ON payment_proof;

  CREATE POLICY "payment_proof_select" ON payment_proof FOR SELECT TO public USING (
    (EXISTS (
      SELECT 1 FROM user_role_assignments ura 
      JOIN user_roles ur ON ur.id = ura.role_id 
      WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY(ARRAY['admin', 'staff', 'therapist'])
    ))
    OR
    ((select auth.uid()) = user_id)
  );

  CREATE POLICY "payment_proof_insert" ON payment_proof FOR INSERT TO public WITH CHECK (
    (EXISTS (
      SELECT 1 FROM user_role_assignments ura 
      JOIN user_roles ur ON ur.id = ura.role_id 
      WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY(ARRAY['admin', 'staff', 'therapist'])
    ))
    OR
    ((select auth.uid()) = user_id)
  );

  CREATE POLICY "payment_proof_update_delete" ON payment_proof FOR ALL TO public USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura 
      JOIN user_roles ur ON ur.id = ura.role_id 
      WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY(ARRAY['admin', 'staff', 'therapist'])
    )
  );
  -- Refine ALL to UPDATE/DELETE? No, reusing ALL logic from dropped "Staff can manage all proofs" is fine but excluding SELECT/INSERT which are now separate.
  -- To be safe, I'll create distinct Update/Delete policies.
  DROP POLICY IF EXISTS "payment_proof_update_delete" ON payment_proof; -- cleanup if rename
  CREATE POLICY "payment_proof_update" ON payment_proof FOR UPDATE TO public USING (
     (EXISTS (
      SELECT 1 FROM user_role_assignments ura 
      JOIN user_roles ur ON ur.id = ura.role_id 
      WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY(ARRAY['admin', 'staff', 'therapist'])
    ))
  );
  CREATE POLICY "payment_proof_delete" ON payment_proof FOR DELETE TO public USING (
     (EXISTS (
      SELECT 1 FROM user_role_assignments ura 
      JOIN user_roles ur ON ur.id = ura.role_id 
      WHERE ura.user_id = (select auth.uid()) AND ur.name = ANY(ARRAY['admin', 'staff', 'therapist'])
    ))
  );

  -- payments
  -- Original: Admin (SELECT), User (SELECT), System (INSERT)
  DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
  DROP POLICY IF EXISTS "Users can view own payments" ON payments;
  
  CREATE POLICY "payments_select" ON payments FOR SELECT TO public USING (
    ((auth.jwt() ->> 'role') = 'admin')
    OR
    ((select auth.uid()) = user_id)
  );

  -- service_translations
  -- Original: Admin (ALL), Public (SELECT)
  DROP POLICY IF EXISTS "Admins manage translations" ON service_translations;
  DROP POLICY IF EXISTS "Public read translations" ON service_translations;

  CREATE POLICY "service_translations_select" ON service_translations FOR SELECT TO public USING (true);
  CREATE POLICY "service_translations_mod" ON service_translations FOR ALL TO public USING (
     EXISTS (
       SELECT 1 FROM user_role_assignments ura 
       JOIN user_roles ur ON ur.id = ura.role_id 
       WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin'
     )
  );
  -- Exclude SELECT from 'mod' policy? Postgres policies combine with OR.
  -- "service_translations_mod" created as ALL, so it creates a SELECT policy too.
  -- If I have "select" (true) and "mod" (admin), Admin gets (true OR admin) = true. Public gets (true OR false) = true.
  -- This is fine functionality-wise. But it creates 2 policies for SELECT (one from 'select', one from 'mod').
  -- Linter will complain again!
  -- Correct fix: restrict 'mod' to INSERT, UPDATE, DELETE.
  DROP POLICY IF EXISTS "service_translations_mod" ON service_translations;
  CREATE POLICY "service_translations_insert" ON service_translations FOR INSERT TO public WITH CHECK (
     EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );
  CREATE POLICY "service_translations_update" ON service_translations FOR UPDATE TO public USING (
     EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );
  CREATE POLICY "service_translations_delete" ON service_translations FOR DELETE TO public USING (
     EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );

  -- service_variant
  -- Original: Public (SELECT), Service Role (ALL)
  DROP POLICY IF EXISTS "Public read access on service_variant" ON service_variant;
  DROP POLICY IF EXISTS "Service role full access on service_variant" ON service_variant;

  CREATE POLICY "service_variant_select" ON service_variant FOR SELECT TO public USING (true);
  
  -- Service Role ALL, excluding SELECT
  CREATE POLICY "service_variant_insert" ON service_variant FOR INSERT TO public WITH CHECK ((auth.role() = 'service_role'));
  CREATE POLICY "service_variant_update" ON service_variant FOR UPDATE TO public USING ((auth.role() = 'service_role'));
  CREATE POLICY "service_variant_delete" ON service_variant FOR DELETE TO public USING ((auth.role() = 'service_role'));


  -- staff
  -- Original: Admin (ALL), Public (SELECT active), Staff (UPDATE own)
  DROP POLICY IF EXISTS "Admins manage staff" ON staff;
  DROP POLICY IF EXISTS "Public can view active staff" ON staff;
  DROP POLICY IF EXISTS "Staff can edit own profile" ON staff;

  CREATE POLICY "staff_select" ON staff FOR SELECT TO public USING (
    (active = true)
    OR
    EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );

  CREATE POLICY "staff_update" ON staff FOR UPDATE TO public USING (
    ((select auth.uid()) = auth_user_id)
    OR
    EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );

  CREATE POLICY "staff_insert" ON staff FOR INSERT TO public WITH CHECK (
    EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );
  
  CREATE POLICY "staff_delete" ON staff FOR DELETE TO public USING (
    EXISTS (SELECT 1 FROM user_role_assignments ura JOIN user_roles ur ON ur.id = ura.role_id WHERE ura.user_id = (select auth.uid()) AND ur.name = 'admin')
  );

  -- subscriptions
  -- Original: Admin (SELECT), Service Role (ALL), User (SELECT own)
  DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;

  CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT TO public USING (
    ((auth.jwt() ->> 'role') = 'admin') 
    OR 
    ((auth.jwt() ->> 'role') = 'service_role')
    OR
    ((select auth.uid()) = user_id)
  );

  CREATE POLICY "subscriptions_mod" ON subscriptions FOR ALL TO public USING (
    ((auth.jwt() ->> 'role') = 'service_role')
  );
  -- Wait, 'mod' is ALL, so it creates SELECT policy too? 
  -- Yes, FOR ALL creates logic for Select, Insert, Update, Delete.
  -- So "subscriptions_mod" overlaps with "subscriptions_select" for Service Role.
  -- Fix: Split 'mod' to Insert, Update, Delete.
  DROP POLICY IF EXISTS "subscriptions_mod" ON subscriptions;
  CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT TO public WITH CHECK (((auth.jwt() ->> 'role') = 'service_role'));
  CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE TO public USING (((auth.jwt() ->> 'role') = 'service_role'));
  CREATE POLICY "subscriptions_delete" ON subscriptions FOR DELETE TO public USING (((auth.jwt() ->> 'role') = 'service_role'));

  -- system_configurations
  -- Original: Admin (ALL), Admin (SELECT) -> Duplicate
  DROP POLICY IF EXISTS "Admins can view configurations" ON system_configurations;
  -- Keep "Admins can manage configurations" covers ALL. No overlap since we dropped the other.

  -- user_preferences
  -- Original: Admin (ALL), User (SELECT), User (UPDATE)
  DROP POLICY IF EXISTS "Admins can manage all preferences" ON user_preferences;
  DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
  DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

  CREATE POLICY "user_preferences_select" ON user_preferences FOR SELECT TO public USING (
    ((auth.jwt() ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  CREATE POLICY "user_preferences_update" ON user_preferences FOR UPDATE TO public USING (
    ((auth.jwt() ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  CREATE POLICY "user_preferences_insert" ON user_preferences FOR INSERT TO public WITH CHECK (
    ((auth.jwt() ->> 'role') = 'admin')
  );

  CREATE POLICY "user_preferences_delete" ON user_preferences FOR DELETE TO public USING (
    ((auth.jwt() ->> 'role') = 'admin')
  );

END $$;
