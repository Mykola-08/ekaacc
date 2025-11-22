import type { User } from './types';

/**
 * Personalization Engine
 * Generates personalized content, recommendations, and insights based on user data
 */

export class PersonalizationEngine {
  /**
   * Generate a personalized welcome message
   */
  static generateWelcomeMessage(user: User): string {
    const name = user.personalization?.fullName || user.displayName || 'there';
    const firstName = name.split(' ')[0];
    const timeOfDay = this.getTimeOfDay();
    const occupation = user.personalization?.occupationType;
    const primaryGoal = user.personalization?.therapeuticGoals?.[0];

    if (occupation === 'student' && primaryGoal) {
      return `Good ${timeOfDay}, ${firstName}! Ready to work on ${primaryGoal.toLowerCase()}? Let's make today count!`;
    }

    if (user.activityData?.loginStreak && user.activityData.loginStreak > 3) {
      return `${user.activityData.loginStreak} day streak, ${firstName}! You're on fire! Keep up the amazing work!`;
    }

    if (primaryGoal) {
      return `Welcome back, ${firstName}! Let's continue your journey toward ${primaryGoal.toLowerCase()}`;
    }

    return `Good ${timeOfDay}, ${firstName}! Great to see you back!`;
  }

  /**
   * Generate personalized motivational messages
   */
  static generateMotivationalMessages(user: User): string[] {
    const messages: string[] = [];
    const { personalization, activityData } = user;

    // Based on goals
    if (personalization?.therapeuticGoals) {
      personalization.therapeuticGoals.forEach(goal => {
        messages.push(`Every small step toward ${goal.toLowerCase()} is progress. You're doing great!`);
      });
    }

    // Based on sports/activity
    if (personalization?.sportsActivities && personalization.sportsActivities.length > 0) {
      const sport = personalization.sportsActivities[0];
      messages.push(`Your ${sport} practice shows your commitment to wellness. Keep it up!`);
    }

    // Based on occupation
    if (personalization?.occupationType === 'student') {
      messages.push(`Balancing studies and self-care shows real strength. You're doing amazing!`);
    }

    // Based on progress
    if (activityData?.progressTrend === 'improving') {
      messages.push(`Your progress is inspiring! You're moving in the right direction!`);
    }

    // Based on engagement
    if (activityData?.loginStreak && activityData.loginStreak > 7) {
      messages.push(`${activityData.loginStreak} days of commitment! Your dedication is remarkable!`);
    }

    // Default motivational messages
    if (messages.length === 0) {
      messages.push(
        "You're stronger than you think!",
        "Every day is a new opportunity to grow",
        "Your wellbeing journey matters. Keep going!"
      );
    }

    return messages;
  }

