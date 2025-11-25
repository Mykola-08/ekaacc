/**
 * AI Wellness Coach
 * 
 * Proactive AI system that:
 * - Monitors user wellness patterns
 * - Provides personalized check-ins
 * - Suggests interventions based on data
 * - Tracks progress over time
 */

export interface WellnessMetrics {
  userId: string;
  period: 'day' | 'week' | 'month';
  moodAverage: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  energyAverage: number;
  stressAverage: number;
  sleepAverage: number;
  journalCount: number;
  appointmentAttendance: number;
  goalProgress: number;
  riskScore: number; // 0-100, higher = more concerning
}

export interface WellnessRecommendation {
  id: string;
  type: 'exercise' | 'meditation' | 'sleep' | 'social' | 'therapy' | 'journal' | 'crisis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionItems: string[];
  reasoning: string;
  expectedImpact: string;
  duration?: string;
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'exercise' | 'meditation';
  }[];
}

export interface CheckInMessage {
  id: string;
  message: string;
  tone: 'supportive' | 'encouraging' | 'concerned' | 'celebratory';
  questions: string[];
  contextualizedTo: string;
}

export class AIWellnessCoach {
  /**
   * Analyze user wellness metrics from database
   */
  async analyzeWellness(
    userId: string,
    supabase: any
  ): Promise<WellnessMetrics> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch mood logs
    const { data: moodLogs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', weekAgo.toISOString())
      .order('logged_at', { ascending: false });

    // Fetch journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', weekAgo.toISOString());

    // Fetch appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('start_time', monthAgo.toISOString());

    // Fetch goals
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    // Calculate metrics
    const moodScores = moodLogs?.map((log: any) => log.mood_score) || [];
    const moodAverage = moodScores.length > 0
      ? moodScores.reduce((a: number, b: number) => a + b, 0) / moodScores.length
      : 5;

    const energyScores = moodLogs?.map((log: any) => log.energy_level).filter((e: any) => e) || [];
    const energyAverage = energyScores.length > 0
      ? energyScores.reduce((a: number, b: number) => a + b, 0) / energyScores.length
      : 5;

    const stressScores = moodLogs?.map((log: any) => log.stress_level).filter((s: any) => s) || [];
    const stressAverage = stressScores.length > 0
      ? stressScores.reduce((a: number, b: number) => a + b, 0) / stressScores.length
      : 5;

    const sleepScores = moodLogs?.map((log: any) => log.sleep_quality).filter((s: any) => s) || [];
    const sleepAverage = sleepScores.length > 0
      ? sleepScores.reduce((a: number, b: number) => a + b, 0) / sleepScores.length
      : 5;

    // Calculate trend
    const recentMoods = moodScores.slice(0, 3);
    const olderMoods = moodScores.slice(3, 6);
    const recentAvg = recentMoods.length > 0
      ? recentMoods.reduce((a: number, b: number) => a + b, 0) / recentMoods.length
      : moodAverage;
    const olderAvg = olderMoods.length > 0
      ? olderMoods.reduce((a: number, b: number) => a + b, 0) / olderMoods.length
      : moodAverage;

    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentAvg > olderAvg + 0.5) moodTrend = 'improving';
    else if (recentAvg < olderAvg - 0.5) moodTrend = 'declining';

    // Calculate appointment attendance
    const completedAppointments = appointments?.filter((a: any) => a.status === 'completed').length || 0;
    const totalAppointments = appointments?.length || 1;
    const appointmentAttendance = (completedAppointments / totalAppointments) * 100;

    // Calculate goal progress (simplified)
    const activeGoals = goals?.filter((g: any) => g.status === 'active') || [];
    const goalProgress = activeGoals.length > 0 ? 50 : 0; // Placeholder

    // Calculate risk score
    const riskScore = this.calculateRiskScore({
      moodAverage,
      moodTrend,
      stressAverage,
      sleepAverage,
      journalCount: journals?.length || 0,
      appointmentAttendance
    });

