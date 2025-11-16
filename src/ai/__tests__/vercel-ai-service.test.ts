import { vercelAIService } from '../vercel-ai-service';
import type { User } from '@/lib/types';

// Mock the Vercel AI SDK
jest.mock('ai', () => ({
  generateText: jest.fn().mockResolvedValue({
    text: 'Test AI response',
    usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    response: { modelId: 'gpt-4-turbo' }
  }),
  generateObject: jest.fn().mockResolvedValue({
    object: { recommendation: 'Test recommendation', confidence: 0.9 },
    usage: { promptTokens: 15, completionTokens: 25, totalTokens: 40 },
    response: { modelId: 'gpt-4-turbo' }
  }),
  streamText: jest.fn().mockReturnValue({
    textStream: ['Hello', ' world']
  })
}));

// Mock the AI providers
jest.mock('@ai-sdk/openai', () => ({
  openai: jest.fn().mockReturnValue({})
}));

jest.mock('@ai-sdk/anthropic', () => ({
  anthropic: jest.fn().mockReturnValue({})
}));

jest.mock('@ai-sdk/google', () => ({
  google: jest.fn().mockReturnValue({})
}));

describe('VercelAIService', () => {
  let mockUser: User;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      name: 'Test User',
      userType: 'patient',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  describe('generateText', () => {
    it('should generate text response successfully', async () => {
      const request = {
        prompt: 'What are some coping strategies for anxiety?',
        userId: mockUser.id,
        model: 'openai' as const,
        maxTokens: 500,
        temperature: 0.7
      };

      const response = await vercelAIService.generateText(request);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
      expect(response.model).toBe('gpt-4-turbo');
      expect(response.timestamp).toBeDefined();
      expect(response.usage).toBeDefined();
      expect(response.usage?.totalTokens).toBe(30);
    });

    it('should use default values when not specified', async () => {
      const request = {
        prompt: 'Simple question'
      };

      const response = await vercelAIService.generateText(request);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
    });

    it('should handle errors gracefully', async () => {
      const { generateText } = await import('ai');
      (generateText as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const request = {
        prompt: 'Test prompt'
      };

      await expect(vercelAIService.generateText(request)).rejects.toThrow('Failed to generate AI response');
    });
  });

  describe('generateObject', () => {
    it('should generate structured object response', async () => {
      interface TestSchema {
        recommendation: string;
        confidence: number;
      }

      const request = {
        prompt: 'Generate a recommendation',
        schema: {} as TestSchema,
        userId: mockUser.id
      };

      const response = await vercelAIService.generateObject<TestSchema>(request);

      expect(response).toBeDefined();
      expect(response.object).toBeDefined();
      expect(response.object.recommendation).toBe('Test recommendation');
      expect(response.object.confidence).toBe(0.9);
      expect(response.content).toBe('{"recommendation":"Test recommendation","confidence":0.9}');
    });
  });

  describe('streamText', () => {
    it('should stream text response', async () => {
      const request = {
        prompt: 'Stream this response',
        userId: mockUser.id
      };

      const chunks: string[] = [];
      for await (const chunk of vercelAIService.streamText(request)) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['Hello', ' world']);
    });
  });

  describe('Therapy-specific methods', () => {
    it('should generate therapy recommendations', async () => {
      const context = 'Patient has been experiencing increased anxiety and sleep issues';
      
      const response = await vercelAIService.generateTherapyRecommendations(mockUser, context);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
      expect(response.userId).toBe(mockUser.id);
    });

    it('should generate monthly report', async () => {
      const monthData = {
        sessions: 4,
        moodLogs: 28,
        exercisesCompleted: 12,
        goalsAchieved: 3
      };

      const response = await vercelAIService.generateMonthlyReport(mockUser, monthData);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
      expect(response.userId).toBe(mockUser.id);
    });

    it('should generate crisis support response', async () => {
      const crisisContext = 'Patient expressing suicidal thoughts';

      const response = await vercelAIService.generateCrisisSupport(mockUser, crisisContext);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
      expect(response.userId).toBe(mockUser.id);
    });

    it('should generate wellness check-in response', async () => {
      const checkInData = {
        mood: 7,
        sleep: 6,
        stress: 4,
        notes: 'Feeling better today'
      };

      const response = await vercelAIService.generateWellnessCheckIn(mockUser, checkInData);

      expect(response).toBeDefined();
      expect(response.content).toBe('Test AI response');
      expect(response.userId).toBe(mockUser.id);
    });
  });

  describe('Utility methods', () => {
    it('should return available models', () => {
      const models = vercelAIService.getAvailableModels();

      expect(models).toBeDefined();
      expect(models.length).toBe(3);
      expect(models[0].provider).toBe('openai');
      expect(models[0].name).toBe('gpt-4-turbo');
    });

    it('should estimate cost for prompt', () => {
      const prompt = 'This is a test prompt with about 20 tokens';
      const cost = vercelAIService.estimateCost(prompt, 'openai');

      expect(cost).toBeGreaterThan(0);
      expect(typeof cost).toBe('number');
    });

    it('should return 0 cost for unknown model', () => {
      const cost = vercelAIService.estimateCost('test', 'unknown');

      expect(cost).toBe(0);
    });
  });
});