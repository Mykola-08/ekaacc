-- STRIPE CUSTOMER INTEGRATION
-- Adds Stripe Customer ID to user profiles for persistent payment linking.

-- 1. Add Column
alter table user_profiles 
add column if not exists stripe_customer_id text;

-- 2. Index for fast lookups (e.g. webhooks finding user by stripe id)
create index if not exists idx_user_profiles_stripe_customer_id 
on user_profiles(stripe_customer_id);

-- 3. Utility Function to Set Stripe ID (securely callable by server/admin)
-- Only admins or the system (via service key) should set this really, 
-- but RLS usually handles "auth.uid() = id".
-- Since this is often set by backend logic, standard update is fine.
