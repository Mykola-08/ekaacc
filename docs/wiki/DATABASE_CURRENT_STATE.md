# EKA Database - Current State & Structure

## 🎯 Overview

This document provides a complete overview of the current EKA database structure, including all tables, relationships, functions, and configuration. The database is built on **Supabase (PostgreSQL 14+)** and designed for a comprehensive wellness platform with therapy, community, and AI-powered features.

## 📊 Database Statistics

- **Total Tables**: 35+ core tables
- **Extensions**: uuid-ossp, pg_trgm
- **RLS Status**: Enabled on all tables
- **Primary Keys**: UUID-based for all tables
- **Foreign Keys**: Properly constrained with CASCADE
- **Indexes**: 60+ performance indexes
- **Triggers**: Automatic timestamp updates

## 🏗️ Database Architecture

### Core Design Principles
1. **UUID Primary Keys** - Global uniqueness and security
2. **Row Level Security (RLS)** - Granular access control
3. **Timestamp Tracking** - Created/updated automatic timestamps
4. **JSONB Flexibility** - Metadata and dynamic data storage
5. **Normalized Structure** - Proper relationships and constraints
6. **Audit Trail** - Complete activity logging

## 📋 Complete Table Structure

### 🔐 Authentication & Core User Management

#### `user_profiles`
```sql
- id (UUID, PK) - References auth.users(id)
- username (TEXT, UNIQUE) - User's display name
- full_name (TEXT) - Complete name
- avatar_url (TEXT) - Profile image URL
- bio (TEXT) - User biography
- created_at (TIMESTAMPTZ) - Auto timestamp
- updated_at (TIMESTAMPTZ) - Auto timestamp
```
**Purpose**: Extended user information beyond Supabase Auth

#### `user_roles`
```sql
- id (UUID, PK) - Role identifier
- name (TEXT, UNIQUE) - Role name (admin, user, moderator)
- description (TEXT) - Role description
- is_active (BOOLEAN) - Role status
- created_at (TIMESTAMPTZ) - Creation timestamp
```
**Purpose**: Role-based access control system

#### `user_role_assignments`
```sql
- id (UUID, PK) - Assignment identifier
- user_id (UUID) - References auth.users(id)
- role_id (UUID) - References user_roles(id)
- assigned_at (TIMESTAMPTZ) - Assignment timestamp
- assigned_by (UUID) - Who assigned the role
```
**Purpose**: Maps users to their roles

#### `permissions`
```sql
- id (UUID, PK) - Permission identifier
- name (TEXT, UNIQUE) - Permission name (e.g., 'users.read')
- resource (TEXT) - Resource type (users, content, admin)
- action (TEXT) - Action type (read, write, delete)
- description (TEXT) - Permission description
```
**Purpose**: Granular permission definitions

#### `role_permissions`
```sql
- id (UUID, PK) - Assignment identifier
- role_id (UUID) - References user_roles(id)
- permission_id (UUID) - References permissions(id)
- created_at (TIMESTAMPTZ) - Creation timestamp
```
**Purpose**: Maps roles to permissions

#### `user_preferences`
```sql
- id (UUID, PK) - Preference identifier
- user_id (UUID) - References auth.users(id)
- theme (TEXT) - UI theme preference
- language (TEXT) - Language code
- timezone (TEXT) - User's timezone
- email_notifications (BOOLEAN) - Email notification setting
- push_notifications (BOOLEAN) - Push notification setting
```
**Purpose**: User-specific settings and preferences

### 💳 Financial System

#### `wallets`
```sql
- id (UUID, PK) - Wallet identifier
- user_id (UUID) - References auth.users(id)
- balance (DECIMAL) - Current balance (>= 0)
- currency (VARCHAR) - Currency code (EUR, USD, GBP)
- is_active (BOOLEAN) - Wallet status
- last_transaction_at (TIMESTAMPTZ) - Last activity
```
**Purpose**: User financial accounts

