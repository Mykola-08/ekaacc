# Database Requirements for EKA Account Application

This document outlines all database tables, columns, and relationships required for the application to function properly.

## Core Authentication Tables

### 1. `user_profiles`
Stores extended user profile information beyond Supabase auth.

**Required Columns:**
- `id` (uuid, PRIMARY KEY) - References auth.users(id)
- `username` (text, UNIQUE, NULLABLE) - User's chosen username
- `full_name` (text, NULLABLE) - User's full name
- `avatar_url` (text, NULLABLE) - URL to user's avatar image
- `bio` (text, NULLABLE) - User biography
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `username` for quick lookups
- Foreign key to `auth.users(id)` ON DELETE CASCADE

### 2. `user_roles`
Defines available roles in the system.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `name` (text, UNIQUE, NOT NULL) - Role name (e.g., 'user', 'admin', 'moderator', 'therapist')
- `description` (text, NULLABLE) - Role description
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Default Data:**
```sql
INSERT INTO user_roles (name, description) VALUES
  ('user', 'Default user role'),
  ('admin', 'Administrator with full access'),
  ('moderator', 'Moderator with content management access'),
  ('therapist', 'Therapist with client management access');
```

### 3. `user_role_assignments`
Maps users to their roles.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `role_id` (uuid, NOT NULL) - References user_roles(id)
- `assigned_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `assigned_by` (uuid, NULLABLE) - References auth.users(id) - who assigned the role

**Indexes:**
- Unique index on (user_id, role_id)
- Foreign keys with ON DELETE CASCADE

### 4. `permissions`
Defines granular permissions available in the system.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `name` (text, UNIQUE, NOT NULL) - Permission name (e.g., 'users.read', 'users.write')
- `description` (text, NULLABLE)
- `resource` (text, NOT NULL) - Resource name (e.g., 'users', 'content', 'admin')
- `action` (text, NOT NULL) - Action type (e.g., 'read', 'write', 'delete')
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Default Data:**
```sql
INSERT INTO permissions (name, resource, action, description) VALUES
  ('users.read', 'users', 'read', 'View user information'),
  ('users.write', 'users', 'write', 'Create and update users'),
  ('users.delete', 'users', 'delete', 'Delete users'),
  ('content.read', 'content', 'read', 'View content'),
  ('content.write', 'content', 'write', 'Create and update content'),
  ('content.delete', 'content', 'delete', 'Delete content'),
  ('admin.access', 'admin', 'access', 'Access admin panel'),
  ('roles.read', 'roles', 'read', 'View roles and permissions'),
  ('roles.write', 'roles', 'write', 'Manage roles and permissions'),
  ('roles.delete', 'roles', 'delete', 'Delete roles');
