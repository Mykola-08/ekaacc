/**
 * @file AI Service - Simple Implementation
 * @description Simple AI service that provides help recommendations without external dependencies.
 * Replaces Genkit AI with a lightweight implementation using motion-primitives glow effects.
 */

export interface AIHelpRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'therapy' | 'technical' | 'navigation' | 'general';
  confidence: number;
  action?: () => void;
}

export interface AIHelpRequest {
  query: string;
  context?: string;
  userId?: string;
  page?: string;
}

/**
 * Simple AI Service that provides help recommendations
 * Uses rule-based matching and mock AI responses
 */
class SimpleAIHelpService {
  private static instance: SimpleAIHelpService;
  private recommendations: AIHelpRecommendation[] = [
    {
      id: 'therapy-1',
      title: 'Book a Therapy Session',
      description: 'Schedule your next therapy session with our experienced therapists',
      category: 'therapy',
      confidence: 0.95,
      action: () => {
        window.location.href = '/book';
      }
    },
    {
      id: 'therapy-2',
      title: 'View Your Progress',
      description: 'Check your therapy progress and session history',
      category: 'therapy',
      confidence: 0.85,
    },
    {
      id: 'technical-1',
      title: 'Payment Help',
      description: 'Get assistance with payments, billing, or subscription issues',
      category: 'technical',
      confidence: 0.90,
    },
    {
      id: 'navigation-1',
      title: 'Find a Therapist',
      description: 'Browse available therapists and their specializations',
      category: 'navigation',
      confidence: 0.88,
    },
    {
      id: 'general-1',
      title: 'Contact Support',
      description: 'Reach out to our support team for any questions',
      category: 'general',
      confidence: 0.80,
    },
    {
      id: 'therapy-3',
      title: 'Crisis Resources',
      description: 'Access emergency mental health resources and hotlines',
      category: 'therapy',
      confidence: 0.98,
    },
    {
      id: 'technical-2',
      title: 'Account Settings',
      description: 'Update your profile, preferences, and account information',
      category: 'technical',
      confidence: 0.82,
    },
    {
      id: 'navigation-2',
      title: 'Session Reminders',
      description: 'Set up notifications for upcoming therapy sessions',
      category: 'navigation',
      confidence: 0.75,
    }
  ];

  static getInstance(): SimpleAIHelpService {
    if (!SimpleAIHelpService.instance) {
      SimpleAIHelpService.instance = new SimpleAIHelpService();
    }
    return SimpleAIHelpService.instance;
  }

  /**
   * Generate AI help recommendations based on user query
   */
  async generateHelpRecommendations(request: AIHelpRequest): Promise<AIHelpRecommendation[]> {
    const { query, context, userId, page } = request;
    
    // Simple keyword matching and scoring
    const queryLower = query.toLowerCase();
    const contextLower = context?.toLowerCase() || '';
    const pageLower = page?.toLowerCase() || '';

    // Score each recommendation based on relevance
    const scoredRecommendations = this.recommendations.map(rec => {
      let score = rec.confidence;
      
      // Boost score based on keyword matches
      const titleLower = rec.title.toLowerCase();
      const descLower = rec.description.toLowerCase();
      
      if (queryLower.includes(titleLower.split(' ')[0]) || titleLower.includes(queryLower.split(' ')[0])) {
        score += 0.15;
      }
      
      if (descLower.includes(queryLower) || queryLower.includes(descLower.split(' ')[0])) {
        score += 0.10;
      }
      
      // Context-based scoring
      if (contextLower.includes(rec.category)) {
        score += 0.08;
      }
      
      // Page-based scoring
      if (pageLower && this.getPageCategory(pageLower) === rec.category) {
        score += 0.12;
      }
      
      // Length penalty for very short queries
      if (query.length < 3) {
        score *= 0.8;
      }
      
      return {
        ...rec,
        confidence: Math.min(score, 1.0) // Cap at 1.0
      };
    });

    // Sort by confidence and return top recommendations
    return scoredRecommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Get category based on current page
   */
  private getPageCategory(page: string): string {
    if (page.includes('therapy') || page.includes('session')) return 'therapy';
    if (page.includes('payment') || page.includes('billing')) return 'technical';
    if (page.includes('therapist') || page.includes('book')) return 'navigation';
    return 'general';
  }

  /**
   * Generate a supportive message based on context
   */
  async generateSupportiveMessage(context: string): Promise<string> {
    const supportiveMessages = [
      "Remember, taking care of your mental health is a sign of strength, not weakness.",
      "Every step you take towards healing matters, no matter how small.",
      "You don't have to face this alone - support is available when you need it.",
      "Progress isn't always linear, and that's completely normal.",
      "Your feelings are valid, and you deserve support and understanding.",
      "Today is a new day, and you have the strength to face whatever comes your way.",
      "Self-care isn't selfish - it's essential for your well-being."
    ];

    // Simple context-based message selection
    if (context.toLowerCase().includes('anxiety')) {
      return "Anxiety can feel overwhelming, but remember: you've managed anxious moments before, and you can do it again. Take a deep breath and know that this feeling will pass.";
    } else if (context.toLowerCase().includes('depression')) {
      return "Depression can make everything feel heavy, but even on the darkest days, you're still moving forward. Reaching out for help is a courageous step toward healing.";
    } else if (context.toLowerCase().includes('stress')) {
      return "Stress is a natural response, but you have tools to manage it. Consider taking a moment to practice some deep breathing or reach out to your therapist for additional support.";
    }

    // Return random supportive message
    return supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];
  }

  /**
   * Generate monthly report summary (simplified)
   */
  async generateMonthlyReportSummary(userId: string, month: number, year: number): Promise<string> {
    // Mock implementation - in a real scenario, this would analyze actual user data
    const summaries = [
      "This month shows positive progress in your therapeutic journey. You've demonstrated resilience and commitment to your mental health goals.",
      "Your engagement with therapy sessions has been consistent, showing dedication to personal growth and self-improvement.",
      "The data indicates steady progress in managing stress and developing healthy coping mechanisms. Keep up the great work!",
      "This month's activities reflect a strong commitment to mental wellness. Your proactive approach to therapy is yielding positive results."
    ];

    return summaries[Math.floor(Math.random() * summaries.length)];
  }
}

/**
 * AI Help Component Props
 */
export interface AIHelpWidgetProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialQuery?: string;
  showGlow?: boolean;
  glowColor?: string;
}

/**
 * Export the AI service instance
 */
export const aiHelpService = SimpleAIHelpService.getInstance();

/**
 * Utility function to get AI recommendations
 */
export async function getAIHelpRecommendations(query: string, context?: string, page?: string): Promise<AIHelpRecommendation[]> {
  return aiHelpService.generateHelpRecommendations({
    query,
    context,
    page
  });
}

/**
 * Utility function to get supportive messages
 */
export async function getSupportiveMessage(context: string): Promise<string> {
  return aiHelpService.generateSupportiveMessage(context);
}

/**
 * Utility function to generate monthly report summary
 */
export async function generateMonthlyReportSummary(userId: string, month: number, year: number): Promise<string> {
  return aiHelpService.generateMonthlyReportSummary(userId, month, year);
}