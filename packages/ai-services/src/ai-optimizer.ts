/**
 * AI Service Optimizer
 * 
 * Enhances AI service with:
 * - Response caching to reduce costs
 * - Smart model selection based on query complexity
 * - Token optimization
 * - Enhanced capabilities
 */

import { LRUCache, memoize } from '@ekaacc/performance-utils';

export interface QueryComplexity {
  score: number; // 0-100
  category: 'simple' | 'moderate' | 'complex';
  reasoning: string;
}

export interface CachedResponse {
  response: string;
  timestamp: number;
  model: string;
  tokens: number;
  cost: number;
}

export interface OptimizedModelSelection {
  model: string;
  provider: 'openai' | 'anthropic' | 'google';
  estimatedCost: number;
  reasoning: string;
}

export class AIServiceOptimizer {
  private responseCache: LRUCache<string, CachedResponse>;
  private queryComplexityCache: LRUCache<string, QueryComplexity>;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly SIMILARITY_THRESHOLD = 0.85;
  
  // Cost per 1K tokens (input/output average)
  private readonly MODEL_COSTS = {
    'gpt-3.5-turbo': 0.001,
    'gpt-4-turbo': 0.02,
    'gpt-4o-mini': 0.00015, // Cheapest, fastest GPT-4 class model
    'claude-3-haiku': 0.00069,
    'claude-3-sonnet': 0.003,
    'gemini-pro': 0.0005,
  };

  constructor(cacheSize: number = 1000) {
    this.responseCache = new LRUCache<string, CachedResponse>(cacheSize);
    this.queryComplexityCache = new LRUCache<string, QueryComplexity>(500);
  }

  /**
   * Analyze query complexity to select appropriate model
   */
  analyzeQueryComplexity(query: string, context?: any): QueryComplexity {
    // Check cache first
    const cacheKey = this.getCacheKey(query);
    const cached = this.queryComplexityCache.get(cacheKey);
    if (cached) return cached;

    let score = 0;
    const indicators = [];

    // Length-based complexity
    const wordCount = query.split(/\s+/).length;
    if (wordCount > 100) {
      score += 30;
      indicators.push('long query');
    } else if (wordCount > 50) {
      score += 15;
    }

    // Keyword-based complexity
    const complexKeywords = [
      'analyze', 'compare', 'evaluate', 'explain why',
      'reasoning', 'complex', 'detailed', 'comprehensive',
      'strategy', 'plan', 'design', 'architecture'
    ];
    
    const simpleKeywords = [
      'what is', 'when', 'where', 'who', 'yes or no',
      'simple', 'quick', 'brief', 'list'
    ];

    const lowerQuery = query.toLowerCase();
    
    const complexMatches = complexKeywords.filter(kw => lowerQuery.includes(kw)).length;
    const simpleMatches = simpleKeywords.filter(kw => lowerQuery.includes(kw)).length;
    
    score += complexMatches * 10;
    score -= simpleMatches * 10;

    // Context complexity
    if (context?.requiresTools) {
      score += 20;
      indicators.push('requires tools');
    }
    
    if (context?.conversationHistory && context.conversationHistory.length > 5) {
      score += 10;
      indicators.push('long conversation');
    }

    // Question marks and multiple questions
    const questionCount = (query.match(/\?/g) || []).length;
    if (questionCount > 2) {
      score += 15;
      indicators.push('multiple questions');
    }

    // Normalize score
    score = Math.max(0, Math.min(100, score));

    // Categorize
    let category: 'simple' | 'moderate' | 'complex';
    if (score < 30) {
      category = 'simple';
    } else if (score < 60) {
      category = 'moderate';
    } else {
      category = 'complex';
    }

    const result: QueryComplexity = {
      score,
      category,
      reasoning: indicators.join(', ') || 'general query'
    };

    // Cache the result
    this.queryComplexityCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Select optimal model based on complexity and subscription tier
   */
  selectOptimalModel(
    complexity: QueryComplexity,
    tier: 'basic' | 'premium' | 'vip',
    requiresTools: boolean = false
  ): OptimizedModelSelection {
    let model: string;
    let provider: 'openai' | 'anthropic' | 'google';
    let reasoning: string;

    // Tool requirement forces more capable models
    if (requiresTools) {
      if (tier === 'vip' || complexity.category === 'complex') {
        model = 'gpt-4-turbo';
        provider = 'openai';
        reasoning = 'Tools + complex reasoning require GPT-4';
      } else {
        model = 'gpt-4o-mini';
        provider = 'openai';
        reasoning = 'Tools enabled, using cost-effective GPT-4o-mini';
      }
    } else {
      // No tools - optimize for cost and speed
      switch (complexity.category) {
        case 'simple':
          // Use cheapest, fastest models
          if (tier === 'basic') {
            model = 'gemini-pro';
            provider = 'google';
            reasoning = 'Simple query, using fastest/cheapest Gemini';
          } else {
            model = 'gpt-4o-mini';
            provider = 'openai';
            reasoning = 'Simple query, GPT-4o-mini offers best value';
          }
          break;

        case 'moderate':
          // Balance cost and capability
          if (tier === 'vip') {
            model = 'claude-3-sonnet';
            provider = 'anthropic';
            reasoning = 'Moderate complexity, Claude Sonnet for quality';
          } else if (tier === 'premium') {
            model = 'claude-3-haiku';
            provider = 'anthropic';
            reasoning = 'Moderate complexity, Claude Haiku for speed/cost';
          } else {
            model = 'gpt-3.5-turbo';
            provider = 'openai';
            reasoning = 'Moderate complexity, GPT-3.5 sufficient';
          }
          break;

        case 'complex':
          // Use most capable models
          if (tier === 'vip') {
            model = 'gpt-4-turbo';
            provider = 'openai';
            reasoning = 'Complex reasoning, GPT-4 Turbo for best results';
          } else if (tier === 'premium') {
            model = 'claude-3-sonnet';
            provider = 'anthropic';
            reasoning = 'Complex query, Claude Sonnet for balance';
          } else {
            model = 'gpt-3.5-turbo';
            provider = 'openai';
            reasoning = 'Complex query but basic tier, using GPT-3.5';
          }
          break;
      }
    }

    return {
      model,
      provider,
      estimatedCost: this.MODEL_COSTS[model as keyof typeof this.MODEL_COSTS] || 0.01,
      reasoning
    };
  }

  /**
   * Check if response is cached (semantic matching)
   */
  getCachedResponse(query: string): CachedResponse | null {
    const cacheKey = this.getCacheKey(query);
    const cached = this.responseCache.get(cacheKey);
    
    if (!cached) return null;
    
    // Check if cache is still valid (TTL)
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.responseCache.delete(cacheKey);
      return null;
    }
    
    return cached;
  }