```

### 5. `role_permissions`
Maps roles to permissions.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `role_id` (uuid, NOT NULL) - References user_roles(id)
- `permission_id` (uuid, NOT NULL) - References permissions(id)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Unique index on (role_id, permission_id)
- Foreign keys with ON DELETE CASCADE

### 6. `user_preferences`
Stores user preferences and settings.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, UNIQUE, NOT NULL) - References auth.users(id)
- `theme` (text, NOT NULL, DEFAULT 'system') - Theme preference ('light', 'dark', 'system')
- `language` (text, NOT NULL, DEFAULT 'en') - Language code
- `timezone` (text, NOT NULL, DEFAULT 'UTC') - User's timezone
- `email_notifications` (boolean, NOT NULL, DEFAULT true)
- `push_notifications` (boolean, NOT NULL, DEFAULT true)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Foreign key to `auth.users(id)` ON DELETE CASCADE

## Subscription & Payment Tables

### 7. `subscription_tiers`
Defines available subscription tiers.

**Required Columns:**
- `id` (text, PRIMARY KEY) - Tier ID (e.g., 'free', 'basic', 'premium', 'enterprise')
- `name` (text, NOT NULL) - Display name
- `description` (text, NULLABLE)
- `price_monthly` (decimal(10,2), NOT NULL) - Monthly price
- `price_yearly` (decimal(10,2), NOT NULL) - Yearly price
- `features` (jsonb, NOT NULL, DEFAULT '[]') - Array of features
- `limits` (jsonb, NOT NULL, DEFAULT '{}') - Usage limits
- `is_active` (boolean, NOT NULL, DEFAULT true)
- `sort_order` (integer, NOT NULL, DEFAULT 0) - Display order
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

### 8. `user_subscriptions`
Tracks user subscription status.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `tier_id` (text, NOT NULL) - References subscription_tiers(id)
- `status` (text, NOT NULL) - 'active', 'canceled', 'expired', 'trial'
- `stripe_subscription_id` (text, NULLABLE, UNIQUE)
- `stripe_customer_id` (text, NULLABLE)
- `current_period_start` (timestamp with time zone, NOT NULL)
- `current_period_end` (timestamp with time zone, NOT NULL)
- `cancel_at_period_end` (boolean, NOT NULL, DEFAULT false)
- `trial_end` (timestamp with time zone, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `stripe_subscription_id`
- Foreign key to `auth.users(id)` ON DELETE CASCADE

### 9. `products`
Stores product information for booking and purchases.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `name` (text, NOT NULL)
- `description` (text, NULLABLE)
- `price` (decimal(10,2), NOT NULL)
- `currency` (text, NOT NULL, DEFAULT 'eur')
- `category` (text, NULLABLE) - Product category
- `type` (text, NULLABLE) - Product type
- `difficulty` (text, NULLABLE)
- `duration` (integer, NULLABLE) - Duration in minutes
- `images` (text[], NULLABLE)
- `is_active` (boolean, NOT NULL, DEFAULT true)
- `stripe_product_id` (text, NULLABLE, UNIQUE)
- `stripe_price_id` (text, NULLABLE)
- `sync_status` (text, DEFAULT 'pending') - 'pending', 'synced', 'error'
- `sync_error` (text, NULLABLE)
- `last_sync_at` (timestamp with time zone, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `category`
- Index on `is_active`
- Index on `stripe_product_id`

## Therapist & Booking Tables

### 10. `therapist_profiles`
Extended profile for therapist users.

**Required Columns:**
- `id` (uuid, PRIMARY KEY) - References auth.users(id)
- `user_id` (uuid, UNIQUE, NOT NULL) - References auth.users(id)
- `specialization` (text[], NULLABLE) - Areas of specialization
- `bio` (text, NULLABLE)
- `certifications` (jsonb, NULLABLE)
- `availability` (jsonb, NULLABLE) - Availability schedule
- `hourly_rate` (decimal(10,2), NULLABLE)
- `square_team_member_id` (text, NULLABLE) - Square integration
- `is_accepting_clients` (boolean, NOT NULL, DEFAULT true)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Foreign key to `auth.users(id)` ON DELETE CASCADE

### 11. `bookings`
Stores booking/appointment information.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id) - client
- `therapist_id` (uuid, NULLABLE) - References therapist_profiles(user_id)
- `product_id` (uuid, NULLABLE) - References products(id)
- `date` (timestamp with time zone, NOT NULL)
- `duration_minutes` (integer, NOT NULL, DEFAULT 60)
- `status` (text, NOT NULL, DEFAULT 'pending') - 'pending', 'confirmed', 'completed', 'canceled'
- `source` (text, NOT NULL, DEFAULT 'app') - 'app', 'square', 'manual'
- `square_booking_id` (text, NULLABLE, UNIQUE)
- `notes` (text, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `therapist_id`
- Index on `date`
- Index on `status`
- Foreign keys with appropriate cascades

### 12. `sessions`
Tracks therapy/wellness sessions.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `therapist_id` (uuid, NULLABLE) - References therapist_profiles(user_id)
- `booking_id` (uuid, NULLABLE) - References bookings(id)
- `title` (text, NOT NULL)
- `notes` (text, NULLABLE)
- `session_date` (timestamp with time zone, NOT NULL)
- `duration_minutes` (integer, NOT NULL)
- `type` (text, NULLABLE) - Session type
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

## User Activity & Content Tables

### 13. `journal_entries`
User journal/mood tracking entries.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `title` (text, NULLABLE)
- `content` (text, NOT NULL)
- `mood` (text, NULLABLE) - Mood indicator
- `mood_score` (integer, NULLABLE) - Numeric mood score (1-10)
- `tags` (text[], NULLABLE)
- `is_private` (boolean, NOT NULL, DEFAULT true)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `created_at` DESC
- Foreign key to `auth.users(id)` ON DELETE CASCADE

### 14. `goals`
User wellness goals.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `title` (text, NOT NULL)
- `description` (text, NULLABLE)
- `category` (text, NULLABLE)
- `target_date` (timestamp with time zone, NULLABLE)
- `status` (text, NOT NULL, DEFAULT 'active') - 'active', 'completed', 'abandoned'
- `progress` (integer, NOT NULL, DEFAULT 0) - Percentage 0-100
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `status`

### 15. `progress_entries`
Tracks progress toward goals.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `goal_id` (uuid, NOT NULL) - References goals(id)
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `value` (decimal(10,2), NOT NULL) - Progress value
- `notes` (text, NULLABLE)
- `recorded_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `goal_id`
- Index on `recorded_at`
- Foreign key to `goals(id)` ON DELETE CASCADE

