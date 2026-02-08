/**
 * AI Personalization Service
 * Advanced personalization logic for context-aware AI responses
 *
 * @review - Basic implementation, designs need polish
 */
import { db } from '@/lib/db';
import { getWellnessSummary, getTodaysMoodEntry } from './wellness-service';
import { getRecentMemories, getImportantMemories } from './ai-memory-service';
import { getActiveInsights, calculateWellnessScore } from './ai-insights-service';
import { getAIClient, getModel } from './provider';

// ============================================================================
// TYPES
// ============================================================================

export interface PersonalizedGreeting {
  greeting: string;
  emoji: string;
  contextTip?: string;
  moodAcknowledgment?: string;
}

export interface DailyAction {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'booking' | 'social' | 'self-care' | 'learning';
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  reason: string;
}

export interface ConversationSentiment {
  overall: 'positive' | 'neutral' | 'negative' | 'mixed';
  confidence: number;
  emotions: string[];
  needsSupport: boolean;
  suggestedTone: string;
}

export interface Affirmation {
  text: string;
  category: string;
  relatedToMood: boolean;
}

export interface BehavioralPattern {
  id: string;
  patternType: string;
  description: string;
  frequency: string;
  insight: string;
  actionSuggestion?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  celebrationMessage: string;
  emoji: string;
  earnedAt: Date;
}

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
  };
  benefits: string[];
  targetStress: 'high' | 'moderate' | 'low';
}

export interface ProgressReport {
  period: 'week' | 'month';
  startDate: Date;
  endDate: Date;
  summary: string;
  stats: {
    moodCheckIns: number;
    averageMood: number;
    bookingsCompleted: number;
    goalsProgress: number;
    streakDays: number;
  };
  highlights: string[];
  areasToImprove: string[];
  nextSteps: string[];
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  breathingPattern: {
    inhale: number;
    hold?: number;
    exhale: number;
  };
  steps: string[];
  calmingQuote?: string;
}

export interface SleepInsight {
  averageSleep: number;
  quality: string;
  trend: 'improving' | 'declining' | 'stable';
  tips: string[];
  summary: string;
}

export interface GoalTracker {
  goals: {
    id: string;
    title: string;
    progress: number;
    target: number;
    unit: string;
    isCompleted: boolean;
  }[];
  lastActiveGoal?: string;
}

export interface MoodCalendarDay {
  date: string;
  mood: number;
  emotions: string[];
}

