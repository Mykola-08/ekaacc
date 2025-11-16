import { simpleAI } from './simple-ai-service';

export type ServiceTier = 'basic' | 'premium' | 'enterprise';
export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'openrouter';

export interface AIRequest {
  input: string;
  context?: Record<string, any>;
  tier?: ServiceTier;
  priority?: 'low' | 'medium' | 'high';
  cacheable?: boolean;
  batchable?: boolean;
}

export interface AIResponse {
  output: string;
  confidence: number;
  metadata?: Record<string, any>;
  cost?: number;
  latency?: number;
  provider?: AIProvider;
  model?: string;
}

export interface UsageMetrics {
  totalRequests: number;
  totalCost: number;
  averageLatency: number;
  requestsByTier: Record<ServiceTier, number>;
  requestsByProvider: Record<AIProvider, number>;
  costByTier: Record<ServiceTier, number>;
  cacheHitRate: number;
  batchEfficiency: number;
}

export interface TierConfig {
  name: ServiceTier;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  supportedProviders: AIProvider[];
  modelPreferences: Record<AIProvider, string[]>;
  fallbackEnabled: boolean;
  cachingEnabled: boolean;
  batchingEnabled: boolean;
  costLimit: number;
  features: string[];
}

export interface ProviderConfig {
  name: AIProvider;
  apiKey: string;
  baseURL?: string;
  models: Record<string, ModelConfig>;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  costPerToken: {
    input: number;
    output: number;
  };
  maxTokens: number;
  supportedFeatures: string[];
}

export interface ModelConfig {
  name: string;
  tier: ServiceTier;
  costMultiplier: number;
  qualityScore: number;
  speedScore: number;
  contextWindow: number;
  maxOutputTokens: number;
  supportedFeatures: string[];
}

export interface CacheEntry {
  key: string;
  response: AIResponse;
  timestamp: number;
  ttl: number;
}

export interface BatchRequest {
  id: string;
  request: AIRequest;
  resolve: (response: AIResponse) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

export class TieredAIService {
  private static instance: TieredAIService;
  private usageMetrics: UsageMetrics;
  private requestCache: Map<string, CacheEntry>;
  private batchQueue: BatchRequest[];
  private batchTimer: NodeJS.Timeout | null;
  private providerConfigs: Map<AIProvider, ProviderConfig>;
  private tierConfigs: Map<ServiceTier, TierConfig>;
  private currentCosts: Map<ServiceTier, number>;
  private requestCounts: Map<string, number>;
  
  private constructor() {
    this.usageMetrics = {
      totalRequests: 0,
      totalCost: 0,
      averageLatency: 0,
      requestsByTier: { basic: 0, premium: 0, enterprise: 0 },
      requestsByProvider: { gemini: 0, openai: 0, anthropic: 0, openrouter: 0 },
      costByTier: { basic: 0, premium: 0, enterprise: 0 },
      cacheHitRate: 0,
      batchEfficiency: 0
    };
    
    this.requestCache = new Map();
    this.batchQueue = [];
    this.batchTimer = null;
    this.providerConfigs = new Map();
    this.tierConfigs = new Map();
    this.currentCosts = new Map();
    this.requestCounts = new Map();
    
    this.initializeConfigs();
    this.startBatchProcessor();
  }
  
  static getInstance(): TieredAIService {
    if (!TieredAIService.instance) {
      TieredAIService.instance = new TieredAIService();
    }
    return TieredAIService.instance;
  }
  
  private initializeConfigs(): void {
    this.initializeTierConfigs();
    this.initializeProviderConfigs();
  }
  
