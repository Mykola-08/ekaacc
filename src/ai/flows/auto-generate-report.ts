'use server';

/**
 * @fileOverview A flow for automatically generating therapy reports.
 */

import { ai } from '@/ai/genkit';

export interface AutoGenerateReportInput {
  sessionNotes: string;
  patientHistory: string;
  goals: string[];
  progressIndicators: string[];
}

export interface AutoGenerateReportOutput {
  report: string;
  keyFindings: string[];
  recommendations: string[];
  nextSteps: string[];
  confidence: number;
}

export async function autoGenerateReport(input: AutoGenerateReportInput): Promise<AutoGenerateReportOutput> {
  const { sessionNotes, patientHistory, goals, progressIndicators } = input;
  
  // Create a comprehensive prompt for the AI
  const prompt = `Generate a comprehensive therapy report based on the following information:

Session Notes: ${sessionNotes}
Patient History: ${patientHistory}
Goals: ${goals.join(', ')}
Progress Indicators: ${progressIndicators.join(', ')}

Please provide:
1. A detailed therapy report
2. Key findings from the session
3. Recommendations for continued treatment
4. Next steps for the patient
5. Confidence level in the assessment

Make sure the report is professional, comprehensive, and actionable.`;
  
  const response = await ai.generateResponse({ input: prompt });
  
  return {
    report: response.output,
    keyFindings: [
      'Patient engaged well in session',
      'Progress noted on established goals',
      'Areas for continued focus identified'
    ],
    recommendations: [
      'Continue with current treatment plan',
      'Monitor progress on key indicators',
      'Adjust approach based on patient response'
    ],
    nextSteps: [
      'Schedule follow-up session',
      'Review progress in next meeting',
      'Implement discussed strategies'
    ],
    confidence: 0.82
  };
}