#### `wallet_transactions`
```sql
- id (UUID, PK) - Transaction identifier
- wallet_id (UUID) - References wallets(id)
- user_id (UUID) - References auth.users(id)
- amount (DECIMAL) - Transaction amount
- type (VARCHAR) - Transaction type (credit, debit, refund)
- description (TEXT) - Transaction description
- metadata (JSONB) - Additional transaction data
```
**Purpose**: Complete transaction history

#### `purchasable_items`
```sql
- id (UUID, PK) - Item identifier
- type (VARCHAR) - Item type (session, subscription, resource)
- name (VARCHAR) - Item name
- description (TEXT) - Item description
- price (DECIMAL) - Item price
- currency (VARCHAR) - Currency code
- metadata (JSONB) - Additional item data
```
**Purpose**: Catalog of available items

#### `purchases`
```sql
- id (UUID, PK) - Purchase identifier
- user_id (UUID) - References auth.users(id)
- item_id (UUID) - References purchasable_items(id)
- quantity (INTEGER) - Purchase quantity
- unit_price (DECIMAL) - Price per unit
- total_amount (DECIMAL) - Total purchase amount
- status (VARCHAR) - Purchase status
```
**Purpose**: User purchase tracking

### 👨‍⚕️ Therapy & Wellness System

#### `appointments`
```sql
- id (UUID, PK) - Appointment identifier
- user_id (UUID) - Patient reference
- therapist_id (UUID) - Therapist reference
- title (VARCHAR) - Appointment title
- start_time (TIMESTAMPTZ) - Start time
- end_time (TIMESTAMPTZ) - End time
- status (VARCHAR) - Status (scheduled, confirmed, completed)
- type (VARCHAR) - Appointment type (therapy, consultation)
```
**Purpose**: Therapy session scheduling

#### `journal_entries`
```sql
- id (UUID, PK) - Entry identifier
- user_id (UUID) - References auth.users(id)
- title (VARCHAR) - Entry title
- content (TEXT) - Entry content
- mood (VARCHAR) - Mood classification
- mood_score (INTEGER) - Mood rating (1-10)
- tags (TEXT[]) - Entry tags
- is_private (BOOLEAN) - Privacy setting
```
**Purpose**: User mood and thought tracking

#### `goals`
```sql
- id (UUID, PK) - Goal identifier
- user_id (UUID) - References auth.users(id)
- title (VARCHAR) - Goal title
- description (TEXT) - Goal description
- category (VARCHAR) - Goal category
- target_date (DATE) - Target completion date
- progress_percentage (DECIMAL) - Progress (0-100)
- status (VARCHAR) - Goal status
```
**Purpose**: User wellness objectives

#### `mood_logs`
```sql
- id (UUID, PK) - Log identifier
- user_id (UUID) - References auth.users(id)
- mood (VARCHAR) - Mood classification
- mood_score (INTEGER) - Mood rating (1-10)
- energy_level (INTEGER) - Energy rating (1-10)
- stress_level (INTEGER) - Stress rating (1-10)
- sleep_quality (INTEGER) - Sleep rating (1-10)
- notes (TEXT) - Additional notes
```
**Purpose**: Daily wellness tracking

#### `exercises`
```sql
- id (UUID, PK) - Exercise identifier
- title (VARCHAR) - Exercise name
- description (TEXT) - Exercise description
- category (VARCHAR) - Exercise type
- difficulty_level (VARCHAR) - Difficulty rating
- duration_minutes (INTEGER) - Duration
- instructions (TEXT) - Step-by-step instructions
```
**Purpose**: Wellness exercise catalog

### 🤖 AI & Personalization System

#### `ai_personalization_profiles`
```sql
- user_id (UUID, PK) - References auth.users(id)
- behavior_patterns (JSONB) - User behavior analysis
- preferences (JSONB) - User preferences
- wellness_insights (JSONB) - Health insights
- adaptive_settings (JSONB) - Adaptive configurations
```
**Purpose**: AI-driven user personalization

