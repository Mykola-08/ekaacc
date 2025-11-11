'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface FocusAreasStepProps {
  onNext: (data: { goals: string[] }) => void;
}

const goalOptions = [
  'Reduce Stress',
  'Sleep Better',
  'Feel More Energized',
  'Emotional Balance',
  'Personal Growth',
  'Build Confidence',
];

export function FocusAreasStep({ onNext }: FocusAreasStepProps) {
  const [goals, setGoals] = useState<string[]>([]);

  const handleGoalToggle = (goal: string) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  return (
    <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {goalOptions.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => {
                if (goals.length >= 3 && !goals.includes(goal)) {
                  return;
                }
                handleGoalToggle(goal);
              }}
              disabled={goals.length >= 3 && !goals.includes(goal)}
              className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                goals.includes(goal)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                  : goals.length >= 3
                  ? 'border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  goals.includes(goal)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}>
                  {goals.includes(goal) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{goal}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
          {goals.length}/3 selected
          {goals.length === 0 && ' • Select at least 1'}
        </div>
        <Button onClick={() => onNext({ goals })} disabled={goals.length === 0} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
