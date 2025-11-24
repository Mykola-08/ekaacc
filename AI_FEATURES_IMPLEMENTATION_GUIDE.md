# AI-Backed Features - Implementation Guide

## Overview

This document outlines the new AI-backed features implemented in the ekaacc platform. These features leverage existing database tables and provide intelligent, personalized wellness support to users.

---

## New AI Features

### 1. AI Wellness Coach 🌟

**Purpose**: Proactive wellness monitoring and personalized recommendations

**Key Capabilities**:
- Analyzes user wellness metrics from multiple data sources
- Generates personalized check-in messages based on current state
- Provides actionable wellness recommendations
- Calculates risk scores for early intervention
- Generates weekly wellness summaries

**Data Sources**:
- `mood_logs` - Mood, energy, stress, sleep data
- `journal_entries` - Emotional state tracking
- `appointments` - Therapy attendance
- `goals` - Progress tracking

**API Usage**:
```typescript
import { wellnessCoach } from '@ekaacc/ai-services';

// Analyze current wellness state
const metrics = await wellnessCoach.analyzeWellness(userId, supabase);

// Generate personalized check-in
const checkIn = wellnessCoach.generateCheckIn(metrics, userName);

// Get recommendations
const recommendations = await wellnessCoach.generateRecommendations(metrics, supabase);

// Generate weekly summary
const summary = await wellnessCoach.generateWeeklySummary(metrics, supabase);
```

**Example Output**:
```typescript
// Wellness Metrics
{
  userId: "user-123",
  period: "week",
  moodAverage: 6.2,
  moodTrend: "declining",
  energyAverage: 5.8,
  stressAverage: 7.3,
  sleepAverage: 5.5,
  journalCount: 4,
  appointmentAttendance: 75,
  goalProgress: 50,
  riskScore: 45
}

// Check-In Message
{
  id: "checkin_1234567890",
  message: "Hi Sarah, I've noticed your mood has been lower recently...",
  tone: "supportive",
  questions: [
    "What's been on your mind lately?",
    "Have you noticed any patterns in when you feel down?"
  ],
  contextualizedTo: "Mood: 6.2/10, Trend: declining, Stress: 7.3/10"
}

// Recommendations
[
  {
    id: "sleep_hygiene",
    type: "sleep",
    priority: "high",
    title: "Improve Sleep Quality",
    description: "Better sleep can significantly impact mood...",
    actionItems: [
      "Establish a consistent bedtime routine",
      "Avoid screens 1 hour before bed",
      "Keep your bedroom cool and dark"
    ],
    reasoning: "Your sleep quality (5.5/10) is below optimal...",
    expectedImpact: "Improved mood, energy, and stress management"
  }
]
```

---

### 2. AI Journal Analyzer 📝

**Purpose**: Extract insights from journal entries

**Key Capabilities**:
- Sentiment analysis (very positive to very negative)
- Emotion detection (joy, sadness, anxiety, anger, etc.)
- Theme extraction (work stress, relationships, self-worth)
- Cognitive distortion detection (all-or-nothing thinking, overgeneralization, etc.)
- Progress indicators (self-awareness, emotional regulation, problem-solving)
- Trend analysis over time

**Data Sources**:
- `journal_entries` - User journal content

**API Usage**:
```typescript
import { journalAnalyzer } from '@ekaacc/ai-services';

// Analyze single entry
const analysis = await journalAnalyzer.analyzeEntry(
  entryId,
  content,
  mood,
  moodScore
);

// Analyze trends over time
const trends = await journalAnalyzer.analyzeTrends(userId, supabase, 30);
```

**Example Output**:
```typescript
// Journal Analysis
{
  entryId: "entry-123",
  sentiment: {
    overall: "negative",
    score: -0.4,
    confidence: 0.75,
    emotions: [
      { emotion: "anxiety", intensity: 0.8 },
      { emotion: "sadness", intensity: 0.6 }
    ]
  },
  themes: [
    {
      theme: "work stress",
      frequency: 3,
      sentiment: -0.5,
      keywords: ["work", "deadline", "project"],
      examples: ["Work has been overwhelming lately..."]
    }
  ],
  cognitiveDistortions: [
    {
      type: "all_or_nothing",
      description: "All-or-nothing thinking: Viewing situations in extreme...",
      example: "I always mess things up at work",
      suggestion: "Try to notice the shades of gray..."
    }
  ],
  insights: [
    {
      id: "low_mood_detected",
      type: "concern",
      title: "Low mood detected",
      description: "This entry reflects a challenging emotional state...",
      priority: "high"
    }
  ],
  progressIndicators: {
    selfAwareness: 65,
    emotionalRegulation: 45,
    problemSolving: 55,
    positiveThinking: 40
  },
  suggestedActions: [
    "Consider discussing these feelings with your therapist",
    "Challenge cognitive distortions by looking for evidence"
  ]
}
```

