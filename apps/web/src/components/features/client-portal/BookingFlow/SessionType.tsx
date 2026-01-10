import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SessionTypeProps {
  onBack: () => void;
  onNext: (sessionType: any) => void;
}

const sessionTypes = [
  {
    id: 1,
    name: 'Integrated Therapy Session',
    duration: '60 min',
    price: '€90',
    description: 'A deep-dive session where body and mind meet in a fluid dance. We combine kinesiology, emotional release work and gentle somatic techniques.',
    bestFor: ['Chronic tension', 'Emotional blocks', 'Overall balance']
  },
  {
    id: 2,
    name: 'Kinesiology Balance Session',
    duration: '50 min',
    price: '€75',
    description: 'Focusing on the body\'s energy and structural alignment, this session uses kinesiology muscle-checking and subtle corrections.',
    bestFor: ['Physical alignment', 'Energy flow', 'Structural balance']
  },
  {
    id: 3,
    name: 'Body-Mind Reset Massage',
    duration: '60 min',
    price: '€80',
    description: 'A therapeutic massage that goes beyond relaxation: gentle myofascial release, soothing touch and invitation to become aware.',
    bestFor: ['Muscle tension', 'Stress relief', 'Body awareness']
  },
  {
    id: 4,
    name: 'Sleep & Restoration Session',
    duration: '45 min',
    price: '€70',
    description: 'Tailored for those whose nights are restless and days foggy. We combine calming bodywork, guided breathing and light kinesiology.',
    bestFor: ['Sleep issues', 'Fatigue', 'Nervous system reset']
  },
  {
    id: 5,
    name: 'Allergy & Immune Support Session',
    duration: '60 min',
    price: '€85',
    description: 'Using gentle kinesiology, subtle body-signals and supportive modalities, we explore triggers, reactions and underlying patterns.',
    bestFor: ['Allergies', 'Immune support', 'Sensitivity issues']
  },
  {
    id: 6,
    name: 'Relationship & Emotional Clarity',
    duration: '50 min',
    price: '€75',
    description: 'Dive into the landscape of your relationships—inner and outer. Emotional patterns, communication traps, past relational imprints.',
    bestFor: ['Relationship issues', 'Emotional patterns', 'Communication']
  },
  {
    id: 7,
    name: 'Corporate Well-being Mini Session',
    duration: '90 min',
    price: '€120',
    description: 'Designed for professionals: stress relief, posture correction from desk work, rapid emotional reset.',
    bestFor: ['Work stress', 'Desk posture', 'Quick reset']
  }
];

export function SessionType({ onBack, onNext }: SessionTypeProps) {
  const [selected, setSelected] = useState<any>(null);

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
            <h2 className="text-gray-900">Choose Your Session</h2>
            <p className="text-sm text-gray-500">Step 1 of 5</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gray-900 rounded-full" style={{ width: '20%' }} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3 pb-24">
        {sessionTypes.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSelected(session)}
              className={`w-full p-5 rounded-2xl text-left transition-all ${
                selected?.id === session.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`mb-2 ${selected?.id === session.id ? 'text-white' : 'text-gray-900'}`}>
                      {session.name}
                    </p>
                    <p className={`text-sm mb-3 ${selected?.id === session.id ? 'text-gray-300' : 'text-gray-500'}`}>
                      {session.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full ${
                        selected?.id === session.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {session.duration}
                      </span>
                      <span className={`${selected?.id === session.id ? 'text-white' : 'text-gray-900'}`}>
                        {session.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {session.bestFor.map((item, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-full ${
                            selected?.id === session.id
                              ? 'bg-white/10 text-gray-300'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                      selected?.id === session.id
                        ? 'border-white bg-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {selected?.id === session.id && (
                      <div className="w-2 h-2 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      {selected && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            onClick={() => onNext(selected)}
            className="w-full max-w-md mx-auto block bg-gray-900 hover:bg-gray-800 text-white border-0 py-6 rounded-2xl"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}


