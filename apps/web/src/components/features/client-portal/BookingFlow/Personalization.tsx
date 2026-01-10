import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PersonalizationProps {
  sessionType: any;
  onBack: () => void;
  onNext: (data: any) => void;
}

export function Personalization({ sessionType, onBack, onNext }: PersonalizationProps) {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [concerns, setConcerns] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);

  const preferenceOptions = [
    'Gentle approach',
    'Deep tissue work',
    'Focus on breathing',
    'Quiet environment',
    'Conversational',
    'Energy work',
    'Stretching included',
    'Aromatherapy'
  ];

  const togglePreference = (pref: string) => {
    setPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const canContinue = isFirstTime !== null && concerns.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-gray-900">Personalize Your Session</h2>
            <p className="text-sm text-gray-500">Step 2 of 5</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gray-900 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Session Info */}
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-1">Selected Session</p>
          <p className="text-gray-900">{sessionType.name}</p>
          <p className="text-sm text-gray-500">{sessionType.duration} • {sessionType.price}</p>
        </div>

        {/* First Time Question */}
        <div>
          <h3 className="text-gray-900 mb-3">Is this your first session with us?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsFirstTime(true)}
              className={`p-4 rounded-2xl transition-all ${
                isFirstTime === true
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              Yes, first time
            </button>
            <button
              onClick={() => setIsFirstTime(false)}
              className={`p-4 rounded-2xl transition-all ${
                isFirstTime === false
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              No, returning
            </button>
          </div>
        </div>

        {/* Main Concerns */}
        <div>
          <h3 className="text-gray-900 mb-3">What would you like to focus on?</h3>
          <Textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="E.g., chronic shoulder tension, sleep issues, stress management..."
            className="min-h-32 resize-none border-0 bg-white rounded-2xl"
          />
          <p className="text-xs text-gray-500 mt-2">
            This helps your practitioner prepare for your session
          </p>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-gray-900 mb-3">Session Preferences (Optional)</h3>
          <div className="grid grid-cols-2 gap-2">
            {preferenceOptions.map((pref) => (
              <button
                key={pref}
                onClick={() => togglePreference(pref)}
                className={`p-3 rounded-2xl text-sm transition-all ${
                  preferences.includes(pref)
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {canContinue && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            onClick={() => onNext({ isFirstTime, concerns, preferences })}
            className="w-full max-w-md mx-auto block bg-gray-900 hover:bg-gray-800 text-white border-0 py-6 rounded-2xl"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}


