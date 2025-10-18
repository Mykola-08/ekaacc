'use server';

/**
 * @fileOverview A flow to generate a personalized monthly progress report for the user.
 *
 * - generateMonthlyReport - A function that generates and returns the monthly report.
 * - GenerateMonthlyReportInput - The input type for the generateMonthlyReport function.
 * - GenerateMonthlyReportOutput - The return type for the generateMonthlyReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMonthlyReportInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate the report for.'),
  startDate: z.string().describe('The start date for the report (ISO format).'),
  endDate: z.string().describe('The end date for the report (ISO format).'),
  healthHistory: z.string().describe('The user health history.'),
  reports: z.string().describe('The user reports.'),
  messages: z.string().describe('The user messages.'),
});
export type GenerateMonthlyReportInput = z.infer<typeof GenerateMonthlyReportInputSchema>;

const GenerateMonthlyReportOutputSchema = z.object({
  report: z.string().describe('The generated monthly report.'),
  progress: z.string().describe('A short summary of the generated report.'),
});
export type GenerateMonthlyReportOutput = z.infer<typeof GenerateMonthlyReportOutputSchema>;

export async function generateMonthlyReport(input: GenerateMonthlyReportInput): Promise<GenerateMonthlyReportOutput> {
  return generateMonthlyReportFlow(input);
}

const generateMonthlyReportPrompt = ai.definePrompt({
  name: 'generateMonthlyReportPrompt',
  input: {schema: GenerateMonthlyReportInputSchema},
  output: {schema: GenerateMonthlyReportOutputSchema},
  prompt: `You are an AI assistant that generates personalized monthly progress reports for users.

  You will receive the user's health history, reports, and messages, and you will generate a comprehensive monthly report that summarizes their progress, highlights key improvements, and provides personalized recommendations.

  User ID: {{{userId}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}
  Health History: {{{healthHistory}}}
  Reports: {{{reports}}}
  Messages: {{{messages}}}

  Generate a well-structured and informative monthly report.
  Be sure to include:
  - A summary of the user's progress during the month.
  - Key improvements and achievements.
  - Personalized recommendations for the next month.

  Write the report in a professional and encouraging tone.
  Also, provide a one-sentence summary of what is generated to the 'progress' field in the output.
  `,
});

const generateMonthlyReportFlow = ai.defineFlow(
  {
    name: 'generateMonthlyReportFlow',
    inputSchema: GenerateMonthlyReportInputSchema,
    outputSchema: GenerateMonthlyReportOutputSchema,
  },
  async input => {
    const {output} = await generateMonthlyReportPrompt(input);
    return output!;
  }
);
