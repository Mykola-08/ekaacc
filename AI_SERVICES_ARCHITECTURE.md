# AI Services Architecture Documentation

## Overview

The application currently has three AI service implementations that provide overlapping functionality. This document describes their architecture, usage patterns, and provides recommendations for consolidation.

## Current AI Services

### 1. AIService (`src/ai/ai-service.ts`)
**Lines of Code:** 334  
**Primary Usage:** 3 imports  
**Status:** ✅ Primary Service - Well-structured with fallback mechanisms

#### Features:
- ✅ Text generation using Vercel AI SDK
- ✅ Multi-provider support (OpenAI, Anthropic, Google)
- ✅ Wellness insights generation
- ✅ Therapy recommendations
- ✅ Fallback responses for offline/error scenarios
- ✅ Singleton pattern for consistent instance
- ✅ Usage tracking and metadata

#### Key Interfaces:
```typescript
interface AIRequest {
  input: string;
  context?: Record<string, any>;
  userId?: string;
  model?: 'openai' | 'anthropic' | 'google';
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface AIResponse {
  output: string;
  confidence: number;
  metadata?: Record<string, any>;
  usage?: { promptTokens, completionTokens, totalTokens };
  model: string;
  timestamp: string;
  userId?: string;
}
```

#### Usage Example:
```typescript
import { generateAIResponse, generateWellnessInsights } from '@/ai/ai-service';

// Generate AI response
const response = await generateAIResponse({
  input: "How can I manage anxiety?",
  userId: user.id,
  model: 'openai'
});

// Generate wellness insights
const insights = await generateWellnessInsights({
  userData: {
    sessionsCompleted: 5,
    mood: 'anxious',
    goals: 'reduce stress',
    name: 'John'
  }
});
```

#### Current Imports:
1. `src/ai/flows/generate-monthly-report.ts`
2. `src/components/eka/dashboard/enhanced-patient-dashboard.tsx`
3. `src/components/eka/dashboard/enhanced-therapist-dashboard.tsx`

### 2. VercelAIService (`src/ai/vercel-ai-service.ts`)
**Lines of Code:** 297  
**Primary Usage:** 1 import  
**Status:** ⚠️ Redundant - Overlaps with AIService

#### Features:
- Similar to AIService but with different interface names
- Text and object generation
- Streaming support
- Multi-provider support

#### Differences from AIService:
- Uses `prompt` instead of `input`
- Uses `content` instead of `output`
- Adds system prompt automatically
- Slightly different error handling

#### Current Import:
1. Unknown/minimal usage

**Recommendation:** Deprecate and migrate to AIService

### 3. AISDKNextService (`src/ai/ai-sdk-next-service.ts`)
**Lines of Code:** 665  
**Primary Usage:** 1 import  
**Status:** ⭐ Advanced Features - Contains unique capabilities

#### Unique Features:
- ✨ Subscription tier management
- ✨ Tool integration (booking, goals, reminders, reports)
- ✨ Proactive agent capabilities
- ✨ Advanced streaming with tools
- ✨ Usage limits and cost tracking
- ✨ Request quota management

#### Key Interfaces:
```typescript
interface AISubscriptionConfig {
  tier: 'basic' | 'premium' | 'vip';
  dailyRequestLimit: number;
  monthlyRequestLimit: number;
  maxTokensPerRequest: number;
  availableModels: string[];
  toolsEnabled: string[];
  streamingEnabled: boolean;
  advancedFeatures: boolean;
  proactiveAgent: boolean;
  costPerRequest: number;
}

interface AIAgentRequest {
  messages: AIChatMessage[];
  userId: string;
  subscriptionTier: 'basic' | 'premium' | 'vip';
  context?: { page, userData, sessionData, goals, recentActivity };
  tools?: string[];
  stream?: boolean;
}
```

#### Available Tools:
1. **bookingTool** - Book therapy sessions
2. **goalTool** - Update wellness goals
3. **reminderTool** - Send reminders
4. **reportTool** - Generate reports

#### Subscription Tiers:
- **Basic**: 50 daily / 1000 monthly requests, GPT-3.5 only, no tools
- **Premium**: 200 daily / 5000 monthly requests, GPT-4 + Claude, basic tools, streaming
- **VIP**: 500 daily / 10000 monthly requests, all models, all tools, proactive agent

#### Current Import:
1. `src/app/api/ai/chat/route.ts` - API endpoint for chat functionality

## Consolidation Recommendations

### Approach 1: Unified Service (Recommended)
Merge all three services into a single comprehensive AI service:

```
ai-service-unified.ts (new)
├── Core functionality from AIService
├── Subscription tier management from AISDKNextService
├── Tool integration from AISDKNextService
└── Enhanced streaming from VercelAIService
```

#### Benefits:
- ✅ Single source of truth
- ✅ Consistent API across the application
- ✅ Reduced code duplication
- ✅ Easier maintenance
- ✅ Better type safety

#### Implementation Plan:
1. Create `ai-service-unified.ts` combining best features
2. Add subscription tier management to base service
3. Integrate tool support
4. Migrate existing imports one by one
5. Deprecate old services with clear migration path

### Approach 2: Layered Architecture (Alternative)
Keep services separate with clear boundaries:

