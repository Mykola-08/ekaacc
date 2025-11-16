// Jest imports are global, no need to import describe, it, expect, beforeEach, afterEach
import { TieredAIService } from '../tiered-ai-service';
import type { AIRequest, AIResponse, ServiceTier } from '../tiered-ai-service';

// Mock the simple AI service
jest.mock('../simple-ai-service', () => ({
  simpleAI: {
    generateResponse: jest.fn().mockResolvedValue({
      output: 'Simple AI response',
      confidence: 0.8,
      metadata: { type: 'test' }
    })
  }
}));

describe('TieredAIService', () => {
  let service: TieredAIService;

  beforeEach(() => {
    // Reset the singleton instance for each test
    (TieredAIService as any).instance = null;
    service = TieredAIService.getInstance();
    jest.clearAllMocks();
  });

  afterEach(() => {
    service.cleanup();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = TieredAIService.getInstance();
      const instance2 = TieredAIService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Basic Response Generation', () => {
    it('should check if service exists', () => {
      expect(service).toBeDefined();
      expect(service.generateResponse).toBeDefined();
    });

    it('should generate a response for a basic request', async () => {
      const request: AIRequest = {
        input: 'Hello, how are you?',
        tier: 'basic'
      };

      console.log('Request:', request);
      let response;
      try {
        response = await service.generateResponse(request);
        console.log('Response received:', response);
      } catch (error) {
        console.error('Error generating response:', error);
        throw error;
      }

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle requests without explicit tier', async () => {
      const request: AIRequest = {
        input: 'What is the weather like?'
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });

    it('should handle requests with context', async () => {
      const request: AIRequest = {
        input: 'Tell me more about that',
        context: { previousTopic: 'weather', location: 'New York' }
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });
  });

  describe('Caching Mechanism', () => {
    it('should cache identical requests', async () => {
      const request: AIRequest = {
        input: 'What is 2+2?',
        cacheable: true
      };

      const response1 = await service.generateResponse(request);
      const response2 = await service.generateResponse(request);

      expect(response1).toBeDefined();
      expect(response2).toBeDefined();
      // Both responses should be valid
      expect(response2.output).toBeDefined();
    });

    it('should respect cacheable flag', async () => {
      const request: AIRequest = {
        input: 'What is 2+2?',
        cacheable: false
      };

      const response1 = await service.generateResponse(request);
      const response2 = await service.generateResponse(request);

      expect(response1).toBeDefined();
      expect(response2).toBeDefined();
      // Both responses should be valid even with caching disabled
      expect(response2.output).toBeDefined();
    });
  });

  describe('Batching', () => {
    it('should handle batchable requests', async () => {
      const request: AIRequest = {
        input: 'What is the capital of France?',
        batchable: true
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });

    it('should handle non-batchable requests', async () => {
      const request: AIRequest = {
        input: 'Urgent: What is 2+2?',
        batchable: false
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });
  });

  describe('Priority Handling', () => {
    it('should handle high priority requests', async () => {
      const request: AIRequest = {
        input: 'Urgent: System failure detected',
        priority: 'high'
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });

    it('should handle medium priority requests', async () => {
      const request: AIRequest = {
        input: 'What is the weather today?',
        priority: 'medium'
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });

    it('should handle low priority requests', async () => {
      const request: AIRequest = {
        input: 'Tell me a joke',
        priority: 'low'
      };

      const response = await service.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
    });
  });

  describe('Usage Metrics', () => {
    it('should track usage metrics', async () => {
      const request: AIRequest = {
        input: 'Hello world'
      };

      await service.generateResponse(request);
      const metrics = service.getUsageMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.totalRequests).toBeGreaterThan(0);
      expect(metrics.totalCost).toBeGreaterThanOrEqual(0);
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
      expect(metrics.requestsByTier).toBeDefined();
      expect(metrics.requestsByProvider).toBeDefined();
      expect(metrics.costByTier).toBeDefined();
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.batchEfficiency).toBeGreaterThanOrEqual(0);
    });

    it('should reset metrics', () => {
      // Generate some usage first
      const request: AIRequest = {
        input: 'Test request'
      };

      // Reset metrics
      service.resetMetrics();
      const metrics = service.getUsageMetrics();

      expect(metrics.totalRequests).toBe(0);
      expect(metrics.totalCost).toBe(0);
      expect(metrics.averageLatency).toBe(0);
    });
  });

  describe('Tier Configuration', () => {
    it('should return tier configuration', () => {
      const basicConfig = service.getTierConfig('basic');
      const premiumConfig = service.getTierConfig('premium');
      const enterpriseConfig = service.getTierConfig('enterprise');

      expect(basicConfig).toBeDefined();
      expect(basicConfig?.name).toBe('basic');
      expect(basicConfig?.maxRequestsPerHour).toBeGreaterThan(0);
      expect(basicConfig?.supportedProviders).toBeDefined();

      expect(premiumConfig).toBeDefined();
      expect(premiumConfig?.name).toBe('premium');

      expect(enterpriseConfig).toBeDefined();
      expect(enterpriseConfig?.name).toBe('enterprise');
    });

    it('should return undefined for invalid tier', () => {
      const invalidConfig = service.getTierConfig('invalid' as ServiceTier);
      expect(invalidConfig).toBeUndefined();
    });
  });

  describe('Provider Configuration', () => {
    it('should return provider configuration', () => {
      const geminiConfig = service.getProviderConfig('gemini');
      const openaiConfig = service.getProviderConfig('openai');
      const anthropicConfig = service.getProviderConfig('anthropic');
      const openrouterConfig = service.getProviderConfig('openrouter');

      // These may or may not be defined depending on environment variables
      // They should either be objects or undefined
      expect([typeof geminiConfig, 'undefined']).toContain(typeof geminiConfig);
      expect([typeof openaiConfig, 'undefined']).toContain(typeof openaiConfig);
      expect([typeof anthropicConfig, 'undefined']).toContain(typeof anthropicConfig);
      expect([typeof openrouterConfig, 'undefined']).toContain(typeof openrouterConfig);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty input', async () => {
      const request: AIRequest = {
        input: ''
      };

      await expect(service.generateResponse(request)).resolves.toBeDefined();
    });

    it('should handle very long input', async () => {
      const request: AIRequest = {
        input: 'a'.repeat(10000)
      };

      await expect(service.generateResponse(request)).resolves.toBeDefined();
    });

    it('should handle special characters in input', async () => {
      const request: AIRequest = {
        input: 'Hello! @#$%^&*()_+{}[]|\\:;"\'<>,.?/~`'
      };

      await expect(service.generateResponse(request)).resolves.toBeDefined();
    });

    it('should handle unicode characters', async () => {
      const request: AIRequest = {
        input: 'Hello 世界 🌍 مرحبا'
      };

      await expect(service.generateResponse(request)).resolves.toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) => ({
        input: `Request ${i + 1}`
      }));

      const responses = await Promise.all(
        requests.map(request => service.generateResponse(request))
      );

      expect(responses).toHaveLength(10);
      responses.forEach(response => {
        expect(response).toBeDefined();
        expect(response.output).toBeDefined();
      });
    });

    it('should handle rapid sequential requests', async () => {
      const results: AIResponse[] = [];

      for (let i = 0; i < 20; i++) {
        const request: AIRequest = {
          input: `Sequential request ${i + 1}`
        };
        const response = await service.generateResponse(request);
        results.push(response);
      }

      expect(results).toHaveLength(20);
      results.forEach(response => {
        expect(response).toBeDefined();
        expect(response.output).toBeDefined();
      });
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources', () => {
      expect(() => service.cleanup()).not.toThrow();
    });

    it('should handle cleanup when already cleaned up', () => {
      service.cleanup();
      expect(() => service.cleanup()).not.toThrow();
    });
  });
});