// ============================================================================
// TIME UTILITIES
// ============================================================================

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getDayOfWeek(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

// ============================================================================
// PERSONALIZED GREETING
// ============================================================================

export async function generatePersonalizedGreeting(userId: string): Promise<PersonalizedGreeting> {
  const timeOfDay = getTimeOfDay();
  const dayOfWeek = getDayOfWeek();

  // Get user context
  const [todayMood, memories, wellnessScore] = await Promise.all([
    getTodaysMoodEntry(userId),
    getRecentMemories(userId, 5),
    calculateWellnessScore(userId),
  ]);

  // Base greetings by time
  const timeGreetings = {
    morning: ['Good morning', 'Rise and shine', 'Hello, early bird'],
    afternoon: ['Good afternoon', 'Hello there', 'Hope your day is going well'],
    evening: ['Good evening', 'Hello', 'Hope you had a great day'],
    night: ['Hello night owl', 'Burning the midnight oil?', 'Hello'],
  };

  const timeEmojis = {
    morning: '☀️',
    afternoon: '🌤️',
    evening: '🌅',
    night: '🌙',
  };

  // Select base greeting
  const greetings = timeGreetings[timeOfDay];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const emoji = timeEmojis[timeOfDay];

  // Check for name in memories
  const nameMemory = memories.find((m) => m.memoryType === 'fact' || m.memoryType === 'preference');

  // Build context tip based on day/time
  let contextTip: string | undefined;
  if (dayOfWeek === 'Monday' && timeOfDay === 'morning') {
    contextTip = 'Ready to start the week strong?';
  } else if (dayOfWeek === 'Friday' && timeOfDay === 'evening') {
    contextTip = 'TGIF! How can I help you wind down?';
  } else if (wellnessScore.overall < 50) {
    contextTip = "I'm here to support you today.";
  }

  // Acknowledge mood if we have today's entry
  let moodAcknowledgment: string | undefined;
  if (todayMood) {
    if (todayMood.mood >= 8) {
      moodAcknowledgment = "Great to see you're feeling good today!";
    } else if (todayMood.mood <= 4) {
      moodAcknowledgment = "I noticed you're having a tough day. I'm here for you.";
    } else if (todayMood.stress === 'high' || todayMood.stress === 'severe') {
      moodAcknowledgment = "Feeling stressed? Let's find some calm together.";
    }
  }

  return {
    greeting: `${greeting}! ${emoji}`,
    emoji,
    contextTip,
    moodAcknowledgment,
  };
}

// ============================================================================
// DAILY ACTIONS
// ============================================================================

export async function suggestDailyActions(userId: string): Promise<DailyAction[]> {
  const [wellnessSummary, todayMood, insights, memories] = await Promise.all([
    getWellnessSummary(userId, 'week'),
    getTodaysMoodEntry(userId),
    getActiveInsights(userId),
    getRecentMemories(userId, 5),
  ]);

  const actions: DailyAction[] = [];
  const timeOfDay = getTimeOfDay();

  // 1. Essential Check-ins (Rule-Based)
  if (!todayMood) {
    actions.push({
      id: 'daily-checkin',
      title: 'Log your mood',
      description: 'Check in with yourself to start the day right.',
      category: 'wellness',
      priority: 'high',
      estimatedMinutes: 2,
      reason: 'Consistency is key to wellness.',
    });
  }

  // 2. AI Personalization Layer
  try {
    const prompt = `
            Context:
            - Time: ${timeOfDay}
            - Mood: ${todayMood ? `${todayMood.mood}/10 (${todayMood.emotions.join(',')})` : 'Not logged yet'}
            - Recent Notes: ${memories.map((m) => m.content).join('; ')}
            - Streak: ${wellnessSummary.streakDays} days
            
            Generate 2 specific, actionable daily tasks for this user.
            Return strictly valid JSON: { "actions": [{ "id", "title", "description", "category" (wellness|booking|social|self-care|learning), "priority" (high|medium), "estimatedMinutes", "reason" }] }
        `;

    const client = await getAIClient();
    const model = await getModel();

    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an empathetic wellness companion. Keep titles short and punchy.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message.content;
    if (content) {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.actions)) {
        actions.push(...parsed.actions);
      }
    }
  } catch (err) {
    console.warn('AI Personalization failed, falling back to rules:', err);
  }

  // 3. Fallbacks if AI fails or returns nothing
  if (actions.length < 2) {
    if (todayMood?.stress === 'high') {
      actions.push({
        id: 'stress-relief',
        title: '5-min Breathing',
        description: 'Center yourself with box breathing.',
        category: 'self-care',
        priority: 'high',
        estimatedMinutes: 5,
        reason: 'De-stress moment',
      });
    }
    actions.push({
      id: 'journal',
      title: 'Evening Reflection',
      description: 'Clear your mind before bed.',
      category: 'self-care',
      priority: 'medium',
      estimatedMinutes: 10,
      reason: 'Daily habit',
    });
  }

  // Deduplicate by ID
  const uniqueActions = Array.from(new Map(actions.map((a) => [a.id, a])).values());

  const pendingInsights = insights.filter((i) => i.actionItems?.some((a) => !a.completed));
  if (pendingInsights.length > 0) {
    uniqueActions.push({
      id: 'complete-insight',
      title: 'Complete an insight action',
      description: `You have ${pendingInsights.length} insight(s) with pending actions`,
      category: 'wellness',
      priority: 'medium',
      estimatedMinutes: 10,
      reason: 'Stay on track with your wellness journey',
    });
  }

  // Sort by priority and return top 5
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return uniqueActions
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 5);
}

