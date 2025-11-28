# Database Setup Guide for EKA Account Application

## Overview
This document provides step-by-step instructions for setting up the complete database schema for the EKA Account application. The database is built on Supabase (PostgreSQL) and includes comprehensive tables for authentication, user management, subscriptions, bookings, wellness tracking, and more.

## Prerequisites
- Supabase project created
- Database access credentials
- PostgreSQL 14+ or Supabase instance

## Quick Start

### 1. Run Existing Migrations
The following migrations are already created and should be run in order:

```bash
# Navigate to migrations folder
cd supabase/migrations

# Run migrations in order
psql -h [your-host] -U [your-user] -d [your-db] -f 20241117_drop_existing_functions.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241117_drop_auth_tables.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241117_create_clean_auth_schema.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241116_missing_core_tables.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241116_missing_tables.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241116_promotional_pages.sql
psql -h [your-host] -U [your-user] -d [your-db] -f 20241116_community_posts.sql
```

**Or using Supabase CLI:**
```bash
supabase db reset  # This will run all migrations
```

## Database Schema Overview

### Core Authentication & User Management
**Tables Created:**
- `user_profiles` - Extended user profile information
- `user_roles` - Role definitions (admin, user, moderator, therapist)
- `user_role_assignments` - User-role mapping
- `permissions` - Granular permission definitions
- `role_permissions` - Role-permission mapping
- `user_preferences` - User settings and preferences
- `audit_logs` - Security and action audit trail

**Default Roles:**
- **admin**: Full system access
- **user**: Basic user permissions
- **moderator**: Content management permissions
- **therapist**: Client management permissions

### Subscription & Payment System
**Tables Created:**
- `subscription_tiers` - Available subscription plans
- `user_subscriptions` - Active user subscriptions
- `products` - Bookable services and products
- `wallets` - User wallet/credit system
- `wallet_transactions` - Transaction history
- `purchasable_items` - Available items for purchase

**Subscription Tiers to Seed:**
```sql
INSERT INTO subscription_tiers (id, name, description, price_monthly, price_yearly, features, limits) VALUES
('free', 'Free', 'Basic features for getting started', 0.00, 0.00, 
 '["Basic mood tracking", "Limited journal entries", "Basic insights"]'::jsonb,
 '{"journal_entries": 10, "ai_insights": 5}'::jsonb),
('basic', 'Basic', 'Essential wellness features', 9.99, 99.99,
 '["Unlimited mood tracking", "Unlimited journal entries", "AI insights", "Goal tracking"]'::jsonb,
 '{"journal_entries": -1, "ai_insights": 50}'::jsonb),
('premium', 'Premium', 'Full platform access', 19.99, 199.99,
 '["All Basic features", "Unlimited AI insights", "Priority support", "Advanced analytics", "Therapist booking"]'::jsonb,
 '{"journal_entries": -1, "ai_insights": -1}'::jsonb),
('enterprise', 'Enterprise', 'For organizations', 49.99, 499.99,
 '["All Premium features", "Custom integrations", "Dedicated support", "Team management", "Custom branding"]'::jsonb,
 '{"journal_entries": -1, "ai_insights": -1, "team_members": 50}'::jsonb);
```

### Therapist & Booking System
**Tables Created:**
- `therapist_profiles` - Extended therapist information
- `bookings` - Appointment/session bookings
- `sessions` - Completed therapy sessions
- `therapist_availability` - Therapist schedule

**Integration Points:**
- Square API for payment processing
- Stripe API for subscription management
- Calendar sync capabilities

### Wellness & Activity Tracking
**Tables Created:**
- `journal_entries` - User journal/diary entries
- `goals` - User wellness goals
- `progress_entries` - Progress tracking for goals
- `mood_logs` - Daily mood tracking
- `activities` - User activities and exercises

**Features:**
- Privacy controls (entries can be private)
- Tagging system for organization
- Mood scoring (1-10 scale)
- Progress percentage tracking

### Communication & Engagement
**Tables Created:**
- `messages` - User-to-user messaging
- `notifications` - System notifications
- `community_posts` - Community forum posts
- `post_comments` - Comments on community posts
- `post_reactions` - Reactions/likes on posts

**Message Threading:**
- Supports conversation threads via `parent_message_id`
- Read receipts and timestamps
- Subject lines for organization

### Loyalty & Referral System
**Tables Created:**
- `loyalty_points` - User loyalty point balances
- `loyalty_transactions` - Point transaction history
- `referrals` - Referral tracking
- `rewards` - Available rewards catalog
- `reward_redemptions` - Redeemed rewards

