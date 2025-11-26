'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the auth app's onboarding page
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.ekaacc.com';
    window.location.href = `${authUrl}/onboarding`;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">Redirecting to onboarding...</div>
    </div>
  );
}
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
        router.push('/home');
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
      
      router.push('/home')
    } catch (error) {
      console.error('Skip onboarding error:', error)
      router.push('/home')
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
