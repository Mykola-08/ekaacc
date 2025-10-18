'use server';

/**
 * @fileOverview A flow for automatically generating or rewriting session reports using AI.
 *
 * - autoGenerateReport - A function that handles the report generation process.
 * - AutoGenerateReportInput - The input type for the autoGenerateReport function.
 * - AutoGenerateReportOutput - The return type for the autoGenerateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoGenerateReportInputSchema = z.object({
  sessionTags: z.string().describe('Tags associated with the session (e.g., on time, late, cooperative).'),
  painRating: z.number().describe('Pain rating on a scale of 1-10.'),
  moodRating: z.number().describe('Mood rating on a scale of 1-10.'),
  energyRating: z.number().describe('Energy rating on a scale of 1-10.'),
  objectiveNotes: z.string().describe('Objective notes from the session.'),
  issuesNotes: z.string().describe('Notes on issues discussed during the session.'),
  nextStepsNotes: z.string().describe('Notes on next steps for the client.'),
});
export type AutoGenerateReportInput = z.infer<typeof AutoGenerateReportInputSchema>;

const AutoGenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated or rewritten session report.'),
});
export type AutoGenerateReportOutput = z.infer<typeof AutoGenerateReportOutputSchema>;

export async function autoGenerateReport(input: AutoGenerateReportInput): Promise<AutoGenerateReportOutput> {
  return autoGenerateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoGenerateReportPrompt',
  input: {schema: AutoGenerateReportInputSchema},
  output: {schema: AutoGenerateReportOutputSchema},
  prompt: `You are an AI assistant that helps therapists generate session reports.

  Based on the following session data, generate a comprehensive session report:

  Session Tags: {{{sessionTags}}}
  Pain Rating: {{{painRating}}}
  Mood Rating: {{{moodRating}}}
  Energy Rating: {{{energyRating}}}
  Objective Notes: {{{objectiveNotes}}}
  Issues Notes: {{{issuesNotes}}}
  Next Steps: {{{nextStepsNotes}}}

  The report should be detailed and professionally written, summarizing the key aspects of the session.
  `,
});

const autoGenerateReportFlow = ai.defineFlow(
  {
    name: 'autoGenerateReportFlow',
    inputSchema: AutoGenerateReportInputSchema,
    outputSchema: AutoGenerateReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