  /**
   * Generate personalized session recommendations
   */
  static generateSessionRecommendations(user: User) {
    const recommendations: Array<{
      title: string;
      description: string;
      type: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];
    const { personalization, activityData } = user;

    // Based on goals
    if (personalization?.therapeuticGoals?.includes('Reduce stress') || (personalization?.lifestyleFactors?.workStressLevel && personalization.lifestyleFactors.workStressLevel >= 4)) {
      recommendations.push({
        title: 'Stress Management Session',
        description: 'Learn practical techniques to manage daily stress and find calm',
        type: 'stress-management',
        reason: 'Based on your stress levels and goals',
        priority: 'high',
      });
    }

    if (personalization?.therapeuticGoals?.includes('Improve sleep') || (personalization?.lifestyleFactors?.sleepQuality && personalization.lifestyleFactors.sleepQuality <= 2)) {
      recommendations.push({
        title: 'Sleep Hygiene Workshop',
        description: 'Develop better sleep habits for restorative rest',
        type: 'sleep-improvement',
        reason: 'Your sleep quality could benefit from targeted support',
        priority: 'high',
      });
    }

    // Based on sports/physical activity
    if (personalization?.sportsActivities && personalization.sportsActivities.length > 0) {
      recommendations.push({
        title: 'Athletic Mindset Coaching',
        description: 'Enhance your sports performance through mental training',
        type: 'performance',
        reason: `Perfect for active individuals like you who enjoy ${personalization.sportsActivities.join(', ')}`,
        priority: 'medium',
      });
    }

    // Based on occupation
    if (personalization?.occupationType === 'student') {
      recommendations.push({
        title: 'Student Success Session',
        description: 'Balance academics, self-care, and personal growth',
        type: 'student-support',
        reason: 'Tailored for students navigating academic challenges',
        priority: 'medium',
      });
    }

    // Based on engagement patterns
    if (activityData?.completedSessions && activityData.completedSessions > 5 && activityData?.progressTrend === 'improving') {
      recommendations.push({
        title: 'Advanced Wellness Strategies',
        description: 'Take your wellness journey to the next level',
        type: 'advanced',
        reason: 'You\'ve made great progress and are ready for more advanced techniques',
        priority: 'medium',
      });
    }

    // Based on challenges
    if (personalization?.currentChallenges?.includes('Anxiety')) {
      recommendations.push({
        title: 'Anxiety Relief Techniques',
        description: 'Evidence-based methods to calm anxious thoughts',
        type: 'anxiety-management',
        reason: 'Addresses your current challenge with anxiety',
        priority: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Generate personalized exercise recommendations
   */
  static generateExerciseRecommendations(user: User) {
    const exercises: Array<{
      name: string;
      type: string;
      duration: number;
      reason: string;
    }> = [];
    const { personalization } = user;

    // Based on stress level
    if (personalization?.lifestyleFactors?.workStressLevel && personalization.lifestyleFactors.workStressLevel >= 4) {
      exercises.push({
        name: '5-Minute Breathing Exercise',
        type: 'breathing',
        duration: 5,
        reason: 'Helps reduce high stress levels quickly',
      });
    }

    // Based on activity level
    if (personalization?.activityLevel === 'sedentary' || personalization?.activityLevel === 'light') {
      exercises.push({
        name: 'Gentle Stretching Routine',
        type: 'physical',
        duration: 10,
        reason: 'Perfect for building movement into your day',
      });
    }

    // Based on sports activities
    if (personalization?.sportsActivities?.includes('yoga')) {
      exercises.push({
        name: 'Mindful Yoga Flow',
        type: 'yoga',
        duration: 15,
        reason: 'Complements your existing yoga practice',
      });
    }

    // Based on goals
    if (personalization?.therapeuticGoals?.includes('Improve focus')) {
      exercises.push({
        name: 'Concentration Meditation',
        type: 'meditation',
        duration: 10,
        reason: 'Helps improve focus and mental clarity',
      });
    }

    // Default exercises
    if (exercises.length === 0) {
      exercises.push(
        {
          name: 'Mindfulness Meditation',
          type: 'meditation',
          duration: 10,
          reason: 'Great for overall wellbeing',
        },
        {
          name: 'Gratitude Journaling',
          type: 'journaling',
          duration: 5,
          reason: 'Promotes positive mindset',
        }
      );
    }

    return exercises;
  }

  /**
   * Generate personalized feedback messages
   */
  static generateFeedbackMessages(user: User) {
    const messages: Array<{
      message: string;
      type: 'encouragement' | 'tip' | 'reminder' | 'celebration';
      date: string;
      read: boolean;
    }> = [];
    const { activityData, personalization } = user;

    // Celebration for milestones
    if (activityData?.completedSessions === 1) {
      messages.push({
        message: `Congratulations on completing your first session! This is just the beginning of your wellness journey.`,
        type: 'celebration',
        date: new Date().toISOString(),
        read: false,
      });
    }

    if (activityData?.loginStreak === 7) {
      messages.push({
        message: `One week streak! You're building a powerful habit. Keep it going!`,
        type: 'celebration',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Tips based on activity
    if (activityData?.featureUsage?.journal === 0 && activityData?.totalLogins && activityData.totalLogins > 3) {
      messages.push({
        message: `Tip: Try the journal feature! Reflection can deepen your self-awareness and track your progress.`,
        type: 'tip',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Encouragement for progress
    if (activityData?.progressTrend === 'improving') {
      messages.push({
        message: `Your wellness score is improving! Your consistent efforts are paying off.`,
        type: 'encouragement',
        date: new Date().toISOString(),
        read: false,
      });
    }

    // Reminders based on inactivity
    const lastActive = activityData?.lastActiveDate ? new Date(activityData.lastActiveDate) : null;
    const daysSinceActive = lastActive ? Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    if (daysSinceActive >= 7 && personalization?.therapeuticGoals) {
      messages.push({
        message: `👋 We've missed you! Ready to continue working on ${personalization.therapeuticGoals[0]}?`,
        type: 'reminder',
        date: new Date().toISOString(),
        read: false,
      });
    }

    return messages;
  }

  /**
   * Generate next steps recommendations
   */
  static generateNextSteps(user: User): string[] {
    const steps: string[] = [];
    const { activityData, personalization } = user;

    // For new users
    if (!activityData?.completedSessions || activityData.completedSessions === 0) {
      steps.push('Book your first therapy session');
      steps.push('Explore our guided exercises');
      steps.push('Set up your wellness goals');
    }

    // For active users
    if (activityData?.completedSessions && activityData.completedSessions > 0 && activityData.completedSessions < 5) {
      steps.push('Continue your session journey');
      steps.push('Try the journaling feature');
      steps.push('Track your progress metrics');
    }

    // Based on goals
    if (personalization?.therapeuticGoals && activityData?.goalsAchieved === 0) {
      steps.push(`Work on your goal: ${personalization.therapeuticGoals[0]}`);
    }

    // Based on features not used
    if (!activityData?.featureUsage?.journal) {
      steps.push('Start journaling to track your thoughts');
    }

    if (!activityData?.featureUsage?.exercises) {
      steps.push('Try a guided wellness exercise');
    }

    return steps;
  }

  /**
   * Generate complete personalized data for a user
   */
  static generatePersonalizedData(user: User): Partial<User> {
    return {
      personalizedContent: {
        welcomeMessage: this.generateWelcomeMessage(user),
        motivationalMessages: this.generateMotivationalMessages(user),
        celebrationMessages: [],
        checkInMessages: [],
        feedbackMessages: this.generateFeedbackMessages(user),
      },
      recommendations: {
        sessions: this.generateSessionRecommendations(user),
        exercises: this.generateExerciseRecommendations(user),
        articles: [],
        therapists: [],
        nextSteps: this.generateNextSteps(user),
      },
    };
  }

  /**
   * Helper: Get time of day
   */
  private static getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  /**
   * Track user activity
   */
  static trackActivity(user: User, activity: {
    type: 'page-visit' | 'feature-use' | 'session-complete' | 'exercise-complete' | 'login';
    data?: any;
  }): Partial<User['activityData']> {
    const currentData = user.activityData || {};
    const updates: Partial<User['activityData']> = {
      lastActiveDate: new Date().toISOString(),
      totalLogins: (currentData.totalLogins || 0) + (activity.type === 'login' ? 1 : 0),
    };

    // Track page visits
    if (activity.type === 'page-visit' && activity.data?.page) {
      const mostVisited = currentData.mostVisitedPages || [];
      updates.mostVisitedPages = [...mostVisited, activity.data.page].slice(-10); // Keep last 10
    }

    // Track feature usage
    if (activity.type === 'feature-use' && activity.data?.feature) {
      const featureUsage = currentData.featureUsage || {};
      const feature = activity.data.feature as keyof typeof featureUsage;
      updates.featureUsage = {
        ...featureUsage,
        [feature]: ((featureUsage[feature] as number) || 0) + 1,
      };
    }

    // Track completed sessions
    if (activity.type === 'session-complete') {
      updates.completedSessions = (currentData.completedSessions || 0) + 1;
      updates.lastSessionDate = new Date().toISOString();
    }

    // Track exercises
    if (activity.type === 'exercise-complete') {
      updates.completedExercises = (currentData.completedExercises || 0) + 1;
    }

    return updates;
  }
}