  private initializeTierConfigs(): void {
    this.tierConfigs.set('basic', {
      name: 'basic',
      maxRequestsPerHour: 100,
      maxRequestsPerDay: 1000,
      supportedProviders: ['gemini', 'openrouter'],
      modelPreferences: {
        gemini: ['gemini-1.5-flash', 'gemini-pro'],
        openai: ['gpt-3.5-turbo', 'gpt-4o-mini'],
        anthropic: ['claude-3-haiku', 'claude-3-sonnet'],
        openrouter: ['google/gemini-flash-1.5', 'meta-llama/llama-3.1-8b-instruct']
      },
      fallbackEnabled: true,
      cachingEnabled: true,
      batchingEnabled: true,
      costLimit: 10.0,
      features: ['basic-chat', 'simple-summaries', 'basic-recommendations']
    });
    
    this.tierConfigs.set('premium', {
      name: 'premium',
      maxRequestsPerHour: 500,
      maxRequestsPerDay: 5000,
      supportedProviders: ['gemini', 'openai', 'anthropic', 'openrouter'],
      modelPreferences: {
        gemini: ['gemini-1.5-pro', 'gemini-ultra'],
        openai: ['gpt-4o-mini', 'gpt-4o'],
        anthropic: ['claude-3-haiku', 'claude-3-sonnet'],
        openrouter: ['anthropic/claude-3-haiku', 'openai/gpt-4o-mini']
      },
      fallbackEnabled: true,
      cachingEnabled: true,
      batchingEnabled: true,
      costLimit: 50.0,
      features: [
        'basic-chat', 'advanced-chat', 'detailed-summaries', 'personalized-recommendations',
        'predictive-analytics', 'trend-analysis', 'insight-generation'
      ]
    });
    
    this.tierConfigs.set('enterprise', {
      name: 'enterprise',
      maxRequestsPerHour: 2000,
      maxRequestsPerDay: 20000,
      supportedProviders: ['gemini', 'openai', 'anthropic', 'openrouter'],
      modelPreferences: {
        gemini: ['gemini-1.5-pro', 'gemini-ultra'],
        openai: ['gpt-4o', 'gpt-4-turbo'],
        anthropic: ['claude-3-sonnet', 'claude-3-opus'],
        openrouter: ['anthropic/claude-3-sonnet', 'openai/gpt-4o']
      },
      fallbackEnabled: true,
      cachingEnabled: true,
      batchingEnabled: true,
      costLimit: 200.0,
      features: [
        'basic-chat', 'advanced-chat', 'premium-chat', 'detailed-summaries',
        'personalized-recommendations', 'predictive-analytics', 'trend-analysis',
        'insight-generation', 'custom-models', 'priority-support', 'white-label'
      ]
    });
  }
  
  private initializeProviderConfigs(): void {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openrouterKey = process.env.OPEN_ROUTER_API_KEY;
    
    if (geminiKey) {
      this.providerConfigs.set('gemini', {
        name: 'gemini',
        apiKey: geminiKey,
        models: {
          'gemini-1.5-flash': {
            name: 'gemini-1.5-flash',
            tier: 'basic',
            costMultiplier: 0.5,
            qualityScore: 0.8,
            speedScore: 0.9,
            contextWindow: 1000000,
            maxOutputTokens: 8192,
            supportedFeatures: ['basic-chat', 'simple-summaries']
          },
          'gemini-pro': {
            name: 'gemini-pro',
            tier: 'basic',
            costMultiplier: 1.0,
            qualityScore: 0.85,
            speedScore: 0.8,
            contextWindow: 1000000,
            maxOutputTokens: 8192,
            supportedFeatures: ['basic-chat', 'simple-summaries', 'basic-recommendations']
          },
          'gemini-1.5-pro': {
            name: 'gemini-1.5-pro',
            tier: 'premium',
            costMultiplier: 2.0,
            qualityScore: 0.9,
            speedScore: 0.7,
            contextWindow: 2000000,
            maxOutputTokens: 8192,
            supportedFeatures: ['basic-chat', 'advanced-chat', 'detailed-summaries', 'personalized-recommendations']
          },
          'gemini-ultra': {
            name: 'gemini-ultra',
            tier: 'enterprise',
            costMultiplier: 4.0,
            qualityScore: 0.95,
            speedScore: 0.6,
            contextWindow: 2000000,
            maxOutputTokens: 8192,
            supportedFeatures: ['premium-chat', 'detailed-summaries', 'predictive-analytics', 'insight-generation']
          }
        },
        rateLimits: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          requestsPerDay: 10000
        },
        costPerToken: {
          input: 0.000001,
          output: 0.000002
        },
        maxTokens: 2000000,
        supportedFeatures: ['basic-chat', 'advanced-chat', 'premium-chat', 'summaries', 'recommendations', 'analytics']
      });
    }
    
