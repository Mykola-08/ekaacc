# AI Integration in Academy LMS

## Overview

This document describes the comprehensive AI features integrated into the Academy LMS, including usage limits by subscription plan, AI-powered learning features, and cost optimization strategies.

## AI-Powered Learning Features

### 1. AI Study Assistant

**Description**: Interactive AI assistant that helps students understand course material.

**Capabilities**:
- Answers questions about course content
- Provides personalized explanations based on learning style
- Suggests related resources and materials
- Tracks usage against subscription plan limits

**Implementation**:
```typescript
import { aiStudyAssistant } from '@ekaacc/ai-services';

const response = await aiStudyAssistant.askQuestion({
  userId,
  courseId,
  lessonId,
  question: "Can you explain cognitive distortions in simpler terms?",
  context: lessonContent
});

// Response includes:
// - answer: string
// - relatedResources: Resource[]
// - tokensUsed: number
// - confidence: number (0-1)
```

**Usage Tracking**:
- Tokens counted per request
- Deducted from monthly AI allowance
- Warning at 80% usage
- Graceful degradation when limit reached

### 2. AI Quiz Generator

**Description**: Automatically generates quizzes from lesson content with adaptive difficulty.

**Capabilities**:
- Creates multiple-choice, true/false, and short-answer questions
- Adjusts difficulty based on student performance
- Provides instant feedback with explanations
- Tracks mastery levels

**Implementation**:
```typescript
import { aiQuizGenerator } from '@ekaacc/ai-services';

const quiz = await aiQuizGenerator.generate({
  lessonContent,
  difficulty: 'adaptive', // or 'easy', 'medium', 'hard'
  questionCount: 10,
  questionTypes: ['multiple-choice', 'true-false']
});

// Quiz includes:
// - questions: Question[]
// - estimatedTime: number (minutes)
// - learningObjectives: string[]
// - difficulty: string
```

**Free Tier Access**: Quiz hints only (no auto-generation)
**Paid Tiers**: Full quiz generation with explanations

### 3. AI Content Summarizer

**Description**: Generates concise summaries of video transcripts and articles.

**Capabilities**:
- Summarizes long-form content
- Creates key takeaways list
- Generates study notes
- Highlights important concepts

**Implementation**:
```typescript
import { aiContentSummarizer } from '@ekaacc/ai-services';

const summary = await aiContentSummarizer.summarize({
  content: lessonContent,
  contentType: 'video_transcript', // or 'article', 'pdf'
  summaryLength: 'medium' // 'short', 'medium', 'detailed'
});

// Summary includes:
// - summary: string (200-500 words)
// - keyTakeaways: string[] (5-7 points)
// - studyNotes: string[]
// - importantConcepts: Concept[]
```

**Cost Optimization**: Caches summaries for 30 days

### 4. AI Learning Path Optimizer

**Description**: Analyzes progress and optimizes learning recommendations.

**Capabilities**:
- Identifies knowledge gaps
- Recommends review materials
- Suggests next courses
- Predicts completion times

**Implementation**:
```typescript
import { aiLearningPathOptimizer } from '@ekaacc/ai-services';

const optimization = await aiLearningPathOptimizer.optimize({
  userId,
  completedCourses,
  currentProgress,
  performanceMetrics,
  learningGoals
});

// Optimization includes:
// - recommendedCourses: Course[]
// - reviewMaterials: Lesson[]
// - estimatedCompletionDate: Date
// - strugglingAreas: string[]
// - nextSteps: string[]
```

**Integration**: Works with mood data, journal insights, therapy goals

### 5. AI Peer Recommendations

**Description**: Matches students with similar learning styles for collaboration.

**Capabilities**:
- Analyzes learning patterns
- Matches compatible study partners
- Suggests collaboration opportunities
- Facilitates study groups

**Implementation**:
```typescript
import { aiPeerMatcher } from '@ekaacc/ai-services';

const matches = await aiPeerMatcher.findMatches({
  userId,
  courseId,
  learningStyle: 'visual', // detected automatically
  availability: schedule,
  goals: userGoals
});

// Matches include:
// - peers: User[]
// - compatibility: number (0-1)
// - sharedInterests: string[]
// - suggestedActivities: Activity[]
```