// ============================================================================
// SENTIMENT ANALYSIS
// ============================================================================

export async function analyzeConversationSentiment(
  userMessage: string,
  _userId: string
): Promise<ConversationSentiment> {
  // Basic keyword-based sentiment analysis
  // In production, this would use a proper NLP model or OpenAI
  const positiveWords = [
    'happy',
    'great',
    'amazing',
    'wonderful',
    'excited',
    'love',
    'good',
    'better',
    'best',
    'thankful',
    'grateful',
    'awesome',
  ];
  const negativeWords = [
    'sad',
    'angry',
    'frustrated',
    'stressed',
    'anxious',
    'worried',
    'terrible',
    'awful',
    'bad',
    'worst',
    'depressed',
    'hopeless',
    'overwhelmed',
  ];
  const supportWords = [
    'help',
    'need',
    'struggling',
    'lonely',
    'scared',
    'afraid',
    'hurt',
    'pain',
    'crisis',
  ];

  const lowerMessage = userMessage.toLowerCase();
  const words = lowerMessage.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  let needsSupport = false;
  const detectedEmotions: string[] = [];

  for (const word of words) {
    if (positiveWords.includes(word)) {
      positiveCount++;
      if (!detectedEmotions.includes('positive')) detectedEmotions.push('positive');
    }
    if (negativeWords.includes(word)) {
      negativeCount++;
      if (!detectedEmotions.includes('distressed')) detectedEmotions.push('distressed');
    }
    if (supportWords.includes(word)) {
      needsSupport = true;
      if (!detectedEmotions.includes('seeking-support')) detectedEmotions.push('seeking-support');
    }
  }

  let overall: ConversationSentiment['overall'];
  let suggestedTone: string;

  if (positiveCount > negativeCount) {
    overall = 'positive';
    suggestedTone = 'enthusiastic and encouraging';
  } else if (negativeCount > positiveCount) {
    overall = 'negative';
    suggestedTone = 'empathetic and supportive';
  } else if (positiveCount > 0 && negativeCount > 0) {
    overall = 'mixed';
    suggestedTone = 'balanced and understanding';
  } else {
    overall = 'neutral';
    suggestedTone = 'friendly and helpful';
  }

  const confidence = Math.min(0.9, ((positiveCount + negativeCount) / words.length) * 5 + 0.3);

  return {
    overall,
    confidence,
    emotions: detectedEmotions.length > 0 ? detectedEmotions : ['neutral'],
    needsSupport,
    suggestedTone,
  };
}

// ============================================================================
// AFFIRMATIONS
// ============================================================================

const AFFIRMATIONS = {
  low_mood: [
    'This feeling is temporary. You have gotten through difficult times before.',
    "It's okay to not be okay. Your feelings are valid.",
    'You are stronger than you think, and braver than you believe.',
    'Small steps forward are still progress. Be gentle with yourself.',
    'Tomorrow is a new day with new possibilities.',
  ],
  high_stress: [
    'Take a deep breath. This moment will pass.',
    "You don't have to have it all figured out. One step at a time.",
    "It's okay to pause and take care of yourself.",
    "Your worth isn't measured by your productivity.",
    'Stress is a signal, not a life sentence. Listen to what your body needs.',
  ],
  general: [
    'You are capable of amazing things.',
    'Every day is a fresh start and a new opportunity.',
    'You deserve kindness – especially from yourself.',
    'Your journey is unique and beautiful.',
    'Progress, not perfection.',
    'You are exactly where you need to be right now.',
  ],
  celebration: [
    "Look at you go! You're doing amazing!",
    'Your consistency is paying off wonderfully.',
    "You should be proud of how far you've come.",
    'Keep shining – the world needs your light!',
    'Success looks good on you!',
  ],
};

