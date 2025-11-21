'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

interface WelcomeStepProps {
  onNext: (data: { onboardingType: 'basic' | 'full' }) => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Welcome! Choose your onboarding experience.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Most people choose Quick Start and customize later
        </p>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => onNext({ onboardingType: 'basic' })}
          className="relative w-full p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:shadow-lg transition-all text-left group"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            ⭐ Most Popular
          </div>
          <div className="flex items-start gap-4">
            <Zap className="w-7 h-7 text-blue-600 mt-1 group-hover:opacity-80 transition-opacity" />
            <div>
              <div className="font-bold text-xl mb-1 text-blue-700 dark:text-blue-300">Quick Start</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Just 3 questions • 2 minutes
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNext({ onboardingType: 'full' })}
          className="w-full p-5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-indigo-500 mt-1" />
            <div>
              <div className="font-semibold text-base mb-1">Deep Personalization</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                7 steps • 5-7 minutes • Better recommendations
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
