'use client';

import { useState } from 'react';
import { Button } from '@/components/platform/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/platform/ui/radio-group';
import { Label } from '@/components/platform/ui/label';

interface CommunicationStepProps {
  onNext: (data: { communicationStyle: string }) => void;
}

const communicationStyles = [
  { value: 'empathetic', label: '💙 Warm & Supportive', desc: 'Gentle, encouraging approach', popular: true },
  { value: 'direct', label: '🎯 Direct & Clear', desc: 'Straight to the point', popular: false },
  { value: 'casual', label: '😊 Relaxed & Friendly', desc: 'Easy-going conversation', popular: false },
];

export function CommunicationStep({ onNext }: CommunicationStepProps) {
  const [communicationStyle, setCommunicationStyle] = useState('');

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-4">
        <div className="space-y-3">
          {communicationStyles.map((style) => (
            <Label
              key={style.value}
              className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                communicationStyle === style.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              {style.popular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  ⭐ Most Chosen
                </div>
              )}
              <span className="text-3xl">{style.label.split(' ')[0]}</span>
              <RadioGroupItem
                value={style.value}
                className="mt-0"
              />
              <div className="flex-1">
                <div className="font-semibold text-base">{style.label.split(' ').slice(1).join(' ')}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{style.desc}</div>
              </div>
            </Label>
          ))}
        </div>
      </div>
      <Button onClick={() => onNext({ communicationStyle })} disabled={!communicationStyle} className="w-full">
        Continue
      </Button>
    </div>
  );
}