export async function generateAffirmation(userId: string): Promise<Affirmation> {
  const [todayMood, wellnessScore] = await Promise.all([
    getTodaysMoodEntry(userId),
    calculateWellnessScore(userId),
  ]);

  let category: string;
  let pool: string[];
  let relatedToMood = false;

  if (todayMood) {
    relatedToMood = true;
    if (todayMood.mood <= 4) {
      category = 'encouragement';
      pool = AFFIRMATIONS.low_mood;
    } else if (todayMood.stress === 'high' || todayMood.stress === 'severe') {
      category = 'stress-relief';
      pool = AFFIRMATIONS.high_stress;
    } else if (todayMood.mood >= 7) {
      category = 'celebration';
      pool = AFFIRMATIONS.celebration;
    } else {
      category = 'general';
      pool = AFFIRMATIONS.general;
    }
  } else if (wellnessScore.trend === 'improving') {
    category = 'celebration';
    pool = AFFIRMATIONS.celebration;
    relatedToMood = true;
  } else {
    category = 'general';
    pool = AFFIRMATIONS.general;
  }

  const text: string = pool[Math.floor(Math.random() * pool.length)]!;

  return {
    text,
    category,
    relatedToMood,
  };
}

// ============================================================================
// BEHAVIORAL PATTERNS
// ============================================================================

