
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AIBackgroundMonitor } from '../ai-background-monitor';
import { AIPersonalizationService } from '../ai-personalization-service';

// Mock AIPersonalizationService
jest.mock('../ai-personalization-service');

describe('AIBackgroundMonitor', () => {
  let monitor: AIBackgroundMonitor;
  let mockAiService: any;
  let mockPersonalizationService: any;

  beforeEach(() => {
    mockAiService = {
      generateBackgroundInsights: jest.fn().mockResolvedValue([]),
      generateProactiveRecommendations: jest.fn().mockResolvedValue([])
    };

    mockPersonalizationService = new AIPersonalizationService(mockAiService);
    (mockPersonalizationService.initializeUserProfile as jest.Mock).mockResolvedValue(undefined);
    (mockPersonalizationService.getPersonalizationProfile as jest.Mock).mockResolvedValue({
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
      limit: jest.fn().mockResolvedValue({ data: [], error: null })
    };
    (mockPersonalizationService.getSupabaseClient as jest.Mock) = jest.fn().mockReturnValue(mockSupabase);

    monitor = new AIBackgroundMonitor(mockAiService, mockPersonalizationService);
  });

  it('should initialize monitoring', async () => {
    await monitor.initializeMonitoring('test-user');
    expect(mockPersonalizationService.initializeUserProfile).toHaveBeenCalledWith('test-user');
  });

  it('should perform background analysis', async () => {
    await monitor.initializeMonitoring('test-user');
    
    await monitor.performBackgroundAnalysis('test-user');
    
    expect(mockPersonalizationService.getSupabaseClient).toHaveBeenCalled();
    expect(mockAiService.generateBackgroundInsights).toHaveBeenCalled();
  });
});