### 16. `messages`
User messaging system.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `sender_id` (uuid, NOT NULL) - References auth.users(id)
- `recipient_id` (uuid, NOT NULL) - References auth.users(id)
- `subject` (text, NULLABLE)
- `body` (text, NOT NULL)
- `is_read` (boolean, NOT NULL, DEFAULT false)
- `read_at` (timestamp with time zone, NULLABLE)
- `parent_message_id` (uuid, NULLABLE) - References messages(id) for threads
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `sender_id`
- Index on `recipient_id`
- Index on `is_read`
- Index on `created_at` DESC

## Loyalty & Referral Tables

### 17. `loyalty_points`
Tracks user loyalty points.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `points` (integer, NOT NULL, DEFAULT 0)
- `tier` (text, NOT NULL, DEFAULT 'bronze') - 'bronze', 'silver', 'gold', 'platinum'
- `lifetime_points` (integer, NOT NULL, DEFAULT 0)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Unique index on `user_id`
- Index on `tier`

### 18. `loyalty_transactions`
Log of point transactions.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `points` (integer, NOT NULL) - Can be positive or negative
- `reason` (text, NOT NULL)
- `reference_id` (uuid, NULLABLE) - Reference to related entity
- `reference_type` (text, NULLABLE) - Type of reference (e.g., 'booking', 'referral')
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `created_at` DESC

### 19. `referrals`
Tracks user referrals.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `referrer_id` (uuid, NOT NULL) - References auth.users(id)
- `referred_id` (uuid, NULLABLE) - References auth.users(id)
- `referral_code` (text, UNIQUE, NOT NULL)
- `status` (text, NOT NULL, DEFAULT 'pending') - 'pending', 'completed', 'rewarded'
- `reward_points` (integer, NULLABLE)
- `completed_at` (timestamp with time zone, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `referrer_id`
- Index on `referred_id`
- Unique index on `referral_code`

## Admin & Analytics Tables

### 20. `tier_audit_logs`
Audit log for tier assignments and changes.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, NOT NULL) - References auth.users(id)
- `tier_id` (text, NOT NULL)
- `action` (text, NOT NULL) - 'assigned', 'revoked', 'upgraded', 'downgraded'
- `performed_by` (uuid, NOT NULL) - References auth.users(id)
- `reason` (text, NULLABLE)
- `metadata` (jsonb, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Index on `user_id`
- Index on `performed_by`
- Index on `created_at` DESC

## Onboarding Tables

### 21. `onboarding_progress`
Tracks user onboarding completion.

**Required Columns:**
- `id` (uuid, PRIMARY KEY, DEFAULT uuid_generate_v4())
- `user_id` (uuid, UNIQUE, NOT NULL) - References auth.users(id)
- `current_step` (integer, NOT NULL, DEFAULT 1)
- `total_steps` (integer, NOT NULL, DEFAULT 8)
- `is_complete` (boolean, NOT NULL, DEFAULT false)
- `onboarding_type` (text, NOT NULL) - 'quick', 'deep'
- `responses` (jsonb, NULLABLE) - User's onboarding responses
- `completed_at` (timestamp with time zone, NULLABLE)
- `created_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())
- `updated_at` (timestamp with time zone, NOT NULL, DEFAULT NOW())

**Indexes:**
- Unique index on `user_id`
- Foreign key to `auth.users(id)` ON DELETE CASCADE

## Row Level Security (RLS) Policies

All tables should have RLS enabled and appropriate policies:

### Example RLS Policies:

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- User profiles - users can read their own and others' public data
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- User preferences - users can only access their own
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN user_roles ur ON ura.role_id = ur.id
      WHERE ura.user_id = auth.uid() AND ur.name = 'admin'
    )
  );
```

## Triggers

### Automatic timestamp updates:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... repeat for other tables
```

### Auto-create user profile on signup:

```sql
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO user_role_assignments (user_id, role_id)
  SELECT NEW.id, id FROM user_roles WHERE name = 'user';
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

## Required Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Notes

1. All `user_id` columns should reference `auth.users(id)` from Supabase Auth
2. All tables should have appropriate indexes for performance
3. Foreign keys should have ON DELETE CASCADE or SET NULL as appropriate
4. JSONB columns are used for flexible data storage (features, metadata, etc.)
5. Timestamps should use `timestamp with time zone` for proper timezone handling
6. All monetary values use `decimal(10,2)` for precision
7. Enum-like values are stored as `text` with application-level validation
8. RLS policies must be configured for security
9. Triggers handle automatic profile creation and timestamp updates
