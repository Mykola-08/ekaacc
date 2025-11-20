# Database Modifications Required

## Overview
This document details all database modifications that need to be applied to make the EKA Account application fully functional. Apply these changes in the order specified.

## Prerequisites
- PostgreSQL 14+ or Supabase project
- Database administrator access
- psql CLI or Supabase dashboard access

---

## Step 1: Run Existing Migrations (In Order)

### 1.1 Drop Existing Functions
```bash
psql $DATABASE_URL -f supabase/migrations/20241117_drop_existing_functions.sql
```

### 1.2 Drop Old Auth Tables  
```bash
psql $DATABASE_URL -f supabase/migrations/20241117_drop_auth_tables.sql
```

### 1.3 Create Clean Auth Schema
```bash
psql $DATABASE_URL -f supabase/migrations/20241117_create_clean_auth_schema.sql
```

**This creates:**
- `user_profiles` - Extended user information
- `user_roles` - Role definitions (admin, user, moderator, therapist)
- `user_role_assignments` - User-role mapping
- `permissions` - Granular permissions
- `role_permissions` - Role-permission mapping
- `user_preferences` - User settings (theme, language, notifications)
- `audit_logs` - Security audit trail

**Triggers created:**
- `on_auth_user_created` - Auto-creates profile, preferences, default role on signup
- `update_user_profiles_updated_at` - Auto-updates timestamps
- `update_user_preferences_updated_at` - Auto-updates timestamps

### 1.4 Create Core Tables
```bash
psql $DATABASE_URL -f supabase/migrations/20241116_missing_core_tables.sql
```

**This creates:**
- `wallets` - User financial accounts
- `wallet_transactions` - Transaction history
- `purchasable_items` - Available items/services
- `subscription_tiers` - Plan definitions
- `user_subscriptions` - Active subscriptions
- `products` - Bookable services
- `therapist_profiles` - Extended therapist info
- `therapist_availability` - Schedule management
- `bookings` - Session bookings
- `sessions` - Completed sessions
- `journal_entries` - User diary/journal
- `goals` - User wellness goals
- `progress_entries` - Goal progress tracking
- `mood_logs` - Daily mood tracking
- `activities` - User activities
- `messages` - User messaging
- `notifications` - System notifications
- `loyalty_points` - Loyalty program balances
- `loyalty_transactions` - Point movements
- `referrals` - Referral tracking
- `rewards` - Available rewards
- `reward_redemptions` - Claimed rewards

### 1.5 Create Additional Missing Tables
```bash
psql $DATABASE_URL -f supabase/migrations/20241116_missing_tables.sql
```

### 1.6 Create Promotional Tables
```bash
psql $DATABASE_URL -f supabase/migrations/20241116_promotional_pages.sql
```

**This creates:**
- `promotional_page_views` - Marketing analytics
- `user_behavioral_data` - Behavior tracking
- `ai_personalization_data` - AI preferences

### 1.7 Create Community Tables
```bash
psql $DATABASE_URL -f supabase/migrations/20241116_community_posts.sql
```

**This creates:**
- `community_categories` - Forum categories
- `community_posts` - User posts
- `post_comments` - Comments on posts
- `post_reactions` - Likes/reactions

---

## Step 2: Seed Initial Data

### 2.1 Default Roles (Already in migration)
The auth migration creates these roles automatically:
- **admin**: Full system access
- **user**: Regular user permissions
- **moderator**: Content moderation
- **therapist**: Client management

