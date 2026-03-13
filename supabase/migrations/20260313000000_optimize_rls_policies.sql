-- Optimize RLS policies that incorrectly use per-row auth.users subqueries
-- Replacing subqueries with JWT claims for scalability and performance

-- 1. features table
DROP POLICY IF EXISTS "Admins can manage features" ON features;
CREATE POLICY "Admins can manage features" ON features FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 2. user_feature_enrollment table
DROP POLICY IF EXISTS "Admins can view all enrollments" ON user_feature_enrollment;
CREATE POLICY "Admins can view all enrollments" ON user_feature_enrollment FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 3. user_feature_overrides table
DROP POLICY IF EXISTS "Admins can manage overrides" ON user_feature_overrides;
CREATE POLICY "Admins can manage overrides" ON user_feature_overrides FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 4. permissions table
DROP POLICY IF EXISTS "Admins can manage permissions" ON permissions;
CREATE POLICY "Admins can manage permissions" ON permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 5. role_permissions table
DROP POLICY IF EXISTS "Admins can manage role permissions" ON role_permissions;
CREATE POLICY "Admins can manage role permissions" ON role_permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 6. user_custom_permissions table
DROP POLICY IF EXISTS "Admins can manage user custom permissions" ON user_custom_permissions;
CREATE POLICY "Admins can manage user custom permissions" ON user_custom_permissions FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 7. wellness_goals
DROP POLICY IF EXISTS "Admins manage all goals" ON wellness_goals;
CREATE POLICY "Admins manage all goals" ON wellness_goals FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Admin', 'admin', 'super_admin', 'therapist') OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
);

-- 8. identity_verifications
DROP POLICY IF EXISTS "Admins manage verifications" ON identity_verifications;
CREATE POLICY "Admins manage verifications" ON identity_verifications FOR ALL USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('Admin', 'admin', 'super_admin') OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
);

-- 9. plan_definition
DROP POLICY IF EXISTS "Admins can manage plan definitions" ON plan_definition;
CREATE POLICY "Admins can manage plan definitions" ON plan_definition
    FOR ALL USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

DROP POLICY IF EXISTS "Therapists can view plan definitions" ON plan_definition;
CREATE POLICY "Therapists can view plan definitions" ON plan_definition
    FOR SELECT TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
    );

-- 10. user_plan
DROP POLICY IF EXISTS "Admins can manage user plans" ON user_plan;
CREATE POLICY "Admins can manage user plans" ON user_plan
    FOR ALL USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
    );

DROP POLICY IF EXISTS "Therapists can view user plans" ON user_plan;
CREATE POLICY "Therapists can view user plans" ON user_plan
    FOR SELECT TO authenticated USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin', 'therapist')
    );
