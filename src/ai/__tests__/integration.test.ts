// Jest imports are global, no need to import describe, it, expect, beforeEach, afterEach
import { TieredAIService } from '../tiered-ai-service';
import { PremiumAIFeatures } from '../premium-features';
import type { AIRequest, PatientData } from '../tiered-ai-service';

// Mock the simple AI service
jest.mock('../simple-ai-service', () => ({
  simpleAI: {
    generateResponse: jest.fn().mockResolvedValue({
      output: `Based on comprehensive analysis, here are my recommendations:

Recommendation 1: Increase mindfulness practice
Description: Patient shows good response to mindfulness techniques based on recent journal entries.
Priority: High
Timeline: 2-4 weeks
Implementation: Start with 5-minute daily sessions

Recommendation 2: Continue CBT techniques  
Description: Cognitive behavioral therapy has shown positive results in previous sessions.
Priority: Medium
Timeline: 4-6 weeks
Implementation: Focus on thought challenging exercises

Recommendation 3: Focus on sleep hygiene
Description: Recent data shows sleep patterns affecting mood stability.
Priority: High
Timeline: 1-2 weeks
Implementation: Establish consistent bedtime routine`,
      confidence: 0.85,
      metadata: { type: 'analysis' }
    })
  }
}));

describe('Tiered AI Service Integration', () => {
  let tieredService: TieredAIService;
  let premiumFeatures: PremiumAIFeatures;

  beforeEach(() => {
    // Reset singleton instances
    (TieredAIService as any).instance = null;
    (PremiumAIFeatures as any).instance = null;
    
    tieredService = TieredAIService.getInstance();
    premiumFeatures = PremiumAIFeatures.getInstance();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    tieredService.cleanup();
  });

  describe('Basic Integration', () => {
    it('should work together for basic AI requests', async () => {
      const request: AIRequest = {
        input: 'What is cognitive behavioral therapy?'
      };

      const response = await tieredService.generateResponse(request);

      expect(response).toBeDefined();
      expect(response.output).toBeDefined();
      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle premium feature requests', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-integration',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Patient learning CBT techniques',
            patientFeedback: 'Finding it helpful',
            moodRating: 7,
            stressLevel: 4,
            topics: ['CBT', 'anxiety'],
            interventions: ['CBT'],
            outcomes: ['improved understanding']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Practiced CBT exercises today',
            mood: 7,
            energy: 6,
            sleep: 7,
            tags: ['CBT', 'practice'],
            sentiment: 'positive'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Master CBT techniques',
            description: 'Learn and apply CBT methods effectively',
            category: 'skills',
            progress: 0.6,
            targetDate: new Date('2024-03-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Learn basic CBT concepts',
                completed: true
              }
            ]
          }
        ],
        assessments: [
          {
            id: 'assessment-1',
            date: new Date('2024-01-01'),
            type: 'CBT-Knowledge',
            scores: { total: 75, knowledge: 80, application: 70 },
            interpretation: 'Good understanding of CBT concepts',
            recommendations: ['Practice techniques', 'Apply in daily situations']
          }
        ],
        demographics: {
          age: 28,
          gender: 'female',
          occupation: 'teacher',
          location: 'Portland',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'structured',
          sessionFrequency: 'weekly',
          preferredTopics: ['CBT', 'anxiety'],
          avoidTopics: ['medical terminology'],
          goals: ['learn CBT techniques', 'reduce anxiety']
        }
      };

      const insights = await premiumFeatures.generatePredictiveInsights(mockPatientData);

      expect(insights).toBeDefined();
      expect(insights.riskFactors).toBeDefined();
      expect(insights.improvementTrajectory).toBeDefined();
      expect(insights.improvementTrajectory.momentum).toBeGreaterThanOrEqual(0);
      expect(insights.improvementTrajectory.momentum).toBeLessThanOrEqual(1);
    });
  });

  describe('End-to-End Workflows', () => {
    it('should handle complete patient analysis workflow', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-workflow',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 55,
            therapistNotes: 'Initial assessment completed',
            patientFeedback: 'Ready to work on goals',
            moodRating: 6,
            stressLevel: 5,
            topics: ['assessment', 'goal-setting'],
            interventions: ['initial assessment'],
            outcomes: ['baseline established']
          },
          {
            id: 'session-2',
            date: new Date('2024-01-08'),
            duration: 60,
            therapistNotes: 'Good engagement with CBT techniques',
            patientFeedback: 'Feeling optimistic',
            moodRating: 8,
            stressLevel: 3,
            topics: ['CBT', 'progress'],
            interventions: ['CBT', 'homework review'],
            outcomes: ['good engagement', 'improved mood']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-03'),
            content: 'Starting therapy journey',
            mood: 6,
            energy: 5,
            sleep: 6,
            tags: ['therapy', 'beginning'],
            sentiment: 'neutral'
          },
          {
            id: 'entry-2',
            date: new Date('2024-01-10'),
            content: 'CBT techniques are helping me manage anxiety',
            mood: 8,
            energy: 7,
            sleep: 8,
            tags: ['CBT', 'anxiety', 'progress'],
            sentiment: 'positive'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Reduce anxiety levels',
            description: 'Develop effective coping strategies for daily anxiety',
            category: 'mental-health',
            progress: 0.7,
            targetDate: new Date('2024-04-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Complete initial assessment',
                completed: true
              },
              {
                id: 'milestone-2',
                description: 'Learn 3 coping techniques',
                completed: true
              }
            ]
          }
        ],
        assessments: [
          {
            id: 'assessment-1',
            date: new Date('2024-01-01'),
            type: 'GAD-7',
            scores: { total: 14, severity: 3 },
            interpretation: 'moderate anxiety',
            recommendations: ['CBT techniques', 'mindfulness practice']
          },
          {
            id: 'assessment-2',
            date: new Date('2024-01-08'),
            type: 'GAD-7',
            scores: { total: 8, severity: 2 },
            interpretation: 'mild anxiety',
            recommendations: ['continue current approach', 'monitor progress']
          }
        ],
        demographics: {
          age: 26,
          gender: 'female',
          occupation: 'graphic designer',
          location: 'Austin',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'collaborative',
          sessionFrequency: 'weekly',
          preferredTopics: ['anxiety', 'CBT', 'coping'],
          avoidTopics: ['group therapy'],
          goals: ['learn CBT techniques', 'reduce anxiety', 'build coping skills']
        }
      };

      // Step 1: Generate predictive insights
      const insights = await premiumFeatures.generatePredictiveInsights(mockPatientData);
      expect(insights.improvementTrajectory.momentum).toBeGreaterThan(0); // Should show some momentum

      // Step 2: Analyze trends
      const trends = await premiumFeatures.analyzeTrends(mockPatientData);
      expect(trends.moodTrends).toBeDefined(); // Should have mood trend data

      // Step 3: Generate recommendations
      const recommendations = await premiumFeatures.generatePersonalizedRecommendations(mockPatientData);
      expect(recommendations.length).toBeGreaterThan(0);

      // Step 4: Generate comprehensive summary
      const summary = await premiumFeatures.generateAdvancedSummary(mockPatientData);
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);

      // Step 5: Test intervention effectiveness
      const intervention = 'CBT';
      const prediction = await premiumFeatures.predictInterventionEffectiveness(mockPatientData, intervention);
      expect(prediction.intervention).toBe(intervention);
      expect(prediction.rationale).toBeDefined();

      // Step 6: Generate therapeutic insights
      const therapeuticInsights = await premiumFeatures.generateTherapeuticInsights(mockPatientData);
      expect(therapeuticInsights.insights).toBeDefined();
      expect(therapeuticInsights.confidence).toBeGreaterThanOrEqual(0);
    });

    it('should handle concurrent AI requests and premium analyses', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-concurrent',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Good session overall',
            patientFeedback: 'Helpful discussion',
            moodRating: 7,
            stressLevel: 4,
            topics: ['general'],
            interventions: ['talk therapy'],
            outcomes: ['good discussion']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Reflecting on therapy progress',
            mood: 7,
            energy: 6,
            sleep: 7,
            tags: ['reflection'],
            sentiment: 'neutral'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Personal growth',
            description: 'Continue personal development',
            category: 'personal',
            progress: 0.5,
            targetDate: new Date('2024-06-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Regular self-reflection',
                completed: true
              }
            ]
          }
        ],
        assessments: [],
        demographics: {
          age: 30,
          gender: 'male',
          occupation: 'consultant',
          location: 'Denver',
          therapyExperience: 'extensive'
        },
        preferences: {
          communicationStyle: 'insight-oriented',
          sessionFrequency: 'biweekly',
          preferredTopics: ['personal growth'],
          avoidTopics: ['career advice'],
          goals: ['achieve personal growth', 'find meaning']
        }
      };

      // Run multiple concurrent operations
      const results = await Promise.all([
        // Basic AI requests
        tieredService.generateResponse({ input: 'What is mindfulness?' }),
        tieredService.generateResponse({ input: 'Tell me about CBT techniques' }),
        tieredService.generateResponse({ input: 'How to manage stress?' }),
        
        // Premium feature analyses
        premiumFeatures.generatePredictiveInsights(mockPatientData),
        premiumFeatures.analyzeTrends(mockPatientData),
        premiumFeatures.generatePersonalizedRecommendations(mockPatientData),
        premiumFeatures.generateAdvancedSummary(mockPatientData)
      ]);

      expect(results).toHaveLength(7);
      
      // Check basic AI responses
      expect(results[0]).toBeDefined();
      expect(results[0].output).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[1].output).toBeDefined();
      expect(results[2]).toBeDefined();
      expect(results[2].output).toBeDefined();
      
      // Check premium analyses
      expect(results[3]).toBeDefined(); // predictive insights
      expect(results[4]).toBeDefined(); // trends
      expect(results[5]).toBeDefined(); // recommendations
      expect(results[6]).toBeDefined(); // summary
    });
  });

  describe('Error Recovery', () => {
    it('should handle errors in basic AI requests gracefully', async () => {
      // Mock a failure scenario by temporarily making simple AI fail
      const simpleAIModule = require('../simple-ai-service');
      const originalGenerateResponse = simpleAIModule.simpleAI.generateResponse;
      simpleAIModule.simpleAI.generateResponse = jest.fn().mockRejectedValueOnce(new Error('AI service error'));

      const request: AIRequest = {
        input: 'This should fail'
      };

      // Should throw an error since both AI services fail
      await expect(tieredService.generateResponse(request)).rejects.toThrow();

      // Restore original function
      simpleAIModule.simpleAI.generateResponse = originalGenerateResponse;
    });

    it('should handle incomplete patient data', async () => {
      const incompletePatientData: PatientData = {
        id: 'patient-incomplete',
        sessions: [],
        journalEntries: [],
        goals: [],
        assessments: [],
        demographics: {
          age: 25,
          gender: 'female',
          occupation: 'student',
          location: 'unknown',
          therapyExperience: 'none'
        },
        preferences: {
          communicationStyle: 'flexible',
          sessionFrequency: 'monthly',
          preferredTopics: [],
          avoidTopics: [],
          goals: ['academic support']
        }
      };

      // Should still generate insights even with minimal data
      const insights = await premiumFeatures.generatePredictiveInsights(incompletePatientData);
      expect(insights).toBeDefined();
      expect(insights.riskFactors).toBeDefined();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle rapid sequential requests efficiently', async () => {
      const results = [];
      
      for (let i = 0; i < 10; i++) {
        const request: AIRequest = {
          input: `Sequential request ${i + 1}`
        };
        const response = await tieredService.generateResponse(request);
        results.push(response);
      }

      expect(results).toHaveLength(10);
      results.forEach((response, index) => {
        expect(response).toBeDefined();
        expect(response.output).toBeDefined();
      });
    });

    it('should maintain performance with large patient datasets', async () => {
      // Create a large patient dataset
      const largePatientData: PatientData = {
        id: 'patient-large',
        sessions: Array.from({ length: 50 }, (_, i) => ({
          id: `session-${i + 1}`,
          date: new Date(2024, 0, i + 1),
          duration: 60,
          therapistNotes: `Session ${i + 1} notes`,
          patientFeedback: `Session ${i + 1} feedback`,
          moodRating: 5 + (i % 5),
          stressLevel: 3 + (i % 4),
          topics: ['topic1', 'topic2'],
          interventions: ['intervention1'],
          outcomes: ['outcome1']
        })),
        journalEntries: Array.from({ length: 100 }, (_, i) => ({
          id: `entry-${i + 1}`,
          date: new Date(2024, 0, Math.floor(i / 3) + 1),
          content: `Journal entry ${i + 1} content`,
          mood: 5 + (i % 5),
          energy: 4 + (i % 4),
          sleep: 5 + (i % 4),
          tags: ['tag1', 'tag2'],
          sentiment: i % 3 === 0 ? 'positive' : i % 3 === 1 ? 'neutral' : 'negative'
        })),
        goals: Array.from({ length: 10 }, (_, i) => ({
          id: `goal-${i + 1}`,
          title: `Goal ${i + 1}`,
          description: `Description for goal ${i + 1}`,
          category: 'mental-health',
          progress: (i + 1) * 0.1,
          targetDate: new Date(2024, 6, i + 1),
          milestones: [
            {
              id: `milestone-${i + 1}`,
              description: `Milestone for goal ${i + 1}`,
              completed: i % 2 === 0
            }
          ]
        })),
        assessments: Array.from({ length: 20 }, (_, i) => ({
          id: `assessment-${i + 1}`,
          date: new Date(2024, 0, (i + 1) * 7),
          type: 'GAD-7',
          scores: { total: 10 + (i % 8), anxiety: 6 + (i % 5), depression: 4 + (i % 3) },
          interpretation: `Anxiety level: ${i % 4 === 0 ? 'mild' : i % 4 === 1 ? 'moderate' : i % 4 === 2 ? 'severe' : 'minimal'}`,
          recommendations: ['CBT', 'Mindfulness', 'Exercise']
        })),
        demographics: {
          age: 30,
          gender: 'male',
          occupation: 'data analyst',
          location: 'Seattle',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'analytical',
          sessionFrequency: 'weekly',
          preferredTopics: ['anxiety', 'data', 'analysis'],
          avoidTopics: ['spontaneous activities'],
          goals: ['understand anxiety patterns', 'develop data-driven coping strategies']
        }
      };

      const startTime = Date.now();
      const insights = await premiumFeatures.generatePredictiveInsights(largePatientData);
      const endTime = Date.now();
      
      expect(insights).toBeDefined();
      expect(insights.riskFactors).toBeDefined();
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Metrics and Monitoring', () => {
    it('should track usage metrics across both services', async () => {
      // Generate some usage
      const basicRequest: AIRequest = { input: 'Basic question' };
      const premiumRequest: AIRequest = { input: 'Premium question' };

      await tieredService.generateResponse(basicRequest);
      await tieredService.generateResponse(premiumRequest);

      const mockPatientData: PatientData = {
        id: 'patient-metrics',
        sessions: [],
        journalEntries: [],
        goals: [],
        assessments: [],
        demographics: {
          age: 25,
          gender: 'female',
          occupation: 'student',
          location: 'Boston',
          therapyExperience: 'none'
        },
        preferences: {
          communicationStyle: 'supportive',
          sessionFrequency: 'weekly',
          preferredTopics: [],
          avoidTopics: [],
          goals: ['academic success', 'stress management']
        }
      };

      await premiumFeatures.generatePredictiveInsights(mockPatientData);

      const metrics = tieredService.getUsageMetrics();
      expect(metrics.totalRequests).toBeGreaterThan(0);
      expect(metrics.totalCost).toBeGreaterThanOrEqual(0);
      expect(metrics.averageLatency).toBeGreaterThanOrEqual(0);
    });
  });
});