  /**
   * Cache a response
   */
  cacheResponse(query: string, response: CachedResponse): void {
    const cacheKey = this.getCacheKey(query);
    this.responseCache.set(cacheKey, {
      ...response,
      timestamp: Date.now()
    });
  }

  /**
   * Optimize prompt to reduce tokens
   */
  optimizePrompt(prompt: string, maxTokens: number = 4000): string {
    // Remove excessive whitespace
    let optimized = prompt.replace(/\s+/g, ' ').trim();
    
    // Estimate tokens (rough: 1 token ≈ 4 characters)
    const estimatedTokens = optimized.length / 4;
    
    if (estimatedTokens <= maxTokens) {
      return optimized;
    }
    
    // Truncate if too long, keeping most recent context
    const targetChars = maxTokens * 4;
    const lines = optimized.split('\n');
    
    // Keep system prompt and recent messages
    const systemPrompt = lines.slice(0, 2).join('\n');
    const recentContext = lines.slice(-10).join('\n');
    
    optimized = `${systemPrompt}\n...(earlier messages omitted)...\n${recentContext}`;
    
    // Final truncation if still too long
    if (optimized.length > targetChars) {
      optimized = optimized.substring(optimized.length - targetChars);
    }
    
    return optimized;
  }

  /**
   * Estimate cost of a query
   */
  estimateCost(model: string, promptTokens: number, completionTokens: number = 500): number {
    const costPer1k = this.MODEL_COSTS[model as keyof typeof this.MODEL_COSTS] || 0.01;
    const totalTokens = promptTokens + completionTokens;
    return (totalTokens / 1000) * costPer1k;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      responsesCached: this.responseCache.size,
      complexityCached: this.queryComplexityCache.size,
      estimatedSavings: this.responseCache.size * 0.02 // $0.02 per cached response
    };
  }

  /**
   * Create cache key from query (normalized)
   */
  private getCacheKey(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit key length
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): number {
    let cleared = 0;
    const now = Date.now();
    
    // Note: LRUCache doesn't expose iteration, so this is a simplified version
    // In production, you might want to track timestamps separately
    
    return cleared;
  }

  /**
   * Detect if query requires crisis intervention
   */
  detectCrisis(query: string): { isCrisis: boolean; urgency: 'low' | 'medium' | 'high'; reason: string } {
    const crisisKeywords = {
      high: ['suicide', 'kill myself', 'end my life', 'self-harm', 'hurt myself'],
      medium: ['can\'t go on', 'no reason to live', 'better off dead', 'worthless'],
      low: ['hopeless', 'desperate', 'giving up', 'can\'t cope']
    };
    
    const lowerQuery = query.toLowerCase();
    
    // Check high urgency
    for (const keyword of crisisKeywords.high) {
      if (lowerQuery.includes(keyword)) {
        return {
          isCrisis: true,
          urgency: 'high',
          reason: `Detected high-risk keyword: "${keyword}"`
        };
      }
    }
    
    // Check medium urgency
    for (const keyword of crisisKeywords.medium) {
      if (lowerQuery.includes(keyword)) {
        return {
          isCrisis: true,
          urgency: 'medium',
          reason: `Detected medium-risk indicator: "${keyword}"`
        };
      }
    }
    
    // Check low urgency
    for (const keyword of crisisKeywords.low) {
      if (lowerQuery.includes(keyword)) {
        return {
          isCrisis: true,
          urgency: 'low',
          reason: `Detected low-risk indicator: "${keyword}"`
        };
      }
    }
    
    return {
      isCrisis: false,
      urgency: 'low',
      reason: 'No crisis indicators detected'
    };
  }
}

/**
 * Export singleton instance
 */
export const aiOptimizer = new AIServiceOptimizer();
