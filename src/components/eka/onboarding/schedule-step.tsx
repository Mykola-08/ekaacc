'use client';

import { useState } from 'react';
import { Button, Radio, Label } from '@/components/keep';

interface ScheduleStepProps {
  onNext: (data: { preferredDays: string[]; preferredTime: string; sessionFrequency: string }) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const timeOptions = [
  { value: 'morning', label: 'Morning', desc: '6AM - 12PM', icon: '🌅', popular: false },
  { value: 'afternoon', label: 'Afternoon', desc: '12PM - 5PM', icon: '☀️', popular: true },
  { value: 'evening', label: 'Evening', desc: '5PM - 9PM', icon: '🌆', popular: false },
];

const frequencyOptions = [
  { value: 'weekly', label: 'Weekly', desc: 'Regular progress', icon: '📅', recommended: true },
  { value: 'biweekly', label: 'Bi-weekly', desc: 'Steady pace', icon: '📆', recommended: false },
  { value: 'monthly', label: 'Monthly', desc: 'Gentle support', icon: '🗓️', recommended: false },
];

export function ScheduleStep({ onNext }: ScheduleStepProps) {
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState('');
  const [sessionFrequency, setSessionFrequency] = useState('');

  const handleDayToggle = (day: string) => {
    setPreferredDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayToggle(weekDays[index])}
              className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold hover:scale-105 ${
                preferredDays.includes(weekDays[index])
                  ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid gap-3">
          {timeOptions.map((option) => (
            <Label
              key={option.value}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                preferredTime === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  Popular
                </div>
              )}
              <span className="text-3xl">{option.icon}</span>
              <Radio
                name="preferredTime"
                value={option.value}
                checked={preferredTime === option.value}
                onChange={() => setPreferredTime(option.value)}
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
          {frequencyOptions.map((option) => (
            <Label
              key={option.value}
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                sessionFrequency === option.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
              }`}
            >
              {option.recommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  ✓ Recommended
                </div>
              )}
              <span className="text-3xl">{option.icon}</span>
              <Radio
                name="sessionFrequency"
                value={option.value}
                checked={sessionFrequency === option.value}
                onChange={() => setSessionFrequency(option.value)}
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
      <Button onClick={() => onNext({ preferredDays, preferredTime, sessionFrequency })} disabled={!preferredTime || !sessionFrequency} className="w-full">
        Continue
      </Button>
    </div>
  );
}