```
ai-service.ts (base layer)
├── Basic text generation
├── Multi-provider support
└── Fallback mechanisms

ai-service-premium.ts (extends base)
├── Subscription management
├── Usage tracking
└── Tier-based features

ai-service-tools.ts (tool layer)
├── Tool integration
├── Proactive agent
└── Advanced workflows
```

## Migration Path

### Phase 1: Audit Current Usage
- [x] Identify all imports of each service
- [x] Document usage patterns
- [ ] Test critical paths

### Phase 2: Create Unified Service
- [ ] Design unified API
- [ ] Implement core features
- [ ] Add subscription management
- [ ] Integrate tools
- [ ] Add comprehensive tests

### Phase 3: Gradual Migration
- [ ] Migrate AIService imports (3 files)
- [ ] Migrate VercelAIService imports (1 file)
- [ ] Migrate AISDKNextService imports (1 file)
- [ ] Update API endpoints

### Phase 4: Cleanup
- [ ] Remove deprecated services
- [ ] Update documentation
- [ ] Performance optimization

## Usage Patterns

### Current Wellness Insights Pattern
```typescript
// Used in enhanced-patient-dashboard.tsx
const insights = await generateWellnessInsights({
  userData: {
    sessionsCompleted: userSessions.length,
    mood: recentMood?.value || 'neutral',
    goals: userGoals.join(', '),
    name: user.name
  }
});
```

### Current Therapy Recommendations Pattern
```typescript
// Used in enhanced-therapist-dashboard.tsx
const recommendations = await generateTherapyRecommendations(
  "Provide personalized therapy recommendations",
  `Patient context: ${JSON.stringify(patientData)}`,
  therapist.id
);
```

### Current Chat API Pattern
```typescript
// Used in src/app/api/ai/chat/route.ts
const aiService = AISDKNextService.getInstance();
const response = await aiService.handleChatRequest({
  messages,
  userId: user.id,
  subscriptionTier: user.tier,
  context: { page, userData, sessionData }
});
```

## Best Practices

### 1. Error Handling
Always implement fallback responses:
```typescript
try {
  const response = await aiService.generate(request);
  return response;
} catch (error) {
  console.error('AI Service Error:', error);
  return fallbackResponse(request);
}
```

### 2. Rate Limiting
Check subscription tier before making requests:
```typescript
const config = getSubscriptionConfig(user.tier);
if (userRequestCount >= config.dailyRequestLimit) {
  throw new Error('Daily request limit exceeded');
}
```

### 3. Context Management
Provide relevant context for better responses:
```typescript
const response = await aiService.generate({
  input: userQuery,
  context: {
    sessionHistory: recentSessions,
    userGoals: activeGoals,
    currentMood: latestMoodEntry,
    therapistNotes: relevantNotes
  }
});
```

### 4. Token Management
Monitor and optimize token usage:
```typescript
const response = await aiService.generate({
  input: userQuery,
  maxTokens: tier === 'vip' ? 4000 : 2000,
  temperature: 0.7
});

// Log usage
await logAIUsage({
  userId: user.id,
  tokens: response.usage.totalTokens,
  cost: calculateCost(response.usage, user.tier)
});
```

## Performance Considerations

1. **Caching**: Implement response caching for common queries
2. **Streaming**: Use streaming for long responses to improve UX
3. **Batching**: Batch similar requests when possible
4. **Model Selection**: Use appropriate model based on complexity
   - Simple queries: GPT-3.5 Turbo
   - Complex analysis: GPT-4 Turbo
   - Long context: Claude 3

## Security Considerations

1. **API Key Management**: Store keys in environment variables
2. **Rate Limiting**: Implement per-user rate limits
3. **Input Validation**: Sanitize all user inputs
4. **PII Protection**: Avoid sending sensitive PII to AI providers
5. **Audit Logging**: Log all AI requests for compliance

## Analytics Integration

Track AI usage metrics:
```typescript
interface AIMetrics {
  totalRequests: number;
  successRate: number;
  averageTokens: number;
  averageLatency: number;
  costByTier: Record<Tier, number>;
  popularFeatures: string[];
}
```

## Future Enhancements

1. **Multi-modal Support**: Add image and voice processing
2. **Fine-tuning**: Custom models for specific therapy approaches
3. **Advanced Personalization**: User-specific model fine-tuning
4. **Conversation Memory**: Long-term conversation history
5. **Proactive Suggestions**: AI-initiated wellness check-ins
6. **Integration with External Tools**: Calendar, mood tracking apps
7. **Real-time Collaboration**: Multi-user AI sessions

## Conclusion

The current AI services provide robust functionality but would benefit from consolidation. The recommended approach is to create a unified service that combines the best features of all three implementations while maintaining backward compatibility during migration.

**Priority Actions:**
1. ✅ Document current architecture (this document)
2. [ ] Design unified service API
3. [ ] Implement unified service with tests
4. [ ] Create migration guide for developers
5. [ ] Execute gradual migration
6. [ ] Deprecate old services
7. [ ] Update all documentation

**Estimated Effort:**
- Design & Implementation: 2-3 days
- Migration: 1-2 days
- Testing & Documentation: 1 day
- Total: 4-6 days
