'use server';

/**
 * @fileOverview A flow for generating daily inspirational quotes.
 */

import { ai } from '@/ai/genkit';

export interface GenerateDailyQuoteInput {
  userContext?: string;
  mood?: string;
  previousQuotes?: string[];
}

export interface GenerateDailyQuoteOutput {
  quote: string;
  author: string;
  category: string;
  relevance: number;
}

export async function generateDailyQuote(input: GenerateDailyQuoteInput = {}): Promise<GenerateDailyQuoteOutput> {
  const { userContext, mood, previousQuotes } = input;
  
  // Create a comprehensive prompt for the AI
  const prompt = `Generate an inspirational daily quote for mental health and wellness. 

User Context: ${userContext || 'General wellness'}
Mood: ${mood || 'Neutral'}
Previous Quotes: ${previousQuotes?.join(', ') || 'None'}

Please provide an original, uplifting quote that promotes mental health, self-care, and personal growth. Include an author (can be "Unknown" for original quotes) and categorize it appropriately.`;
  
  const response = await ai.generateResponse({ input: prompt });
  
  return {
    quote: response.output,
    author: 'Unknown',
    category: 'Mental Health & Wellness',
    relevance: 0.85
  };
}
