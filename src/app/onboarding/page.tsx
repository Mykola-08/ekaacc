'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { ComprehensiveOnboarding } from '@/components/eka/comprehensive-onboarding';
import { OnboardingShell } from '@/components/eka/onboarding/onboarding-shell';
import { motion } from 'framer-motion';
import MedicalDisclaimer from '@/components/medical-disclaimer';
import { useEffect, useState } from 'react';

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already onboarded
    if (user?.personalizationCompleted) {
      toast({
        title: 'Already onboarded!',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/dashboard');
    }
  }, [user, router, toast]);

  const handleComplete = async (personalizationData: any) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to complete onboarding.',
      });
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const { getDataService } = await import('@/services/data-service');
      const dataService = await getDataService();
      
      // Extract layout preference
      const { layoutPreference, ...otherPersonalization } = personalizationData;
      
      await dataService.updateUser(user.id, {
        personalizationCompleted: true,
        personalization: otherPersonalization,
        settings: {
          ...user.settings,
          appPreferences: {
            ...user.settings?.appPreferences,
            layoutMode: layoutPreference
          }
        }
      });
      
      toast({
        title: 'Welcome aboard!',
        description: 'Your personalized wellness journey begins now.',
        duration: 5000,
      });
      
      // Redirect to home with a small delay to show the success toast
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your preferences. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const { getDataService } = await import('@/services/data-service')
      const dataService = await getDataService()
      
      // Mark as completed even if skipped
      await dataService.updateUser(user.id, {
        personalizationCompleted: true
      })
      
      toast({
        title: 'Onboarding skipped',
        description: 'You can customize your preferences anytime in settings.',
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Skip onboarding error:', error)
      router.push('/dashboard')
    }
  };

  return (
    <OnboardingShell>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ComprehensiveOnboarding 
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      </motion.div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <MedicalDisclaimer />
      </div>
    </OnboardingShell>
  );
}
