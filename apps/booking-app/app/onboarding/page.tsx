import { getOnboardingQuestions } from '@/server/personalization/service';
import { OnboardingWizard } from './onboarding-wizard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // redirect('/login'); // In production redirect to login
    // For demo purposes, we might want to allow viewing, but since we need profileId:
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Please log in to continue onboarding.</p>
        </div>
    )
  }

  // Get Profile ID (Simple lookup, or assume trigger created it with auth_id linkage)
  // Assuming a helper or direct query.
  // For now, let's fetch profile ID.
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) {
     return <div>Error loading profile. Please contact support.</div>;
  }

  const questions = await getOnboardingQuestions();

  return (
    <OnboardingWizard 
        questions={questions} 
        userProfileId={profile.id} 
    />
  );
}