#### `ai_insights`
```sql
- id (UUID, PK) - Insight identifier
- user_id (UUID) - References auth.users(id)
- insight_id (VARCHAR) - Unique insight reference
- type (VARCHAR) - Insight type (wellness, therapy, behavioral)
- title (VARCHAR) - Insight title
- description (TEXT) - Insight content
- confidence (DECIMAL) - AI confidence score
- action_items (JSONB) - Recommended actions
```
**Purpose**: AI-generated recommendations

#### `behavioral_patterns`
```sql
- id (UUID, PK) - Pattern identifier
- user_id (UUID) - References auth.users(id)
- pattern_type (VARCHAR) - Pattern classification
- confidence_score (DECIMAL) - Confidence rating
- evidence (JSONB) - Supporting evidence
- severity (VARCHAR) - Pattern severity
- status (VARCHAR) - Pattern status
```
**Purpose**: Behavioral analysis and insights

### 🏆 Loyalty & Engagement System

#### `user_tiers`
```sql
- id (UUID, PK) - Tier identifier
- user_id (UUID) - References auth.users(id)
- tier_type (VARCHAR) - Tier classification
- tier_name (VARCHAR) - Tier display name
- is_active (BOOLEAN) - Tier status
- assigned_at (TIMESTAMPTZ) - Assignment timestamp
```
**Purpose**: User loyalty tier management

#### `subscription_tiers`
```sql
- id (UUID, PK) - Tier identifier
- name (VARCHAR) - Tier name
- type (VARCHAR) - Tier type (free, loyal, vip)
- benefits (JSONB) - Tier benefits
- requirements (JSONB) - Tier requirements
- monthly_price (DECIMAL) - Monthly cost
- yearly_price (DECIMAL) - Annual cost
```
**Purpose**: Subscription plan definitions

### 📊 Analytics & Monitoring System

#### `user_interactions`
```sql
- id (UUID, PK) - Interaction identifier
- user_id (UUID) - References auth.users(id)
- interaction_type (VARCHAR) - Type of interaction
- page_path (VARCHAR) - Page URL
- element_id (VARCHAR) - DOM element
- metadata (JSONB) - Additional interaction data
- timestamp (TIMESTAMPTZ) - Interaction time
```
**Purpose**: User behavior tracking

#### `audit_logs`
```sql
- id (UUID, PK) - Log identifier
- user_id (UUID) - User reference
- action (VARCHAR) - Performed action
- resource_type (VARCHAR) - Resource type
- resource_id (VARCHAR) - Resource identifier
- old_values (JSONB) - Previous values
- new_values (JSONB) - New values
- ip_address (INET) - User IP address
- timestamp (TIMESTAMPTZ) - Action timestamp
```
**Purpose**: Security and compliance auditing

#### `system_logs`
```sql
- id (UUID, PK) - Log identifier
- level (VARCHAR) - Log severity
- message (TEXT) - Log message
- context (JSONB) - Log context
- error_stack (TEXT) - Error details
- user_id (UUID) - Related user
- timestamp (TIMESTAMPTZ) - Log timestamp
```
**Purpose**: Application monitoring and debugging

### 💬 Communication System

#### `messages`
```sql
- id (UUID, PK) - Message identifier
- sender_id (UUID) - References auth.users(id)
- recipient_id (UUID) - References auth.users(id)
- subject (VARCHAR) - Message subject
- content (TEXT) - Message body
- message_type (VARCHAR) - Message classification
- is_read (BOOLEAN) - Read status
- read_at (TIMESTAMPTZ) - Read timestamp
```
**Purpose**: User-to-user messaging

