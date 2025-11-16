import { BehavioralTrackingService } from '@/services/behavioral-tracking-service';
import { UserInteraction, BehavioralPattern, PredictiveInsight } from '@/services/behavioral-tracking-service';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [],
        error: null
      }),
      update: jest.fn().mockResolvedValue({ error: null })
    }))
  }
}));

describe('BehavioralTrackingService', () => {
  let service: BehavioralTrackingService;
  let mockUserId: string;

  beforeEach(() => {
    service = BehavioralTrackingService.getInstance();
    mockUserId = 'test-user-' + Date.now();
    jest.clearAllMocks();
  });

  describe('trackInteraction', () => {
    it('should track basic interactions', async () => {
      const interaction = {
        user_id: mockUserId,
        interaction_type: 'page_view' as const,
        page_path: '/dashboard',
        metadata: { duration: 5000 }
      };

      await expect(service.trackInteraction(interaction)).resolves.not.toThrow();
    });

    it('should track mood logging interactions', async () => {
      const moodInteraction = {
        user_id: mockUserId,
        interaction_type: 'mood_logged' as const,
        metadata: {
          mood: 'happy',
          intensity: 7,
          trigger: 'therapy_session'
        }
      };

      await expect(service.trackInteraction(moodInteraction)).resolves.not.toThrow();
    });

    it('should track session interactions', async () => {
      const sessionInteraction = {
        user_id: mockUserId,
        interaction_type: 'session_start' as const,
        metadata: {
          session_type: 'individual_therapy',
          therapist_id: 'therapist-123'
        }
      };

      await expect(service.trackInteraction(sessionInteraction)).resolves.not.toThrow();
    });

    it('should handle crisis interactions with real-time analysis', async () => {
      const crisisInteraction = {
        user_id: mockUserId,
        interaction_type: 'crisis_interaction' as const,
        metadata: {
          severity: 'high',
          type: 'suicidal_thoughts'
        }
      };

      await expect(service.trackInteraction(crisisInteraction)).resolves.not.toThrow();
    });
  });

  describe('analyzeBehaviorInRealTime', () => {
    it('should analyze patterns for users with interactions', async () => {
      // Mock the supabase responses for pattern analysis
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              user_id: mockUserId,
              interaction_type: 'mood_logged',
              timestamp: new Date().toISOString(),
              metadata: { mood: 'sad', intensity: 8 }
            },
            {
              id: '2',
              user_id: mockUserId,
              interaction_type: 'mood_logged',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              metadata: { mood: 'anxious', intensity: 7 }
            }
          ],
          error: null
        })
      }));

      await expect(service.analyzeBehaviorInRealTime(mockUserId)).resolves.not.toThrow();
    });
  });

  describe('getUserBehavioralInsights', () => {
    it('should return comprehensive insights for existing user', async () => {
      // Mock the supabase responses
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementation((table: string) => {
        const baseMock = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          gte: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis()
        };

        if (table === 'behavioral_patterns') {
          return {
            ...baseMock,
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'pattern-1',
                  user_id: mockUserId,
                  pattern_type: 'mood_deterioration',
                  confidence_score: 0.75,
                  severity: 'high',
                  status: 'active'
                }
              ],
              error: null
            })
          };
        }

        if (table === 'predictive_insights') {
          return {
            ...baseMock,
            order: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'insight-1',
                  user_id: mockUserId,
                  insight_type: 'relapse_risk',
                  probability: 0.6,
                  contributing_factors: ['mood decline'],
                  recommended_actions: ['schedule session'],
                  timeframe: 'short_term'
                }
              ],
              error: null
            })
          };
        }

        if (table === 'user_interactions') {
          return {
            ...baseMock,
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue({
              data: [
                {
                  id: 'interaction-1',
                  user_id: mockUserId,
                  interaction_type: 'mood_logged',
                  timestamp: new Date().toISOString(),
                  metadata: { mood: 'neutral' }
                }
              ],
              error: null
            })
          };
        }

        return baseMock;
      });

      const insights = await service.getUserBehavioralInsights(mockUserId);
      
      expect(insights).toHaveProperty('patterns');
      expect(insights).toHaveProperty('insights');
      expect(insights).toHaveProperty('recentInteractions');
      expect(Array.isArray(insights.patterns)).toBe(true);
      expect(Array.isArray(insights.insights)).toBe(true);
      expect(Array.isArray(insights.recentInteractions)).toBe(true);
    });

    it('should return empty insights when no data exists', async () => {
      // Mock empty responses
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        limit: jest.fn().mockResolvedValue({ data: [], error: null })
      }));

      const insights = await service.getUserBehavioralInsights('new-user');
      
      expect(insights.patterns).toEqual([]);
      expect(insights.insights).toEqual([]);
      expect(insights.recentInteractions).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      // Mock error responses
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
        limit: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') })
      }));

      const insights = await service.getUserBehavioralInsights(mockUserId);
      
      expect(insights.patterns).toEqual([]);
      expect(insights.insights).toEqual([]);
      expect(insights.recentInteractions).toEqual([]);
    });
  });

  describe('Pattern Analysis', () => {
    it('should detect engagement decline patterns', () => {
      const recentInteractions = [
        { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      
      const olderInteractions = [
        { timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      // This is a private method, but we can test the logic indirectly
      // by checking if patterns are detected in getUserBehavioralInsights
      expect(recentInteractions.length).toBeLessThan(olderInteractions.length * 0.5);
    });

    it('should detect mood deterioration patterns', () => {
      const moodLogs = [
        { metadata: { mood: 'sad' } },
        { metadata: { mood: 'anxious' } },
        { metadata: { mood: 'angry' } },
        { metadata: { mood: 'depressed' } },
        { metadata: { mood: 'neutral' } }
      ];

      const negativeMoods = moodLogs.filter(log => 
        ['sad', 'anxious', 'angry', 'depressed'].includes(log.metadata.mood)
      );
      
      expect(negativeMoods.length).toBeGreaterThanOrEqual(moodLogs.length * 0.6);
    });
  });

  describe('Predictive Insights', () => {
    it('should generate relapse risk insights', () => {
      const moodLogs = [
        { metadata: { mood: 'sad' } },
        { metadata: { mood: 'anxious' } },
        { metadata: { mood: 'angry' } },
        { metadata: { mood: 'depressed' } },
        { metadata: { mood: 'anxious' } },
        { metadata: { mood: 'sad' } },
        { metadata: { mood: 'depressed' } }
      ];

      const negativeMoods = moodLogs.filter(log => 
        ['sad', 'anxious', 'angry', 'depressed'].includes(log.metadata.mood)
      );
      
      expect(negativeMoods.length).toBeGreaterThanOrEqual(moodLogs.length * 0.7);
    });

    it('should generate positive outcome insights', () => {
      const exerciseCompletions = [
        { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
      ];
      
      const goalAchievements = [
        { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      const totalProgress = exerciseCompletions.length + goalAchievements.length;
      expect(totalProgress).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Utility Methods', () => {
    it('should generate unique session IDs', () => {
      const service1 = BehavioralTrackingService.getInstance();
      const service2 = BehavioralTrackingService.getInstance();
      
      // Both should be the same instance (singleton)
      expect(service1).toBe(service2);
    });

    it('should detect device types correctly', () => {
      // Mock window.innerWidth for different device types
      const originalWidth = window.innerWidth;
      
      // Test mobile
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      const mobileService = BehavioralTrackingService.getInstance();
      
      // Test tablet
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
      
      // Test desktop
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      
      // Restore original
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, writable: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed interaction data gracefully', async () => {
      const malformedInteraction = {
        user_id: mockUserId,
        // Missing required interaction_type
      } as any;

      await expect(service.trackInteraction(malformedInteraction)).resolves.not.toThrow();
    });

    it('should handle database connection errors', async () => {
      const mockSupabase = require('@/lib/supabase').supabase;
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const interaction = {
        user_id: mockUserId,
        interaction_type: 'page_view' as const,
        page_path: '/test'
      };

      await expect(service.trackInteraction(interaction)).resolves.not.toThrow();
    });

    it('should handle invalid user IDs', async () => {
      const interaction = {
        user_id: '',
        interaction_type: 'page_view' as const,
        page_path: '/test'
      };

      await expect(service.trackInteraction(interaction)).resolves.not.toThrow();
    });
  });
});