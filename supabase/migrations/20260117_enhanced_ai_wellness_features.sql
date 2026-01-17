-- Enhanced AI and Wellness Features Migration
-- Created: 2026-01-17
-- Description: Adds tables for wellness tracking, goals, journal entries,
--              recommendation interactions, and enhances AI features

-- ============================================================================
-- WELLNESS TRACKING
-- ============================================================================

-- Wellness entries for mood/health tracking
CREATE TABLE IF NOT EXISTS wellness_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  energy VARCHAR(20) NOT NULL CHECK (energy IN ('very_low', 'low', 'moderate', 'high', 'very_high')),
  stress VARCHAR(20) NOT NULL CHECK (stress IN ('minimal', 'mild', 'moderate', 'high', 'severe')),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_hours DECIMAL(4,2) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  notes TEXT,
  activities TEXT[] DEFAULT '{}',
  emotions TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient user queries
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_date
  ON wellness_entries(user_id, created_at DESC);

-- RLS for wellness entries
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wellness entries"
  ON wellness_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness entries"
  ON wellness_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness entries"
  ON wellness_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness entries"
  ON wellness_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- WELLNESS GOALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS wellness_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('mood', 'stress', 'sleep', 'activity', 'custom')),
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wellness_goals_user_status
  ON wellness_goals(user_id, status);

ALTER TABLE wellness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wellness goals"
  ON wellness_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness goals"
  ON wellness_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness goals"
  ON wellness_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness goals"
  ON wellness_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- JOURNAL ENTRIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date
  ON journal_entries(user_id, created_at DESC);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RECOMMENDATION INTERACTIONS (for learning)
-- ============================================================================

CREATE TABLE IF NOT EXISTS recommendation_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id VARCHAR(200) NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('viewed', 'clicked', 'dismissed', 'completed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendation_interactions_user
  ON recommendation_interactions(user_id, created_at DESC);

ALTER TABLE recommendation_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendation interactions"
  ON recommendation_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendation interactions"
  ON recommendation_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ENSURE AI TABLES EXIST (Idempotent)
-- ============================================================================

-- AI Conversations (if not exists)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user
  ON ai_conversations(user_id, created_at DESC);

-- AI Messages (if not exists)
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'function', 'tool')),
  content TEXT NOT NULL,
  tokens INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation
  ON ai_messages(conversation_id, created_at ASC);

-- AI User Profiles (if not exists)
CREATE TABLE IF NOT EXISTS ai_user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  behavior_patterns JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  wellness_insights JSONB DEFAULT '{}',
  adaptive_settings JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Interactions (if not exists)
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_type
  ON ai_interactions(user_id, type, created_at DESC);

-- AI Insights (if not exists)
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('wellness', 'therapy', 'behavioral', 'progress', 'recommendation', 'mood', 'engagement')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  action_items JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_insights_user_active
  ON ai_insights(user_id, is_active, created_at DESC);