export async function identifyBehavioralPatterns(userId: string): Promise<BehavioralPattern[]> {
  const [wellnessSummary, insights, memories] = await Promise.all([
    getWellnessSummary(userId, 'month'),
    getActiveInsights(userId),
    getImportantMemories(userId),
  ]);

  const patterns: BehavioralPattern[] = [];

  // Mood trend pattern
  if (wellnessSummary.moodTrend === 'improving') {
    patterns.push({
      id: 'mood-improving',
      patternType: 'positive-trend',
      description: 'Your mood has been improving over time',
      frequency: 'Consistent upward trend',
      insight: 'Your wellness practices are having a positive effect!',
      actionSuggestion: "Keep doing what you're doing!",
    });
  } else if (wellnessSummary.moodTrend === 'declining') {
    patterns.push({
      id: 'mood-declining',
      patternType: 'attention-needed',
      description: 'Your mood has been declining recently',
      frequency: 'Downward trend noticed',
      insight: "Let's explore what might be contributing to this.",
      actionSuggestion: 'Consider booking a session or trying some new wellness activities.',
    });
  }

  // Sleep patterns
  if (wellnessSummary.averageSleep < 6) {
    patterns.push({
      id: 'low-sleep',
      patternType: 'health-alert',
      description: "You're averaging less than 6 hours of sleep",
      frequency: 'Most nights',
      insight: 'Sleep deprivation can significantly impact mood and energy.',
      actionSuggestion: 'Try setting a consistent bedtime or reducing screen time before bed.',
    });
  } else if (wellnessSummary.averageSleep >= 7.5) {
    patterns.push({
      id: 'good-sleep',
      patternType: 'positive-habit',
      description: "You're maintaining healthy sleep habits",
      frequency: 'Consistently',
      insight: 'Good sleep is foundational to wellness. Well done!',
    });
  }

  // Check-in streak
  if (wellnessSummary.streakDays >= 7) {
    patterns.push({
      id: 'consistent-tracking',
      patternType: 'achievement',
      description: `You've tracked your wellness for ${wellnessSummary.streakDays} days straight`,
      frequency: 'Daily',
      insight: 'Consistency is key to understanding yourself better!',
      actionSuggestion: 'Keep the streak going!',
    });
  }

  // Common emotions
  if (wellnessSummary.commonEmotions && wellnessSummary.commonEmotions.length > 0) {
    const topEmotion = wellnessSummary.commonEmotions[0];
    if (topEmotion) {
      patterns.push({
        id: 'common-emotion',
        patternType: 'emotional-pattern',
        description: `"${topEmotion.emotion}" appears frequently in your check-ins`,
        frequency: `${topEmotion.count} times recently`,
        insight: `This emotion seems to be a regular part of your experience.`,
      });
    }
  }

  return patterns;
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export async function celebrateAchievement(userId: string): Promise<Achievement[]> {
  const [wellnessSummary, wellnessScore] = await Promise.all([
    getWellnessSummary(userId, 'month'),
    calculateWellnessScore(userId),
  ]);

  const achievements: Achievement[] = [];

  // Streak achievements
  if (wellnessSummary.streakDays >= 7) {
    achievements.push({
      id: 'streak-7',
      title: '7 Day Streak! 🔥',
      description: "You've checked in for 7 days straight",
      celebrationMessage: "A whole week of tracking! You're building a powerful habit!",
      emoji: '🔥',
      earnedAt: new Date(),
    });
  }

  if (wellnessSummary.streakDays >= 30) {
    achievements.push({
      id: 'streak-30',
      title: 'Monthly Master! 🏆',
      description: "You've maintained a 30-day streak",
      celebrationMessage: 'Incredible commitment! A full month of wellness tracking!',
      emoji: '🏆',
      earnedAt: new Date(),
    });
  }

  // Mood improvements
  if (wellnessSummary.moodTrend === 'improving' && wellnessSummary.averageMood >= 7) {
    achievements.push({
      id: 'mood-climber',
      title: 'Mood Climber! 📈',
      description: 'Your mood has been steadily improving',
      celebrationMessage: 'Your hard work on your wellness is paying off!',
      emoji: '📈',
      earnedAt: new Date(),
    });
  }

  // Wellness score milestones
  if (wellnessScore.overall >= 80) {
    achievements.push({
      id: 'wellness-star',
      title: 'Wellness Star! ⭐',
      description: "You've achieved a wellness score of 80+",
      celebrationMessage: "You're absolutely crushing it! Keep shining!",
      emoji: '⭐',
      earnedAt: new Date(),
    });
  }

  // Consistency achievement
  if (wellnessScore.consistency >= 80) {
    achievements.push({
      id: 'consistent-champion',
      title: 'Consistency Champion! 🎯',
      description: "You're incredibly consistent with your wellness practice",
      celebrationMessage: 'Your dedication to showing up every day is remarkable!',
      emoji: '🎯',
      earnedAt: new Date(),
    });
  }

  return achievements;
}

// ============================================================================
// BREATHING EXERCISES
// ============================================================================

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description:
      'A calming technique used by Navy SEALs. Inhale, hold, exhale, hold – each for 4 seconds.',
    duration: 4,
    pattern: { inhale: 4, hold: 4, exhale: 4 },
    benefits: ['Reduces stress', 'Improves focus', 'Calms the nervous system'],
    targetStress: 'high',
  },
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description:
      'A relaxing breath pattern that promotes sleep and calm. Inhale for 4, hold for 7, exhale for 8.',
    duration: 5,
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ['Promotes relaxation', 'Helps with sleep', 'Reduces anxiety'],
    targetStress: 'high',
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing that activates the parasympathetic nervous system.',
    duration: 5,
    pattern: { inhale: 4, exhale: 6 },
    benefits: ['Lowers blood pressure', 'Reduces heart rate', 'Promotes calm'],
    targetStress: 'moderate',
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick, shallow breaths to increase alertness and energy.',
    duration: 2,
    pattern: { inhale: 2, exhale: 2 },
    benefits: ['Increases energy', 'Improves alertness', 'Wakes up the body'],
    targetStress: 'low',
  },
];