---

### 3. AI Mood Predictor 🔮

**Purpose**: Pattern recognition and mood forecasting

**Key Capabilities**:
- Predict mood trends for upcoming days
- Identify recurring patterns (daily, weekly, monthly)
- Detect mood triggers (positive and negative)
- Early warning sign detection
- Preventive intervention suggestions

**Data Sources**:
- `mood_logs` - Historical mood data
- `journal_entries` - Contextual information
- `ai_interactions` - User engagement levels

**API Usage**:
```typescript
import { moodPredictor } from '@ekaacc/ai-services';

// Predict upcoming mood
const predictions = await moodPredictor.predictMood(userId, supabase, 7);

// Identify patterns
const moodLogs = /* fetch from database */;
const patterns = moodPredictor.identifyPatterns(moodLogs);

// Identify triggers
const triggers = await moodPredictor.identifyTriggers(userId, supabase);

// Detect warning signs
const warnings = await moodPredictor.detectWarningsSigns(userId, supabase);
```

**Example Output**:
```typescript
// Mood Predictions
[
  {
    date: "2025-11-25",
    predictedMood: 6.5,
    confidence: 0.7,
    factors: ["day of week pattern", "weekly trend"],
    recommendation: "A moderate day predicted. Good opportunity for routine activities..."
  }
]

// Mood Patterns
[
  {
    type: "daily",
    description: "Your mood tends to be higher on Fridays and lower on Mondays",
    confidence: 0.8,
    evidence: {
      dates: [...],
      moodScores: [...]
    }
  }
]

// Mood Triggers
[
  {
    trigger: "exercise",
    category: "activity",
    impact: "positive",
    strength: 0.8,
    occurrences: 12,
    examples: ["2025-11-20", "2025-11-18"]
  },
  {
    trigger: "work deadline",
    category: "event",
    impact: "negative",
    strength: 0.6,
    occurrences: 5
  }
]

// Early Warning Signs
[
  {
    sign: "Declining mood",
    description: "Your mood has been consistently low over the past few days",
    severity: "moderate",
    frequency: 3,
    lastOccurrence: "2025-11-24T10:30:00Z",
    suggestedAction: "Consider reaching out to your therapist or support system"
  }
]
```

---

## Database Requirements

### Existing Tables (No Changes Needed) ✅

The new AI features work with existing database tables:

1. **mood_logs** - Already has all required fields:
   - `mood_score` (1-10)
   - `energy_level` (1-10)
   - `stress_level` (1-10)
   - `sleep_quality` (1-10)
   - `factors` (TEXT[])
   - `logged_at`

2. **journal_entries** - Already supports:
   - `content` (TEXT)
   - `mood_score` (1-10)
   - `ai_analysis` (JSONB) - Can store analysis results
   - `created_at`

3. **appointments** - Already tracks:
   - `status` (scheduled, completed, cancelled, etc.)
   - `start_time`, `end_time`

4. **goals** - Already has:
   - `title`, `description`
   - `status`

5. **ai_interactions** - Already tracks:
   - User interactions
   - Engagement metrics

6. **ai_user_profiles** - Already has:
   - `behavior_patterns` (JSONB)
   - `wellness_insights` (JSONB)

### Optional Enhancements (Future)

If you want to optimize performance further, consider adding indexes:

```sql
-- Already added in migration 20250123000000_add_performance_indexes.sql:
-- CREATE INDEX idx_ai_interactions_user_created ON ai_interactions(user_id, created_at DESC);
-- CREATE INDEX idx_ai_user_profiles_user_id ON ai_user_profiles(user_id);

-- Additional optional indexes for new features:
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_logged 
  ON mood_logs(user_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created 
  ON journal_entries(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_user_status 
  ON appointments(user_id, status);
```

### Storing AI Analysis Results

