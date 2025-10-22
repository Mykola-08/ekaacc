
import { TherapyRecommendation } from './types';

export const MOCK_AI_RECOMMENDATIONS: TherapyRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Practice Mindfulness Meditation',
    reasoning: 'Based on your recent journal entries about feeling stressed, a 5-minute daily mindfulness practice could help calm your nervous system.',
    type: 'meditation',
  },
  {
    id: 'rec-2',
    title: 'Read About Cognitive Restructuring',
    reasoning: 'You mentioned struggling with negative thought patterns. This article explains a technique to challenge and change them.',
    type: 'article',
  },
  {
    id: 'rec-3',
    title: 'Try a Guided Breathing Exercise',
    reasoning: 'To help with the anxiety you described before sessions, a short breathing exercise can help center you.',
    type: 'exercise',
  },
];