**Privacy**: Users can opt-out of matching

## Subscription Plans & AI Usage Limits

### Plan Comparison

| Feature | Free | Basic ($29/mo) | Premium ($79/mo) | Professional ($149/mo) | Enterprise (Custom) |
|---------|------|----------------|------------------|------------------------|---------------------|
| **AI Queries/Month** | 10 | 100 | 500 | 2,000 | Unlimited |
| **Study Assistant** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Quiz Generator** | Hints only | ✅ | ✅ | ✅ | ✅ |
| **Content Summarizer** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Learning Path Optimizer** | Basic | ✅ | ✅ Advanced | ✅ Advanced | ✅ Custom |
| **Peer Recommendations** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Response Priority** | Low | Normal | High | Highest | Highest |
| **Model Quality** | GPT-4o-mini | GPT-3.5/Claude Haiku | GPT-4 Turbo | GPT-4 Turbo | Custom models |
| **Cache Hit Rate** | 60% | 50% | 40% | 30% | N/A |

### Usage Tracking Implementation

**Database Schema**:
```sql
-- AI usage logs
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL, -- study_assistant, quiz_generator, etc.
  course_id UUID REFERENCES academy_courses(id) ON DELETE SET NULL,
  tokens_used INTEGER NOT NULL,
  cost_estimate DECIMAL(10,4),
  response_cached BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_tier VARCHAR(20) NOT NULL CHECK (plan_tier IN ('free', 'basic', 'premium', 'professional', 'enterprise')),
  ai_query_limit INTEGER NOT NULL,
  current_usage INTEGER DEFAULT 0,
  reset_date DATE NOT NULL,
  features JSONB DEFAULT '{}',
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage alerts
CREATE TABLE usage_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50), -- warning_80, limit_reached, upgrade_suggested
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  dismissed BOOLEAN DEFAULT false
);

-- Create indexes
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_subscription_plans_user_id ON subscription_plans(user_id);
CREATE INDEX idx_usage_alerts_user_id ON usage_alerts(user_id, dismissed);

-- Auto-reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_ai_usage()
RETURNS void AS $$
BEGIN
  UPDATE subscription_plans
  SET current_usage = 0,
      reset_date = reset_date + INTERVAL '1 month'
  WHERE reset_date <= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for usage tracking
CREATE OR REPLACE FUNCTION track_ai_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE subscription_plans
  SET current_usage = current_usage + 1,
      updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  -- Alert at 80% usage
  IF (SELECT current_usage::FLOAT / ai_query_limit FROM subscription_plans WHERE user_id = NEW.user_id) >= 0.8 THEN
    INSERT INTO usage_alerts (user_id, alert_type)
    VALUES (NEW.user_id, 'warning_80')
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_ai_usage_trigger
AFTER INSERT ON ai_usage_logs
FOR EACH ROW
EXECUTE FUNCTION track_ai_usage();
```

**Usage Checker Service**:
```typescript
import { createClient } from '@supabase/supabase-js';

export class AIUsageLimitService {
  async canUseAI(userId: string, feature: string): Promise<{
    allowed: boolean;
    remainingQueries: number;
    plan: string;
    upgradeUrl?: string;
  }> {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    
    // Get user's plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!plan) {
      // Create free plan for new users
      await supabase.from('subscription_plans').insert({
        user_id: userId,
        plan_tier: 'free',
        ai_query_limit: 10,
        reset_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
      return { allowed: true, remainingQueries: 10, plan: 'free' };
    }
    
    // Check if limit reached
    if (plan.current_usage >= plan.ai_query_limit) {
      return {
        allowed: false,
        remainingQueries: 0,
        plan: plan.plan_tier,
        upgradeUrl: '/pricing'
      };
    }
    
    return {
      allowed: true,
      remainingQueries: plan.ai_query_limit - plan.current_usage,
      plan: plan.plan_tier
    };
  }
  
  async logUsage(userId: string, feature: string, tokensUsed: number, cached: boolean = false) {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    
    // Don't count cached responses against limit
    if (cached) return;
    
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      feature_type: feature,
      tokens_used: tokensUsed,
      cost_estimate: this.calculateCost(tokensUsed),
      response_cached: false
    });
  }
  
  private calculateCost(tokens: number): number {
    // GPT-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
    // Assume 50/50 split
    const inputCost = (tokens / 2) * 0.15 / 1_000_000;
    const outputCost = (tokens / 2) * 0.60 / 1_000_000;
    return inputCost + outputCost;
  }
}
```

