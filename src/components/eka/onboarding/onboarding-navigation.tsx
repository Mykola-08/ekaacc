'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface OnboardingNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export function OnboardingNavigation({
  currentStep,
  totalSteps,
  isLoading,
  onBack,
  onNext,
  onComplete,
}: OnboardingNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <Button
        variant="outline"
        onClick={onBack}
        className="gap-2"
        disabled={currentStep === 0}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>

      {currentStep < totalSteps - 1 ? (
        <Button
          onClick={onNext}
          size="lg"
          className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          onClick={onComplete}
          disabled={isLoading}
          size="lg"
          className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 animate-pulse"
        >
          {isLoading ? 'Creating Your Journey...' : '🎉 Complete & Get Started'}
          {!isLoading && <Sparkles className="w-5 h-5" />}
        </Button>
      )}
    </div>
  );
}