export async function suggestBreathingExercise(userId: string): Promise<BreathingExercise> {
  const todayMood = await getTodaysMoodEntry(userId);

  // Determine stress level
  let targetStress: 'high' | 'moderate' | 'low' = 'moderate';
  if (todayMood) {
    if (todayMood.stress === 'severe' || todayMood.stress === 'high') {
      targetStress = 'high';
    } else if (todayMood.stress === 'minimal') {
      targetStress = 'low';
    }
  }

  // Find matching exercises
  const matching = BREATHING_EXERCISES.filter((e) => e.targetStress === targetStress);
  if (matching.length > 0 && matching[0]) {
    return matching[Math.floor(Math.random() * matching.length)]!;
  }

  // Default to box breathing
  return BREATHING_EXERCISES[0]!;
}

// ============================================================================
// PROGRESS REPORT
// ============================================================================

export async function generateProgressReport(
  userId: string,
  period: 'week' | 'month' = 'week'
): Promise<ProgressReport> {
  const [wellnessSummary, wellnessScore, insights] = await Promise.all([
    getWellnessSummary(userId, period),
    calculateWellnessScore(userId),
    getActiveInsights(userId),
  ]);

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - (period === 'week' ? 7 : 30));

  // Get bookings count
  let bookingsCompleted = 0;
  try {
    const result = await db.queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM booking WHERE customer_reference_id = $1 AND status = 'completed' AND created_at >= $2`,
      [userId, startDate.toISOString()]
    );
    bookingsCompleted = result ? parseInt(result.count, 10) : 0;
  } catch {
    // Table might not exist
  }

  // Calculate goals progress
  let goalsProgress = 0;
  const completedActions = insights.reduce((sum, i) => {
    const total = i.actionItems?.length || 0;
    const completed = i.actionItems?.filter((a) => a.completed).length || 0;
    return sum + (total > 0 ? completed / total : 0);
  }, 0);
  if (insights.length > 0) {
    goalsProgress = Math.round((completedActions / insights.length) * 100);
  }

  // Generate summary
  let summary: string;
  if (wellnessScore.overall >= 70) {
    summary = `You've had a great ${period}! Your wellness score is ${wellnessScore.overall}, and you've been consistent with your tracking.`;
  } else if (wellnessScore.overall >= 50) {
    summary = `A solid ${period} overall. There's room for improvement, but you're on the right track.`;
  } else {
    summary = `This ${period} has been challenging. Remember, it's okay to have tough periods. Let's focus on small wins.`;
  }

  // Generate highlights
  const highlights: string[] = [];
  if (wellnessSummary.streakDays > 0) {
    highlights.push(`Maintained a ${wellnessSummary.streakDays}-day tracking streak`);
  }
  if (wellnessSummary.moodTrend === 'improving') {
    highlights.push('Your mood trend is improving');
  }
  if (wellnessSummary.averageMood >= 7) {
    highlights.push(`Average mood of ${wellnessSummary.averageMood}/10 – great job!`);
  }
  if (bookingsCompleted > 0) {
    highlights.push(
      `Completed ${bookingsCompleted} wellness session${bookingsCompleted > 1 ? 's' : ''}`
    );
  }

  // Areas to improve
  const areasToImprove: string[] = [];
  if (wellnessSummary.averageSleep < 7) {
    areasToImprove.push('Consider focusing on sleep quality');
  }
  if (wellnessScore.stress < 50) {
    areasToImprove.push('Stress management could use attention');
  }
  if (wellnessScore.engagement < 50) {
    areasToImprove.push('Try engaging with more wellness features');
  }

  // Next steps
  const nextSteps: string[] = [
    'Continue daily mood check-ins',
    'Try a new breathing exercise',
    'Set a wellness goal for next ' + period,
  ];

  return {
    period,
    startDate,
    endDate: now,
    summary,
    stats: {
      moodCheckIns: wellnessSummary.totalEntries,
      averageMood: wellnessSummary.averageMood,
      bookingsCompleted,
      goalsProgress,
      streakDays: wellnessSummary.streakDays,
    },
    highlights: highlights.length > 0 ? highlights : ['You showed up and did your best'],
    areasToImprove: areasToImprove.length > 0 ? areasToImprove : ["Keep doing what you're doing!"],
    nextSteps,
  };
}

// ============================================================================
// GUIDED MEDITATION
// ============================================================================

export async function startGuidedMeditation(userId: string): Promise<MeditationSession> {
  const todayMood = await getTodaysMoodEntry(userId);

  let title = 'Calm Moments';
  let breathingPattern = { inhale: 4, hold: 4, exhale: 4 };
  const steps = [
    'Find a comfortable seated position',
    'Close your eyes and focus on your breath',
    'Follow the visual breathing guide',
    'If your mind wanders, gently bring it back to your breath',
  ];

  if (todayMood?.stress === 'high' || todayMood?.stress === 'severe') {
    title = 'De-Stress Session';
    breathingPattern = { inhale: 4, hold: 7, exhale: 8 };
    steps.push('Feel the tension leaving your body with each exhale');
  }

  return {
    id: 'session-' + Date.now(),
    title,
    description: 'A short meditation to help you re-center.',
    durationMinutes: 3,
    breathingPattern,
    steps,
    calmingQuote:
      'The present moment is the only moment available to us, and it is the door to all moments.',
  };
}

// ============================================================================
// SLEEP INSIGHTS
// ============================================================================

export async function getSleepQualityInsights(userId: string): Promise<SleepInsight> {
  const summary = await getWellnessSummary(userId, 'week');

  const tips = [
    'Maintain a consistent sleep schedule',
    'Avoid screens 30 minutes before bed',
    'Keep your bedroom cool and dark',
  ];

  let quality = 'Moderate';
  if (summary.averageSleep >= 7.5) quality = 'Excellent';
  else if (summary.averageSleep >= 6.5) quality = 'Good';
  else if (summary.averageSleep < 5.5) {
    quality = 'Poor';
    tips.push('Consider a relaxing evening ritual to improve sleep duration');
  }

  return {
    averageSleep: summary.averageSleep,
    quality,
    trend: summary.averageSleep > 7 ? 'improving' : 'stable',
    tips: tips.slice(0, 4),
    summary: `You've averaged ${summary.averageSleep} hours of sleep this week. Consistent sleep is vital for your mental well-being.`,
  };
}