    if (openrouterKey) {
      this.providerConfigs.set('openrouter', {
        name: 'openrouter',
        apiKey: openrouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        models: {
          'google/gemini-flash-1.5': {
            name: 'google/gemini-flash-1.5',
            tier: 'basic',
            costMultiplier: 0.6,
            qualityScore: 0.8,
            speedScore: 0.9,
            contextWindow: 1000000,
            maxOutputTokens: 8192,
            supportedFeatures: ['basic-chat', 'simple-summaries']
          },
          'meta-llama/llama-3.1-8b-instruct': {
            name: 'meta-llama/llama-3.1-8b-instruct',
            tier: 'basic',
            costMultiplier: 0.3,
            qualityScore: 0.75,
            speedScore: 0.95,
            contextWindow: 128000,
            maxOutputTokens: 4096,
            supportedFeatures: ['basic-chat', 'simple-summaries']
          },
          'anthropic/claude-3-haiku': {
            name: 'anthropic/claude-3-haiku',
            tier: 'premium',
            costMultiplier: 1.5,
            qualityScore: 0.85,
            speedScore: 0.85,
            contextWindow: 200000,
            maxOutputTokens: 4096,
            supportedFeatures: ['basic-chat', 'advanced-chat', 'detailed-summaries']
          },
          'openai/gpt-4o-mini': {
            name: 'openai/gpt-4o-mini',
            tier: 'premium',
            costMultiplier: 1.2,
            qualityScore: 0.88,
            speedScore: 0.8,
            contextWindow: 128000,
            maxOutputTokens: 16384,
            supportedFeatures: ['basic-chat', 'advanced-chat', 'detailed-summaries', 'personalized-recommendations']
          }
        },
        rateLimits: {
          requestsPerMinute: 120,
          requestsPerHour: 2000,
          requestsPerDay: 20000
        },
        costPerToken: {
          input: 0.0000015,
          output: 0.000003
        },
        maxTokens: 2000000,
        supportedFeatures: ['basic-chat', 'advanced-chat', 'summaries', 'recommendations']
      });
    }
  }
  
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const tier = request.tier || 'basic';
    
    console.log('generateResponse called with:', request);
    
