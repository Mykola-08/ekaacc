'use server';

import { submitOnboardingAnswers } from './service';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitOnboarding(profileId: string | undefined, answers: any[]) {
  if (!profileId) {
    // In a real app, we might get profileId from session here if not passed.
    // For now, fail if not provided.
    throw new Error('Profile ID is required');
  }

  await submitOnboardingAnswers(profileId, answers);

  revalidatePath('/');
  redirect('/');
}