    return {
      userId,
      period: 'week',
      moodAverage,
      moodTrend,
      energyAverage,
      stressAverage,
      sleepAverage,
      journalCount: journals?.length || 0,
      appointmentAttendance,
      goalProgress,
      riskScore
    };
  }

  /**
   * Generate personalized check-in message
   */
  generateCheckIn(metrics: WellnessMetrics, userName?: string): CheckInMessage {
    const greeting = userName ? `Hi ${userName}` : 'Hi';
    let message = '';
    let tone: 'supportive' | 'encouraging' | 'concerned' | 'celebratory' = 'supportive';
    const questions: string[] = [];

    // Determine tone based on metrics
    if (metrics.riskScore > 70) {
      tone = 'concerned';
      message = `${greeting}, I've noticed some concerning patterns in your wellness data. Your safety and wellbeing are my priority.`;
      questions.push('How are you feeling right now?');
      questions.push('Is there anything specific that\'s been troubling you?');
      questions.push('Would you like to talk to someone?');
    } else if (metrics.moodTrend === 'declining') {
      tone = 'supportive';
      message = `${greeting}, I've noticed your mood has been lower recently. Remember that ups and downs are normal, and I'm here to support you.`;
      questions.push('What\'s been on your mind lately?');
      questions.push('Have you noticed any patterns in when you feel down?');
      questions.push('What usually helps you feel better?');
    } else if (metrics.moodTrend === 'improving') {
      tone = 'celebratory';
      message = `${greeting}, it looks like things have been looking up for you! I'm happy to see positive changes.`;
      questions.push('What\'s been going well for you?');
      questions.push('Have you tried anything new that\'s helping?');
      questions.push('How can we maintain this positive momentum?');
    } else {
      tone = 'encouraging';
      message = `${greeting}, you seem to be maintaining steady progress. Let's keep building on that.`;
      questions.push('How are you feeling today?');
      questions.push('What\'s one thing you\'re grateful for right now?');
      questions.push('Any goals you\'d like to work toward this week?');
    }

    // Add context about specific metrics
    if (metrics.stressAverage > 7) {
      message += ` Your stress levels have been elevated - let's explore ways to manage that.`;
    }
    if (metrics.sleepAverage < 5) {
      message += ` I noticed your sleep quality could use some attention.`;
    }

    return {
      id: `checkin_${Date.now()}`,
      message,
      tone,
      questions,
      contextualizedTo: `Mood: ${metrics.moodAverage.toFixed(1)}/10, Trend: ${metrics.moodTrend}, Stress: ${metrics.stressAverage.toFixed(1)}/10`
    };
  }

  /**
   * Generate personalized wellness recommendations
   */
  async generateRecommendations(
    metrics: WellnessMetrics,
    supabase: any
  ): Promise<WellnessRecommendation[]> {
    const recommendations: WellnessRecommendation[] = [];

    // Crisis intervention (highest priority)
    if (metrics.riskScore > 70) {
      recommendations.push({
        id: 'crisis_support',
        type: 'crisis',
        priority: 'urgent',
        title: 'Immediate Support Available',
        description: 'I\'m concerned about your wellbeing. Please consider reaching out for immediate support.',
        actionItems: [
          'Contact the 988 Suicide & Crisis Lifeline (call or text 988)',
          'Reach out to a trusted friend or family member',
          'Schedule an emergency appointment with your therapist',
          'If in immediate danger, call 911'
        ],
        reasoning: 'Risk indicators suggest immediate support may be beneficial',
        expectedImpact: 'Immediate safety and connection to professional help',
        resources: [
          {
            title: '988 Suicide & Crisis Lifeline',
            url: 'https://988lifeline.org',
            type: 'article'
          },
          {
            title: 'Crisis Text Line',
            url: 'https://www.crisistextline.org',
            type: 'article'
          }
        ]
      });
    }

    // Therapy appointment recommendation
    if (metrics.appointmentAttendance < 50 && metrics.moodAverage < 6) {
      recommendations.push({
        id: 'schedule_therapy',
        type: 'therapy',
        priority: metrics.moodTrend === 'declining' ? 'high' : 'medium',
        title: 'Schedule a Therapy Session',
        description: 'Regular therapy sessions can provide valuable support and guidance.',
        actionItems: [
          'Review available appointment slots',
          'Book a session with your preferred therapist',
          'Prepare topics you\'d like to discuss'
        ],
        reasoning: `Your recent mood scores (${metrics.moodAverage.toFixed(1)}/10) and attendance rate (${metrics.appointmentAttendance.toFixed(0)}%) suggest regular sessions would be beneficial`,
        expectedImpact: 'Professional guidance and structured support',
        duration: '45-60 minutes'
      });
    }

    // Journal recommendation
    if (metrics.journalCount < 3 && metrics.stressAverage > 6) {
      recommendations.push({
        id: 'journaling',
        type: 'journal',
        priority: 'medium',
        title: 'Try Expressive Journaling',
        description: 'Writing about your thoughts and feelings can help process stress and gain clarity.',
        actionItems: [
          'Set aside 10-15 minutes in a quiet space',
          'Write freely about what\'s on your mind',
          'Don\'t worry about grammar or structure',
          'Reflect on patterns you notice'
        ],
        reasoning: `You've journaled ${metrics.journalCount} times this week. Research shows daily journaling can reduce stress by up to 40%`,
        expectedImpact: 'Reduced stress, improved emotional clarity',
        duration: '10-15 minutes',
        resources: [
          {
            title: 'Journaling for Mental Health',
            url: 'https://www.apa.org/topics/healthy-workplaces/journaling',
            type: 'article'
          }
        ]
      });
    }

    // Sleep improvement
    if (metrics.sleepAverage < 6) {
      recommendations.push({
        id: 'sleep_hygiene',
        type: 'sleep',
        priority: 'high',
        title: 'Improve Sleep Quality',
        description: 'Better sleep can significantly impact mood, energy, and overall wellbeing.',
        actionItems: [
          'Establish a consistent bedtime routine',
          'Avoid screens 1 hour before bed',
          'Keep your bedroom cool and dark',
          'Try a 10-minute wind-down meditation',
          'Limit caffeine after 2 PM'
        ],
        reasoning: `Your sleep quality (${metrics.sleepAverage.toFixed(1)}/10) is below optimal. Sleep and mental health are closely connected`,
        expectedImpact: 'Improved mood, energy, and stress management',
        duration: 'Ongoing practice',
        resources: [
          {
            title: 'Sleep Meditation',
            url: '/resources/sleep-meditation',
            type: 'meditation'
          },
          {
            title: 'Sleep Hygiene Guide',
            url: '/resources/sleep-guide',
            type: 'article'
          }
        ]
      });
    }

    // Exercise/movement
    if (metrics.energyAverage < 5 || metrics.moodAverage < 6) {
      recommendations.push({
        id: 'movement',
        type: 'exercise',
        priority: 'medium',
        title: 'Incorporate Movement',
        description: 'Physical activity is a proven mood booster and energy enhancer.',
        actionItems: [
          'Take a 15-minute walk outside',
          'Try a gentle yoga session',
          'Do 5 minutes of stretching',
          'Dance to your favorite song'
        ],
        reasoning: `Low energy (${metrics.energyAverage.toFixed(1)}/10) and mood (${metrics.moodAverage.toFixed(1)}/10) can benefit from movement`,
        expectedImpact: 'Increased energy, improved mood, reduced stress',
        duration: '15-30 minutes',
        resources: [
          {
            title: 'Quick Energizing Exercises',
            url: '/resources/quick-exercises',
            type: 'video'
          }
        ]
      });
    }

    // Meditation/mindfulness
    if (metrics.stressAverage > 7) {
      recommendations.push({
        id: 'meditation',
        type: 'meditation',
        priority: 'high',
        title: 'Practice Mindfulness',
        description: 'Meditation can help reduce stress and improve emotional regulation.',
        actionItems: [
          'Find a quiet space',
          'Try a guided 5-minute breathing exercise',
          'Use a meditation app for support',
          'Practice mindful moments throughout the day'
        ],
        reasoning: `Your stress level (${metrics.stressAverage.toFixed(1)}/10) is elevated. Regular mindfulness practice can reduce stress by up to 30%`,
        expectedImpact: 'Reduced stress and anxiety, improved focus',
        duration: '5-20 minutes',
        resources: [
          {
            title: 'Beginner Meditation Guide',
            url: '/resources/meditation-guide',
            type: 'article'
          },
          {
            title: '5-Minute Breathing Exercise',
            url: '/resources/breathing-exercise',
            type: 'meditation'
          }
        ]
      });
    }

    // Social connection
    if (metrics.riskScore > 40 && metrics.moodTrend === 'declining') {
      recommendations.push({
        id: 'social_connection',
        type: 'social',
        priority: 'medium',
        title: 'Connect with Others',
        description: 'Social support is crucial for mental health and can help lift your mood.',
        actionItems: [
          'Call or text a friend',
          'Join a support group',
          'Attend a community event',
          'Share your feelings with someone you trust'
        ],
        reasoning: 'Social connection is especially important when mood is low',
        expectedImpact: 'Reduced isolation, emotional support, improved perspective',
        duration: 'Varies'
      });
    }

    // Sort by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations.slice(0, 5); // Return top 5
  }

  /**
   * Calculate risk score based on metrics
   */
  private calculateRiskScore(data: {
    moodAverage: number;
    moodTrend: 'improving' | 'stable' | 'declining';
    stressAverage: number;
    sleepAverage: number;
    journalCount: number;
    appointmentAttendance: number;
  }): number {
    let score = 0;

    // Mood (0-40 points)
    if (data.moodAverage < 3) score += 40;
    else if (data.moodAverage < 5) score += 25;
    else if (data.moodAverage < 6) score += 10;

    // Mood trend (0-20 points)
    if (data.moodTrend === 'declining') score += 20;
    else if (data.moodTrend === 'stable' && data.moodAverage < 5) score += 10;

    // Stress (0-20 points)
    if (data.stressAverage > 8) score += 20;
    else if (data.stressAverage > 6) score += 10;

    // Sleep (0-15 points)
    if (data.sleepAverage < 4) score += 15;
    else if (data.sleepAverage < 6) score += 8;

    // Engagement (0-10 points)
    if (data.journalCount === 0 && data.appointmentAttendance < 30) score += 10;
    else if (data.appointmentAttendance < 50) score += 5;

    return Math.min(100, score);
  }

  /**
   * Generate weekly wellness summary
   */
  async generateWeeklySummary(
    metrics: WellnessMetrics,
    supabase: any
  ): Promise<string> {
    const summary = [];

    summary.push('# Your Weekly Wellness Summary\n');

    // Overall assessment
    if (metrics.moodTrend === 'improving') {
      summary.push('✨ **Great progress this week!** Your mood has been trending upward.\n');
    } else if (metrics.moodTrend === 'declining') {
      summary.push('💙 **I\'ve noticed things have been challenging.** Remember, you\'re not alone in this.\n');
    } else {
      summary.push('📊 **You\'ve been maintaining steady progress** this week.\n');
    }

    // Key metrics
    summary.push('## Key Metrics\n');
    summary.push(`- Average Mood: ${metrics.moodAverage.toFixed(1)}/10 (${this.getMoodLabel(metrics.moodAverage)})\n`);
    summary.push(`- Energy Level: ${metrics.energyAverage.toFixed(1)}/10\n`);
    summary.push(`- Stress Level: ${metrics.stressAverage.toFixed(1)}/10\n`);
    summary.push(`- Sleep Quality: ${metrics.sleepAverage.toFixed(1)}/10\n`);
    summary.push(`- Journal Entries: ${metrics.journalCount}\n`);
    summary.push(`- Appointment Attendance: ${metrics.appointmentAttendance.toFixed(0)}%\n\n`);

    // Highlights
    summary.push('## Highlights\n');
    if (metrics.moodAverage >= 7) {
      summary.push('- 🎉 You maintained a good mood throughout the week\n');
    }
    if (metrics.journalCount >= 5) {
      summary.push('- 📝 Excellent journaling consistency\n');
    }
    if (metrics.sleepAverage >= 7) {
      summary.push('- 😴 Your sleep quality has been good\n');
    }
    if (metrics.appointmentAttendance >= 80) {
      summary.push('- 🎯 Great job staying committed to therapy\n');
    }

    // Areas for attention
    if (metrics.stressAverage > 7 || metrics.sleepAverage < 5 || metrics.moodAverage < 5) {
      summary.push('\n## Areas to Focus On\n');
      if (metrics.stressAverage > 7) {
        summary.push('- Managing stress levels (consider meditation or breathing exercises)\n');
      }
      if (metrics.sleepAverage < 5) {
        summary.push('- Improving sleep quality (establish a bedtime routine)\n');
      }
      if (metrics.moodAverage < 5) {
        summary.push('- Supporting your mood (consider increasing therapy sessions or social connections)\n');
      }
    }

    summary.push('\n---\n');
    summary.push('*This summary is generated to help you track your wellness journey. For personalized guidance, please consult with your therapist.*');

    return summary.join('');
  }

  private getMoodLabel(score: number): string {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Moderate';
    if (score >= 2) return 'Low';
    return 'Very Low';
  }
}

/**
 * Export singleton instance
 */
export const wellnessCoach = new AIWellnessCoach();
