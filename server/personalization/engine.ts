/**
 * Personalization Engine
 * Generates personalized content and recommendations based on user data
 *
 * @review - Basic implementation, needs more sophisticated algorithms
 */
import { db } from '@/lib/db';
import { getWellnessSummary } from '../ai/wellness-service';
import { getActiveInsights } from '../ai/ai-insights-service';
import { getRecentMemories } from '../ai/ai-memory-service';
import { getAllRecommendations } from '../ai/recommendation-engine';

export interface PersonalizedContent {
  welcomeMessage: string;
  motivationalMessages: string[];
  celebrationMessages: string[];
  checkInMessages: string[];
  feedbackMessages: FeedbackMessage[];
}

export interface FeedbackMessage {
  type: 'encouragement' | 'tip' | 'reminder' | 'celebration';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserActivityData {
  lastActiveDate?: Date;
  loginStreak: number;
  completedSessions: number;
  completedExercises: number;
  journalEntries: number;
  lastSessionDate?: Date;
  mostVisitedPages: string[];
  featureUsage: Record<string, number>;
}

export interface PersonalizationProfile {
  name?: string;
  occupation?: string;
  goals: string[];
  therapeuticGoals: string[];
  sportsActivities: string[];
  workStressLevel: number;
  sleepQuality: number;
  progressTrend: 'improving' | 'stable' | 'declining';
  activityData: UserActivityData;
}

/**
 * Get personalization profile for a user
 */
export async function getPersonalizationProfile(userId: string): Promise<PersonalizationProfile> {
  const defaultProfile: PersonalizationProfile = {
    goals: [],
    therapeuticGoals: [],
    sportsActivities: [],
    workStressLevel: 5,
    sleepQuality: 3,
    progressTrend: 'stable',
    activityData: {
      loginStreak: 0,
      completedSessions: 0,
      completedExercises: 0,
      journalEntries: 0,
      mostVisitedPages: [],
      featureUsage: {},
    },
  };

  try {
    // Get profile data
    const profileData = await db.queryOne<{
      full_name: string;
      personalization_data: Record<string, unknown>;
    }>(`SELECT full_name, personalization_data FROM profiles WHERE auth_id = $1`, [userId]);

    if (profileData) {
      defaultProfile.name = profileData.full_name;
      const pd = profileData.personalization_data || {};
      defaultProfile.goals = (pd.goals as string[]) || [];
      defaultProfile.occupation = pd.occupation as string;
    }

    // Get onboarding answers
    const onboardingData = await db.query<{
      question_key: string;
      answer_data: { value: unknown };
    }>(
      `SELECT oq.question_key, uoa.answer_data
       FROM user_onboarding_answers uoa
       JOIN onboarding_questions oq ON uoa.question_id = oq.id
       JOIN profiles p ON p.id = uoa.profile_id
       WHERE p.auth_id = $1`,
      [userId]
    );

    for (const answer of onboardingData.rows) {
      switch (answer.question_key) {
        case 'primary_goal':
          if (answer.answer_data?.value) {
            defaultProfile.therapeuticGoals.push(String(answer.answer_data.value));
          }
          break;
        case 'stress_level':
          defaultProfile.workStressLevel = Number(answer.answer_data?.value) || 5;
          break;
        case 'sleep_quality':
          defaultProfile.sleepQuality = Number(answer.answer_data?.value) || 3;
          break;
      }
    }

    // Get activity data
    const activityData = await db.queryOne<{
      sessions: number;
      journals: number;
      last_session: Date;
    }>(
      `SELECT
        (SELECT COUNT(*) FROM booking WHERE customer_reference_id = $1 AND status = 'completed') as sessions,
        (SELECT COUNT(*) FROM journal_entries WHERE user_id = $1) as journals,
        (SELECT MAX(start_time) FROM booking WHERE customer_reference_id = $1 AND status = 'completed') as last_session`,
      [userId]
    );

    if (activityData) {
      defaultProfile.activityData.completedSessions = Number(activityData.sessions) || 0;
      defaultProfile.activityData.journalEntries = Number(activityData.journals) || 0;
      defaultProfile.activityData.lastSessionDate = activityData.last_session;
    }

    // Get wellness trend
    const wellness = await getWellnessSummary(userId, 'week');
    defaultProfile.progressTrend = wellness.moodTrend;
    defaultProfile.sleepQuality = Math.round(wellness.averageSleep);

    return defaultProfile;
  } catch (error) {
    console.error('Error getting personalization profile:', error);
    return defaultProfile;
  }
}

/**
 * Generate personalized welcome message
 */
export function generateWelcomeMessage(profile: PersonalizationProfile): string {
  const hour = new Date().getHours();
  let greeting = 'Hello';

  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  const name = profile.name?.split(' ')[0] || '';

  // Students with goals get special messaging
  if (
    profile.occupation === 'student' &&
    profile.therapeuticGoals &&
    profile.therapeuticGoals.length > 0
  ) {
    return `${greeting}${name ? `, ${name}` : ''}! Ready to work on ${profile.therapeuticGoals[0]?.toLowerCase()}?`;
  }

  // Login streak recognition
  if (profile.activityData.loginStreak > 3) {
    return `${greeting}${name ? `, ${name}` : ''}! ${profile.activityData.loginStreak} days strong!`;
  }

  // Goal-based greeting
  if (profile.therapeuticGoals && profile.therapeuticGoals.length > 0) {
    return `${greeting}${name ? `, ${name}` : ''}! Let's continue your ${profile.therapeuticGoals[0]?.toLowerCase()} journey.`;
  }

  // Default
  return `${greeting}${name ? `, ${name}` : ''}! Welcome back to EKA Balance.`;
}

/**
 * Generate motivational messages based on user profile
 */
export function generateMotivationalMessages(profile: PersonalizationProfile): string[] {
  const messages: string[] = [];

  // Goal-based messages
  for (const goal of profile.therapeuticGoals) {
    const goalLower = goal.toLowerCase();
    if (goalLower.includes('stress')) {
      messages.push("Taking time for yourself is not selfish - it's necessary.");
    }
    if (goalLower.includes('sleep')) {
      messages.push('Quality rest is the foundation of wellness.');
    }
    if (goalLower.includes('pain')) {
      messages.push('Every small step toward relief matters.');
    }
  }

  // Progress-based messages
  if (profile.progressTrend === 'improving') {
    messages.push('Your progress is showing! Keep going!');
    messages.push("You're on the right track. Trust the process.");
  }

  // Streak-based messages
  if (profile.activityData.loginStreak >= 7) {
    messages.push(`${profile.activityData.loginStreak} days of consistency. Amazing dedication!`);
  }

  // Occupation-based
  if (profile.occupation === 'student') {
    messages.push('Balance is key - academics and wellness go hand in hand.');
  }

  // High stress messages
  if (profile.workStressLevel >= 7) {
    messages.push("Remember to breathe. You're handling more than you think.");
  }

  // Default messages if none generated
  if (messages.length === 0) {
    messages.push('Every day is a new opportunity for wellness.');
    messages.push('Small steps lead to big changes.');
    messages.push('You deserve to feel your best.');
  }

  return messages.slice(0, 3);
}

/**
 * Generate session recommendations with priorities
 */
export function generateSessionRecommendations(profile: PersonalizationProfile): {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}[] {
  const recommendations: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[] = [];

  // Stress-based recommendations
  if (
    profile.therapeuticGoals.some((g) => g.toLowerCase().includes('stress')) ||
    profile.workStressLevel >= 4
  ) {
    recommendations.push({
      title: 'Stress Management Session',
      description: 'Learn techniques to manage daily stress effectively.',
      priority: 'high',
    });
  }

  // Sleep-based recommendations
  if (
    profile.therapeuticGoals.some((g) => g.toLowerCase().includes('sleep')) ||
    profile.sleepQuality <= 2
  ) {
    recommendations.push({
      title: 'Sleep Hygiene Workshop',
      description: 'Improve your sleep quality with proven techniques.',
      priority: 'high',
    });
  }

  // Activity-based recommendations
  if (profile.sportsActivities.length > 0) {
    recommendations.push({
      title: 'Athletic Mindset Coaching',
      description: 'Mental training to enhance your athletic performance.',
      priority: 'medium',
    });
  }

  // Student-specific
  if (profile.occupation === 'student') {
    recommendations.push({
      title: 'Student Success Session',
      description: 'Balance academics with mental wellness.',
      priority: 'medium',
    });
  }

  // Progress-based recommendations
  if (profile.activityData.completedSessions >= 5 && profile.progressTrend === 'improving') {
    recommendations.push({
      title: 'Advanced Wellness Strategies',
      description: 'Take your wellness practice to the next level.',
      priority: 'medium',
    });
  }

  return recommendations.slice(0, 4);
}

/**
 * Generate exercise recommendations
 */
export function generateExerciseRecommendations(profile: PersonalizationProfile): {
  type: string;
  duration: number;
  reason: string;
}[] {
  const exercises: { type: string; duration: number; reason: string }[] = [];

  // High stress
  if (profile.workStressLevel >= 6) {
    exercises.push({
      type: 'Deep Breathing',
      duration: 5,
      reason: 'Quick stress relief for your busy day',
    });
  }

  // Low energy/sleep
  if (profile.sleepQuality <= 2) {
    exercises.push({
      type: 'Evening Wind-Down',
      duration: 10,
      reason: 'Prepare your mind for better sleep',
    });
  }

  // Focus goals
  if (profile.therapeuticGoals.some((g) => g.toLowerCase().includes('focus'))) {
    exercises.push({
      type: 'Concentration Meditation',
      duration: 10,
      reason: 'Sharpen your focus and clarity',
    });
  }

  // Default recommendations
  if (exercises.length === 0) {
    exercises.push({
      type: 'Mindfulness Meditation',
      duration: 10,
      reason: 'A great daily wellness practice',
    });
    exercises.push({
      type: 'Gratitude Journal',
      duration: 5,
      reason: 'Cultivate positivity in your day',
    });
  }

  return exercises.slice(0, 3);
}

/**
 * Generate feedback messages
 */
export function generateFeedbackMessages(profile: PersonalizationProfile): FeedbackMessage[] {
  const messages: FeedbackMessage[] = [];

  // First session celebration
  if (profile.activityData.completedSessions === 1) {
    messages.push({
      type: 'celebration',
      message: 'Congratulations on completing your first session!',
      priority: 'high',
    });
  }

  // Week streak celebration
  if (profile.activityData.loginStreak === 7) {
    messages.push({
      type: 'celebration',
      message: "One week streak! You're building a great habit.",
      priority: 'high',
    });
  }

  // Journal suggestion
  if (profile.activityData.journalEntries === 0 && profile.activityData.loginStreak >= 3) {
    messages.push({
      type: 'tip',
      message: 'Try journaling to track your thoughts and progress.',
      priority: 'medium',
    });
  }

  // Improving trend encouragement
  if (profile.progressTrend === 'improving') {
    messages.push({
      type: 'encouragement',
      message: 'Your wellness metrics are trending up. Keep it going!',
      priority: 'medium',
    });
  }

  // Declining trend support
  if (profile.progressTrend === 'declining') {
    messages.push({
      type: 'reminder',
      message: "Remember, setbacks are part of the journey. We're here for you.",
      priority: 'high',
    });
  }

  return messages;
}

/**
 * Generate next steps for user
 */
export function generateNextSteps(profile: PersonalizationProfile): string[] {
  const steps: string[] = [];

  // New user steps
  if (profile.activityData.completedSessions === 0) {
    steps.push('Book your first wellness session');
    steps.push('Explore available exercises');
    steps.push('Set your wellness goals');
    return steps;
  }

  // Active user steps
  if (profile.activityData.completedSessions >= 1 && profile.activityData.completedSessions <= 4) {
    steps.push('Continue your wellness journey with another session');
    if (profile.activityData.journalEntries === 0) {
      steps.push('Try journaling to reflect on your progress');
    }
    steps.push('Track your mood to see patterns');
  }

  // Goal-based steps
  for (const goal of profile.therapeuticGoals) {
    if (!steps.includes(`Work on your ${goal.toLowerCase()} goal`)) {
      steps.push(`Work on your ${goal.toLowerCase()} goal`);
    }
  }

  return steps.slice(0, 4);
}

/**
 * Generate all personalized data for a user
 */
export async function generatePersonalizedData(userId: string): Promise<{
  personalizedContent: PersonalizedContent;
  recommendations: {
    sessions: ReturnType<typeof generateSessionRecommendations>;
    exercises: ReturnType<typeof generateExerciseRecommendations>;
    nextSteps: string[];
  };
  profile: PersonalizationProfile;
}> {
  const profile = await getPersonalizationProfile(userId);

  const personalizedContent: PersonalizedContent = {
    welcomeMessage: generateWelcomeMessage(profile),
    motivationalMessages: generateMotivationalMessages(profile),
    celebrationMessages: [],
    checkInMessages: [],
    feedbackMessages: generateFeedbackMessages(profile),
  };

  // Add celebration messages
  if (profile.activityData.loginStreak >= 7) {
    personalizedContent.celebrationMessages.push(`${profile.activityData.loginStreak} day streak!`);
  }
  if (profile.progressTrend === 'improving') {
    personalizedContent.celebrationMessages.push('Your wellness is improving!');
  }

  // Add check-in messages
  personalizedContent.checkInMessages.push('How are you feeling today?');
  if (profile.workStressLevel >= 6) {
    personalizedContent.checkInMessages.push('Remember to take breaks when stressed.');
  }

  const recommendations = {
    sessions: generateSessionRecommendations(profile),
    exercises: generateExerciseRecommendations(profile),
    nextSteps: generateNextSteps(profile),
  };

  return {
    personalizedContent,
    recommendations,
    profile,
  };
}

/**
 * Track user activity for personalization
 */
export async function trackActivity(
  userId: string,
  activityType: 'page-visit' | 'feature-use' | 'session-complete' | 'exercise-complete',
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO ai_interactions (user_id, type, context, metadata)
       VALUES ($1, $2, $3, $4)`,
      [userId, activityType, metadata, { timestamp: new Date().toISOString() }]
    );
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
}
