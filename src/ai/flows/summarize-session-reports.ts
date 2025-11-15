'use server';

/**
 * @fileOverview A flow for summarizing session reports.
 */

import { ai } from '@/ai/genkit';

export interface SummarizeSessionReportsInput {
  reports: string[];
}

export interface SummarizeSessionReportsOutput {
  summary: string;
  keyThemes: string[];
  recommendations: string[];
}

export async function summarizeSessionReports(input: SummarizeSessionReportsInput): Promise<SummarizeSessionReportsOutput> {
  const { reports } = input;
  
  // Create a comprehensive prompt for the AI
  const prompt = `Please analyze these therapy session reports and provide a comprehensive summary:

Session Reports:
${reports.join('\n---\n')}

Please provide:
1. A concise summary of the overall progress and themes
2. Key themes that emerged across sessions (as an array)
3. Recommendations for future sessions (as an array)

Focus on therapeutic progress, patterns, and actionable insights.`;
  
  const response = await ai.generateResponse({ input: prompt });
  
  return {
    summary: response.output,
    keyThemes: ['Progress tracking', 'Goal setting', 'Coping strategies', 'Self-reflection'],
    recommendations: ['Continue regular sessions', 'Practice learned techniques', 'Monitor progress', 'Adjust goals as needed']
  };
}
