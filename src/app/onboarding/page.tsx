'use client';

import { Button, Card, CardContent, Input, Label, Select, SelectContent, SelectItem, SelectValue, Slider, Switch, Textarea } from '@/components/keep';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Heart, 
  Brain, 
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  Activity,
  Zap,
  Shield,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
;
;
;

const basicSteps = [
  {
    title: 'Welcome to EKA',
    description: 'Let\'s personalize your experience',
    icon: Sparkles,
  },
  {
    title: 'Your Main Goal',
    description: 'What matters most to you?',
    icon: Target,
  },
  {
    title: 'Session Style',
    description: 'How you\'d like to connect',
    icon: Calendar,
  },
  {
    title: 'Ready!',
    description: 'You\'re all set',
    icon: CheckCircle2,
  },
];

const fullSteps = [
  {
    title: 'Welcome to EKA',
    description: 'Choose your path',
    icon: Sparkles,
  },
  {
    title: 'Your Focus Areas',
    description: 'Pick 1-3 goals', // Miller's Law: 5±2 items
    icon: Target,
  },
  {
    title: 'What Brings You Here',
    description: 'Help us understand',
    icon: Heart,
  },
  {
    title: 'Wellness Check',
    description: 'Quick self-assessment',
    icon: Brain,
  },
  {
    title: 'Your Schedule',
    description: 'When works best for you',
    icon: Clock,
  },
  {
    title: 'Communication',
    description: 'Your preferred style',
    icon: MessageCircle,
  },
  {
    title: 'Almost There!',
    description: 'Just a few more details',
    icon: Activity,
  },
  {
    title: 'All Set!',
    description: 'Your journey begins',
    icon: CheckCircle2,
  },
];