    try {
      // Check rate limits
      this.checkRateLimits(tier);
      
      // Check cache first
      if (request.cacheable !== false) {
        const cachedResponse = this.getCachedResponse(request);
        if (cachedResponse) {
          this.updateMetrics(tier, 'cache_hit', 0, Date.now() - startTime);
          return cachedResponse;
        }
      }
      
      // Check if batching is appropriate
      if (request.batchable !== false && this.shouldBatch(request)) {
        return await this.addToBatch(request, startTime);
      }
      
      // Select appropriate provider and model
      const provider = this.selectProvider(tier, request);
      const model = this.selectModel(provider, tier, request);
      
      // Generate response
      const response = await this.generateAIResponse(provider, model, request);
      console.log('Generated response:', response);
      
      // Cache response if enabled
      if (request.cacheable !== false) {
        this.cacheResponse(request, response);
      }
      
      // Update metrics
      const latency = Date.now() - startTime;
      const cost = this.calculateCost(provider, model, request, response);
      this.updateMetrics(tier, provider, cost, latency);
      
      const finalResponse = {
        ...response,
        cost,
        latency,
        provider,
        model: model.name
      };
      console.log('Final response:', finalResponse);
      return finalResponse;
      
    } catch (error) {
      // Fallback to simple AI service
      if (this.tierConfigs.get(tier)?.fallbackEnabled) {
        console.warn(`AI provider failed for tier ${tier}, falling back to simple AI`);
        const simpleRequest = {
          input: request.input,
          context: request.context
        };
        const fallbackResponse = await simpleAI.generateResponse(simpleRequest);
        this.updateMetrics(tier, 'fallback', 0, Date.now() - startTime);
        return {
          ...fallbackResponse,
          provider: 'simple-ai' as AIProvider,
          model: 'rule-based',
          cost: 0
        };
      }
      
      throw error;
    }
  }
  
  private checkRateLimits(tier: ServiceTier): void {
    const config = this.tierConfigs.get(tier);
    if (!config) throw new Error(`Invalid tier: ${tier}`);
    
    const hourKey = `hour_${tier}_${Math.floor(Date.now() / 3600000)}`;
    const dayKey = `day_${tier}_${Math.floor(Date.now() / 86400000)}`;
    
    const hourCount = this.requestCounts.get(hourKey) || 0;
    const dayCount = this.requestCounts.get(dayKey) || 0;
    
    if (hourCount >= config.maxRequestsPerHour) {
      throw new Error(`Hourly rate limit exceeded for tier ${tier}`);
    }
    
    if (dayCount >= config.maxRequestsPerDay) {
      throw new Error(`Daily rate limit exceeded for tier ${tier}`);
    }
    
    // Check cost limits
    const currentCost = this.currentCosts.get(tier) || 0;
    if (currentCost >= config.costLimit) {
      throw new Error(`Cost limit exceeded for tier ${tier}`);
    }
  }
  
  private getCachedResponse(request: AIRequest): AIResponse | null {
    const cacheKey = this.generateCacheKey(request);
    const entry = this.requestCache.get(cacheKey);
    
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry.response;
    }
    
    return null;
  }
  
  private cacheResponse(request: AIRequest, response: AIResponse): void {
    const cacheKey = this.generateCacheKey(request);
    const ttl = request.tier === 'premium' ? 1800000 : 3600000; // 30min premium, 1hr basic
    
    this.requestCache.set(cacheKey, {
      key: cacheKey,
      response,
      timestamp: Date.now(),
      ttl
    });
    
    // Clean up old cache entries
    this.cleanupCache();
  }
  
  private generateCacheKey(request: AIRequest): string {
    const inputHash = this.hashString(request.input);
    const contextHash = request.context ? this.hashString(JSON.stringify(request.context)) : '';
    const tier = request.tier || 'basic';
    
    return `${tier}_${inputHash}_${contextHash}`;
  }
  
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.requestCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.requestCache.delete(key);
      }
    }
  }
  
  private shouldBatch(request: AIRequest): boolean {
    return request.priority !== 'high' && this.batchQueue.length > 0;
  }
  
  private addToBatch(request: AIRequest, startTime: number): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      const batchRequest: BatchRequest = {
        id: `batch_${Date.now()}_${Math.random()}`,
        request,
        resolve,
        reject,
        timestamp: startTime
      };
      
      this.batchQueue.push(batchRequest);
      
      // Process batch if it's getting large
      if (this.batchQueue.length >= 5) {
        this.processBatch();
      }
    });
  }
  
  private startBatchProcessor(): void {
    // Process batch every 2 seconds
    this.batchTimer = setInterval(() => {
      if (this.batchQueue.length > 0) {
        this.processBatch();
      }
    }, 2000);
  }
  
  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;
    
    const batch = this.batchQueue.splice(0, 10); // Process up to 10 requests
    
    try {
      // Group by tier and provider for efficient processing
      const grouped = this.groupBatchRequests(batch);
      
      for (const [key, group] of grouped.entries()) {
        await this.processBatchGroup(group);
      }
      
      this.usageMetrics.batchEfficiency = Math.min(
        1.0,
        this.usageMetrics.batchEfficiency + (batch.length * 0.1)
      );
      
    } catch (error) {
      // Reject all pending requests in case of error
      batch.forEach(req => req.reject(error as Error));
    }
  }
  
  private groupBatchRequests(batch: BatchRequest[]): Map<string, BatchRequest[]> {
    const grouped = new Map<string, BatchRequest[]>();
    
    batch.forEach(req => {
      const tier = req.request.tier || 'basic';
      const key = `${tier}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      
      grouped.get(key)!.push(req);
    });
    
    return grouped;
  }
  
  private async processBatchGroup(group: BatchRequest[]): Promise<void> {
    // Process requests in parallel with concurrency limit
    const concurrency = 3;
    const chunks = this.chunkArray(group, concurrency);
    
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (batchReq) => {
          try {
            const response = await this.generateIndividualResponse(batchReq.request);
            batchReq.resolve(response);
          } catch (error) {
            batchReq.reject(error as Error);
          }
        })
      );
    }
  }
  
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  
  private async generateIndividualResponse(request: AIRequest): Promise<AIResponse> {
    const provider = this.selectProvider(request.tier || 'basic', request);
    const model = this.selectModel(provider, request.tier || 'basic', request);
    
    return await this.generateAIResponse(provider, model, request);
  }
  
  private selectProvider(tier: ServiceTier, request: AIRequest): AIProvider {
    const tierConfig = this.tierConfigs.get(tier);
    if (!tierConfig) throw new Error(`Invalid tier: ${tier}`);
    
    const availableProviders = tierConfig.supportedProviders.filter(
      provider => this.providerConfigs.has(provider)
    );
    
    if (availableProviders.length === 0) {
      throw new Error(`No providers available for tier ${tier}`);
    }
    
    // Select provider based on cost efficiency and current load
    return this.selectOptimalProvider(availableProviders, tier);
  }
  
  private selectOptimalProvider(providers: AIProvider[], tier: ServiceTier): AIProvider {
    // Simple load balancing based on usage metrics
    const usage = providers.map(provider => ({
      provider,
      usage: this.usageMetrics.requestsByProvider[provider]
    }));
    
    // Select provider with lowest usage
    return usage.reduce((min, current) => 
      current.usage < min.usage ? current : min
    ).provider;
  }
  
  private selectModel(provider: AIProvider, tier: ServiceTier, request: AIRequest): ModelConfig {
    const providerConfig = this.providerConfigs.get(provider);
    if (!providerConfig) throw new Error(`Invalid provider: ${provider}`);
    
    const tierConfig = this.tierConfigs.get(tier);
    if (!tierConfig) throw new Error(`Invalid tier: ${tier}`);
    
    const preferredModels = tierConfig.modelPreferences[provider] || [];
    
    // Find the best available model
    for (const modelName of preferredModels) {
      const model = providerConfig.models[modelName];
      if (model && model.tier === tier) {
        return model;
      }
    }
    
    // Fallback to any available model for the tier
    const availableModels = Object.values(providerConfig.models).filter(
      model => model.tier === tier
    );
    
    if (availableModels.length === 0) {
      throw new Error(`No models available for provider ${provider} and tier ${tier}`);
    }
    
    return availableModels[0];
  }
  
  private async generateAIResponse(provider: AIProvider, model: ModelConfig, request: AIRequest): Promise<AIResponse> {
    // For now, use simple AI service as fallback
    // In a real implementation, this would call the actual AI provider APIs
    const simpleRequest = {
      input: request.input,
      context: request.context
    };
    console.log('Calling simpleAI with:', simpleRequest);
    const simpleResponse = await simpleAI.generateResponse(simpleRequest);
    console.log('SimpleAI response:', simpleResponse);
    
    if (!simpleResponse) {
      throw new Error('SimpleAI returned undefined response');
    }
    
    return {
      ...simpleResponse,
      confidence: Math.min(1.0, simpleResponse.confidence * model.qualityScore)
    };
  }
  
  private calculateCost(provider: AIProvider, model: ModelConfig, request: AIRequest, response: AIResponse): number {
    const providerConfig = this.providerConfigs.get(provider);
    if (!providerConfig) return 0;
    
    const baseCost = providerConfig.costPerToken.input + providerConfig.costPerToken.output;
    const estimatedTokens = Math.ceil(request.input.length / 4) + Math.ceil(response.output.length / 4);
    
    return baseCost * estimatedTokens * model.costMultiplier;
  }
  
  private updateMetrics(tier: ServiceTier, provider: AIProvider | 'cache_hit' | 'fallback', cost: number, latency: number): void {
    this.usageMetrics.totalRequests++;
    this.usageMetrics.totalCost += cost;
    this.usageMetrics.requestsByTier[tier]++;
    this.usageMetrics.costByTier[tier] += cost;
    
    if (provider !== 'cache_hit' && provider !== 'fallback') {
      this.usageMetrics.requestsByProvider[provider]++;
    }
    
    // Update average latency
    this.usageMetrics.averageLatency = (
      (this.usageMetrics.averageLatency * (this.usageMetrics.totalRequests - 1) + latency) /
      this.usageMetrics.totalRequests
    );
    
    // Update request counts for rate limiting
    const hourKey = `hour_${tier}_${Math.floor(Date.now() / 3600000)}`;
    const dayKey = `day_${tier}_${Math.floor(Date.now() / 86400000)}`;
    
    this.requestCounts.set(hourKey, (this.requestCounts.get(hourKey) || 0) + 1);
    this.requestCounts.set(dayKey, (this.requestCounts.get(dayKey) || 0) + 1);
    
    // Update current costs
    this.currentCosts.set(tier, (this.currentCosts.get(tier) || 0) + cost);
  }
  
  getUsageMetrics(): UsageMetrics {
    return { ...this.usageMetrics };
  }
  
  getTierConfig(tier: ServiceTier): TierConfig | undefined {
    return this.tierConfigs.get(tier);
  }
  
  getProviderConfig(provider: AIProvider): ProviderConfig | undefined {
    return this.providerConfigs.get(provider);
  }
  
  resetMetrics(): void {
    this.usageMetrics = {
      totalRequests: 0,
      totalCost: 0,
      averageLatency: 0,
      requestsByTier: { basic: 0, premium: 0, enterprise: 0 },
      requestsByProvider: { gemini: 0, openai: 0, anthropic: 0, openrouter: 0 },
      costByTier: { basic: 0, premium: 0, enterprise: 0 },
      cacheHitRate: 0,
      batchEfficiency: 0
    };
    
    this.currentCosts.clear();
    this.requestCounts.clear();
  }
  
  cleanup(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
    
    this.requestCache.clear();
    this.batchQueue = [];
  }
}

export const tieredAI = TieredAIService.getInstance();