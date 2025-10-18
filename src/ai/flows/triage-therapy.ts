'use server';

/**
 * @fileOverview An AI flow for triaging user problems and recommending therapies.
 *
 * - triageTherapy - A function that handles the therapy recommendation process.
 * - TriageInput - The input type for the triageTherapy function.
 * - TriageResult - The return type for the triageTherapy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { therapies } from '@/lib/data';
import { Therapy } from '@/lib/types';

export const TriageInputSchema = z.object({
  mode: z.enum(['freeText', 'form']),
  text: z.string().optional().describe('Free-form text describing the user\'s problem, goals, and context.'),
  tags: z.array(z.string()).optional().describe('Optional tags for symptoms or goals like Neck, Lower back, Stress, Sleep.'),
  intensity: z.object({
    pain: z.number().optional(),
    mobility: z.number().optional(),
    energy: z.number().optional(),
    stress: z.number().optional(),
  }).optional(),
  duration: z.enum(['days', 'weeks', 'months']).optional(),
  context: z.array(z.string()).optional().describe('Context like injury, chronic, desk work, sport.'),
  preferences: z.object({
    length: z.number().optional().describe('Preferred session length: 30, 60, 90 minutes.'),
    therapistGender: z.enum(['male', 'female', 'any']).optional(),
    time: z.enum(['weekday', 'evening', 'weekend']).optional(),
  }).optional(),
});
export type TriageInput = z.infer<typeof TriageInputSchema>;

export const TriageResultSchema = z.object({
  top: z.object({
    therapyId: z.string(),
    reason: z.string(),
    plan: z.object({
      sessions: z.number(),
      freq: z.string(),
    }),
  }),
  alts: z.array(z.object({
    therapyId: z.string(),
  })),
  square: z.object({
    serviceId: z.string(),
    locationId: z.string(),
    bookingLink: z.string().url(),
  }),
});
export type TriageResult = z.infer<typeof TriageResultSchema>;

const therapyOptions = therapies.map(t => ({id: t.id, name: t.name, description: t.shortDescription, category: t.category, complexity: t.complexityLevel}));

export async function triageTherapy(input: TriageInput): Promise<TriageResult> {
  return triageTherapyFlow(input);
}

const triageTherapyPrompt = ai.definePrompt({
  name: 'triageTherapyPrompt',
  input: { schema: TriageInputSchema },
  output: { schema: TriageResultSchema },
  prompt: `You are an expert clinical assistant. Your task is to triage a user's problem and recommend the best therapy from a predefined list.

  Available therapies:
  ${JSON.stringify(therapyOptions, null, 2)}

  User Input:
  {{{json input}}}

  Recommendation Rules:
  - If acute muscular tension + low contraindications -> Massage
  - If movement patterns / posture / chronic -> Feldenkrais Method
  - If multi-factor, complex symptoms, unknown cause -> Kinesiology
  - If multi-area + long history -> 360° Therapy

  Your Task:
  1.  Analyze the user's input (either free text or form data).
  2.  Apply the recommendation rules. You can use your judgment to override if the user's text provides strong evidence for another option.
  3.  Select the best "Top 1" therapy.
  4.  Provide two "alternatives" from the list.
  5.  Generate a concise "Reasoning" snippet (max 60 words) explaining why the top therapy was chosen.
  6.  Suggest a "Plan" including the number of sessions and frequency (e.g., 8 sessions, 1-2/week).
  7.  Determine the correct Square serviceId and locationId from the environment variables. For now, use placeholder values from SERVICE_MAP and a placeholder locationId.
  8.  Construct the bookingLink using the format: https://squareup.com/appointments/book/{locationId}/{serviceId}/start

  Output the result in the required JSON format.
  `,
});

const triageTherapyFlow = ai.defineFlow(
  {
    name: 'triageTherapyFlow',
    inputSchema: TriageInputSchema,
    outputSchema: TriageResultSchema,
  },
  async (input) => {

    const serviceMap: Record<string, string> = {
        "Massage Therapy": "L5D2M7J4K9N1R/services/6Z3X5Y7A9B1C2D4E",
        "Feldenkrais Method": "L5D2M7J4K9N1R/services/7A9B1C2D4E6Z3X5Y",
        "Kinesiology": "L5D2M7J4K9N1R/services/8B1C2D4E6Z3X5Y7A",
        "360° Therapy": "L5D2M7J4K9N1R/services/9C1D2E4F6G3H5I7J"
    };

    const { output } = await triageTherapyPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate a recommendation.');
    }

    const topTherapy = therapies.find(t => t.id === output.top.therapyId);
    if (!topTherapy) {
        throw new Error(`AI recommended an invalid therapyId: ${output.top.therapyId}`);
    }

    const locationId = process.env.SQUARE_LOCATION_ID || 'YOUR_SQUARE_LOCATION_ID';
    const serviceId = serviceMap[topTherapy.name] || 'service-id-not-found';
    
    output.square.serviceId = serviceId;
    output.square.locationId = locationId;
    output.square.bookingLink = `https://squareup.com/appointments/book/${locationId}/${serviceId}/start`;


    return output;
  }
);
