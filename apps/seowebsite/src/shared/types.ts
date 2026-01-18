import { z } from 'zod';

export const OnboardingDataSchema = z.object({
  userType: z.string(),
  goals: z.array(z.string()),
  preferredFeeling: z.string(),
});

export type OnboardingData = z.infer<typeof OnboardingDataSchema>;

export interface ServiceItem {
  id: string;
  slug?: string; // Added for booking integration
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
  active?: boolean;
}

export interface PersonalizedServiceItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
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
