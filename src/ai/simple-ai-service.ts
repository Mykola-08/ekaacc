export interface SimpleAIRequest {
  input: string;
  context?: Record<string, any>;
}

export interface SimpleAIResponse {
  output: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export class SimpleAIService {
  private static instance: SimpleAIService;
  
  private constructor() {}
  
  static getInstance(): SimpleAIService {
    if (!SimpleAIService.instance) {
      SimpleAIService.instance = new SimpleAIService();
    }
    return SimpleAIService.instance;
  }
  
  async generateResponse(request: SimpleAIRequest): Promise<SimpleAIResponse> {
    const { input, context } = request;
    
    // Simple rule-based responses based on input patterns
    const lowerInput = input.toLowerCase();
    
    // Therapy-specific responses
    if (lowerInput.includes('therapy') || lowerInput.includes('session')) {
      return {
        output: this.generateTherapyResponse(lowerInput, context),
        confidence: 0.85,
        metadata: { type: 'therapy', keywords: ['therapy', 'session'] }
      };
    }
    
    if (lowerInput.includes('support') || lowerInput.includes('help')) {
      return {
        output: this.generateSupportResponse(lowerInput, context),
        confidence: 0.80,
        metadata: { type: 'support', keywords: ['support', 'help'] }
      };
    }
    
    if (lowerInput.includes('quote') || lowerInput.includes('daily')) {
      return {
        output: this.generateQuoteResponse(lowerInput, context),
        confidence: 0.90,
        metadata: { type: 'quote', keywords: ['quote', 'daily'] }
      };
    }
    
    if (lowerInput.includes('triage') || lowerInput.includes('assessment')) {
      return {
        output: this.generateTriageResponse(lowerInput, context),
        confidence: 0.88,
        metadata: { type: 'triage', keywords: ['triage', 'assessment'] }
      };
    }
    
    if (lowerInput.includes('chat') || lowerInput.includes('reply')) {
      return {
        output: this.generateChatResponse(lowerInput, context),
        confidence: 0.82,
        metadata: { type: 'chat', keywords: ['chat', 'reply'] }
      };
    }
    
    if (lowerInput.includes('report') || lowerInput.includes('summary')) {
      return {
        output: this.generateReportResponse(lowerInput, context),
        confidence: 0.87,
        metadata: { type: 'report', keywords: ['report', 'summary'] }
      };
    }
    
    // Default response
    return {
      output: 'I understand your request. Let me help you with that.',
      confidence: 0.60,
      metadata: { type: 'default' }
    };
  }
  
  private generateTherapyResponse(input: string, context?: Record<string, any>): string {
    const responses = [
      'Based on your therapy session, I recommend focusing on mindfulness techniques and breathing exercises.',
      'Your session progress shows positive development. Consider journaling your thoughts between sessions.',
      'Therapy sessions are most effective when combined with regular self-reflection and goal setting.',
      'I notice themes of growth in your sessions. Continue practicing the coping strategies discussed.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateSupportResponse(input: string, context?: Record<string, any>): string {
    const responses = [
      'You\'re doing great by reaching out for support. Remember that progress takes time and patience.',
      'Support is available whenever you need it. Consider connecting with your therapist or support group.',
      'Your well-being is important. Don\'t hesitate to use the resources available to you.',
      'Remember that seeking help is a sign of strength, not weakness. You\'re on the right path.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateQuoteResponse(input: string, context?: Record<string, any>): string {
    const quotes = [
      'Every small step forward is progress. Celebrate your daily victories, no matter how small.',
      'Healing is not linear. Some days will be harder than others, and that\'s perfectly okay.',
      'Your mental health journey is unique to you. Trust the process and be patient with yourself.',
      'Today is a new opportunity to prioritize your well-being and take care of your mental health.'
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  private generateTriageResponse(input: string, context?: Record<string, any>): string {
    const responses = [
      'Based on your assessment, I recommend scheduling a session with your therapist to discuss these concerns.',
      'Your responses indicate areas that could benefit from professional support. Consider reaching out to your care team.',
      'I suggest monitoring these symptoms and sharing this information with your healthcare provider.',
      'These assessment results show important areas to address. Professional guidance would be beneficial.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateChatResponse(input: string, context?: Record<string, any>): string {
    const responses = [
      'I understand your concern. It might help to explore this further with your therapist.',
      'That\'s an important observation. Consider how this relates to your therapeutic goals.',
      'Thank you for sharing that. This seems like something worth discussing in your next session.',
      'I appreciate you sharing this. These feelings are valid and worth exploring further.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private generateReportResponse(input: string, context?: Record<string, any>): string {
    const responses = [
      'Your progress summary shows consistent engagement with therapeutic activities and positive trends.',
      'Based on your reports, you\'ve demonstrated growth in several key areas of your mental health journey.',
      'The data indicates steady progress in your therapeutic goals with room for continued development.',
      'Your session summaries reveal important insights that can guide future therapeutic interventions.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  async generateStructuredResponse<T>(request: SimpleAIRequest, schema: any): Promise<T> {
    const response = await this.generateResponse(request);
    
    // Simple schema-based response generation
    if (schema && schema.shape) {
      const result: any = {};
      
      for (const [key, field] of Object.entries(schema.shape)) {
        if (key === 'summary' || key === 'output') {
          result[key] = response.output;
        } else if (key === 'confidence') {
          result[key] = response.confidence;
        } else if (key === 'keywords' || key === 'themes') {
          result[key] = response.metadata?.keywords || [];
        } else {
          result[key] = this.generateFieldValue(key, field);
        }
      }
      
      return result as T;
    }
    
    return response as T;
  }
  
  private generateFieldValue(key: string, field: any): any {
    switch (key) {
      case 'urgency':
        return Math.random() > 0.7 ? 'high' : 'medium';
      case 'category':
        return ['emotional', 'behavioral', 'cognitive'][Math.floor(Math.random() * 3)];
      case 'recommendations':
        return ['Continue therapy', 'Practice mindfulness', 'Journaling'];
      case 'nextSteps':
        return ['Schedule follow-up', 'Monitor progress', 'Adjust treatment'];
      default:
        return 'N/A';
    }
  }
}

export const simpleAI = SimpleAIService.getInstance();