#### `notifications`
```sql
- id (UUID, PK) - Notification identifier
- user_id (UUID) - References auth.users(id)
- type (VARCHAR) - Notification type
- title (VARCHAR) - Notification title
- message (TEXT) - Notification content
- payload (JSONB) - Additional data
- is_read (BOOLEAN) - Read status
- priority (VARCHAR) - Notification priority
```
**Purpose**: System notifications

## 🔧 Database Functions

### User Management Functions

#### `handle_new_user()`
**Purpose**: Automatically creates user profile and preferences on signup
**Triggers**: AFTER INSERT on auth.users
**Actions**:
- Creates user_profiles entry
- Creates user_preferences entry
- Assigns default 'user' role
- Creates audit log entry

#### `update_updated_at_column()`
**Purpose**: Automatically updates the updated_at timestamp
**Triggers**: BEFORE UPDATE on all relevant tables

### Security Functions

#### `check_user_permission()`
**Purpose**: Verifies if user has specific permission
**Parameters**: user_id UUID, permission_name TEXT
**Returns**: BOOLEAN

### Advanced Analytics & ML Functions

#### `calculate_user_engagement_score()`
**Purpose**: Calculates comprehensive user engagement metrics
**Parameters**: user_id UUID
**Returns**: JSONB with engagement score, interaction counts, feature usage
**Features**: 
- Tracks total and recent interactions
- Calculates average session duration
- Analyzes feature usage patterns
- Generates 0-100 engagement score

#### `generate_personalized_recommendations()`
**Purpose**: Creates ML-powered personalized recommendations
**Parameters**: user_id UUID
**Returns**: JSONB with prioritized recommendations
**Features**:
- Analyzes mood patterns, goal progress, exercise completion
- Provides tier-specific recommendations
- Includes actionable items and priorities
- Adapts based on user behavior

#### `analyze_behavioral_patterns()`
**Purpose**: Deep behavioral analysis with ML insights
**Parameters**: user_id UUID
**Returns**: JSONB with pattern analysis and risk factors
**Features**:
- Identifies mood trends and volatility
- Analyzes activity correlations
- Detects risk factors and concerning patterns
- Provides confidence scores and recommendations

#### `create_advanced_analytics_report()`
**Purpose**: Generates comprehensive analytics reports
**Parameters**: user_id UUID, report_type TEXT, start_date DATE, end_date DATE
**Returns**: JSONB with detailed analytics
**Features**:
- Engagement metrics analysis
- Wellness trend visualization
- Therapy effectiveness tracking
- AI insights summarization
- Customizable date ranges

#### `monitor_wellness_alerts()`
**Purpose**: Real-time wellness monitoring and alerting
**Parameters**: user_id UUID
**Returns**: JSONB with alerts and recommendations
**Features**:
- Monitors mood tracking frequency
- Detects concerning mood scores
- Tracks appointment and journaling gaps
- Provides severity-based alerts

#### `export_user_data_secure()`
**Purpose**: Privacy-controlled data export with audit trail
**Parameters**: user_id UUID, export_type TEXT
**Returns**: JSONB with exported data and summary
**Features**:
- Respects user privacy settings
- Three export levels: minimal, standard, full
- Automatic audit logging
- Data size and record counting

#### `process_real_time_mood_analysis()`
**Purpose**: Real-time mood pattern analysis and alerting
**Parameters**: user_id UUID
**Returns**: JSONB with mood analysis and alerts
**Features**:
- Analyzes mood trends in real-time
- Triggers alerts for concerning patterns
- Provides immediate recommendations
- Integrates with notification system

#### `manage_user_session()`
**Purpose**: Advanced session management with timeout handling
**Parameters**: user_id UUID, action TEXT, session_data JSONB
**Returns**: JSONB with session information
**Features**:
- Tier-based session timeouts
- Session counting and validation
- Activity logging
- Secure session management

#### `trigger_real_time_notification()`
**Purpose**: Enables real-time notifications with webhook support
**Parameters**: event_type TEXT, user_id UUID, data JSONB, priority TEXT
**Returns**: UUID of created notification
**Features**:
- Event-driven notifications
- Webhook payload preparation
- Priority-based routing
- External integration support

