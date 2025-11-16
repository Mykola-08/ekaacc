'use client';

import { useState } from 'react';
import { Button, Slider, Label } from '@/components/keep';

interface WellnessCheckStepProps {
  onNext: (data: { stressLevel: number; sleepQuality: number; energyLevel: number }) => void;
}

export function WellnessCheckStep({ onNext }: WellnessCheckStepProps) {
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);

  return (
    <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
      <div className="space-y-4 bg-slate-50 dark:bg-slate-900 rounded-xl p-5">
        <div className="text-center mb-3">
          <h3 className="font-semibold text-base">Quick check-in</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tap the number that feels right</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Stress Level</Label>
              <span className="text-2xl">{stressLevel <= 3 ? '😌' : stressLevel <= 6 ? '😐' : '😰'}</span>
            </div>
            <Slider
              value={[stressLevel]}
              onValueChange={([val]) => setStressLevel(val)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Sleep Quality</Label>
              <span className="text-2xl">{sleepQuality <= 3 ? '😴' : sleepQuality <= 6 ? '😊' : '✨'}</span>
            </div>
            <Slider
              value={[sleepQuality]}
              onValueChange={([val]) => setSleepQuality(val)}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Energy Level</Label>
              <span className="text-2xl">{energyLevel <= 3 ? '😩' : energyLevel <= 6 ? '🙂' : '⚡️'}</span>
            </div>
            <Slider
              value={[energyLevel]}
              onValueChange={([val]) => setEnergyLevel(val)}
              max={10}
              step={1}
            />
          </div>
        </div>
      </div>
      <Button onClick={() => onNext({ stressLevel, sleepQuality, energyLevel })} className="w-full">
        Continue
      </Button>
    </div>
  );
}