## Cost Optimization Strategies

### 1. Intelligent Caching

**Strategy**: Cache AI responses with semantic matching

**Implementation**:
```typescript
import { LRUCache } from '@ekaacc/performance-utils';

const aiResponseCache = new LRUCache<string, AIResponse>(1000, 30 * 60 * 1000); // 30min TTL

async function getAIResponse(query: string): Promise<AIResponse> {
  // Check cache first
  const cached = aiResponseCache.get(query);
  if (cached) {
    return { ...cached, fromCache: true };
  }
  
  // Make AI request
  const response = await makeAIRequest(query);
  
  // Cache response
  aiResponseCache.set(query, response);
  
  return { ...response, fromCache: false };
}
```

**Expected Cache Hit Rates**:
- Free tier: 60% (more common questions)
- Basic tier: 50%
- Premium tier: 40%
- Professional tier: 30%

### 2. Model Selection by Plan

**Strategy**: Route to cheaper models for lower tiers

| Plan | Model | Cost per 1K tokens |
|------|-------|--------------------|
| Free | GPT-4o-mini | $0.0003 |
| Basic | GPT-3.5-turbo | $0.0005 |
| Premium | GPT-4-turbo | $0.010 |
| Professional | GPT-4-turbo | $0.010 |
| Enterprise | Custom | Variable |

### 3. Batch Processing

**Strategy**: Process multiple requests together

```typescript
// Instead of 10 individual calls
for (const lesson of lessons) {
  await generateSummary(lesson);
}

// Batch them
const summaries = await batchGenerateSummaries(lessons);
```

### 4. Prompt Optimization

**Strategy**: Minimize token usage with efficient prompts

**Before**:
```
Generate a comprehensive summary of the following lesson content, including all key points, important concepts, learning objectives, and takeaways. Make sure to cover every detail...
```
(50 tokens)

**After**:
```
Summarize key points & learning objectives from:
```
(8 tokens)

**Savings**: 84% reduction in prompt tokens

## Integration Examples

### Study Assistant in Course Page

```typescript
// apps/academy/src/components/StudyAssistant.tsx
import { useState } from 'react';
import { aiStudyAssistant } from '@ekaacc/ai-services';
import { AIUsageLimitService } from '@/services/ai-usage-limit';

export function StudyAssistant({ userId, courseId, lessonId }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  
  const limitService = new AIUsageLimitService();
  
  const handleAsk = async () => {
    setLoading(true);
    
    // Check limits
    const canUse = await limitService.canUseAI(userId, 'study_assistant');
    if (!canUse.allowed) {
      setLimitReached(true);
      setLoading(false);
      return;
    }
    
    try {
      const response = await aiStudyAssistant.askQuestion({
        userId,
        courseId,
        lessonId,
        question,
        context: lessonContent
      });
      
      setAnswer(response);
      
      // Log usage if not cached
      if (!response.fromCache) {
        await limitService.logUsage(userId, 'study_assistant', response.tokensUsed);
      }
    } catch (error) {
      console.error('AI request failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (limitReached) {
    return (
      <div className="ai-limit-reached">
        <p>You've reached your monthly AI limit</p>
        <a href="/pricing">Upgrade to continue</a>
      </div>
    );
  }
  
  return (
    <div className="study-assistant">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about this lesson..."
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>
      
      {answer && (
        <div className="ai-response">
          <p>{answer.answer}</p>
          {answer.relatedResources && (
            <div className="related-resources">
              <h4>Related Resources:</h4>
              <ul>
                {answer.relatedResources.map(r => (
                  <li key={r.id}>{r.title}</li>
                ))}
              </ul>
            </div>
          )}
          {answer.fromCache && (
            <span className="cache-indicator">Cached response (not counted against limit)</span>
          )}
        </div>
      )}
    </div>
  );
}
```

