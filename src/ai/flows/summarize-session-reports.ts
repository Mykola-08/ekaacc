'use server';
/**
 * @fileOverview A Genkit flow for summarizing session reports using AI.
 *
 * - summarizeSessionReports - A function that handles the session report summarization process.
 * - SummarizeSessionReportsInput - The input type for the summarizeSessionReports function.
 * - SummarizeSessionReportsOutput - The return type for the summarizeSessionReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSessionReportsInputSchema = z.object({
  reports: z.array(z.string()).describe('An array of session reports to summarize.'),
});
export type SummarizeSessionReportsInput = z.infer<typeof SummarizeSessionReportsInputSchema>;

const SummarizeSessionReportsOutputSchema = z.object({
  summary: z.string().describe('A summary of the session reports.'),
});
export type SummarizeSessionReportsOutput = z.infer<typeof SummarizeSessionReportsOutputSchema>;

export async function summarizeSessionReports(input: SummarizeSessionReportsInput): Promise<SummarizeSessionReportsOutput> {
  return summarizeSessionReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSessionReportsPrompt',
  input: {schema: SummarizeSessionReportsInputSchema},
  output: {schema: SummarizeSessionReportsOutputSchema},
  prompt: `You are an AI assistant helping therapists summarize session reports.

  Please provide a concise summary of the following session reports, highlighting key trends and insights:

  {{#each reports}}
  Report:
  {{{this}}}
  {{/each}}
  `,
});

const summarizeSessionReportsFlow = ai.defineFlow(
  {
    name: 'summarizeSessionReportsFlow',
    inputSchema: SummarizeSessionReportsInputSchema,
    outputSchema: SummarizeSessionReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
