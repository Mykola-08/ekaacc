/**
 * @file Unified AI Service - Vercel AI Integration
 * @description Centralized AI service that uses Vercel AI for all AI operations
 * Replaces simple-ai-service, tiered-ai-service, and premium-features
 */

import { generateText, generateObject, streamText, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import type { User } from '@/lib/types';

export interface AIRequest {
  input: string;
  context?: Record<string, any>;
  userId?: string;
  model?: 'openai' | 'anthropic' | 'google';
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIResponse {
  output: string;
  confidence: number;
  metadata?: Record<string, any>;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: string;
  userId?: string;
}

export interface AIObjectRequest<T> extends AIRequest {
  schema: T;
}

export interface WellnessInsightsRequest {
  userData: {
    sessionsCompleted: number;
    mood: string;
    goals: string;
    name?: string;
  };
  context?: string;
}

export interface TherapyRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'therapy' | 'technical' | 'navigation' | 'general';
  confidence: number;
  action?: () => void;
}

/**
 * Unified AI Service that provides all AI functionality using Vercel AI
 */
export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Generate a text response using Vercel AI
   */
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    try {
      const { input, context, userId, model = 'openai', maxTokens = 1000, temperature = 0.7 } = request;
      
      // Select the AI provider based on the model
      const provider = this.getProvider(model);
      
      // Build the prompt with context
      let fullPrompt = input;
      if (context && Object.keys(context).length > 0) {
        fullPrompt = `Context: ${JSON.stringify(context, null, 2)}\n\nUser Input: ${input}`;
      }
      
      const result = await generateText({
        model: provider,
        prompt: fullPrompt,
        maxTokens: maxTokens,
        temperature: temperature
      } as any);
      
      return {
        output: result.text,
        confidence: 0.85, // Default confidence for AI responses
        usage: result.usage ? {
          promptTokens: (result.usage as any).promptTokens || (result.usage as any).inputTokens || 0,
          completionTokens: (result.usage as any).completionTokens || (result.usage as any).outputTokens || 0,
          totalTokens: (result.usage as any).totalTokens || 0
        } : undefined,
        model: result.response?.modelId || model,
        timestamp: new Date().toISOString(),
        userId,
        metadata: {
          finishReason: (result.response as any)?.finishReason,
        }
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to rule-based response
      return this.generateFallbackResponse(request);
    }
  }

  /**
   * Generate wellness insights for patients
   */
  async generateWellnessInsights(request: WellnessInsightsRequest): Promise<string[]> {
    const { userData, context } = request;
    
    const insights = [];
    
    try {
      const aiResponse = await this.generateResponse({
        input: `Generate 3 personalized wellness insights for a patient who has completed ${userData.sessionsCompleted} sessions with mood ${userData.mood} and goal: ${userData.goals}`,
        context: {
          patientName: userData.name,
          sessionsCompleted: userData.sessionsCompleted,
          currentMood: userData.mood,
          primaryGoal: userData.goals,
          additionalContext: context,
        },
        model: 'openai',
        maxTokens: 500,
        temperature: 0.7,
      });
      
      // Parse the response into individual insights
      const responseText = aiResponse.output;
      const lines = responseText.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const cleanedLine = line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
        if (cleanedLine && insights.length < 3) {
          insights.push(cleanedLine);
        }
      }
      
      // Fallback insights if AI doesn't provide enough
      if (insights.length === 0) {
        insights.push(...this.getFallbackWellnessInsights(userData));
      }
    } catch (error) {
      console.error('Wellness Insights Error:', error);
      insights.push(...this.getFallbackWellnessInsights(userData));
    }
    
    return insights.slice(0, 3);
  }

  /**
   * Generate therapy recommendations
   */
  async generateTherapyRecommendations(query: string, context?: string, userId?: string): Promise<TherapyRecommendation[]> {
    try {
      const aiResponse = await this.generateResponse({
        input: `Provide therapy recommendations for: ${query}`,
        context: { query, additionalContext: context },
        userId,
        model: 'openai',
        maxTokens: 800,
        temperature: 0.6,
      });
      
      // Parse recommendations from AI response
      const recommendations = this.parseRecommendations(aiResponse.output);
      
      if (recommendations.length === 0) {
        return this.getFallbackRecommendations(query);
      }
      
      return recommendations;
    } catch (error) {
      console.error('Therapy Recommendations Error:', error);
      return this.getFallbackRecommendations(query);
    }
  }

  /**
   * Get the appropriate AI provider based on model selection
   */
  private getProvider(model: string) {
    switch (model) {
      case 'anthropic':
        return anthropic('claude-3-haiku-20240307');
      case 'google':
        return google('models/gemini-pro');
      case 'openai':
      default:
        return openai('gpt-3.5-turbo');
    }
  }

  /**
   * Generate fallback response when AI service fails
   */
  private generateFallbackResponse(request: AIRequest): AIResponse {
    const { input } = request;
    const lowerInput = input.toLowerCase();
    
    let output = "I understand you're looking for support. Here's what I can suggest:";
    let confidence = 0.5;
    
    if (lowerInput.includes('anxiety') || lowerInput.includes('stress')) {
      output = "For anxiety and stress management, consider trying deep breathing exercises, progressive muscle relaxation, or mindfulness meditation. These techniques can help calm your nervous system and reduce immediate stress.";
      confidence = 0.7;
    } else if (lowerInput.includes('depression') || lowerInput.includes('sad')) {
      output = "When dealing with feelings of depression or sadness, it's important to maintain daily routines, stay connected with supportive people, and engage in activities you once enjoyed. Small, consistent steps can make a significant difference.";
      confidence = 0.7;
    } else if (lowerInput.includes('sleep') || lowerInput.includes('insomnia')) {
      output = "For better sleep, try maintaining a consistent sleep schedule, creating a relaxing bedtime routine, and avoiding screens before bed. Consider journaling or gentle stretching to help your mind and body prepare for rest.";
      confidence = 0.7;
    } else if (lowerInput.includes('relationship') || lowerInput.includes('communication')) {
      output = "Healthy communication involves active listening, expressing your needs clearly, and being open to understanding others' perspectives. Practice 'I' statements and validate feelings before problem-solving.";
      confidence = 0.7;
    } else {
      output = "I'm here to support your wellness journey. Consider discussing this with your therapist who can provide personalized guidance based on your specific situation and goals.";
      confidence = 0.6;
    }
    
    return {
      output,
      confidence,
      model: 'fallback',
      timestamp: new Date().toISOString(),
      userId: request.userId,
      metadata: { source: 'fallback' }
    };
  }

  /**
   * Get fallback wellness insights
   */
  private getFallbackWellnessInsights(userData: any): string[] {
    const insights = [];
    
    if (userData.sessionsCompleted < 3) {
      insights.push("Keep up the great work! Early sessions are building the foundation for your wellness journey.");
    } else if (userData.sessionsCompleted >= 3 && userData.sessionsCompleted < 8) {
      insights.push("You're making solid progress! Consider journaling between sessions to track your insights.");
    } else {
      insights.push("You've shown great commitment to your wellness! Reflect on how far you've come since starting.");
    }
    
    if (userData.mood === 'low' || userData.mood === 'anxious') {
      insights.push("Remember that mood fluctuations are normal. Try a grounding technique like 5-4-3-2-1 sensory awareness.");
    } else if (userData.mood === 'good' || userData.mood === 'positive') {
      insights.push("Your positive mood is wonderful! Consider what factors contributed and how to maintain them.");
    }
    
    if (userData.goals.includes('stress') || userData.goals.includes('anxiety')) {
      insights.push("For stress management, try box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4.");
    }
    
    return insights;
  }

  /**
   * Parse recommendations from AI response
   */
  private parseRecommendations(responseText: string): TherapyRecommendation[] {
    const recommendations: TherapyRecommendation[] = [];
    const lines = responseText.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const cleanedLine = line.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
      if (cleanedLine && recommendations.length < 5) {
        recommendations.push({
          id: `rec_${recommendations.length + 1}`,
          title: cleanedLine.substring(0, 50) + (cleanedLine.length > 50 ? '...' : ''),
          description: cleanedLine,
          category: 'therapy',
          confidence: 0.8,
        });
      }
    }
    
    return recommendations;
  }

  /**
   * Get fallback recommendations
   */
  private getFallbackRecommendations(query: string): TherapyRecommendation[] {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('anxiety') || lowerQuery.includes('stress')) {
      return [{
        id: 'fallback_anxiety',
        title: 'Anxiety Management Techniques',
        description: 'Practice deep breathing, progressive muscle relaxation, or mindfulness meditation to manage anxiety symptoms.',
        category: 'therapy',
        confidence: 0.7,
      }];
    }
    
    if (lowerQuery.includes('depression') || lowerQuery.includes('mood')) {
      return [{
        id: 'fallback_depression',
        title: 'Mood Enhancement Strategies',
        description: 'Maintain daily routines, stay connected with supportive people, and engage in activities you enjoy.',
        category: 'therapy',
        confidence: 0.7,
      }];
    }
    
    return [{
      id: 'fallback_general',
      title: 'General Wellness Support',
      description: 'Consider discussing your concerns with your therapist who can provide personalized guidance.',
      category: 'general',
      confidence: 0.6,
    }];
  }
}

// Export singleton instance
export const aiService = AIService.getInstance();

// Export convenience functions for common operations
export const generateAIResponse = (request: AIRequest) => aiService.generateResponse(request);
export const generateWellnessInsights = (request: WellnessInsightsRequest) => aiService.generateWellnessInsights(request);
export const generateTherapyRecommendations = (query: string, context?: string, userId?: string) => 
  aiService.generateTherapyRecommendations(query, context, userId);