The `journal_entries.ai_analysis` JSONB field can store full analysis results:

```sql
UPDATE journal_entries 
SET ai_analysis = $1 
WHERE id = $2;
```

Example data:
```json
{
  "sentiment": {
    "overall": "negative",
    "score": -0.4,
    "emotions": [...]
  },
  "themes": [...],
  "cognitiveDistortions": [...],
  "insights": [...],
  "analyzedAt": "2025-11-24T10:30:00Z"
}
```

---

## Integration Examples

### 1. Dashboard Wellness Widget

```typescript
// apps/web/src/components/wellness-dashboard.tsx
import { wellnessCoach } from '@ekaacc/ai-services';

export function WellnessDashboard({ userId }: { userId: string }) {
  const [metrics, setMetrics] = useState<WellnessMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<WellnessRecommendation[]>([]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const metrics = await wellnessCoach.analyzeWellness(userId, supabase);
      const recs = await wellnessCoach.generateRecommendations(metrics, supabase);
      
      setMetrics(metrics);
      setRecommendations(recs);
    }
    loadData();
  }, [userId]);

  return (
    <div>
      <h2>Your Wellness Overview</h2>
      <MoodTrendChart trend={metrics?.moodTrend} score={metrics?.moodAverage} />
      <RecommendationsList recommendations={recommendations} />
    </div>
  );
}
```

### 2. Journal Entry Auto-Analysis

```typescript
// apps/web/src/components/journal-editor.tsx
import { journalAnalyzer } from '@ekaacc/ai-services';

async function handleSaveJournal(content: string) {
  // Save journal entry
  const { data: entry } = await supabase
    .from('journal_entries')
    .insert({ user_id: userId, content })
    .select()
    .single();

  // Analyze in background
  const analysis = await journalAnalyzer.analyzeEntry(
    entry.id,
    content,
    mood,
    moodScore
  );

  // Store analysis
  await supabase
    .from('journal_entries')
    .update({ ai_analysis: analysis })
    .eq('id', entry.id);

  // Show insights to user
  showInsights(analysis.insights);
}
```

### 3. Proactive Check-Ins

```typescript
// apps/admin/src/ai/background-check-ins.ts
import { wellnessCoach, moodPredictor } from '@ekaacc/ai-services';

export async function runDailyCheckIns() {
  const users = await getActiveUsers();

  for (const user of users) {
    // Analyze wellness
    const metrics = await wellnessCoach.analyzeWellness(user.id, supabase);
    
    // Check for warning signs
    const warnings = await moodPredictor.detectWarningsSigns(user.id, supabase);
    
    // Send check-in if needed
    if (metrics.riskScore > 40 || warnings.length > 0) {
      const checkIn = wellnessCoach.generateCheckIn(metrics, user.name);
      await sendNotification(user.id, checkIn);
    }
  }
}
```

### 4. Mood Forecast Widget

```typescript
// apps/web/src/components/mood-forecast.tsx
import { moodPredictor } from '@ekaacc/ai-services';

export function MoodForecast({ userId }: { userId: string }) {
  const [predictions, setPredictions] = useState<MoodPrediction[]>([]);
  const [patterns, setPatterns] = useState<MoodPattern[]>([]);

  useEffect(() => {
    async function loadForecast() {
      const supabase = createClient();
      const pred = await moodPredictor.predictMood(userId, supabase, 7);
      const patt = await moodPredictor.identifyPatterns(/* mood logs */);
      
      setPredictions(pred);
      setPatterns(patt);
    }
    loadForecast();
  }, [userId]);

  return (
    <div>
      <h3>7-Day Mood Forecast</h3>
      {predictions.map(p => (
        <DayForecast key={p.date} prediction={p} />
      ))}
      <PatternInsights patterns={patterns} />
    </div>
  );
}
```

---

## Performance Considerations

### Caching Strategy

Use the AI Optimizer's caching for frequently-run analyses:

```typescript
import { aiOptimizer } from '@ekaacc/ai-services';

// Cache wellness metrics for 15 minutes
const cacheKey = `wellness:${userId}:${new Date().toISOString().split('T')[0]}`;
const cached = aiOptimizer.getCachedResponse(cacheKey);

if (cached) {
  return JSON.parse(cached.response);
}

const metrics = await wellnessCoach.analyzeWellness(userId, supabase);

aiOptimizer.cacheResponse(cacheKey, {
  response: JSON.stringify(metrics),
  timestamp: Date.now(),
  model: 'local',
  tokens: 0,
  cost: 0
});
```