### Quiz Generator Button

```typescript
// apps/academy/src/components/QuizGenerator.tsx
export function QuizGeneratorButton({ lessonId, lessonContent }) {
  const generateQuiz = async () => {
    const canUse = await limitService.canUseAI(userId, 'quiz_generator');
    
    if (!canUse.allowed) {
      showUpgradeModal();
      return;
    }
    
    const quiz = await aiQuizGenerator.generate({
      lessonContent,
      difficulty: 'adaptive',
      questionCount: 10
    });
    
    // Save quiz to database
    await saveQuiz(lessonId, quiz);
    
    // Navigate to quiz
    router.push(`/academy/quiz/${quiz.id}`);
  };
  
  return (
    <button onClick={generateQuiz}>
      Generate Practice Quiz (AI)
    </button>
  );
}
```

## Monitoring & Analytics

### Usage Dashboard

**Admin View** (`/admin/ai-usage`):
- Total AI queries across platform
- Cost breakdown by feature
- Plan distribution
- Cache hit rates
- Top users by usage
- Upgrade conversion rates

**User View** (`/dashboard/ai-usage`):
- Current month usage
- Queries remaining
- Feature breakdown
- Cost savings from caching
- Upgrade recommendations

### Alerts System

**80% Usage Warning**:
```
Subject: AI Usage Alert - 80% Limit Reached

Hi {userName},

You've used 80% of your monthly AI query allowance ({current_usage}/{ai_query_limit}).

Remaining queries: {remaining}
Resets on: {reset_date}

Consider upgrading to {next_tier} for {next_limit} queries/month.

[View Usage] [Upgrade Plan]
```

**100% Limit Reached**:
```
Subject: AI Usage Limit Reached

Hi {userName},

You've reached your monthly AI limit ({ai_query_limit} queries).

Your limit resets on {reset_date}, or you can upgrade now for immediate access.

[Upgrade Plan]
```

## Best Practices

### For Users

1. **Use AI Strategically**: Save AI queries for complex questions
2. **Check Cache**: Similar questions may already be answered
3. **Combine Questions**: Ask multiple related questions at once
4. **Review First**: Try to find answers in course materials first
5. **Upgrade When Needed**: Don't let limits block your learning

### For Developers

1. **Always Check Limits**: Before making AI requests
2. **Log Usage**: Track all non-cached responses
3. **Cache Aggressively**: Reduce costs and improve speed
4. **Optimize Prompts**: Minimize token usage
5. **Monitor Costs**: Track spending per feature
6. **Handle Gracefully**: Show helpful upgrade messages

## Migration Guide

### Existing Users

```sql
-- Grant all existing users free plan
INSERT INTO subscription_plans (user_id, plan_tier, ai_query_limit, reset_date)
SELECT 
  id,
  'free',
  10,
  CURRENT_DATE + INTERVAL '1 month'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plans WHERE user_id = auth.users.id
);
```

### Grandfathering

```sql
-- Grant basic plan to early adopters (enrolled before launch)
UPDATE subscription_plans
SET plan_tier = 'basic',
    ai_query_limit = 100
WHERE user_id IN (
  SELECT user_id 
  FROM academy_enrollments 
  WHERE enrolled_at < '2025-01-01'
);
```

## Conclusion

The AI integration in Academy LMS provides powerful learning assistance while maintaining sustainable costs through:

- **Smart usage limits** based on subscription plans
- **Aggressive caching** (40-60% hit rates)
- **Model optimization** (cheaper models for lower tiers)
- **Graceful degradation** when limits reached
- **Clear upgrade paths** for users needing more

This creates a balanced system that delivers value to users while ensuring platform profitability.