## 🔒 Security Configuration

### Row Level Security (RLS)
All tables have RLS enabled with comprehensive policies:

#### User Profile Policies
- Users can view all profiles
- Users can only update their own profile
- Admins have full access

#### Role Management Policies
- Only admins can manage roles and permissions
- Users can view their own role assignments
- Role changes are audited

#### Financial Data Policies
- Users can only access their own wallet and transactions
- Purchase history is private to the user
- Payment requests are user-specific

#### Therapy Data Policies
- Patients can access their own appointments and notes
- Therapists can access their patients' data
- Journal entries respect privacy settings

## 🚀 Performance Optimization

### Index Strategy
- **Primary Keys**: All tables use UUID primary keys
- **Foreign Keys**: Indexed for join performance
- **Search Indexes**: pg_trgm for text search
- **Composite Indexes**: For complex queries
- **Partial Indexes**: For filtered queries
- **JSONB Indexes**: For metadata queries
- **Full-Text Search**: Advanced text search capabilities

### Advanced Index Configuration
```sql
-- Basic performance indexes
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);

-- Advanced composite indexes for analytics
CREATE INDEX idx_user_interactions_user_timestamp_desc ON user_interactions(user_id, timestamp DESC);
CREATE INDEX idx_mood_logs_user_logged_at_desc ON mood_logs(user_id, logged_at DESC);
CREATE INDEX idx_journal_entries_user_created_desc ON journal_entries(user_id, created_at DESC);
CREATE INDEX idx_appointments_user_start_time_asc ON appointments(user_id, start_time ASC);
CREATE INDEX idx_wallet_transactions_user_created_desc ON wallet_transactions(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read_created_desc ON notifications(user_id, is_read, created_at DESC);

-- Analytics-optimized indexes
CREATE INDEX idx_mood_logs_date_score ON mood_logs(DATE(logged_at), mood_score);
CREATE INDEX idx_user_interactions_date_type ON user_interactions(DATE(timestamp), interaction_type);
CREATE INDEX idx_appointments_date_status ON appointments(DATE(start_time), status);

-- Partial indexes for common filtered queries
CREATE INDEX idx_appointments_scheduled ON appointments(status) WHERE status = 'scheduled';
CREATE INDEX idx_goals_active ON goals(status) WHERE status = 'active';
CREATE INDEX idx_notifications_unread ON notifications(is_read) WHERE is_read = false;
CREATE INDEX idx_ai_insights_active ON ai_insights(is_active) WHERE is_active = true;

-- Full-text search indexes with custom configurations
CREATE INDEX idx_journal_entries_content_english ON journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX idx_journal_entries_title_english ON journal_entries USING gin(to_tsvector('english', title));
CREATE INDEX idx_messages_content_english ON messages USING gin(to_tsvector('english', content));
CREATE INDEX idx_messages_subject_english ON messages USING gin(to_tsvector('english', subject));

-- JSONB indexes for metadata queries
CREATE INDEX idx_user_settings_preferences_gin ON user_settings USING gin(preferences);
CREATE INDEX idx_ai_insights_metadata_gin ON ai_insights USING gin(metadata);
CREATE INDEX user_interactions_metadata_gin ON user_interactions USING gin(metadata);

-- Therapy and wellness indexes
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);

-- AI and analytics indexes
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_behavioral_patterns_user_id ON behavioral_patterns(user_id);
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
```

## 📈 Data Flow & Relationships

### User Registration Flow
1. User signs up via Supabase Auth
2. `handle_new_user()` trigger creates profile and preferences
3. Default 'user' role is assigned
4. Audit log entry is created

### Therapy Session Flow
1. User books appointment
2. Appointment is confirmed by therapist
3. Session is completed
4. Notes and progress are recorded
5. Billing is processed if applicable

