/**
 * AI Learning Path Generator
 * Generates personalized course recommendations based on user data
 * Zero cost - uses local algorithms, no AI API calls
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface LearningPathRecommendation {
  recommendedCourses: string[]; // Array of course IDs in suggested order
  reasoning: string; // Explanation for recommendations
  confidenceScore: number; // 0-1 confidence in recommendations
  basedOnData: {
    moodPatterns?: string[];
    journalThemes?: string[];
    therapyGoals?: string[];
    completedCourses?: string[];
    currentSkillLevel?: string;
  };
  personalizationFactors: string[]; // e.g., ['anxiety_management', 'sleep_improvement']
}

export interface CourseRecommendation {
  courseId: string;
  title: string;
  relevanceScore: number; // 0-1
  reasoning: string;
  estimatedCompletionDays: number;
}

export class AILearningPathGenerator {
  /**
   * Generate personalized learning path for user
   */
  async generatePath(
    userId: string,
    supabase: SupabaseClient
  ): Promise<LearningPathRecommendation> {
    // Gather user data
    const [moodData, journalData, goalsData, enrollmentData] = await Promise.all([
      this.getMoodPatterns(userId, supabase),
      this.getJournalThemes(userId, supabase),
      this.getTherapyGoals(userId, supabase),
      this.getCompletedCourses(userId, supabase),
    ]);

    // Analyze user needs
    const needs = this.analyzeUserNeeds(moodData, journalData, goalsData);

    // Get available courses
    const { data: courses } = await supabase
      .from('academy_courses')
      .select('id, title, category, difficulty, tags, learning_objectives')
      .eq('is_published', true);

    if (!courses) {
      return this.getDefaultPath();
    }

    // Score and rank courses
    const scoredCourses = this.scoreCourses(courses, needs, enrollmentData);

    // Select top 5 courses
    const recommendedCourses = scoredCourses
      .slice(0, 5)
      .map(c => c.courseId);

    // Generate reasoning
    const reasoning = this.generateReasoning(scoredCourses.slice(0, 5), needs);

    // Calculate confidence
    const confidenceScore = this.calculateConfidence(moodData, journalData, goalsData);

    return {
      recommendedCourses,
      reasoning,
      confidenceScore,
      basedOnData: {
        moodPatterns: moodData.patterns,
        journalThemes: journalData.themes,
        therapyGoals: goalsData.goals,
        completedCourses: enrollmentData,
        currentSkillLevel: this.estimateSkillLevel(enrollmentData),
      },
      personalizationFactors: needs,
    };
  }

  /**
   * Get next course recommendations based on current progress
   */
  async getNextRecommendations(
    userId: string,
    currentCourseId: string,
    supabase: SupabaseClient
  ): Promise<CourseRecommendation[]> {
    // Get current course details
    const { data: currentCourse } = await supabase
      .from('academy_courses')
      .select('category, tags, difficulty, prerequisites')
      .eq('id', currentCourseId)
      .single();

    if (!currentCourse) {
      return [];
    }

    // Find related courses
    const { data: relatedCourses } = await supabase
      .from('academy_courses')
      .select('id, title, category, tags, difficulty, estimated_hours')
      .eq('is_published', true)
      .neq('id', currentCourseId)
      .or(
        `category.eq.${currentCourse.category},tags.cs.{${currentCourse.tags?.join(',')}}`
      )
      .limit(10);

    if (!relatedCourses) {
      return [];
    }

    // Score based on progression
    const recommendations = relatedCourses.map(course => {
      const relevanceScore = this.calculateRelevanceScore(
        currentCourse,
        course
      );
      const reasoning = this.generateCourseReasoning(currentCourse, course);
      const estimatedDays = Math.ceil((course.estimated_hours || 10) / 1.5); // Assume 1.5 hours/day

      return {
        courseId: course.id,
        title: course.title,
        relevanceScore,
        reasoning,
        estimatedCompletionDays: estimatedDays,
      };
    });

    // Sort by relevance
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  }

  /**
   * Analyze user needs from data
   */
  private analyzeUserNeeds(
    moodData: any,
    journalData: any,
    goalsData: any
  ): string[] {
    const needs: Set<string> = new Set();

    // Mood-based needs
    if (moodData.avgMood < 4) {
      needs.add('mood_improvement');
      needs.add('emotional_regulation');
    }
    if (moodData.avgStress > 6) {
      needs.add('stress_management');
      needs.add('relaxation_techniques');
    }
    if (moodData.avgSleep < 6) {
      needs.add('sleep_improvement');
      needs.add('sleep_hygiene');
    }

    // Journal theme-based needs
    journalData.themes.forEach((theme: string) => {
      if (theme.includes('anxiety')) {
        needs.add('anxiety_management');
        needs.add('coping_skills');
      }
      if (theme.includes('depression')) {
        needs.add('depression_support');
        needs.add('behavioral_activation');
      }
      if (theme.includes('work') || theme.includes('stress')) {
        needs.add('work_life_balance');
        needs.add('stress_management');
      }
      if (theme.includes('relationship')) {
        needs.add('communication_skills');
        needs.add('relationship_building');
      }
    });

    // Goal-based needs
    goalsData.goals.forEach((goal: string) => {
      const goalLower = goal.toLowerCase();
      if (goalLower.includes('mindfulness') || goalLower.includes('meditation')) {
        needs.add('mindfulness_practice');
      }
      if (goalLower.includes('exercise') || goalLower.includes('fitness')) {
        needs.add('physical_wellness');
      }
      if (goalLower.includes('social') || goalLower.includes('friend')) {
        needs.add('social_skills');
      }
    });

    // Default needs if nothing identified
    if (needs.size === 0) {
      needs.add('mental_health_basics');
      needs.add('self_care_fundamentals');
    }

    return Array.from(needs);
  }

  /**
   * Score courses based on user needs
   */
  private scoreCourses(
    courses: any[],
    needs: string[],
    completedCourses: string[]
  ): CourseRecommendation[] {
    return courses
      .filter(course => !completedCourses.includes(course.id))
      .map(course => {
        let score = 0;
        const reasons: string[] = [];

        // Match with needs
        needs.forEach(need => {
          if (course.tags?.some((tag: string) => 
            tag.toLowerCase().includes(need.replace('_', ' ')) ||
            need.includes(tag.toLowerCase())
          )) {
            score += 1.5;
            reasons.push(`Addresses your ${need.replace('_', ' ')}`);
          }

          if (course.category?.toLowerCase().includes(need.replace('_', ' '))) {
            score += 1.0;
          }

          if (course.learning_objectives?.some((obj: string) =>
            obj.toLowerCase().includes(need.replace('_', ' '))
          )) {
            score += 0.5;
          }
        });

        // Difficulty bonus (prefer beginner if no courses completed)
        if (completedCourses.length === 0 && course.difficulty === 'beginner') {
          score += 1.0;
          reasons.push('Perfect for beginners');
        }

        // Normalize score to 0-1
        const relevanceScore = Math.min(score / (needs.length * 1.5), 1);

        return {
          courseId: course.id,
          title: course.title,
          relevanceScore,
          reasoning: reasons.join('; '),
          estimatedCompletionDays: Math.ceil((course.estimated_hours || 10) / 1.5),
        };
      })
      .filter(c => c.relevanceScore > 0.2) // Only relevant courses
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Generate reasoning text for recommendations
   */
  private generateReasoning(
    courses: CourseRecommendation[],
    needs: string[]
  ): string {
    const topNeeds = needs.slice(0, 3).map(n => n.replace('_', ' '));
    const courseCount = courses.length;

    let reasoning = `Based on your ${topNeeds.join(', ')}, `;
    reasoning += `we've curated ${courseCount} courses to support your mental health journey. `;

    if (courses[0]) {
      reasoning += `Start with "${courses[0].title}" `;
      reasoning += `(${courses[0].estimatedCompletionDays} days to complete) `;
      reasoning += `as it directly addresses your current needs.`;
    }

    return reasoning;
  }

  /**
   * Calculate confidence in recommendations
   */
  private calculateConfidence(
    moodData: any,
    journalData: any,
    goalsData: any
  ): number {
    let confidence = 0.5; // Base confidence

    // More data = higher confidence
    if (moodData.count > 10) confidence += 0.15;
    if (journalData.count > 5) confidence += 0.15;
    if (goalsData.count > 2) confidence += 0.1;

    // Consistency in data = higher confidence
    if (moodData.patterns.length > 0) confidence += 0.05;
    if (journalData.themes.length > 0) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate relevance between two courses
   */
  private calculateRelevanceScore(currentCourse: any, targetCourse: any): number {
    let score = 0;

    // Same category
    if (currentCourse.category === targetCourse.category) {
      score += 0.4;
    }

    // Overlapping tags
    const currentTags = new Set(currentCourse.tags || []);
    const targetTags = new Set(targetCourse.tags || []);
    const overlap = [...currentTags].filter(tag => targetTags.has(tag)).length;
    score += (overlap / Math.max(currentTags.size, 1)) * 0.3;

    // Progressive difficulty
    const difficultyMap: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    const currentDiff = difficultyMap[currentCourse.difficulty] || 1;
    const targetDiff = difficultyMap[targetCourse.difficulty] || 1;

    if (targetDiff === currentDiff || targetDiff === currentDiff + 1) {
      score += 0.3; // Same or next level
    } else if (targetDiff < currentDiff) {
      score += 0.1; // Review/foundation
    }

    return Math.min(score, 1.0);
  }

  /**
   * Generate reasoning for course recommendation
   */
  private generateCourseReasoning(currentCourse: any, targetCourse: any): string {
    const reasons: string[] = [];

    if (currentCourse.category === targetCourse.category) {
      reasons.push('Continues your learning in the same area');
    }

    const difficultyMap: Record<string, number> = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    const currentDiff = difficultyMap[currentCourse.difficulty] || 1;
    const targetDiff = difficultyMap[targetCourse.difficulty] || 1;

    if (targetDiff === currentDiff + 1) {
      reasons.push('Natural progression to the next level');
    } else if (targetDiff === currentDiff) {
      reasons.push('Builds on similar concepts');
    }

    return reasons.join('; ') || 'Related to your current learning';
  }

  /**
   * Estimate user's current skill level
   */
  private estimateSkillLevel(completedCourses: string[]): string {
    if (completedCourses.length === 0) return 'beginner';
    if (completedCourses.length < 3) return 'beginner';
    if (completedCourses.length < 8) return 'intermediate';
    return 'advanced';
  }

  /**
   * Get mood patterns for user
   */
  private async getMoodPatterns(userId: string, supabase: SupabaseClient) {
    const { data: moods } = await supabase
      .from('mood_logs')
      .select('mood_level, energy_level, stress_level, sleep_hours')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!moods || moods.length === 0) {
      return { avgMood: 5, avgStress: 5, avgSleep: 7, patterns: [], count: 0 };
    }

    const avgMood = moods.reduce((sum, m) => sum + (m.mood_level || 5), 0) / moods.length;
    const avgStress = moods.reduce((sum, m) => sum + (m.stress_level || 5), 0) / moods.length;
    const avgSleep = moods.reduce((sum, m) => sum + (m.sleep_hours || 7), 0) / moods.length;

    const patterns: string[] = [];
    if (avgMood < 4) patterns.push('low_mood');
    if (avgStress > 6) patterns.push('high_stress');
    if (avgSleep < 6) patterns.push('poor_sleep');

    return { avgMood, avgStress, avgSleep, patterns, count: moods.length };
  }

  /**
   * Get journal themes for user
   */
  private async getJournalThemes(userId: string, supabase: SupabaseClient) {
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('content, ai_analysis')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!entries || entries.length === 0) {
      return { themes: [], count: 0 };
    }

    const themes = new Set<string>();
    entries.forEach(entry => {
      if (entry.ai_analysis?.themes) {
        entry.ai_analysis.themes.forEach((theme: any) => {
          themes.add(theme.theme || theme);
        });
      }
    });

    return { themes: Array.from(themes), count: entries.length };
  }

  /**
   * Get therapy goals for user
   */
  private async getTherapyGoals(userId: string, supabase: SupabaseClient) {
    const { data: goals } = await supabase
      .from('goals')
      .select('title, description')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(10);

    if (!goals || goals.length === 0) {
      return { goals: [], count: 0 };
    }

    return {
      goals: goals.map(g => g.title),
      count: goals.length,
    };
  }

  /**
   * Get completed courses for user
   */
  private async getCompletedCourses(userId: string, supabase: SupabaseClient): Promise<string[]> {
    const { data: enrollments } = await supabase
      .from('academy_enrollments')
      .select('course_id')
      .eq('user_id', userId)
      .eq('enrollment_status', 'completed');

    return enrollments?.map(e => e.course_id) || [];
  }

  /**
   * Get default learning path when insufficient data
   */
  private getDefaultPath(): LearningPathRecommendation {
    return {
      recommendedCourses: [],
      reasoning: 'Start your mental health journey with our foundational courses.',
      confidenceScore: 0.5,
      basedOnData: {},
      personalizationFactors: ['mental_health_basics', 'self_care_fundamentals'],
    };
  }
}

// Export singleton instance
export const learningPathGenerator = new AILearningPathGenerator();
