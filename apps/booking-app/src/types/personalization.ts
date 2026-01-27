export interface OnboardingQuestion {
  id: string;
  questionKey: string;
  questionText: string;
  type: 'text' | 'single_choice' | 'multi_choice' | 'scale';
  options?: any; // mixed types
  displayOrder: number;
  category: string;
}

export interface UserOnboardingAnswer {
  profileId: string;
  questionId: string;
  answerData: any;
  updatedAt: string;
}

export interface PersonalizationProfile {
  id: string;
  goals: string[];
  preferences: Record<string, any>;
  contraindications: string[];
  notes?: string;
}