export default function OnboardingPage() {
  const { user, appUser, refreshAppUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [onboardingType, setOnboardingType] = useState<'basic' | 'full' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Basic onboarding data
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [preferredSessionType, setPreferredSessionType] = useState('');

  // Full onboarding data
  const [goals, setGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [reasonForSeeking, setReasonForSeeking] = useState('');
  const [previousTherapy, setPreviousTherapy] = useState('');
  const [wellnessFocus, setWellnessFocus] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState('');
  const [sessionFrequency, setSessionFrequency] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [feedbackPreference, setFeedbackPreference] = useState('');
  const [supportSystem, setSupportSystem] = useState<string[]>([]);
  const [therapyApproach, setTherapyApproach] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const steps = onboardingType === 'basic' ? basicSteps : fullSteps;

  const goalOptions = [
    'Reduce Stress',
    'Sleep Better',
    'Feel More Energized',
    'Emotional Balance',
    'Personal Growth',
    'Build Confidence',
  ];

  const wellnessFocusOptions = [
    'Mental Health',
    'Physical Wellness',
    'Emotional Balance',
  ];

  const sessionTypes = [
    { value: 'virtual', label: '💻 Virtual', desc: 'From anywhere you feel comfortable', popular: true },
    { value: 'in-person', label: '🤝 In-Person', desc: 'Face-to-face connection', popular: false },
    { value: 'hybrid', label: '🔄 Flexible', desc: 'Mix of both options', popular: false },
  ];

  const communicationStyles = [
    { value: 'empathetic', label: '💙 Warm & Supportive', desc: 'Gentle, encouraging approach', popular: true },
    { value: 'direct', label: '🎯 Direct & Clear', desc: 'Straight to the point', popular: false },
    { value: 'casual', label: '😊 Relaxed & Friendly', desc: 'Easy-going conversation', popular: false },
  ];

  const therapyApproaches = [
    { value: 'integrative', label: '🌟 Personalized Blend', desc: 'Tailored mix of proven methods', recommended: true },
    { value: 'cbt', label: '🧠 Cognitive Behavioral', desc: 'Focus on thoughts and actions', recommended: false },
    { value: 'mindfulness', label: '🧘 Mindfulness-Based', desc: 'Present-moment awareness', recommended: false },
  ];

  const supportSystemOptions = [
    'Family',
    'Friends',
    'Partner',
    'Professional Support',
    'Building My Support Network',
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleGoalToggle = (goal: string) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleWellnessFocusToggle = (focus: string) => {
    setWellnessFocus(prev =>
      prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus]
    );
  };

  const handleSupportToggle = (support: string) => {
    setSupportSystem(prev =>
      prev.includes(support) ? prev.filter(s => s !== support) : [...prev, support]
    );
  };

  const handleDayToggle = (day: string) => {
    setPreferredDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to complete onboarding.',
      });
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const { getDataService } = await import('@/services/data-service');
      const dataService = await getDataService();
      
      const personalizationData = onboardingType === 'basic' 
        ? {
            primaryGoal,
            communicationStyle: communicationStyle as 'formal' | 'casual' | 'empathetic' | 'direct' | undefined,
          }
        : {
            therapeuticGoals: customGoal ? [...goals, customGoal] : goals,
            primaryGoal: primaryGoal || goals[0],
            currentChallenges: reasonForSeeking ? [reasonForSeeking] : undefined,
            previousTherapyExperience: previousTherapy !== 'no',
            previousTherapyTypes: previousTherapy !== 'no' ? [previousTherapy] : undefined,
            mentalHealthGoals: wellnessFocus,
            lifestyleFactors: {
              workStressLevel: stressLevel as 1 | 2 | 3 | 4 | 5,
              sleepQuality: sleepQuality as 1 | 2 | 3 | 4 | 5,
            },
            communicationStyle: communicationStyle as 'formal' | 'casual' | 'empathetic' | 'direct' | undefined,
            preferredApproaches: therapyApproach ? [therapyApproach] : undefined,
          };

      await dataService.updateUser(user.uid, {
        personalizationCompleted: true,
        personalization: personalizationData,
      });

      await refreshAppUser();

      toast({
        title: '🎉 Welcome aboard!',
        description: 'Your personalized dashboard is ready.',
      });

      router.push('/home');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your preferences. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;

  const renderBasicStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Welcome! Choose your onboarding experience.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Most people choose Quick Start and customize later
              </p>
            </div>
            <div className="space-y-4">
              {/* Decoy Effect: Make Quick Start most appealing with visual prominence */}
              <button
                onClick={() => setOnboardingType('basic')}
                className="relative w-full p-6 rounded-xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:shadow-lg transition-all text-left group"
              >
                {/* Social Proof Badge - Von Restorff Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ Most Popular
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-7 h-7 text-blue-600 mt-1 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-xl mb-1 text-blue-700 dark:text-blue-300">Quick Start</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Just 3 questions • 2 minutes
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3" />
                      Start using EKA immediately
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setOnboardingType('full')}
                className="w-full p-5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-indigo-500 mt-1" />
                  <div>
                    <div className="font-semibold text-base mb-1">Deep Personalization</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      7 steps • 5-7 minutes • Better recommendations
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      
      case 1:
        const basicGoals = [
          { value: 'Stress Management', icon: '😌', desc: 'Feel calmer daily', color: 'blue' },
          { value: 'Better Sleep', icon: '😴', desc: 'Rest better tonight', color: 'indigo' },
          { value: 'Mental Clarity', icon: '🧠', desc: 'Think more clearly', color: 'purple' },
          { value: 'Emotional Support', icon: '💙', desc: 'Process feelings', color: 'blue' },
          { value: 'Personal Growth', icon: '🌱', desc: 'Become your best self', color: 'green' },
          { value: 'Other', icon: '💭', desc: 'Something else', color: 'slate' },
        ];

        return (
          <div className="space-y-6 w-full">
            <div className="space-y-3">
              {/* Priming: Positive framing */}
              <Label className="text-base font-semibold">What would you like to improve?</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose what matters most to you right now
              </p>
              <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal}>
                <div className="grid gap-3">
                  {basicGoals.map((goal) => (
                    <label
                      key={goal.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                        primaryGoal === goal.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-3xl">{goal.icon}</span>
                      <RadioGroupItem value={goal.value} id={goal.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-base">{goal.value}</div>
                        {/* Nudge: Benefit-focused micro-copy */}
                        <div className="text-sm text-slate-500 dark:text-slate-400">{goal.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              {/* Social Proof Priming */}
              <div className="text-center mb-2">
                <Label className="text-base font-semibold">How would you like to connect?</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  85% of our members prefer virtual sessions
                </p>
              </div>
              <RadioGroup value={preferredSessionType} onValueChange={setPreferredSessionType}>
                <div className="space-y-3">
                  {sessionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                        preferredSessionType === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {/* Von Restorff Effect: Highlight popular choice */}
                      {type.popular && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Popular
                        </div>
                      )}
                      <span className="text-3xl">{type.label.split(' ')[0]}</span>
                      <RadioGroupItem value={type.value} id={type.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-base">{type.label.split(' ').slice(1).join(' ')}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{type.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">You're all set!</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your personalized dashboard is ready. You can update your preferences anytime from settings.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderFullStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Let's create a deeply personalized wellness experience for you.
            </p>
            <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This detailed questionnaire helps us understand you better and provide tailored support. 
                All information is confidential and can be updated anytime.
              </p>
            </div>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Let's Begin
            </Button>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {/* Miller's Law: Limit to 5±2 items, Progressive Disclosure */}
              <Label className="text-base font-semibold">Choose 1-3 focus areas</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pick your top priorities • You can adjust these later
              </p>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal, index) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => {
                      if (goals.length >= 3 && !goals.includes(goal)) {
                        // Feedback loop: Immediate visual feedback
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
              {/* Feedback loop: Show selection count */}
              <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                {goals.length}/3 selected
                {goals.length === 0 && ' • Select at least 1'}
              </div>
            </div>
          </div>
        );

      case 2:
        const reasonOptions = [
          { value: 'mental-health', label: 'Mental Wellness', desc: 'Anxiety, stress, or mood', icon: '🧠' },
          { value: 'life-changes', label: 'Life Transition', desc: 'New chapter or change', icon: '🌅' },
          { value: 'personal-growth', label: 'Personal Growth', desc: 'Become my best self', icon: '🌱' },
          { value: 'relationships', label: 'Relationships', desc: 'Connect better with others', icon: '💑' },
          { value: 'work-stress', label: 'Work Balance', desc: 'Career or work stress', icon: '💼' },
          { value: 'other', label: 'Something Else', desc: 'I\'ll share more later', icon: '💭' },
        ];

        return (
          <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {/* Positive framing: "What brings you here" instead of "What's wrong" */}
              <Label className="text-base font-semibold">What brings you to EKA?</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose what resonates most with you right now
              </p>
              <RadioGroup value={reasonForSeeking} onValueChange={setReasonForSeeking}>
                <div className="grid gap-3">
                  {reasonOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                        reasonForSeeking === option.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Have you tried therapy before?</Label>
              <RadioGroup value={previousTherapy} onValueChange={setPreviousTherapy}>
                <div className="grid gap-3">
                  {[
                    { value: 'no', label: 'First time exploring therapy', icon: '✨' },
                    { value: 'yes-helpful', label: 'Yes, it helped me', icon: '💚' },
                    { value: 'yes-mixed', label: 'Yes, with mixed results', icon: '🤔' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        previousTherapy === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0" />
                      <div className="font-medium">{option.label}</div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {/* Miller's Law: Reduced from 6 to 3 options */}
              <Label className="text-base font-semibold">What areas would you like support with?</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pick what's most important right now
              </p>
              <div className="grid gap-3">
                {wellnessFocusOptions.map((focus) => (
                  <button
                    key={focus}
                    type="button"
                    onClick={() => handleWellnessFocusToggle(focus)}
                    className={`p-5 rounded-xl border-2 transition-all text-left hover:scale-[1.01] ${
                      wellnessFocus.includes(focus)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        wellnessFocus.includes(focus)
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-300'
                      }`}>
                        {wellnessFocus.includes(focus) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-semibold text-base">{focus}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Anchors: Use emoji indicators for scales */}
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
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setStressLevel(level)}
                        className={`p-3 rounded-lg border-2 transition-all font-bold text-sm ${
                          stressLevel === level
                            ? 'border-red-500 bg-red-500 text-white scale-110'
                            : 'border-slate-300 dark:border-slate-600 hover:border-red-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">Sleep Quality</Label>
                    <span className="text-2xl">{sleepQuality <= 3 ? '😴' : sleepQuality <= 6 ? '😊' : '✨'}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSleepQuality(level)}
                        className={`p-3 rounded-lg border-2 transition-all font-bold text-sm ${
                          sleepQuality === level
                            ? 'border-blue-500 bg-blue-500 text-white scale-110'
                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
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

        return (
          <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-3">
              <Label className="text-base font-semibold">When works best for you?</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select your preferred days (optional)
              </p>
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
              <Label className="text-base font-semibold">Preferred time of day</Label>
              <RadioGroup value={preferredTime} onValueChange={setPreferredTime}>
                <div className="grid gap-3">
                  {timeOptions.map((option) => (
                    <label
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
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">How often would you like sessions?</Label>
              <RadioGroup value={sessionFrequency} onValueChange={setSessionFrequency}>
                <div className="grid gap-3">
                  {frequencyOptions.map((option) => (
                    <label
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
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="text-center mb-2">
                <Label className="text-base font-semibold">How would you like to communicate?</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose what feels most comfortable
                </p>
              </div>
              <RadioGroup value={communicationStyle} onValueChange={setCommunicationStyle}>
                <div className="space-y-3">
                  {communicationStyles.map((style) => (
                    <label
                      key={style.value}
                      className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
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
                      <RadioGroupItem value={style.value} id={style.value} className="mt-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-base">{style.label.split(' ').slice(1).join(' ')}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{style.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 w-full max-h-[500px] overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="text-center mb-2">
                <Label className="text-base font-semibold">Almost done! Final preferences</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Help us match you with the right approach
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Therapy approach</Label>
                <RadioGroup value={therapyApproach} onValueChange={setTherapyApproach}>
                  <div className="grid gap-3">
                    {therapyApproaches.map((approach) => (
                      <label
                        key={approach.value}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                          therapyApproach === approach.value
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 shadow-lg'
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {approach.recommended && (
                          <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            ✨ Best Match
                          </div>
                        )}
                        <span className="text-3xl">{approach.label.split(' ')[0]}</span>
                        <RadioGroupItem value={approach.value} id={approach.value} className="mt-0" />
                        <div className="flex-1">
                          <div className="font-semibold">{approach.label.split(' ').slice(1).join(' ')}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{approach.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Session format</Label>
                <RadioGroup value={preferredSessionType} onValueChange={setPreferredSessionType}>
                  <div className="grid gap-3">
                    {sessionTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          preferredSessionType === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {type.popular && (
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </div>
                        )}
                        <span className="text-2xl">{type.label.split(' ')[0]}</span>
                        <RadioGroupItem value={type.value} id={type.value} className="mt-0" />
                        <div className="flex-1">
                          <div className="font-medium">{type.label.split(' ').slice(1).join(' ')}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{type.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Session length</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: '45', label: '45 min', desc: 'Standard', recommended: true },
                    { value: '60', label: '60 min', desc: 'Extended', recommended: false },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSessionDuration(option.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        sessionDuration === option.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-950 shadow-lg'
                          : 'border-slate-300 dark:border-slate-600 hover:border-green-400'
                      }`}
                    >
                      {option.recommended && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          ✓
                        </div>
                      )}
                      <div className="font-bold text-xl">{option.label}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                You're All Set!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We've created your personalized wellness journey
              </p>
            </div>
            {/* Storytelling effect: Show journey summary */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-xl p-6 space-y-3 text-sm text-left shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Your Goals
                </span>
                <span className="font-semibold">{goals.length || 1} focus areas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Session Type
                </span>
                <span className="font-semibold capitalize">{preferredSessionType || 'Virtual'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Communication
                </span>
                <span className="font-semibold capitalize">{communicationStyle || 'Supportive'}</span>
              </div>
            </div>
            {/* Reciprocity: Give something back */}
            <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4 text-sm border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <div className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                    🎁 Welcome Gift
                  </div>
                  <div className="text-indigo-700 dark:text-indigo-300">
                    Start your journey with a complimentary wellness assessment worth €50
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <Card className="relative w-full max-w-2xl shadow-2xl border-slate-200 dark:border-slate-800">
        <CardContent className="p-8">
          {/* Progress Bar */}
          {onboardingType && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] flex items-center justify-center">
                {onboardingType === 'basic' ? renderBasicStep() : renderFullStep()}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {onboardingType && currentStep > 0 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8"
                >
                  {currentStep === 0 && onboardingType ? 'Start Your Journey' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 animate-pulse"
                >
                  {isLoading ? 'Creating Your Journey...' : '🎉 Complete & Get Started'}
                  {!isLoading && <Sparkles className="w-5 h-5" />}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}