### 2.2 Subscription Tiers
```sql
INSERT INTO subscription_tiers (id, name, description, price_monthly, price_yearly, features, limits, is_active)
VALUES
  ('free', 'Free', 'Basic wellness features', 0.00, 0.00, 
   '["Mood tracking (10 entries/month)", "Basic journal (10 entries)", "Community access"]'::jsonb,
   '{"mood_logs": 10, "journal_entries": 10, "ai_insights": 3}'::jsonb, true),
   
  ('basic', 'Basic', 'Essential wellness toolkit', 9.99, 99.00,
   '["Unlimited mood tracking", "Unlimited journaling", "AI insights (50/month)", "Goal tracking", "Progress reports"]'::jsonb,
   '{"mood_logs": -1, "journal_entries": -1, "ai_insights": 50}'::jsonb, true),
   
  ('premium', 'Premium', 'Full platform access', 19.99, 199.00,
   '["All Basic features", "Unlimited AI insights", "Therapist booking", "Priority support", "Advanced analytics", "Group sessions"]'::jsonb,
   '{"mood_logs": -1, "journal_entries": -1, "ai_insights": -1, "bookings": -1}'::jsonb, true),
   
  ('enterprise', 'Enterprise', 'For organizations', 49.99, 499.00,
   '["All Premium features", "Team management (50 members)", "Custom integrations", "Dedicated support", "Custom branding", "Advanced reporting"]'::jsonb,
   '{"mood_logs": -1, "journal_entries": -1, "ai_insights": -1, "bookings": -1, "team_members": 50}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;
```

### 2.3 Therapy Services/Products
```sql
INSERT INTO products (name, description, price, currency, category, type, duration_minutes, is_active)
VALUES
  ('Initial Consultation', '60-minute consultation session with therapist', 80.00, 'EUR', 'therapy', 'session', 60, true),
  ('Individual Therapy', 'Standard one-on-one therapy session', 75.00, 'EUR', 'therapy', 'session', 50, true),
  ('Cognitive Behavioral Therapy', 'CBT techniques and exercises', 100.00, 'EUR', 'therapy', 'session', 60, true),
  ('Wellness & Mindfulness', 'Holistic mindfulness session', 65.00, 'EUR', 'wellness', 'session', 45, true),
  ('Couples Therapy', 'Relationship counseling session', 120.00, 'EUR', 'therapy', 'session', 90, true),
  ('Group Session', 'Small group therapy (4-6 people)', 45.00, 'EUR', 'therapy', 'session', 90, true),
  ('Specialist Consultation', 'Expert assessment and treatment plan', 140.00, 'EUR', 'therapy', 'session', 75, true),
  ('Follow-up Session', 'Quick check-in session', 50.00, 'EUR', 'therapy', 'session', 30, true)
ON CONFLICT DO NOTHING;
```

### 2.4 Community Categories
```sql
INSERT INTO community_categories (name, description, color, icon)
VALUES
  ('General Discussion', 'General wellness topics and conversations', '#3B82F6', 'message-circle'),
  ('Success Stories', 'Share your wins and progress', '#10B981', 'trophy'),
  ('Questions & Support', 'Ask the community for help', '#F59E0B', 'help-circle'),
  ('Resources', 'Helpful resources and tools', '#8B5CF6', 'book-open'),
  ('Motivation', 'Inspiration and encouragement', '#EC4899', 'sparkles'),
  ('Techniques & Tips', 'Share wellness techniques', '#06B6D4', 'lightbulb')
ON CONFLICT DO NOTHING;
```

### 2.5 Loyalty Program Rewards
```sql
INSERT INTO rewards (name, description, points_required, reward_type, reward_value, is_active)
VALUES
  ('Free Session', 'One free therapy session', 1000, 'session_credit', '1', true),
  ('Premium Month', 'One month of Premium subscription', 2000, 'subscription_upgrade', 'premium_30', true),
  ('€10 Credit', 'Account credit for any service', 500, 'wallet_credit', '10', true),
  ('€25 Credit', 'Account credit for any service', 1200, 'wallet_credit', '25', true),
  ('Priority Booking', '7 days of priority booking access', 800, 'feature_unlock', 'priority_booking_7', true)
ON CONFLICT DO NOTHING;
```

---

## Step 3: Create First Admin User

After a user signs up through the app:

```sql
-- Replace 'user-uuid-here' with actual user UUID from auth.users
INSERT INTO user_role_assignments (user_id, role_id)
SELECT 
  'user-uuid-here'::uuid, 
  id 
FROM user_roles 
WHERE name = 'admin';
```

---

## Step 4: Verify Installation

### 4.1 Check All Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected tables (21+):**
- activities
- audit_logs
- bookings
- community_categories
- community_posts
- goals
- journal_entries
- loyalty_points
- loyalty_transactions
- messages
- mood_logs
- notifications
- permissions
- post_comments
- post_reactions
- products
- progress_entries
- promotional_page_views
- purchasable_items
- referrals
- reward_redemptions
- rewards
- role_permissions
- sessions
- subscription_tiers
- therapist_availability
- therapist_profiles
- user_behavioral_data
- user_preferences
- user_profiles
- user_role_assignments
- user_roles
- user_subscriptions
- wallet_transactions
- wallets

