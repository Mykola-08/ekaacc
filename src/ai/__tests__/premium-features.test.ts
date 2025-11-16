// Jest imports are global, no need to import describe, it, expect, beforeEach, afterEach
import { PremiumAIFeatures } from '../premium-features';
import type { PatientData, PredictiveInsights, TrendAnalysis, PersonalizedRecommendation } from '../premium-features';

// Mock the tiered AI service
jest.mock('../tiered-ai-service', () => ({
  tieredAI: {
    generateResponse: jest.fn().mockResolvedValue({
      output: `Based on patient data analysis, here are my recommendations:

Recommendation 1: Increase mindfulness practice
Description: Patient shows good response to mindfulness techniques based on recent journal entries.
Priority: High
Timeline: 2-4 weeks

Recommendation 2: Continue CBT techniques  
Description: Cognitive behavioral therapy has shown positive results in previous sessions.
Priority: Medium
Timeline: 4-6 weeks

Recommendation 3: Focus on sleep hygiene
Description: Recent data shows sleep patterns affecting mood stability.
Priority: High
Timeline: 1-2 weeks`,
      confidence: 0.85,
      cost: 0.02,
      latency: 150,
      metadata: { type: 'analysis' }
    })
  }
}));

describe('PremiumAIFeatures', () => {
  let premiumFeatures: PremiumAIFeatures;

  beforeEach(() => {
    // Reset the singleton instance for each test
    (PremiumAIFeatures as any).instance = null;
    premiumFeatures = PremiumAIFeatures.getInstance();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup if needed
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PremiumAIFeatures.getInstance();
      const instance2 = PremiumAIFeatures.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Predictive Insights', () => {
    it('should generate predictive insights for patient data', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-123',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Patient showed good progress',
            patientFeedback: 'Felt helpful',
            moodRating: 7,
            stressLevel: 4,
            topics: ['anxiety', 'coping'],
            interventions: ['CBT', 'mindfulness'],
            outcomes: ['improved mood']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Feeling better today',
            mood: 8,
            energy: 6,
            sleep: 7,
            tags: ['positive', 'progress'],
            sentiment: 'positive'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Reduce anxiety',
            description: 'Manage daily anxiety levels',
            category: 'mental-health',
            progress: 0.6,
            targetDate: new Date('2024-06-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Complete 10 therapy sessions',
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
            scores: { total: 12, anxiety: 8, depression: 4 },
            interpretation: 'Moderate anxiety levels detected',
            recommendations: ['CBT', 'Mindfulness', 'Exercise']
          }
        ],
        demographics: {
          age: 30,
          gender: 'female',
          occupation: 'teacher',
          location: 'New York',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'supportive',
          sessionFrequency: 'weekly',
          preferredTopics: ['anxiety', 'stress'],
          avoidTopics: ['trauma', 'abuse'],
          goals: ['reduce anxiety', 'improve sleep', 'better coping']
        }
      };

      const insights = await premiumFeatures.generatePredictiveInsights(mockPatientData);

      expect(insights).toBeDefined();
      expect(insights.riskFactors).toBeDefined();
      expect(insights.improvementTrajectory).toBeDefined();
      expect(insights.improvementTrajectory.momentum).toBeGreaterThanOrEqual(0);
      expect(insights.improvementTrajectory.momentum).toBeLessThanOrEqual(1);
      expect(insights.recommendedInterventions).toBeDefined();
      expect(insights.predictedOutcomes).toBeDefined();
      expect(insights.confidence).toBeGreaterThanOrEqual(0);
      expect(insights.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle empty patient data', async () => {
      const emptyPatientData: PatientData = {
        id: 'patient-empty',
        sessions: [],
        journalEntries: [],
        goals: [],
        assessments: [],
        demographics: {
          age: 25,
          gender: 'other',
          occupation: 'unknown',
          location: 'unknown',
          therapyExperience: 'none'
        },
        preferences: {
          communicationStyle: 'casual',
          sessionFrequency: 'biweekly',
          preferredTopics: [],
          avoidTopics: [],
          goals: ['general wellness']
        }
      };

      const insights = await premiumFeatures.generatePredictiveInsights(emptyPatientData);

      expect(insights).toBeDefined();
      expect(insights.riskFactors).toBeDefined();
      expect(insights.improvementTrajectory).toBeDefined();
      expect(insights.improvementTrajectory.momentum).toBeGreaterThanOrEqual(0);
      expect(insights.improvementTrajectory.momentum).toBeLessThanOrEqual(1);
    });
  });

  describe('Trend Analysis', () => {
    it('should analyze trends in patient data', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-456',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Good session',
            patientFeedback: 'Helpful',
            moodRating: 6,
            stressLevel: 5,
            topics: ['anxiety'],
            interventions: ['CBT'],
            outcomes: ['some improvement']
          },
          {
            id: 'session-2',
            date: new Date('2024-01-08'),
            duration: 60,
            therapistNotes: 'Better session',
            patientFeedback: 'Very helpful',
            moodRating: 8,
            stressLevel: 3,
            topics: ['anxiety', 'coping'],
            interventions: ['CBT', 'mindfulness'],
            outcomes: ['significant improvement']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Feeling okay',
            mood: 6,
            energy: 5,
            sleep: 6,
            tags: ['neutral'],
            sentiment: 'neutral'
          },
          {
            id: 'entry-2',
            date: new Date('2024-01-09'),
            content: 'Feeling much better',
            mood: 8,
            energy: 7,
            sleep: 8,
            tags: ['positive'],
            sentiment: 'positive'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Reduce anxiety',
            description: 'Manage anxiety levels',
            category: 'mental-health',
            progress: 0.7,
            targetDate: new Date('2024-06-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Complete sessions',
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
            scores: { total: 14, anxiety: 10, depression: 4 },
            interpretation: 'Moderate anxiety levels',
            recommendations: ['CBT', 'Mindfulness']
          },
          {
            id: 'assessment-2',
            date: new Date('2024-01-08'),
            type: 'GAD-7',
            scores: { total: 8, anxiety: 6, depression: 2 },
            interpretation: 'Mild anxiety levels showing improvement',
            recommendations: ['Continue current treatment']
          }
        ],
        demographics: {
          age: 28,
          gender: 'male',
          occupation: 'engineer',
          location: 'San Francisco',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'formal',
          sessionFrequency: 'weekly',
          preferredTopics: ['anxiety'],
          avoidTopics: [],
          goals: ['reduce anxiety', 'improve focus']
        }
      };

      const trends = await premiumFeatures.analyzeTrends(mockPatientData);

      expect(trends).toBeDefined();
      expect(trends.moodTrends).toBeDefined();
      expect(trends.progressTrends).toBeDefined();
      expect(trends.sessionEffectiveness).toBeDefined();
      expect(trends.behavioralPatterns).toBeDefined();
      expect(trends.seasonalFactors).toBeDefined();
    });
  });

  describe('Personalized Recommendations', () => {
    it('should generate personalized recommendations', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-789',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 45,
            therapistNotes: 'Patient responds well to CBT',
            patientFeedback: 'CBT is helpful',
            moodRating: 7,
            stressLevel: 4,
            topics: ['anxiety', 'CBT'],
            interventions: ['CBT'],
            outcomes: ['good response']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Practiced CBT techniques today',
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
            description: 'Learn and apply CBT methods',
            category: 'skills',
            progress: 0.5,
            targetDate: new Date('2024-03-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Learn basic CBT',
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
            scores: { total: 70, knowledge: 70 },
            severity: 'average',
            responses: {}
          }
        ],
        demographics: {
          age: 35,
          gender: 'female',
          occupation: 'nurse',
          location: 'Chicago',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'formal',
          sessionFrequency: 'weekly',
          preferredTopics: ['CBT', 'anxiety'],
          avoidTopics: [],
          goals: ['learn CBT techniques', 'manage anxiety']
        }
      };

      const recommendations = await premiumFeatures.generatePersonalizedRecommendations(mockPatientData);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);

      recommendations.forEach(recommendation => {
        expect(recommendation.type).toBeDefined();
        expect(recommendation.title).toBeDefined();
        expect(recommendation.description).toBeDefined();
        expect(recommendation.rationale).toBeDefined();
        expect(recommendation.priority).toBeDefined();
        expect(recommendation.estimatedImpact).toBeGreaterThanOrEqual(0);
        expect(recommendation.implementationDifficulty).toBeDefined();
        expect(recommendation.timeline).toBeDefined();
        expect(recommendation.personalizationFactors).toBeDefined();
      });
    });

    it('should handle patient data with minimal information', async () => {
      const minimalPatientData: PatientData = {
        id: 'patient-minimal',
        sessions: [],
        journalEntries: [],
        goals: [],
        assessments: [],
        demographics: {
          age: 20,
          gender: 'other',
          occupation: 'student',
          location: 'unknown'
        },
        preferences: {
          communicationStyle: 'casual',
          sessionFrequency: 'monthly',
          preferredTopics: [],
          avoidTopics: [],
          goals: ['general support']
        }
      };

      const recommendations = await premiumFeatures.generatePersonalizedRecommendations(minimalPatientData);

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });

  describe('Advanced Summary Generation', () => {
    it('should generate comprehensive summary', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-summary',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Patient made good progress with anxiety management',
            patientFeedback: 'Feeling more confident',
            moodRating: 8,
            stressLevel: 3,
            topics: ['anxiety', 'confidence'],
            interventions: ['CBT', 'exposure therapy'],
            outcomes: ['improved confidence', 'reduced anxiety']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Had a great day today. Managed my anxiety well.',
            mood: 8,
            energy: 7,
            sleep: 8,
            tags: ['anxiety', 'good day'],
            sentiment: 'positive'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Manage anxiety',
            description: 'Develop coping strategies for anxiety',
            category: 'mental-health',
            progress: 0.8,
            targetDate: new Date('2024-02-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Learn 5 coping techniques',
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
            scores: { total: 6, anxiety: 6 },
            severity: 'mild',
            responses: {}
          }
        ],
        demographics: {
          age: 32,
          gender: 'male',
          occupation: 'software developer',
          location: 'Seattle',
          therapyExperience: 'extensive'
        },
        preferences: {
          communicationStyle: 'supportive',
          sessionFrequency: 'biweekly',
          preferredTopics: ['anxiety', 'coping'],
          avoidTopics: [],
          goals: ['master coping skills', 'maintain progress']
        }
      };

      const summary = await premiumFeatures.generateAdvancedSummary(mockPatientData, 'comprehensive');

      expect(summary).toBeDefined();
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });
  });

  describe('Intervention Effectiveness Prediction', () => {
    it('should predict intervention effectiveness', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-intervention',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 50,
            therapistNotes: 'Patient responded well to CBT techniques',
            patientFeedback: 'CBT was helpful',
            moodRating: 7,
            stressLevel: 4,
            topics: ['CBT', 'anxiety'],
            interventions: ['CBT'],
            outcomes: ['good response']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Practiced CBT exercises, feeling better',
            mood: 7,
            energy: 6,
            sleep: 7,
            tags: ['CBT', 'practice'],
            sentiment: 'positive'
          }
        ],
        goals: [],
        assessments: [],
        demographics: {
          age: 29,
          gender: 'female',
          occupation: 'marketing manager',
          location: 'Los Angeles',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'structured',
          sessionFrequency: 'weekly',
          preferredTopics: ['CBT'],
          avoidTopics: ['group therapy'],
          goals: ['master CBT techniques']
        }
      };

      const intervention = 'CBT';
      const prediction = await premiumFeatures.predictInterventionEffectiveness(mockPatientData, intervention);

      expect(prediction).toBeDefined();
      expect(prediction.intervention).toBe(intervention);
      expect(prediction.rationale).toBeDefined();
      expect(prediction.expectedImpact).toBeGreaterThanOrEqual(0);
      expect(prediction.expectedImpact).toBeLessThanOrEqual(1);
      expect(prediction.implementationSteps).toBeDefined();
      expect(prediction.timeline).toBeDefined();
      expect(prediction.evidenceLevel).toBeDefined();
    });
  });

  describe('Therapeutic Insights Generation', () => {
    it('should generate therapeutic insights', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-insights',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 55,
            therapistNotes: 'Patient shows resistance to change',
            patientFeedback: 'Unsure about progress',
            moodRating: 5,
            stressLevel: 7,
            topics: ['resistance', 'change'],
            interventions: ['motivational interviewing'],
            outcomes: ['mixed results']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Feeling stuck and unsure about therapy',
            mood: 5,
            energy: 4,
            sleep: 5,
            tags: ['stuck', 'uncertainty'],
            sentiment: 'negative'
          }
        ],
        goals: [
          {
            id: 'goal-1',
            title: 'Overcome resistance',
            description: 'Work through therapeutic resistance',
            category: 'process',
            progress: 0.2,
            targetDate: new Date('2024-04-01'),
            milestones: [
              {
                id: 'milestone-1',
                description: 'Identify resistance patterns',
                completed: true
              }
            ]
          }
        ],
        assessments: [
          {
            id: 'assessment-1',
            date: new Date('2024-01-01'),
            type: 'Readiness-to-Change',
            scores: { total: 45, readiness: 45 },
            severity: 'low',
            responses: {}
          }
        ],
        demographics: {
          age: 40,
          gender: 'male',
          occupation: 'lawyer',
          location: 'Boston',
          therapyExperience: 'extensive'
        },
        preferences: {
          communicationStyle: 'formal',
          sessionFrequency: 'weekly',
          preferredTopics: ['resistance', 'change'],
          avoidTopics: ['small talk'],
          goals: ['overcome resistance', 'embrace change']
        }
      };

      const insights = await premiumFeatures.generateTherapeuticInsights(mockPatientData);

      expect(insights).toBeDefined();
      expect(insights.insights).toBeDefined();
      expect(insights.confidence).toBeGreaterThanOrEqual(0);
      expect(insights.confidence).toBeLessThanOrEqual(1);
      expect(insights.metadata).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid patient data gracefully', async () => {
      const invalidPatientData = {
        id: '',
        sessions: null as any,
        journalEntries: null as any,
        goals: null as any,
        assessments: null as any,
        demographics: null as any,
        preferences: null as any
      };

      await expect(
        premiumFeatures.generatePredictiveInsights(invalidPatientData)
      ).rejects.toThrow();
    });

    it('should handle missing required fields', async () => {
      const incompletePatientData = {
        id: 'patient-incomplete',
        sessions: [],
        journalEntries: [],
        goals: [],
        assessments: [],
        demographics: {
          age: 25,
          gender: 'female',
          occupation: 'teacher',
          location: 'Chicago',
          therapyExperience: 'none'
        },
        preferences: {
          communicationStyle: 'supportive',
          sessionFrequency: 'weekly',
          preferredTopics: ['anxiety'],
          avoidTopics: [],
          goals: ['reduce anxiety']
        }
      };

      await expect(
        premiumFeatures.generatePredictiveInsights(incompletePatientData)
      ).resolves.toBeDefined();
    });
  });

  describe('Performance', () => {
    it('should handle multiple concurrent analyses', async () => {
      const mockPatientData: PatientData = {
        id: 'patient-concurrent',
        sessions: [
          {
            id: 'session-1',
            date: new Date('2024-01-01'),
            duration: 60,
            therapistNotes: 'Good progress',
            patientFeedback: 'Helpful',
            moodRating: 7,
            stressLevel: 4,
            topics: ['anxiety'],
            interventions: ['CBT'],
            outcomes: ['improvement']
          }
        ],
        journalEntries: [
          {
            id: 'entry-1',
            date: new Date('2024-01-02'),
            content: 'Good day',
            mood: 7,
            energy: 6,
            sleep: 7,
            tags: ['positive'],
            sentiment: 'positive'
          }
        ],
        goals: [],
        assessments: [],
        demographics: {
          age: 30,
          gender: 'male',
          occupation: 'developer',
          location: 'Seattle',
          therapyExperience: 'some'
        },
        preferences: {
          communicationStyle: 'collaborative',
          sessionFrequency: 'biweekly',
          preferredTopics: ['anxiety'],
          avoidTopics: ['social situations'],
          goals: ['reduce social anxiety', 'build confidence']
        }
      };

      const results = await Promise.all([
        premiumFeatures.generatePredictiveInsights(mockPatientData),
        premiumFeatures.analyzeTrends(mockPatientData),
        premiumFeatures.generatePersonalizedRecommendations(mockPatientData),
        premiumFeatures.generateAdvancedSummary(mockPatientData)
      ]);

      expect(results).toHaveLength(4);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});