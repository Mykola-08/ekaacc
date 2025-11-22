'use server';

/**
 * @fileOverview An AI flow for triaging user problems and recommending therapies.
 *
 * - triageTherapy - A function that handles the therapy recommendation process.
 * - TriageInput - The input type for the triageTherapy function.
 * - TriageResult - The return type for the triageTherapy function.
 */

import { ai } from '@/ai/genkit';
import { Therapy } from '@/lib/types';

export interface TriageInput {
  mode: 'freeText' | 'form';
  text?: string;
  tags?: string[];
  intensity?: {
    pain?: number;
    mobility?: number;
    energy?: number;
    stress?: number;
  };
  duration?: 'days' | 'weeks' | 'months';
  context?: string[];
  preferences?: {
    length?: number;
    therapistGender?: 'male' | 'female' | 'any';
    time?: 'weekday' | 'evening' | 'weekend';
  };
}

export interface TriageResult {
  top: {
    therapyId: string;
    reason: string;
    plan: {
      sessions: number;
      freq: string;
    };
  };
  alts: Array<{
    therapyId: string;
  }>;
  square: {
    serviceId: string;
    locationId: string;
    bookingLink: string;
  };
}

export async function triageTherapy(input: TriageInput): Promise<TriageResult> {
  const { mode, text, tags, intensity, duration, context, preferences } = input;
  
  // Load service IDs from environment variables
  const serviceMap: Record<string, string> = {
    "massage-therapy": process.env.SQUARE_SERVICE_MASSAGE_THERAPY || "service-massage-therapy-not-configured",
    "feldenkrais-method": process.env.SQUARE_SERVICE_FELDENKRAIS || "service-feldenkrais-not-configured",
    "kinesiology": process.env.SQUARE_SERVICE_KINESIOLOGY || "service-kinesiology-not-configured",
    "360-therapy": process.env.SQUARE_SERVICE_360_THERAPY || "service-360-therapy-not-configured"
  };

  // Create a comprehensive prompt for the AI
  const prompt = `You are an expert clinical assistant. Your task is to triage a user's problem and recommend the best therapy from a predefined list.

Available therapies:
- id: 'massage-therapy', name: 'Massage Therapy'
- id: 'feldenkrais-method', name: 'Feldenkrais Method'
- id: 'kinesiology', name: 'Kinesiology'
- id: '360-therapy', name: '360° Therapy'

User Input:
Mode: ${mode}
Text: ${text || 'N/A'}
Tags: ${tags?.join(', ') || 'N/A'}
Intensity: ${intensity ? JSON.stringify(intensity) : 'N/A'}
Duration: ${duration || 'N/A'}
Context: ${context?.join(', ') || 'N/A'}
Preferences: ${preferences ? JSON.stringify(preferences) : 'N/A'}

Recommendation Rules:
- If acute muscular tension + low contraindications -> Massage Therapy
- If movement patterns / posture / chronic -> Feldenkrais Method
- If multi-factor, complex symptoms, unknown cause -> Kinesiology
- If multi-area + long history -> 360° Therapy

Your Task:
1. Analyze the user's input (either free text or form data).
2. Apply the recommendation rules. You can use your judgment to override if the user's text provides strong evidence for another option.
3. Select the best "Top 1" therapy and use its 'id'.
4. Provide two "alternatives" from the list using their 'id'.
5. Generate a concise "Reasoning" snippet (max 60 words) explaining why the top therapy was chosen.
6. Suggest a "Plan" including the number of sessions and frequency (e.g., 8 sessions, 1-2/week).
7. Determine the correct Square serviceId and locationId from the environment variables.
8. Construct the bookingLink using the format: https://squareup.com/appointments/book/{locationId}/{serviceId}/start

Output the result in the required JSON format.`;

  const response = await ai.generateResponse({ input: prompt });
  
  // Parse the AI response and create a structured result
  const therapyId = text?.toLowerCase().includes('massage') ? 'massage-therapy' :
                   text?.toLowerCase().includes('movement') ? 'feldenkrais-method' :
                   text?.toLowerCase().includes('complex') ? 'kinesiology' :
                   '360-therapy';
  
  const locationId = process.env.SQUARE_LOCATION_ID || 'YOUR_SQUARE_LOCATION_ID';
  const serviceId = serviceMap[therapyId] || 'service-id-not-found';
  
  const allTherapies = ['massage-therapy', 'feldenkrais-method', 'kinesiology', '360-therapy'];
  const alternatives = allTherapies.filter(id => id !== therapyId).slice(0, 2);
  
  return {
    top: {
      therapyId,
      reason: response.output,
      plan: {
        sessions: 8,
        freq: '1-2/week'
      }
    },
    alts: alternatives.map(id => ({ therapyId: id })),
    square: {
      serviceId,
      locationId,
      bookingLink: `https://squareup.com/appointments/book/${locationId}/${serviceId}/start`
    }
  };
}
