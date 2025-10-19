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
  objectiveNotes: z.string().describe('Therapist\'s objective notes from the session.'),
  issuesNotes: z.string().describe('Therapist\'s notes on issues discussed or assessment.'),
  nextStepsNotes: z.string().describe('Therapist\'s notes on the plan or next steps for the client.'),
});
export type AutoGenerateReportInput = z.infer<typeof AutoGenerateReportInputSchema>;

const AutoGenerateReportOutputSchema = z.object({
  report: z.string().describe('The generated session report in a professional format.'),
});
export type AutoGenerateReportOutput = z.infer<typeof AutoGenerateReportOutputSchema>;

export async function autoGenerateReport(input: AutoGenerateReportInput): Promise<AutoGenerateReportOutput> {
  return autoGenerateReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoGenerateReportPrompt',
  input: {schema: AutoGenerateReportInputSchema},
  output: {schema: AutoGenerateReportOutputSchema},
  prompt: `You are an expert AI assistant for therapists, specializing in writing clear, concise, and professional session reports based on notes.
  
Your task is to convert the provided ratings and notes into a structured session report. The report should follow a standard format (e.g., SOAP notes) but be readable and comprehensive.

Begin by summarizing the client's self-reported state based on the ratings. Then, use the notes provided for the Objective, Assessment, and Plan sections. Elaborate on the therapist's notes to create full, professional sentences. Maintain a neutral and objective tone.

Session Data:
- Tags: {{{sessionTags}}}
- Pain Rating (1-10): {{{painRating}}}
- Mood Rating (1-10): {{{moodRating}}}
- Energy Rating (1-10): {{{energyRating}}}

Therapist's Notes:
- Objective (O): {{{objectiveNotes}}}
- Assessment (A): {{{issuesNotes}}}
- Plan (P): {{{nextStepsNotes}}}

Generate the report below.
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
