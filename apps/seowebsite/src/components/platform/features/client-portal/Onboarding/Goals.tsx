import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { CheckCircle2, Sparkles, ArrowRight, ArrowLeft, Heart, Brain, Moon, Zap, Scale, Smile } from 'lucide-react';

interface GoalsProps {
  onNext: (selectedGoals: string[], useTemplates: boolean) => void;
  onBack: () => void;
}

const wellnessGoals = [
  { 
    id: 1, 
    label: 'Reduce stress and anxiety', 
    icon: Brain,
    color: 'from-purple-500 to-purple-600',
    description: 'Find calm and manage daily stress'
  },
  { 
    id: 2, 
    label: 'Manage physical pain', 
    icon: Heart,
    color: 'from-red-500 to-red-600',
    description: 'Relief from chronic or acute discomfort'
  },
  { 
    id: 3, 
    label: 'Improve emotional well-being', 
    icon: Smile,
    color: 'from-green-500 to-green-600',
    description: 'Enhance mood and emotional balance'
  },
  { 
    id: 4, 
    label: 'Enhance sleep quality', 
    icon: Moon,
    color: 'from-blue-500 to-blue-600',
    description: 'Better rest and recovery'
  },
  { 
    id: 5, 
    label: 'Increase energy and vitality', 
    icon: Zap,
    color: 'from-yellow-500 to-yellow-600',
    description: 'Boost daily energy levels'
  },
  { 
    id: 6, 
    label: 'Better work-life balance', 
    icon: Scale,
    color: 'from-teal-500 to-teal-600',
    description: 'Create healthy boundaries'
  }
];

const templateGoals = {
  'Reduce stress and anxiety': [
    { title: 'Daily Mindfulness Practice', description: '10 minutes of meditation each morning', totalDays: 21, category: 'Mindfulness' },
    { title: 'Breathing Exercises', description: '4-7-8 breathing when feeling stressed', totalDays: 14, category: 'Stress Relief' }
  ],
  'Manage physical pain': [
    { title: 'Gentle Movement', description: '15 minutes of stretching daily', totalDays: 21, category: 'Physical Wellness' },
    { title: 'Body Awareness', description: 'Notice and release tension throughout the day', totalDays: 14, category: 'Pain Management' }
  ],
  'Improve emotional well-being': [
    { title: 'Gratitude Journaling', description: 'Write 3 things you\'re grateful for each day', totalDays: 21, category: 'Emotional Health' },
    { title: 'Emotional Check-ins', description: 'Pause 3x daily to notice how you feel', totalDays: 14, category: 'Self-Awareness' }
  ],
  'Enhance sleep quality': [
    { title: 'Sleep Routine', description: 'Wind-down routine starting at 10 PM', totalDays: 21, category: 'Sleep Health' },
    { title: 'Digital Sunset', description: 'No screens 1 hour before bed', totalDays: 14, category: 'Sleep Hygiene' }
  ],
  'Increase energy and vitality': [
    { title: 'Hydration Habit', description: 'Drink 8 glasses of water daily', totalDays: 21, category: 'Nutrition' },
    { title: 'Movement Breaks', description: '5-minute movement every 2 hours', totalDays: 14, category: 'Energy' }
  ],
  'Better work-life balance': [
    { title: 'Boundary Setting', description: 'Leave work at work - no emails after 6 PM', totalDays: 21, category: 'Boundaries' },
    { title: 'Self-care Time', description: '30 minutes daily for activities you enjoy', totalDays: 14, category: 'Self-Care' }
  ]
};

export function Goals({ onNext, onBack }: GoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [useTemplates, setUseTemplates] = useState<boolean | null>(null);

  const toggleGoal = (label: string) => {
    if (selectedGoals.includes(label)) {
      setSelectedGoals(selectedGoals.filter(g => g !== label));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, label]);
      }
    }
  };

  // Template selection screen
  if (selectedGoals.length > 0 && useTemplates === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex flex-col relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-green-200/30 to-teal-200/20 rounded-full blur-3xl" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-gray-900 mb-3">Quick Start Your Journey</h1>
              <p className="text-gray-600 text-lg">
                Would you like us to create starter goals based on your selections?
              </p>
            </div>

            {/* Preview Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200/60 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700">You'll get personalized action goals like:</p>
              </div>
              
              <div className="space-y-4">
                {selectedGoals.slice(0, 2).map((goal, goalIdx) => {
                  const templates = templateGoals[goal as keyof typeof templateGoals];
                  if (!templates || templates.length === 0) return null;
                  
                  return (
                    <motion.div
                      key={goal}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: goalIdx * 0.1 }}
                      className="space-y-3"
                    >
                      {templates.map((template, idx) => (
                        <div key={idx} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 mb-1">{template.title}</p>
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="px-2 py-1 bg-white rounded-md">{template.totalDays} days</span>
                                <span>{template.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </div>

              {selectedGoals.length > 2 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  + {(selectedGoals.length - 2) * 2} more goals based on your other selections
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setUseTemplates(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white h-14 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Yes, use templates
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => setUseTemplates(false)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-gray-200 h-14 rounded-xl"
              >
                I'll create my own
              </Button>
            </div>

            <button
              onClick={() => {
                setSelectedGoals([]);
                setUseTemplates(null);
              }}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Change my goal selections
            </button>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="pb-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-900 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
          <p className="text-xs text-gray-500">Step 2 of 4</p>
        </div>
      </div>
    );
  }

  // Goal selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-green-200/30 to-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-gray-900 mb-3">What are your wellness goals?</h1>
            <p className="text-gray-600 text-lg mb-6">
              Select up to 3 goals to help us personalize your experience
            </p>
            
            {selectedGoals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedGoals.length} of 3 selected</span>
              </motion.div>
            )}
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {wellnessGoals.map((goal, index) => {
              const isSelected = selectedGoals.includes(goal.label);
              const Icon = goal.icon;
              const isDisabled = !isSelected && selectedGoals.length >= 3;
              
              return (
                <motion.button
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => !isDisabled && toggleGoal(goal.label)}
                  disabled={isDisabled}
                  className={`relative p-6 rounded-2xl text-left transition-all group ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-xl scale-[1.02]'
                      : isDisabled
                      ? 'bg-white/40 border border-gray-200/40 opacity-50 cursor-not-allowed'
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-lg hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-br ${goal.color}`
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {goal.label}
                      </h3>
                      <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                        {goal.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-gray-900" />
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
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
              onClick={() => {
                if (selectedGoals.length === 0) {
                  onNext([], false);
                } else {
                  // Will show template selection screen
                  setUseTemplates(null);
                }
              }}
              disabled={selectedGoals.length === 0}
              className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="pb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
        <p className="text-xs text-gray-500">Step 2 of 4</p>
      </div>
    </div>
  );
}


