import { useState } from 'react';
import { ArrowLeft, Star, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PractitionerProps {
  onBack: () => void;
  onNext: (practitioner: any) => void;
}

const practitioners = [
  { 
    id: 1, 
    name: 'Emma Kowalski', 
    specialty: 'Integrated Therapy & Kinesiology',
    avatar: '👩‍⚕️',
    rating: 4.9,
    reviews: 127,
    experience: '10+ years',
    bio: 'Specializes in integrative approaches that honor the body\'s wisdom and the mind\'s complexity.',
    specializations: ['Kinesiology', 'Somatic Therapy', 'Emotional Release', 'Energy Work'],
    nextAvailable: 'Tomorrow at 2:00 PM'
  },
  { 
    id: 2, 
    name: 'Sarah Mitchell', 
    specialty: 'Body-Mind Integration',
    avatar: '👩',
    rating: 4.8,
    reviews: 98,
    experience: '8 years',
    bio: 'Focuses on the deep connection between physical sensations and emotional states.',
    specializations: ['Massage Therapy', 'Breathwork', 'Myofascial Release'],
    nextAvailable: 'Today at 5:00 PM'
  },
  { 
    id: 3, 
    name: 'Dr. Alex Rivera', 
    specialty: 'Somatic Therapy',
    avatar: '👨‍⚕️',
    rating: 5.0,
    reviews: 156,
    experience: '12+ years',
    bio: 'Combines clinical expertise with holistic healing approaches for transformative results.',
    specializations: ['Somatic Therapy', 'Trauma Work', 'Kinesiology', 'Mind-Body Medicine'],
    nextAvailable: 'Nov 16 at 10:00 AM'
  }
];

export function Practitioner({ onBack, onNext }: PractitionerProps) {
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
            <h2 className="text-gray-900">Choose Your Practitioner</h2>
            <p className="text-sm text-gray-500">Step 3 of 5</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gray-900 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-24">
        {practitioners.map((practitioner) => (
          <motion.div
            key={practitioner.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSelected(practitioner)}
              className={`w-full p-5 rounded-2xl text-left transition-all ${
                selected?.id === practitioner.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {practitioner.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`mb-1 ${selected?.id === practitioner.id ? 'text-white' : 'text-gray-900'}`}>
                        {practitioner.name}
                      </p>
                      <p className={`text-sm mb-2 ${selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-500'}`}>
                        {practitioner.specialty}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${selected?.id === practitioner.id ? 'fill-white text-white' : 'fill-gray-900 text-gray-900'}`} />
                          <span className={selected?.id === practitioner.id ? 'text-white' : 'text-gray-900'}>
                            {practitioner.rating}
                          </span>
                          <span className={selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-500'}>
                            ({practitioner.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className={`w-4 h-4 ${selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-500'}`} />
                          <span className={selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-500'}>
                            {practitioner.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selected?.id === practitioner.id
                        ? 'border-white bg-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {selected?.id === practitioner.id && (
                      <div className="w-2 h-2 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>

                <p className={`text-sm ${selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-600'}`}>
                  {practitioner.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {practitioner.specializations.map((spec, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full ${
                        selected?.id === practitioner.id
                          ? 'bg-white/10 text-gray-300'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-2 text-sm ${
                  selected?.id === practitioner.id ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>Next available: {practitioner.nextAvailable}</span>
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


