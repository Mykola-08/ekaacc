
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { AIBackgroundMonitor } from '../ai-background-monitor';
import { AIPersonalizationService } from '../ai-personalization-service';

// Mock AIPersonalizationService
jest.mock('../ai-personalization-service');

describe('AIBackgroundMonitor', () => {
  let monitor: AIBackgroundMonitor;
  let mockAiService: {
    generateBackgroundInsights: Mock<() => Promise<never[]>>;
    generateProactiveRecommendations: Mock<() => Promise<never[]>>;
  };
  let mockPersonalizationService: AIPersonalizationService & {
    initializeUserProfile: Mock<() => Promise<void>>;
    getPersonalizationProfile: Mock<() => Promise<{
      userId: string;
      behaviorPatterns: never[];
      preferences: Record<string, never>;
      wellnessInsights: Record<string, never>;
    }>>;
    getSupabaseClient: Mock<() => {
      from: Mock;
      select: Mock;
      eq: Mock;
      gte: Mock;
      order: Mock;
      limit: Mock<() => Promise<{ data: never[]; error: null }>>;
    }>;
  };

  beforeEach(() => {
    mockAiService = {
      generateBackgroundInsights: jest.fn<() => Promise<never[]>>().mockResolvedValue([]),
      generateProactiveRecommendations: jest.fn<() => Promise<never[]>>().mockResolvedValue([])
    };

    mockPersonalizationService = new AIPersonalizationService(mockAiService) as typeof mockPersonalizationService;
    (mockPersonalizationService.initializeUserProfile as Mock<() => Promise<void>>).mockResolvedValue(undefined);
    (mockPersonalizationService.getPersonalizationProfile as Mock<() => Promise<unknown>>).mockResolvedValue({
      userId: 'test-user',
      behaviorPatterns: [],
      preferences: {},
      wellnessInsights: {}
    });
    
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn<() => Promise<{ data: never[]; error: null }>>().mockResolvedValue({ data: [], error: null })
    };
    (mockPersonalizationService as { getSupabaseClient: Mock }).getSupabaseClient = jest.fn().mockReturnValue(mockSupabase);

    monitor = new AIBackgroundMonitor(mockAiService, mockPersonalizationService);
  });

  it('should initialize monitoring', async () => {
    await monitor.initializeMonitoring('test-user');
    expect(mockPersonalizationService.initializeUserProfile).toHaveBeenCalledWith('test-user');
  });

  it('should perform background analysis', async () => {
    await monitor.initializeMonitoring('test-user');
    
    await monitor.performBackgroundAnalysis('test-user');
    
    expect((mockPersonalizationService as { getSupabaseClient: Mock }).getSupabaseClient).toHaveBeenCalled();
    expect(mockAiService.generateBackgroundInsights).toHaveBeenCalled();
  });
});
