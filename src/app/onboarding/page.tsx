'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user } = useAuth();
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
      await dataService.updateUser(user.id, {
        personalizationCompleted: true,
        personalization: formData,
      });
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
  const CurrentIcon = currentStepData.icon;

  // Calculate progress
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <Card className="relative w-full max-w-2xl shadow-2xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] flex items-center justify-center">
                <CurrentStepComponent 
                  onNext={handleNext} 
                  formData={formData}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => handleNext({})}
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
              >
                {currentStep === 0 ? 'Start Your Journey' : 'Continue'}
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                size="lg"
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 animate-pulse"
              >
                {isLoading ? 'Creating Your Journey...' : '🎉 Complete & Get Started'}
                {!isLoading && <Sparkles className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
