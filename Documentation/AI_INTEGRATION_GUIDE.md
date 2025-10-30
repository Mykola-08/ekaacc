# AI Integration Guide - EKA Personalization

## 🎯 Overview
This guide explains how to replace the simulated AI insights in the onboarding flow with real AI service integration.

## 📍 Current Implementation

### Location
`src/components/eka/comprehensive-onboarding.tsx` - Line ~191

### Current Simulated Function
```typescript
const generateAIInsights = async (): Promise<Partial<User['personalization']>> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulated AI-generated persona profile
  const aiPersonaProfile = `Based on your responses, you appear to be someone who values ${data.values?.[0] || 'personal growth'} and is motivated by ${data.motivations?.[0] || 'self-improvement'}. Your focus on ${data.therapeuticGoals?.[0] || 'wellness'} suggests you're ready for meaningful change. We recommend a holistic approach that combines ${data.preferredApproaches?.[0] || 'mindfulness'} with regular self-reflection.`;

  // Generate recommended approaches based on user input
  const aiRecommendedApproaches = data.preferredApproaches || ['Cognitive Behavioral Therapy', 'Mindfulness', 'Goal Setting'];

  // Predict user needs based on challenges and lifestyle
  const aiPredictedNeeds = [
    ...(data.currentChallenges || []).map(c => `Support for ${c.toLowerCase()}`),
    `Work-life balance coaching`,
    `Stress management techniques`
  ].slice(0, 5);

  // Calculate personalization score
  const completionFactors = [
    data.fullName ? 10 : 0,
    data.therapeuticGoals?.length || 0 * 5,
    data.preferredApproaches?.length || 0 * 5,
    data.lifestyleFactors.workStressLevel ? 10 : 0,
    data.lifestyleFactors.sleepQuality ? 10 : 0,
    data.motivations?.length || 0 * 5,
    data.personalityTraits?.length || 0 * 5,
  ];
  const aiPersonalizationScore = Math.min(100, completionFactors.reduce((a, b) => a + b, 0));

  return {
    ...data,
    aiPersonaProfile,
    aiRecommendedApproaches,
    aiPredictedNeeds,
    aiPersonalizationScore,
  };
};
```

## 🚀 Recommended AI Service Options

### Option 1: OpenAI GPT-4 (Recommended)
**Best for:** Natural language persona generation, therapy recommendations

**Pros:**
- Excellent understanding of psychological concepts
- High-quality, human-like text generation
- Well-documented API
- Large context window

**Cons:**
- Requires API key (costs money)
- Needs rate limiting
- Response times vary (1-5 seconds)

**Setup:**
```bash
npm install openai
```

**Environment Variables:**
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

### Option 2: Azure OpenAI Service
**Best for:** Enterprise deployments, compliance requirements

**Pros:**
- Same models as OpenAI
- Enterprise-grade security
- Data residency options
- SLA guarantees

**Cons:**
- Requires Azure account
- More complex setup
- Higher cost

**Setup:**
```bash
npm install @azure/openai
```

**Environment Variables:**
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment
```

### Option 3: Anthropic Claude
**Best for:** Privacy-focused implementations, ethical AI

**Pros:**
- Strong ethical guidelines
- Good at nuanced understanding
- Competitive pricing
- Privacy-focused

**Cons:**
- Newer API (less examples)
- Smaller community
- Regional availability

**Setup:**
```bash
npm install @anthropic-ai/sdk
```

### Option 4: Google Gemini
**Best for:** Multimodal needs (future expansion)

**Pros:**
- Free tier available
- Fast response times
- Multimodal capabilities
- Google ecosystem integration

**Cons:**
- Newer platform
- Limited availability in some regions
- API still evolving

**Setup:**
```bash
npm install @google/generative-ai
```

## 📝 Implementation Steps

### Step 1: Create API Route Handler

Create `src/app/api/ai/generate-persona/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Construct prompt from user data
    const prompt = `You are a compassionate mental health AI assistant. Based on the following user information, create a personalized wellness profile.