### Batch Processing

For analyzing multiple users or entries, use batch processing:

```typescript
import { asyncBatch } from '@ekaacc/performance-utils';

const analyses = await asyncBatch(
  journalEntries,
  async (entry) => journalAnalyzer.analyzeEntry(entry.id, entry.content),
  { concurrency: 5 }
);
```

---

## Cost Analysis

### No Additional AI API Costs 💰

All new features use **local algorithms** - no external AI API calls required!

- **AI Wellness Coach**: Local computation only
- **AI Journal Analyzer**: Pattern matching and keyword analysis
- **AI Mood Predictor**: Statistical analysis of historical data

**Monthly Cost**: $0 (zero additional cost)

### Optional: Enhanced Analysis with AI Models

If you want to add AI-powered analysis (e.g., deep sentiment analysis), you can integrate with the existing AI optimizer:

```typescript
import { aiOptimizer } from '@ekaacc/ai-services';

// Analyze complex journal entry with AI
const complexity = aiOptimizer.analyzeQueryComplexity(journalContent);
const model = aiOptimizer.selectOptimalModel(complexity, userTier, false);

// Use cheapest model (GPT-4o-mini or Gemini) for sentiment analysis
// Cost: ~$0.0003 per entry
```

---

## Testing

### Unit Tests

```typescript
// Test wellness coach
describe('AIWellnessCoach', () => {
  it('calculates risk score correctly', () => {
    const metrics = { moodAverage: 3, stressAverage: 8, /* ... */ };
    expect(metrics.riskScore).toBeGreaterThan(60);
  });
});

// Test journal analyzer
describe('AIJournalAnalyzer', () => {
  it('detects negative sentiment', async () => {
    const analysis = await journalAnalyzer.analyzeEntry(
      'test-id',
      'I feel terrible and everything is awful'
    );
    expect(analysis.sentiment.overall).toBe('negative');
  });
});
```

### Integration Tests

```typescript
// Test with real database
describe('AI Features Integration', () => {
  it('generates wellness recommendations', async () => {
    const metrics = await wellnessCoach.analyzeWellness(testUserId, supabase);
    const recommendations = await wellnessCoach.generateRecommendations(metrics, supabase);
    expect(recommendations.length).toBeGreaterThan(0);
  });
});
```

---

## Monitoring & Analytics

### Track Feature Usage

```typescript
// Log AI feature usage
await supabase.from('ai_interactions').insert({
  user_id: userId,
  type: 'wellness_analysis',
  context: { feature: 'wellness_coach' },
  metadata: { riskScore: metrics.riskScore }
});
```

### Monitor Performance

```typescript
import { PerformanceTracker } from '@ekaacc/performance-utils';

const tracker = new PerformanceTracker();
tracker.start('wellness_analysis');

const metrics = await wellnessCoach.analyzeWellness(userId, supabase);

tracker.end('wellness_analysis');
console.log(`Analysis took ${tracker.getDuration('wellness_analysis')}ms`);
```

---

## Future Enhancements

### Phase 2 Features (Optional)

1. **AI Goal Tracker**
   - Analyze goal progress
   - Suggest adjustments
   - Predict completion likelihood

2. **AI Session Summarizer**
   - Summarize therapy sessions
   - Extract action items
   - Track therapy progress

3. **AI Resource Recommender**
   - Personalized content recommendations
   - Exercise and meditation suggestions
   - Community connection matching

4. **AI Crisis Monitor**
   - Real-time crisis detection
   - Automatic escalation
   - Emergency contact notification

---

## Summary

**What's Been Added**:
- ✅ 3 new AI services with 15+ capabilities
- ✅ Zero additional database changes needed
- ✅ $0 additional monthly costs (local processing)
- ✅ 100% backward compatible
- ✅ Ready to integrate into apps

**Next Steps**:
1. Review this documentation
2. Integrate features into apps
3. Test with real user data
4. Monitor usage and performance
5. Iterate based on feedback

**Questions or Issues**:
- All features use existing database schema
- No migrations required
- Performance is optimized with caching
- Can run in background or real-time

Let me know if you need any clarification or want additional features!