-- User Memory (if not exists)
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  memory_type VARCHAR(50) NOT NULL CHECK (memory_type IN ('preference', 'fact', 'observation', 'interaction', 'goal', 'mood')),
  importance INTEGER DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_memory_user_type
  ON user_memory(user_id, memory_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_memory_importance
  ON user_memory(user_id, importance DESC);

-- ============================================================================
-- RLS FOR AI TABLES (Ensure enabled)
-- ============================================================================

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist (using DO block)
DO $$
BEGIN
  -- AI Conversations policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversations' AND policyname = 'Users can view own conversations') THEN
    CREATE POLICY "Users can view own conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversations' AND policyname = 'Users can insert own conversations') THEN
    CREATE POLICY "Users can insert own conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversations' AND policyname = 'Users can update own conversations') THEN
    CREATE POLICY "Users can update own conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- AI Messages policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_messages' AND policyname = 'Users can view own messages') THEN
    CREATE POLICY "Users can view own messages" ON ai_messages FOR SELECT
      USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_messages' AND policyname = 'Users can insert own messages') THEN
    CREATE POLICY "Users can insert own messages" ON ai_messages FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.user_id = auth.uid()));
  END IF;

  -- AI User Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_user_profiles' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON ai_user_profiles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_user_profiles' AND policyname = 'Users can upsert own profile') THEN
    CREATE POLICY "Users can upsert own profile" ON ai_user_profiles FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- AI Interactions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_interactions' AND policyname = 'Users can view own interactions') THEN
    CREATE POLICY "Users can view own interactions" ON ai_interactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_interactions' AND policyname = 'Users can insert own interactions') THEN
    CREATE POLICY "Users can insert own interactions" ON ai_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- AI Insights policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_insights' AND policyname = 'Users can view own insights') THEN
    CREATE POLICY "Users can view own insights" ON ai_insights FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_insights' AND policyname = 'Users can manage own insights') THEN
    CREATE POLICY "Users can manage own insights" ON ai_insights FOR ALL USING (auth.uid() = user_id);
  END IF;

  -- User Memory policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_memory' AND policyname = 'Users can view own memory') THEN
    CREATE POLICY "Users can view own memory" ON user_memory FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_memory' AND policyname = 'Users can manage own memory') THEN
    CREATE POLICY "Users can manage own memory" ON user_memory FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to new tables
DROP TRIGGER IF EXISTS update_wellness_entries_updated_at ON wellness_entries;
CREATE TRIGGER update_wellness_entries_updated_at
  BEFORE UPDATE ON wellness_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wellness_goals_updated_at ON wellness_goals;
CREATE TRIGGER update_wellness_goals_updated_at
  BEFORE UPDATE ON wellness_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON journal_entries;
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON ai_insights;
CREATE TRIGGER update_ai_insights_updated_at
  BEFORE UPDATE ON ai_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_memory_updated_at ON user_memory;
CREATE TRIGGER update_user_memory_updated_at
  BEFORE UPDATE ON user_memory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View for wellness streak calculation
CREATE OR REPLACE VIEW user_wellness_streaks AS
SELECT
  user_id,
  COUNT(*) as streak_days,
  MIN(created_at::date) as streak_start,
  MAX(created_at::date) as streak_end
FROM (
  SELECT
    user_id,
    created_at,
    created_at::date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at::date))::int AS grp
  FROM wellness_entries
  WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY user_id, created_at::date
) streak_groups
WHERE grp = (
  SELECT grp
  FROM (
    SELECT created_at::date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at::date))::int AS grp
    FROM wellness_entries
    WHERE user_id = streak_groups.user_id AND created_at::date = CURRENT_DATE
    GROUP BY created_at::date
    LIMIT 1
  ) current_grp
)
GROUP BY user_id, grp;

-- View for mood trends
CREATE OR REPLACE VIEW user_mood_trends AS
SELECT
  user_id,
  DATE_TRUNC('week', created_at) as week,
  AVG(mood) as avg_mood,
  COUNT(*) as entry_count,
  MODE() WITHIN GROUP (ORDER BY stress) as common_stress,
  MODE() WITHIN GROUP (ORDER BY energy) as common_energy
FROM wellness_entries
WHERE created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY user_id, DATE_TRUNC('week', created_at)
ORDER BY user_id, week DESC;

-- ============================================================================
-- GRANT PERMISSIONS (for service role)
-- ============================================================================

GRANT ALL ON wellness_entries TO service_role;
GRANT ALL ON wellness_goals TO service_role;
GRANT ALL ON journal_entries TO service_role;
GRANT ALL ON recommendation_interactions TO service_role;
GRANT ALL ON ai_conversations TO service_role;
GRANT ALL ON ai_messages TO service_role;
GRANT ALL ON ai_user_profiles TO service_role;
GRANT ALL ON ai_interactions TO service_role;
GRANT ALL ON ai_insights TO service_role;
GRANT ALL ON user_memory TO service_role;