### 4.2 Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true
ORDER BY tablename;
```

All tables should have RLS enabled.

### 4.3 Check Triggers
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected triggers:**
- `on_auth_user_created` on `auth.users`
- `update_user_profiles_updated_at` on `user_profiles`
- `update_user_preferences_updated_at` on `user_preferences`

### 4.4 Check Default Data
```sql
-- Check roles
SELECT * FROM user_roles;
-- Should show: admin, user, moderator, therapist

-- Check permissions  
SELECT COUNT(*) FROM permissions;
-- Should have 10+ permissions

-- Check subscription tiers
SELECT id, name, price_monthly FROM subscription_tiers;
-- Should show: free, basic, premium, enterprise

-- Check products
SELECT name, price, duration_minutes FROM products WHERE is_active = true;
-- Should show 8 therapy services
```

---

## Step 5: Optional Configurations

### 5.1 Adjust Booking Time Slots
Edit therapist availability to match your business hours:

```sql
-- Example: Set availability for a therapist
INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time, is_available)
SELECT 
  t.user_id,
  generate_series(1, 5) as day_of_week, -- Monday to Friday
  '09:00'::time,
  '17:00'::time,
  true
FROM therapist_profiles t;
```

### 5.2 Configure Notification Preferences
Default notification settings are created automatically. Adjust defaults if needed:

```sql
UPDATE user_preferences 
SET 
  email_notifications = true,
  push_notifications = true
WHERE user_id IS NOT NULL;
```

### 5.3 Set Up Promotional Tracking
No action needed - tables are created and will be populated as users interact with the app.

---

## Step 6: Backup & Maintenance

### 6.1 Set Up Automated Backups
```bash
# Using Supabase CLI
supabase db dump -f backups/backup_$(date +%Y%m%d).sql

# Or with pg_dump
pg_dump $DATABASE_URL > backups/backup_$(date +%Y%m%d).sql
```

### 6.2 Schedule Regular Maintenance
```sql
-- Run weekly
VACUUM ANALYZE;

-- Check table sizes monthly
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Troubleshooting

### Issue: Migration fails with "relation already exists"
**Solution:** Tables may already exist. Check and drop if necessary:
```sql
DROP TABLE IF EXISTS table_name CASCADE;
```
Then rerun the migration.

### Issue: RLS blocks all access
**Solution:** Check if user has proper role assignment:
```sql
SELECT u.email, r.name as role
FROM auth.users u
LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN user_roles r ON ura.role_id = r.id
WHERE u.id = 'user-uuid';
```

### Issue: Trigger not firing
**Solution:** Verify trigger exists and is enabled:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## Post-Installation Checklist

- [ ] All migrations run successfully
- [ ] All 30+ tables created
- [ ] RLS enabled on all tables
- [ ] Default roles and permissions exist
- [ ] Subscription tiers created
- [ ] Products/services added
- [ ] Community categories set up
- [ ] First admin user created
- [ ] Triggers functioning (test by creating a user)
- [ ] Backup schedule configured
- [ ] Database performance optimized (indexes, vacuum)

---

## Security Notes

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in client code
2. **Always use Row Level Security** - Enabled on all tables
3. **Rotate credentials regularly** - Every 90 days recommended
4. **Monitor audit logs** - Check for suspicious activity
5. **Backup before major changes** - Always have a restore point

---

## Quick Reference Commands

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT version();"

# List all tables
psql $DATABASE_URL -c "\dt"

# Check table structure
psql $DATABASE_URL -c "\d table_name"

# View recent audit logs
psql $DATABASE_URL -c "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;"

# Count users by role
psql $DATABASE_URL -c "SELECT r.name, COUNT(*) FROM user_role_assignments ura JOIN user_roles r ON ura.role_id = r.id GROUP BY r.name;"
```

---

**Document Version:** 1.0  
**Last Updated:** 2024-11-17  
**Compatible With:** EKA Account v0.1.0
