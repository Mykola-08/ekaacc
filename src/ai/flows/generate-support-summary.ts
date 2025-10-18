'use server';

/**
 * @fileOverview An AI agent for generating a summary of support received by a donation receiver.
 *
 * - generateSupportSummary - A function that handles the generation of the support summary.
 * - GenerateSupportSummaryInput - The input type for the generateSupportSummary function.
 * - GenerateSupportSummaryOutput - The return type for the generateSupportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupportSummaryInputSchema = z.object({
  receiverName: z.string().describe('The name of the donation receiver.'),
  donorNames: z.array(z.string()).describe('A list of the names of the donors.'),
  supportDetails: z.string().describe('Details of the support received, including amounts and dates.'),
  progressDetails: z.string().describe('Details of the progress made by the donation receiver.'),
});
export type GenerateSupportSummaryInput = z.infer<typeof GenerateSupportSummaryInputSchema>;

const GenerateSupportSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the support received.'),
  progress: z.string().describe('A short, one-sentence summary of progress.'),
});
export type GenerateSupportSummaryOutput = z.infer<typeof GenerateSupportSummaryOutputSchema>;

export async function generateSupportSummary(input: GenerateSupportSummaryInput): Promise<GenerateSupportSummaryOutput> {
  return generateSupportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupportSummaryPrompt',
  input: {schema: GenerateSupportSummaryInputSchema},
  output: {schema: GenerateSupportSummaryOutputSchema},
  prompt: `You are an AI assistant helping a donation receiver communicate their progress to donors.

  Your task is to generate a concise and engaging summary of the support they have received, as well as a short progress update.

  Receiver Name: {{{receiverName}}}
  Donor Names: {{#each donorNames}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Support Details: {{{supportDetails}}}
  Progress Details: {{{progressDetails}}}

  Please generate a summary that highlights the impact of the donations and the progress made by the receiver.
  Also, include a one-sentence summary of progress in the "progress" field.
  `,
});

const generateSupportSummaryFlow = ai.defineFlow(
  {
    name: 'generateSupportSummaryFlow',
    inputSchema: GenerateSupportSummaryInputSchema,
    outputSchema: GenerateSupportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
