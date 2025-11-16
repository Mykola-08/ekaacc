-- Create user_interactions table for tracking user behavior
CREATE TABLE user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('session_start', 'session_end', 'page_view', 'button_click', 'form_submission', 'message_sent', 'appointment_booked', 'exercise_completed', 'mood_logged', 'crisis_interaction')),
  page_path TEXT,
  element_id TEXT,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT NOT NULL,
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_interaction_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp DESC);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX idx_user_interactions_composite ON user_interactions(user_id, interaction_type, timestamp DESC);

-- Create behavioral_patterns table for storing detected patterns
CREATE TABLE behavioral_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50) NOT NULL CHECK (pattern_type IN ('engagement_decline', 'mood_deterioration', 'session_frequency_drop', 'crisis_pattern', 'positive_progress', 'goal_achievement', 'adherence_increase')),
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  evidence TEXT[] NOT NULL,
  severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  first_detected TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for behavioral_patterns
CREATE INDEX idx_behavioral_patterns_user_id ON behavioral_patterns(user_id);
CREATE INDEX idx_behavioral_patterns_pattern_type ON behavioral_patterns(pattern_type);
CREATE INDEX idx_behavioral_patterns_status ON behavioral_patterns(status);
CREATE INDEX idx_behavioral_patterns_severity ON behavioral_patterns(severity);
CREATE INDEX idx_behavioral_patterns_composite ON behavioral_patterns(user_id, status, severity);

-- Create predictive_insights table for AI-generated insights
CREATE TABLE predictive_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL CHECK (insight_type IN ('potential_crisis', 'relapse_risk', 'treatment_resistance', 'engagement_decline', 'positive_outcome')),
  probability DECIMAL(3,2) NOT NULL CHECK (probability >= 0 AND probability <= 1),
  contributing_factors TEXT[] NOT NULL,
  recommended_actions TEXT[] NOT NULL,
  timeframe VARCHAR(20) NOT NULL CHECK (timeframe IN ('immediate', 'short_term', 'long_term')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE
);

-- Create indexes for predictive_insights
CREATE INDEX idx_predictive_insights_user_id ON predictive_insights(user_id);
CREATE INDEX idx_predictive_insights_insight_type ON predictive_insights(insight_type);
CREATE INDEX idx_predictive_insights_timeframe ON predictive_insights(timeframe);
CREATE INDEX idx_predictive_insights_expires_at ON predictive_insights(expires_at);
CREATE INDEX idx_predictive_insights_unread ON predictive_insights(user_id, is_read, is_dismissed) WHERE is_read = FALSE AND is_dismissed = FALSE;

-- Enable Row Level Security (RLS)
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_interactions
CREATE POLICY "Users can view own interactions" ON user_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert interactions" ON user_interactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for behavioral_patterns
CREATE POLICY "Users can view own patterns" ON behavioral_patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage patterns" ON behavioral_patterns
  FOR ALL USING (true);

-- RLS Policies for predictive_insights
CREATE POLICY "Users can view own insights" ON predictive_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON predictive_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage insights" ON predictive_insights
  FOR ALL USING (true);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON user_interactions TO anon, authenticated;
GRANT INSERT ON user_interactions TO anon, authenticated;
GRANT SELECT ON behavioral_patterns TO anon, authenticated;
GRANT INSERT, UPDATE ON behavioral_patterns TO anon, authenticated;
GRANT SELECT, UPDATE ON predictive_insights TO anon, authenticated;
GRANT INSERT ON predictive_insights TO anon, authenticated;

-- Create function to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_behavioral_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating last_updated
CREATE TRIGGER trigger_update_behavioral_patterns_updated_at
  BEFORE UPDATE ON behavioral_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_behavioral_patterns_updated_at();

-- Create function to clean up expired insights
CREATE OR REPLACE FUNCTION cleanup_expired_insights()
RETURNS VOID AS $$
BEGIN
  DELETE FROM predictive_insights
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job to clean up expired insights (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-insights', '0 2 * * *', 'SELECT cleanup_expired_insights();');

-- Sample data will be inserted by the application when users interact with the platform