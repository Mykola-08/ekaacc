# EKA Database Configuration & Features

## Overview

The EKA Account application uses **Supabase (PostgreSQL)** as its primary database with a comprehensive schema designed for a wellness platform. This document provides the complete database setup configuration and feature overview.

## Database Architecture

### Core Design Principles
- **Row Level Security (RLS)** enabled on all tables
- **UUID-based** primary keys for global uniqueness
- **Timestamp tracking** with automatic `created_at` and `updated_at`
- **Soft deletes** where appropriate for data integrity
- **Normalized structure** with proper foreign key relationships
- **JSONB fields** for flexible metadata storage

## Database Features

### 🔐 Authentication & User Management
**Purpose**: Secure user authentication with role-based access control

**Key Tables**:
- `user_profiles` - Extended user information beyond Supabase Auth
- `user_roles` - Role definitions (admin, user, moderator, therapist)
- `user_role_assignments` - User-to-role mappings
- `permissions` - Granular permission definitions
- `role_permissions` - Role-to-permission mappings
- `user_preferences` - User settings and preferences
- `audit_logs` - Security audit trail

**Features**:
- Multi-role support (users can have multiple roles)
- Granular permissions system
- Automatic profile creation on signup
- Comprehensive audit logging
- GDPR-compliant data handling

### 💳 Subscription & Payment System
**Purpose**: Handle subscription tiers, payments, and billing

**Key Tables**:
- `subscription_tiers` - Subscription plan definitions
- `user_subscriptions` - Active user subscriptions
- `products` - Bookable services and products
- `wallets` - User credit system
- `wallet_transactions` - Transaction history
- `purchasable_items` - Available items for purchase

**Features**:
- 4-tier subscription system (Free, Basic, Premium, Enterprise)
- Stripe integration for payment processing
- Wallet/credit system for internal payments
- Usage limits and feature gating
- Automatic subscription management

### 👨‍⚕️ Therapist & Booking System
**Purpose**: Connect therapists with clients and manage appointments

**Key Tables**:
- `therapist_profiles` - Extended therapist information
- `bookings` - Appointment scheduling
- `sessions` - Completed therapy sessions
- `therapist_availability` - Schedule management

**Features**:
- Square integration for booking management
- Therapist availability scheduling
- Session notes and progress tracking
- Multi-duration appointment support
- Automated booking confirmations

### 📊 Wellness & Activity Tracking
**Purpose**: Track user wellness journey and progress

**Key Tables**:
- `journal_entries` - Daily mood and thought tracking
- `goals` - User wellness objectives
- `progress_entries` - Goal progress tracking
- `mood_logs` - Daily mood scoring
- `activities` - User exercises and activities

**Features**:
- Mood tracking (1-10 scale with text descriptions)
- Goal setting with progress percentages
- Private/public journal entries
- Tag-based organization
- Timeline-based activity tracking

### 💬 Communication & Community
**Purpose**: Facilitate user interaction and community building

**Key Tables**:
- `messages` - User-to-user messaging
- `notifications` - System notifications
- `community_posts` - Forum posts and discussions
- `post_comments` - Community post comments
- `post_reactions` - Likes and reactions

**Features**:
- Threaded messaging system
- Rich notification system
- Community forums with moderation
- Reaction system for engagement
- Read receipts and timestamps

### 🏆 Loyalty & Referral System
**Purpose**: Gamify user engagement and reward participation

**Key Tables**:
- `loyalty_points` - User point balances
- `loyalty_transactions` - Point earning/spending history
- `referrals` - User referral tracking
- `rewards` - Available rewards catalog
- `reward_redemptions` - Redeemed rewards

**Features**:
- 4-tier loyalty system (Bronze, Silver, Gold, Platinum)
- Point-based reward system
- Referral tracking with rewards
- Automatic tier upgrades
- Reward redemption management

### 📈 Analytics & Admin
**Purpose**: Provide insights and administrative controls

**Key Tables**:
- `tier_audit_logs` - Subscription tier change tracking
- `promotional_page_views` - Marketing analytics
- `user_behavioral_data` - User behavior insights
- `ai_personalization_data` - AI model training data

**Features**:
- Comprehensive audit trails
- User behavior analytics
- Promotional campaign tracking
- AI personalization data storage
- Admin dashboard data

### 🎯 Onboarding & Personalization
**Purpose**: Guide new users and personalize their experience

**Key Tables**:
- `onboarding_progress` - User onboarding completion tracking
- `community_categories` - Forum organization

**Features**:
- Multi-step onboarding flow
- Personalized recommendations
- Community category organization
- Progress tracking and guidance

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Admins have full system access
- Therapists can access their clients' data
- Public data is appropriately accessible

### Data Protection
- **Encryption at rest** and in transit
- **GDPR compliance** with data deletion capabilities
- **Audit logging** for all sensitive operations
- **Role-based access control** with granular permissions
- **Automatic data anonymization** for analytics

## Performance Features

### Indexing Strategy
- Primary keys on all tables
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- Full-text search indexes where applicable
- Partial indexes for filtered queries

### Optimization
- **Connection pooling** via Supabase
- **Query optimization** with proper indexing
- **Data partitioning** for large tables
- **Automated vacuuming** and maintenance
- **Real-time subscriptions** where needed

## Integration Features

### Third-Party Integrations
- **Stripe** - Payment processing and subscription management
- **Square** - Booking and appointment scheduling
- **Supabase Auth** - Authentication and user management
- **OpenAI/Anthropic** - AI services for personalization

### API Support
- **RESTful endpoints** for all major operations
- **GraphQL support** via Supabase
- **Webhook support** for real-time updates
- **Rate limiting** and security middleware

## Setup Instructions

### Prerequisites
- Supabase project created
- Database access credentials
- PostgreSQL 14+ or Supabase instance

### Quick Setup
```bash
# Using Supabase CLI
supabase db reset  # Runs all migrations

# Or run migrations manually
cd supabase/migrations
supabase migration new your_migration_name
```

### Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Payment Integrations
STRIPE_SECRET_KEY=your_stripe_secret_key
SQUARE_ACCESS_TOKEN=your_square_token

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Migration Files

The database schema is managed through migration files in `supabase/migrations/`:

1. **20241117_drop_existing_functions.sql** - Cleanup existing functions
2. **20241117_drop_auth_tables.sql** - Remove old auth tables
3. **20241117_create_clean_auth_schema.sql** - Create clean auth schema
4. **20241116_missing_core_tables.sql** - Core application tables
5. **20241116_missing_tables.sql** - Additional feature tables
6. **20241116_promotional_pages.sql** - Marketing analytics tables
7. **20241116_community_posts.sql** - Community forum tables

## Maintenance & Monitoring

### Regular Tasks
- **Weekly**: VACUUM ANALYZE for performance
- **Monthly**: Index usage analysis
- **Quarterly**: Security audit and permission review
- **As needed**: Migration application and backup verification

### Monitoring
- Query performance monitoring
- Connection pool utilization
- Storage usage tracking
- Error rate monitoring
- Security event logging

## Backup & Recovery

### Automated Backups
- Daily automated backups via Supabase
- Point-in-time recovery capability
- Cross-region backup replication

### Manual Backup
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Using pg_dump
pg_dump -h [host] -U [user] -d [database] > backup_$(date +%Y%m%d).sql
```

---

**Database Version**: PostgreSQL 14+  
**Application Version**: 0.1.0  
**Last Updated**: 2024-11-18  
**Schema Complexity**: 21+ tables with full RLS and integrations