// ============================================================================
// GOAL TRACKER
// ============================================================================

export async function getInteractiveGoalTracker(userId: string): Promise<GoalTracker> {
  // In a real app, we'd fetch these from a 'wellness_goals' table
  // For now, we'll derive some based on user activity or return placeholders
  const summary = await getWellnessSummary(userId, 'week');

  return {
    goals: [
      {
        id: 'mood-logs',
        title: 'Daily Check-ins',
        progress: summary.totalEntries,
        target: 7,
        unit: 'days',
        isCompleted: summary.totalEntries >= 7,
      },
      {
        id: 'sleep-target',
        title: 'Sleep Target (7h+)',
        progress: Math.round(summary.averageSleep * 10) / 10,
        target: 7,
        unit: 'hours',
        isCompleted: summary.averageSleep >= 7,
      },
    ],
  };
}

// ============================================================================
// MOOD CALENDAR
// ============================================================================

export async function getMoodCalendar(userId: string): Promise<MoodCalendarDay[]> {
  try {
    const rows = await db.query<{ created_at: Date; mood: number; emotions: string[] }>(
      `SELECT created_at, mood, emotions 
             FROM wellness_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '14 days'
             ORDER BY created_at ASC`,
      [userId]
    );

    return rows.rows.map((r) => ({
      date: r.created_at.toISOString().split('T')[0]!,
      mood: r.mood,
      emotions: r.emotions || [],
    }));
  } catch {
    return [];
  }
}
