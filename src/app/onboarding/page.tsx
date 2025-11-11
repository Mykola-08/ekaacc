'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { OnboardingShell } from '@/components/eka/onboarding/onboarding-shell';
import { OnboardingStep } from '@/components/eka/onboarding/onboarding-step';
import { OnboardingNavigation } from '@/components/eka/onboarding/onboarding-navigation';
import { WelcomeStep } from '@/components/eka/onboarding/welcome-step';
import { FocusAreasStep } from '@/components/eka/onboarding/focus-areas-step';
import { ReasonStep } from '@/components/eka/onboarding/reason-step';
import { WellnessCheckStep } from '@/components/eka/onboarding/wellness-check-step';
import { ScheduleStep } from '@/components/eka/onboarding/schedule-step';
import { CommunicationStep } from '@/components/eka/onboarding/communication-step';
import { FinalStep } from '@/components/eka/onboarding/final-step';
import {
  Sparkles,
  Target,
  Heart,
  Brain,
  CheckCircle2,
  Clock,
  MessageCircle,
  Activity,
} from 'lucide-react';

const steps = [
  {
    title: 'Welcome to EKA',
    description: 'Let\'s personalize your experience',
    icon: Sparkles,
    component: WelcomeStep,
  },
  {
    title: 'Your Focus Areas',
    description: 'Pick 1-3 goals',
    icon: Target,
    component: FocusAreasStep,
  },
  {
    title: 'What Brings You Here',
    description: 'Help us understand',
    icon: Heart,
    component: ReasonStep,
  },
  {
    title: 'Wellness Check',
    description: 'Quick self-assessment',
    icon: Brain,
    component: WellnessCheckStep,
  },
  {
    title: 'Your Schedule',
    description: 'When works best for you',
    icon: Clock,
    component: ScheduleStep,
  },
  {
    title: 'Communication',
    description: 'Your preferred style',
    icon: MessageCircle,
    component: CommunicationStep,
  },
  {
    title: 'Almost There!',
    description: 'Just a few more details',
    icon: Activity,
    component: FinalStep, // Placeholder for now
  },
  {
    title: 'All Set!',
    description: 'Your journey begins',
    icon: CheckCircle2,
    component: FinalStep,
  },
];

export default function OnboardingPage() {
  const { user, refreshAppUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
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
      await dataService.updateUser(user.uid, {
        personalizationCompleted: true,
        personalization: formData,
      });
      await refreshAppUser();
      toast({
        title: '🎉 Welcome aboard!',
        description: 'Your personalized dashboard is ready.',
      });
      router.push('/home');
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

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  return (
    <OnboardingShell>
      <OnboardingStep
        currentStep={currentStep}
        totalSteps={steps.length}
        title={currentStepData.title}
        description={currentStepData.description}
        icon={currentStepData.icon}
      >
        <CurrentStepComponent onNext={handleNext} formData={formData} />
      </OnboardingStep>
      <OnboardingNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        isLoading={isLoading}
        onBack={handleBack}
        onNext={() => {}}
        onComplete={handleComplete}
      />
    </OnboardingShell>
  );
}
