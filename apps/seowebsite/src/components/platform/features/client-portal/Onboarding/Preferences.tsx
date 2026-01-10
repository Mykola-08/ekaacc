import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { ArrowRight, ArrowLeft, Search, X, Check, User, Briefcase, Clock, Users } from 'lucide-react';
import { sessionTypes } from '@/data/sessionTypes';

interface PreferencesProps {
  onNext: (preferences: any) => void;
  onBack: () => void;
}

const practitioners = [
  { id: 'emma', name: 'Emma Kowalski', specialty: 'Integrated Therapy', experience: '15+ years' },
  { id: 'sarah', name: 'Sarah Mitchell', specialty: 'Kinesiology', experience: '12+ years' },
  { id: 'james', name: 'James Chen', specialty: 'Body-Mind Reset', experience: '10+ years' },
  { id: 'maria', name: 'Maria Santos', specialty: 'Sleep & Restoration', experience: '8+ years' },
];

const sessionPreferenceOptions = [
  { 
    id: 'time-morning', 
    label: 'Morning Sessions', 
    icon: Clock,
    description: '8 AM - 12 PM'
  },
  { 
    id: 'time-afternoon', 
    label: 'Afternoon Sessions', 
    icon: Clock,
    description: '12 PM - 5 PM'
  },
  { 
    id: 'time-evening', 
    label: 'Evening Sessions', 
    icon: Clock,
    description: '5 PM - 8 PM'
  },
  { 
    id: 'duration-short', 
    label: 'Quick Sessions', 
    icon: Clock,
    description: '30-45 minutes'
  },
  { 
    id: 'duration-standard', 
    label: 'Standard Sessions', 
    icon: Clock,
    description: '60 minutes'
  },
  { 
    id: 'duration-extended', 
    label: 'Extended Sessions', 
    icon: Clock,
    description: '90+ minutes'
  },
];

export function Preferences({ onNext, onBack }: PreferencesProps) {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [selectedPractitioners, setSelectedPractitioners] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSession = (sessionId: string) => {
    if (selectedSessions.includes(sessionId)) {
      setSelectedSessions(selectedSessions.filter(id => id !== sessionId));
    } else {
      setSelectedSessions([...selectedSessions, sessionId]);
    }
  };

  const togglePractitioner = (practitionerId: string) => {
    if (selectedPractitioners.includes(practitionerId)) {
      setSelectedPractitioners(selectedPractitioners.filter(id => id !== practitionerId));
    } else {
      setSelectedPractitioners([...selectedPractitioners, practitionerId]);
    }
  };

  const togglePreference = (preferenceId: string) => {
    if (selectedPreferences.includes(preferenceId)) {
      setSelectedPreferences(selectedPreferences.filter(id => id !== preferenceId));
    } else {
      setSelectedPreferences([...selectedPreferences, preferenceId]);
    }
  };

  const handleContinue = () => {
    onNext({
      sessionTypes: selectedSessions,
      practitioners: selectedPractitioners,
      timePreferences: selectedPreferences,
      notes: notes
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tr from-teal-200/20 to-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-gray-900 mb-3">Customize your experience</h1>
            <p className="text-gray-600 text-lg">
              Help us tailor your wellness journey to your preferences
            </p>
          </div>

          {/* Session Types */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Interested in these sessions?</h3>
                <p className="text-sm text-gray-600">Select the types you'd like to explore</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionTypes.slice(0, 6).map((session, index) => {
                const isSelected = selectedSessions.includes(String(session.id));
                
                return (
                  <motion.button
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleSession(String(session.id))}
                    className={`relative p-5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className={`mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {session.name}
                        </h4>
                        <p className={`text-sm mb-2 line-clamp-2 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                          {session.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`px-2 py-1 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                            {session.duration} min
                          </span>
                          <span className={isSelected ? 'text-white/80' : 'text-gray-600'}>
                            €{session.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white' : 'bg-gray-100'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-gray-900" />}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Practitioners */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Preferred practitioners</h3>
                <p className="text-sm text-gray-600">Choose who you'd like to work with (optional)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practitioners.map((practitioner, index) => {
                const isSelected = selectedPractitioners.includes(practitioner.id);
                
                return (
                  <motion.button
                    key={practitioner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => togglePractitioner(practitioner.id)}
                    className={`relative p-5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-gray-900 to-gray-700'
                      }`}>
                        <User className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {practitioner.name}
                        </h4>
                        <p className={`text-sm mb-1 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                          {practitioner.specialty}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-500'}`}>
                          {practitioner.experience}
                        </p>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white' : 'bg-gray-100'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-gray-900" />}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Session Preferences */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900">Session preferences</h3>
                <p className="text-sm text-gray-600">When and how long do you prefer?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sessionPreferenceOptions.map((pref, index) => {
                const isSelected = selectedPreferences.includes(pref.id);
                const Icon = pref.icon;
                
                return (
                  <motion.button
                    key={pref.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => togglePreference(pref.id)}
                    className={`relative p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ml-auto ${
                        isSelected ? 'bg-white' : 'bg-gray-100'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-gray-900" />}
                      </div>
                    </div>
                    <p className={`text-sm mb-0.5 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                      {pref.label}
                    </p>
                    <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                      {pref.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-12">
            <label className="text-gray-900 mb-3 block">
              Anything else we should know? (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share any preferences, concerns, or questions..."
              className="w-full h-32 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 transition-all text-gray-900 placeholder:text-gray-400"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/80 hover:bg-white border-gray-200 h-12 px-6 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleContinue}
              className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-6 rounded-xl shadow-lg"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-0 right-0 text-center z-20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
        <p className="text-xs text-gray-500">Step 3 of 4</p>
      </div>
    </div>
  );
}