User Profile:
- Name: ${userData.fullName}
- Age: ${userData.age}
- Occupation: ${userData.occupation}
- Therapeutic Goals: ${userData.therapeuticGoals?.join(', ')}
- Current Challenges: ${userData.currentChallenges?.join(', ')}
- Pain Areas: ${userData.painAreas?.join(', ')}
- Work Stress Level: ${userData.lifestyleFactors?.workStressLevel}/5
- Sleep Quality: ${userData.lifestyleFactors?.sleepQuality}/5
- Exercise Frequency: ${userData.lifestyleFactors?.exerciseFrequency}
- Preferred Approaches: ${userData.preferredApproaches?.join(', ')}
- Motivations: ${userData.motivations?.join(', ')}
- Personality Traits: ${userData.personalityTraits?.join(', ')}
- Values: ${userData.values?.join(', ')}

Please generate:
1. A compassionate 2-3 sentence persona profile
2. 3-5 recommended therapeutic approaches (as a comma-separated list)
3. 3-5 predicted needs based on their challenges (as a comma-separated list)
4. A wellness score from 0-100 based on their lifestyle factors

Format your response as JSON:
{
  "personaProfile": "...",
  "recommendedApproaches": ["...", "..."],
  "predictedNeeds": ["...", "..."],
  "wellnessScore": 85
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a compassionate AI wellness assistant specializing in personalized mental health support. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      aiPersonaProfile: aiResponse.personaProfile,
      aiRecommendedApproaches: aiResponse.recommendedApproaches,
      aiPredictedNeeds: aiResponse.predictedNeeds,
      aiPersonalizationScore: aiResponse.wellnessScore,
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}
```

### Step 2: Update Onboarding Component

Replace the `generateAIInsights` function in `comprehensive-onboarding.tsx`:

```typescript
const generateAIInsights = async (): Promise<Partial<User['personalization']>> => {
  try {
    const response = await fetch('/api/ai/generate-persona', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('AI generation failed');
    }

    const aiInsights = await response.json();

    return {
      ...data,
      aiPersonaProfile: aiInsights.aiPersonaProfile,
      aiRecommendedApproaches: aiInsights.aiRecommendedApproaches,
      aiPredictedNeeds: aiInsights.aiPredictedNeeds,
      aiPersonalizationScore: aiInsights.aiPersonalizationScore,
    };
  } catch (error) {
    console.error('Failed to generate AI insights:', error);
    
    // Fallback to simulated insights if AI fails
    return generateSimulatedInsights(data);
  }
};

// Keep original function as fallback
const generateSimulatedInsights = (userData: OnboardingData): Partial<User['personalization']> => {
  // Original simulated logic here...
};
```

### Step 3: Add Error Handling & Retry Logic

```typescript
const generateAIInsights = async (retries = 3): Promise<Partial<User['personalization']>> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('/api/ai/generate-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const aiInsights = await response.json();

      // Validate response structure
      if (!aiInsights.aiPersonaProfile || !aiInsights.aiRecommendedApproaches) {
        throw new Error('Invalid AI response structure');
      }

      return {
        ...data,
        aiPersonaProfile: aiInsights.aiPersonaProfile,
        aiRecommendedApproaches: aiInsights.aiRecommendedApproaches,
        aiPredictedNeeds: aiInsights.aiPredictedNeeds,
        aiPersonalizationScore: aiInsights.aiPersonalizationScore,
      };
    } catch (error) {
      console.error(`AI generation attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        // Final attempt failed, use fallback
        toast({
          variant: 'warning',
          title: 'Using Standard Profile',
          description: 'AI personalization is currently unavailable. Using standard profile instead.',
        });
        return generateSimulatedInsights(data);
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  // Typescript requires this, but should never reach here
  return generateSimulatedInsights(data);
};
```

### Step 4: Add Loading States

Update the onboarding component UI:

```typescript
const [aiStatus, setAiStatus] = useState<'idle' | 'generating' | 'success' | 'fallback'>('idle');

const handleComplete = async () => {
  setIsGeneratingInsights(true);
  setAiStatus('generating');
  
  toast({
    title: '✨ Generating your personalized profile...',
    description: 'Our AI is analyzing your responses to create the perfect experience.'
  });

  try {
    const personalizationData = await generateAIInsights();
    
    setAiStatus('success');
    toast({
      title: '🎉 Welcome to EKA!',
      description: 'Your personalized dashboard is ready.',
    });
    
    onComplete(personalizationData);
  } catch (error) {
    setAiStatus('fallback');
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Failed to process your responses. Please try again.'
    });
  } finally {
    setIsGeneratingInsights(false);
  }
};
```

## 🔐 Security Best Practices

### 1. API Key Management
```env
# .env.local (NEVER commit this file)
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...

# Add to .gitignore
.env.local
.env*.local
```

### 2. Rate Limiting
Create `src/lib/rate-limiter.ts`:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 requests per hour per user
  analytics: true,
});
```

Use in API route:

```typescript
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await rateLimiter.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Rest of the code...
}
```

### 3. Input Validation
```typescript
import { z } from 'zod';

