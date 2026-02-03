# Onboarding & Personalization Implementation Guide

## Overview
We have implemented a dynamic onboarding system that allows asking configurable questions to users to build their personalization profile.

## Backend
- **Schema**: `onboarding_questions` and `user_onboarding_answers` tables.
- **Service**: `server/personalization/service.ts`
  - `getOnboardingQuestions()`: Fetches active questions ordered by display order.
  - `submitOnboardingAnswers(profileId, answers)`: Saves user responses.
  - `getUserPersonalization(profileId)`: Gets the summarized personalization JSON from the profile.

## Frontend Flow (Recommended)
1. **Fetch Questions**: On the onboarding page, call a Server Action that wraps `getOnboardingQuestions`.
2. **Render Form**: Display questions based on `type` (text, single_choice, scale, etc.).
3. **Submit**: Call Server Action to `submitOnboardingAnswers`.
4. **Redirect**: Send user to the Dashboard.

## Data Structure
### Question
```typescript
interface OnboardingQuestion {
  id: string;
  questionKey: string; // unique key e.g. 'primary_goal'
  questionText: string;
  type: 'text' | 'single_choice' | 'multi_choice' | 'scale';
  options: any; // e.g. ["Relaxation", "Pain Relief"]
  // ...
}
```

### Answer
```typescript
{
  questionId: string;
  value: string | string[] | number; // match the question type
}
```

## Seed Data
We have pre-seeded 4 standard questions:
1. Primary Goal (Single Choice)
2. Stress Level (Scale 1-10)
3. Focus Areas (Multi Choice)
4. Pressure Preference (Single Choice)

## Profile Creation
A database trigger `on_auth_user_created` now automatically creates a `profiles` row when a new user signs up via Supabase Auth.