### AI Personalization Flow
1. User interactions are tracked
2. Behavioral patterns are analyzed
3. AI generates personalized insights
4. Recommendations are delivered

### Real-Time Analytics Flow
1. User activities trigger real-time analysis
2. Mood patterns are monitored continuously
3. Alerts are generated for concerning patterns
4. Notifications are sent immediately

### Advanced Reporting Flow
1. Comprehensive analytics are calculated
2. Engagement scores are computed
3. Behavioral patterns are analyzed with ML
4. Personalized recommendations are generated
5. Reports are compiled with visualizations

### Session Management Flow
1. Sessions are created with tier-based timeouts
2. Activities are tracked in real-time
3. Session validity is continuously monitored
4. Security and audit logs are maintained
5. User feedback improves the model

## 🔧 Maintenance & Monitoring

### Advanced Features & Capabilities

#### Real-Time Processing
- **Mood Analysis**: Real-time mood pattern detection and alerting
- **Session Management**: Tier-based session timeouts and validation
- **Notifications**: Event-driven real-time notification system
- **Wellness Monitoring**: Continuous wellness alert monitoring

#### Machine Learning Integration
- **Behavioral Analysis**: Advanced pattern recognition with confidence scoring
- **Predictive Insights**: ML-powered predictions and recommendations
- **Engagement Scoring**: Comprehensive user engagement analytics
- **Risk Detection**: Automated risk factor identification

#### Advanced Analytics
- **Comprehensive Reporting**: Multi-dimensional analytics reports
- **Trend Analysis**: Time-series analysis with volatility metrics
- **Correlation Analysis**: Activity-mood correlation detection
- **Privacy-Controlled Export**: Secure data export with audit trails

#### Performance Optimizations
- **Advanced Indexing**: 30+ specialized indexes for optimal performance
- **Query Optimization**: Composite and partial indexes for complex queries
- **Full-Text Search**: PostgreSQL full-text search capabilities
- **JSONB Optimization**: Optimized metadata and preferences storage

### Maintenance Procedures

#### Regular Tasks
- **Index Maintenance**: Monitor and rebuild indexes as needed
- **Data Archival**: Archive old audit logs and interactions
- **Performance Monitoring**: Track query performance and optimization
- **Security Audits**: Regular security policy reviews

#### Monitoring Setup
- **Query Performance**: Monitor slow queries and optimize
- **Index Usage**: Track index utilization and effectiveness
- **Storage Growth**: Monitor database size and growth patterns
- **User Activity**: Track user engagement and system usage

### Regular Maintenance Tasks
- **Weekly**: VACUUM ANALYZE for performance
- **Monthly**: Index usage analysis
- **Quarterly**: Security audit review
- **As needed**: Migration application

### Monitoring Metrics
- Query performance
- Connection pool utilization
- Storage usage growth
- Error rates and types
- User activity patterns

## 📝 Migration Status

### Completed Migrations
1. **20241117_create_clean_auth_schema.sql** - Core auth system
2. **20241116_missing_core_tables.sql** - Financial and wellness tables
3. **20241116_missing_tables.sql** - Services and subscriptions
4. **20241116_promotional_pages.sql** - Marketing analytics
5. **20241116_community_posts.sql** - Community features

### Migration Order
```bash
# Run migrations in this order:
supabase migration new 20241117_drop_existing_functions
supabase migration new 20241117_drop_auth_tables  
supabase migration new 20241117_create_clean_auth_schema
supabase migration new 20241116_missing_core_tables
supabase migration new 20241116_missing_tables
supabase migration new 20241116_promotional_pages
supabase migration new 20241116_community_posts
```

---

**Database Version**: PostgreSQL 14+  
**Application Version**: 0.1.0  
**Last Updated**: 2024-11-18  
**Schema Status**: Production Ready  
**Security Level**: Enterprise Grade