const UserDataSchema = z.object({
  fullName: z.string().min(1).max(100),
  age: z.number().min(13).max(120),
  therapeuticGoals: z.array(z.string()).min(1).max(10),
  // ... rest of validation
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  const validationResult = UserDataSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid input data', details: validationResult.error },
      { status: 400 }
    );
  }

  const userData = validationResult.data;
  // Process validated data...
}
```

### 4. Content Filtering
```typescript
// Check for sensitive content
const containsSensitiveContent = (text: string): boolean => {
  const sensitivePatterns = [
    /\b(suicide|self-harm|kill myself)\b/i,
    /\b(abuse|assault|trauma)\b/i,
  ];
  return sensitivePatterns.some(pattern => pattern.test(text));
};

// In API route
if (containsSensitiveContent(JSON.stringify(userData))) {
  // Flag for human review or provide crisis resources
  return NextResponse.json({
    requiresReview: true,
    crisisResources: [
      'National Suicide Prevention Lifeline: 988',
      'Crisis Text Line: Text HOME to 741741'
    ]
  });
}
```

## 📊 Monitoring & Analytics

### Track AI Usage
```typescript
import { analytics } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const result = await openai.chat.completions.create({...});
    
    // Track successful generation
    analytics.track('ai_persona_generated', {
      duration: Date.now() - startTime,
      tokens_used: result.usage?.total_tokens,
      model: process.env.OPENAI_MODEL,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    // Track failures
    analytics.track('ai_persona_failed', {
      error: error.message,
      duration: Date.now() - startTime,
    });
    throw error;
  }
}
```

## 💰 Cost Optimization

### 1. Caching Results
```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(request: NextRequest) {
  const userData = await request.json();
  
  // Create cache key from user data hash
  const cacheKey = `ai_persona:${hashUserData(userData)}`;
  
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }
  
  // Generate new insights
  const insights = await generateInsights(userData);
  
  // Cache for 24 hours
  await redis.setex(cacheKey, 86400, insights);
  
  return NextResponse.json(insights);
}
```

### 2. Batch Processing
Instead of generating insights immediately, queue them:

```typescript
import { Queue } from 'bullmq';

const aiQueue = new Queue('ai-persona-generation');

// In onboarding component
await aiQueue.add('generate-persona', { userId, userData });

// Process in background worker
// Worker can process multiple requests in batch
```

### 3. Use Cheaper Models for Simple Tasks
```typescript
const selectModel = (complexity: 'simple' | 'complex') => {
  if (complexity === 'simple') {
    return 'gpt-3.5-turbo'; // Faster, cheaper
  }
  return 'gpt-4-turbo-preview'; // More accurate
};
```

## 🧪 Testing

### Unit Test Example
```typescript
import { POST } from '@/app/api/ai/generate-persona/route';

describe('AI Persona Generation API', () => {
  it('should generate valid persona from user data', async () => {
    const mockRequest = new Request('http://localhost/api/ai/generate-persona', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Test User',
        age: 30,
        therapeuticGoals: ['Reduce anxiety'],
        // ... rest of data
      }),
    });

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(data.aiPersonaProfile).toBeTruthy();
    expect(data.aiRecommendedApproaches).toBeInstanceOf(Array);
    expect(data.aiPersonalizationScore).toBeGreaterThan(0);
  });
});
```

## 🚀 Deployment Checklist

- [ ] API keys stored in environment variables
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Error handling and fallbacks configured
- [ ] Logging and monitoring setup
- [ ] Cost tracking enabled
- [ ] Content filtering active
- [ ] Cache strategy implemented
- [ ] Load testing completed
- [ ] Privacy policy updated
- [ ] User consent obtained
- [ ] HIPAA compliance verified (if applicable)

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Azure OpenAI Service](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [AI Safety Best Practices](https://openai.com/safety)

---

**Ready to integrate AI?** Start with the simpler implementation and gradually add features like caching, rate limiting, and advanced error handling as needed.
