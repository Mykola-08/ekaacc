-- Fix remaining Auth RLS Initplan warnings by wrapping auth.jwt() and auth.role()

DO $$
BEGIN

  -- community_posts
  DROP POLICY IF EXISTS "community_posts_insert" ON community_posts;
  CREATE POLICY "community_posts_insert" ON community_posts FOR INSERT TO authenticated WITH CHECK (
    (( (select auth.jwt()) ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  DROP POLICY IF EXISTS "community_posts_update" ON community_posts;
  CREATE POLICY "community_posts_update" ON community_posts FOR UPDATE TO authenticated USING (
    (( (select auth.jwt()) ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  DROP POLICY IF EXISTS "community_posts_delete" ON community_posts;
  CREATE POLICY "community_posts_delete" ON community_posts FOR DELETE TO authenticated USING (
    (( (select auth.jwt()) ->> 'role') = 'admin')
  );

  -- payments
  DROP POLICY IF EXISTS "payments_select" ON payments;
  CREATE POLICY "payments_select" ON payments FOR SELECT TO public USING (
    (( (select auth.jwt()) ->> 'role') = 'admin')
    OR
    ((select auth.uid()) = user_id)
  );

  -- service_variant
  DROP POLICY IF EXISTS "service_variant_insert" ON service_variant;
  CREATE POLICY "service_variant_insert" ON service_variant FOR INSERT TO public WITH CHECK (((select auth.role()) = 'service_role'));

  DROP POLICY IF EXISTS "service_variant_update" ON service_variant;
  CREATE POLICY "service_variant_update" ON service_variant FOR UPDATE TO public USING (((select auth.role()) = 'service_role'));

  DROP POLICY IF EXISTS "service_variant_delete" ON service_variant;
  CREATE POLICY "service_variant_delete" ON service_variant FOR DELETE TO public USING (((select auth.role()) = 'service_role'));

  -- subscriptions
  DROP POLICY IF EXISTS "subscriptions_select" ON subscriptions;
  CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT TO public USING (
    (( (select auth.jwt()) ->> 'role') = 'admin') 
    OR 
    (( (select auth.jwt()) ->> 'role') = 'service_role')
    OR
    ((select auth.uid()) = user_id)
  );

  DROP POLICY IF EXISTS "subscriptions_insert" ON subscriptions;
  CREATE POLICY "subscriptions_insert" ON subscriptions FOR INSERT TO public WITH CHECK ((( (select auth.jwt()) ->> 'role') = 'service_role'));

  DROP POLICY IF EXISTS "subscriptions_update" ON subscriptions;
  CREATE POLICY "subscriptions_update" ON subscriptions FOR UPDATE TO public USING ((( (select auth.jwt()) ->> 'role') = 'service_role'));

  DROP POLICY IF EXISTS "subscriptions_delete" ON subscriptions;
  CREATE POLICY "subscriptions_delete" ON subscriptions FOR DELETE TO public USING ((( (select auth.jwt()) ->> 'role') = 'service_role'));

  -- user_preferences
  DROP POLICY IF EXISTS "user_preferences_select" ON user_preferences;
  CREATE POLICY "user_preferences_select" ON user_preferences FOR SELECT TO public USING (
    (( (select auth.jwt()) ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  DROP POLICY IF EXISTS "user_preferences_update" ON user_preferences;
  CREATE POLICY "user_preferences_update" ON user_preferences FOR UPDATE TO public USING (
    (( (select auth.jwt()) ->> 'role') = 'admin') OR ((select auth.uid()) = user_id)
  );

  DROP POLICY IF EXISTS "user_preferences_insert" ON user_preferences;
  CREATE POLICY "user_preferences_insert" ON user_preferences FOR INSERT TO public WITH CHECK (
    (( (select auth.jwt()) ->> 'role') = 'admin')
  );

  DROP POLICY IF EXISTS "user_preferences_delete" ON user_preferences;
  CREATE POLICY "user_preferences_delete" ON user_preferences FOR DELETE TO public USING (
    (( (select auth.jwt()) ->> 'role') = 'admin')
  );

END $$;
