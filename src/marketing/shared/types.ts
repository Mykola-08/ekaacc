import { z } from 'zod';

// ==============================
// Shared Zod Schemas
// ==============================

export const OnboardingDataSchema = z.object({
  userType: z.string(),
  goals: z.array(z.string()),
  preferredFeeling: z.string(),
});

/**
 * Contact form schema — shared between frontend and backend.
 * Frontend may add localized error messages on top, but structure must match.
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  service: z.string().min(1),
  message: z.string().min(10),
  preferred_contact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  preferred_time: z.string().optional(),
  source: z.string().optional(),
  privacy_policy: z.boolean().optional(),
});

export type OnboardingData = z.infer<typeof OnboardingDataSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;

export interface ServiceItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  iconName: string;
  color: string;
  durations: number[];
  image: string;
  href: string;
  benefitsKeys?: string[];
  fullWidth?: boolean;
  price?: number;
}

export interface PersonalizedServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  color: string;
  href: string;
  benefitsKeys?: string[];
  resultKey?: string;
  price?: number;
  duration?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  link: string;
  personalizedLink: string;
  feeling: string;
}