**Loyalty Tiers:**
- Bronze (default)
- Silver (1000+ points)
- Gold (5000+ points)
- Platinum (10000+ points)

### Analytics & Admin
**Tables Created:**
- `tier_audit_logs` - Subscription tier changes
- `promotional_page_views` - Marketing analytics
- `user_behavioral_data` - User behavior tracking
- `ai_personalization_data` - AI model data

## Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Admins have full access
- Therapists can access their clients' data
- Public data is appropriately accessible

**Example RLS Policy:**
```sql
-- Users can view their own data
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all data
CREATE POLICY "Admins can view all" ON table_name
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.name = 'admin'
    )
  );
```

## Automatic Data Population

### Triggers
The following triggers are automatically set up:

1. **User Profile Creation** - When a user signs up:
   - Creates `user_profiles` entry
   - Creates `user_preferences` entry
   - Assigns default 'user' role
   - Creates audit log entry

2. **Timestamp Updates** - Automatically updates `updated_at` columns

3. **Wallet Creation** - Creates wallet on first subscription

### Functions
Key database functions created:
- `handle_new_user()` - User signup automation
- `update_auth_updated_at_column()` - Timestamp management
- `check_user_permission()` - Permission verification

## Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Square Configuration (for bookings)
SQUARE_ACCESS_TOKEN=your_square_token
SQUARE_ENVIRONMENT=sandbox # or production

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_key

# Anthropic (for Claude AI)
ANTHROPIC_API_KEY=your_anthropic_key

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:9002
NEXT_PUBLIC_API_URL=http://localhost:9002/api
```

## Data Seeding

After running migrations, seed with initial data:

```sql
-- 1. Create first admin user (run after a user signs up)
INSERT INTO user_role_assignments (user_id, role_id)
SELECT '[user-id-from-auth-users]', id 
FROM user_roles WHERE name = 'admin';

-- 2. Add sample products (optional for development)
INSERT INTO products (name, description, price, currency, category, type, duration, is_active)
VALUES 
('Initial Consultation', '60-minute consultation session', 75.00, 'eur', 'therapy', 'session', 60, true),
('Follow-up Session', '45-minute follow-up session', 60.00, 'eur', 'therapy', 'session', 45, true),
('Group Workshop', '2-hour group wellness workshop', 40.00, 'eur', 'workshop', 'session', 120, true);

-- 3. Add sample community categories
INSERT INTO community_categories (name, description, color)
VALUES
('General Discussion', 'General wellness topics', '#3B82F6'),
('Success Stories', 'Share your wins', '#10B981'),
('Questions', 'Ask the community', '#F59E0B'),
('Resources', 'Helpful resources', '#8B5CF6');
```

## Verification Queries

After setup, verify the database:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check default roles
SELECT * FROM user_roles;

-- Check default permissions
SELECT * FROM permissions;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND rowsecurity = false;  -- Should return no rows if all tables have RLS

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## Maintenance & Backup

### Regular Maintenance
```sql
-- Vacuum and analyze (weekly)
VACUUM ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan;
```

### Backup
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or using pg_dump
pg_dump -h [host] -U [user] -d [database] > backup_$(date +%Y%m%d).sql
```

## Common Issues & Solutions

### Issue: RLS prevents access
**Solution:** Check if user has proper role assignments
```sql
SELECT u.email, r.name 
FROM auth.users u
LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN user_roles r ON ura.role_id = r.id
WHERE u.id = '[user-id]';
```

### Issue: Trigger not firing
**Solution:** Check trigger exists and is enabled
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: Foreign key constraint fails
**Solution:** Ensure referenced records exist first
```sql
-- Check if user exists before creating related records
SELECT id FROM auth.users WHERE id = '[user-id]';
```

## Production Considerations

1. **Connection Pooling**: Use Supabase's connection pooling in production
2. **Indexes**: All frequently queried columns are indexed
3. **Monitoring**: Set up query performance monitoring
4. **Backups**: Configure automatic daily backups
5. **Replication**: Consider read replicas for high traffic
6. **Rate Limiting**: Implement at application layer
7. **SSL**: Always use SSL connections in production

## Additional Resources

- Full schema reference: See `DATABASE_REQUIREMENTS.md`
- Migration files: `supabase/migrations/`
- API documentation: See API route files in `src/app/api/`
- Supabase docs: https://supabase.com/docs

## Support

For issues or questions:
1. Check migration logs for errors
2. Review Supabase dashboard logs
3. Verify environment variables are set correctly
4. Ensure database user has proper permissions

---

**Last Updated:** 2024-11-17
**Database Version:** PostgreSQL 14+
**Application Version:** 0.1.0
