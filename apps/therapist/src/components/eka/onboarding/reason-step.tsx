'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ReasonStepProps {
  onNext: (data: { reasonForSeeking: string; previousTherapy: string }) => void;
}

const reasonOptions = [
  { value: 'mental-health', label: 'Mental Wellness', desc: 'Anxiety, stress, or mood', icon: '🧠' },
  { value: 'life-changes', label: 'Life Transition', desc: 'New chapter or change', icon: '🌅' },
  { value: 'personal-growth', label: 'Personal Growth', desc: 'Become my best self', icon: '🌱' },
  { value: 'relationships', label: 'Relationships', desc: 'Connect better with others', icon: '💑' },
  { value: 'work-stress', label: 'Work Balance', desc: 'Career or work stress', icon: '💼' },
  { value: 'other', label: 'Something Else', desc: 'I\'ll share more later', icon: '💭' },
];

export function ReasonStep({ onNext }: ReasonStepProps) {
  const [reasonForSeeking, setReasonForSeeking] = useState('');
  const [previousTherapy, setPreviousTherapy] = useState('');

  return (
    <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
      <div className="space-y-3">
        <div className="grid gap-3">
          {reasonOptions.map((option) => (
            <Label
              key={option.value}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                reasonForSeeking === option.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              <span className="text-3xl">{option.icon}</span>
              <RadioGroupItem
                value={option.value}
                className="mt-0"
              />
              <div className="flex-1">
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
              </div>
            </Label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3">
          {[
            { value: 'no', label: 'First time exploring therapy', icon: '✨' },
            { value: 'yes-helpful', label: 'Yes, it helped me', icon: '💚' },
            { value: 'yes-mixed', label: 'Yes, with mixed results', icon: '🤔' },
          ].map((option) => (
            <Label
              key={option.value}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                previousTherapy === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <RadioGroupItem
                value={option.value}
                className="mt-0"
              />
              <div className="font-medium">{option.label}</div>
            </Label>
          ))}
        </div>
      </div>
      <Button onClick={() => onNext({ reasonForSeeking, previousTherapy })} disabled={!reasonForSeeking || !previousTherapy} className="w-full">
        Continue
      </Button>
    </div>
  );
}
