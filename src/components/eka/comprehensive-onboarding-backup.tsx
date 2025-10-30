'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight, ArrowLeft, Check, Shield, Lock, Info, Heart, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingData {
  // Essential fields only
  fullName: string;
  age: string;
  occupationType: string;
  therapeuticGoals: string[];
  currentChallenges: string[];
  painAreas: string[];
  workStressLevel: string;
  sleepQuality: string;
  sportsActivities: string[];
  activityLevel: string;
  hobbies: string[];
  leisureTime: string;
  preferredApproaches: string[];
  communicationStyle: string;
  primaryMotivation: string;
}

interface ComprehensiveOnboardingProps {
  onComplete: (data: Partial<User['personalization']>) => void;
  onSkip?: () => void;
}

// Minimal, essential options
const OCCUPATION_TYPES = [
  { value: 'student', label: '🎓 Student', description: 'Currently studying' },
  { value: 'employed', label: '💼 Employed', description: 'Working full or part-time' },
  { value: 'self-employed', label: '🚀 Self-employed', description: 'Running own business' },
  { value: 'unemployed', label: '🔍 Between jobs', description: 'Looking for opportunities' },
  { value: 'retired', label: '🌴 Retired', description: 'Enjoying retirement' },
  { value: 'other', label: '✨ Other', description: 'Something else' }
];

const THERAPEUTIC_GOALS = [
  { value: 'stress', label: 'Reduce stress', icon: '🧘', why: 'Helps us focus on relaxation techniques' },
  { value: 'sleep', label: 'Better sleep', icon: '😴', why: "We'll tailor sessions for rest and recovery" },
  { value: 'pain', label: 'Manage pain', icon: '💪', why: 'Targets physical therapy methods' },
  { value: 'anxiety', label: 'Ease anxiety', icon: '🌸', why: 'Focuses on calming practices' },
  { value: 'mood', label: 'Improve mood', icon: '☀️', why: 'Enhances emotional well-being' },
  { value: 'energy', label: 'Boost energy', icon: '⚡', why: 'Activating exercises and routines' },
  { value: 'balance', label: 'Work-life balance', icon: '⚖️', why: 'Helps prioritize self-care' },
  { value: 'growth', label: 'Personal growth', icon: '🌱', why: 'Supports your development journey' }
];

const PAIN_AREAS = [
  { value: 'neck', label: 'Neck', icon: '🦴' },
  { value: 'shoulders', label: 'Shoulders', icon: '💪' },
  { value: 'back-upper', label: 'Upper back', icon: '🧍' },
  { value: 'back-lower', label: 'Lower back', icon: '🧎' },
  { value: 'hips', label: 'Hips', icon: '🦵' },
  { value: 'knees', label: 'Knees', icon: '🏃' },
  { value: 'headaches', label: 'Headaches', icon: '🤕' },
  { value: 'full-body', label: 'Full body tension', icon: '😣' },
  { value: 'none', label: 'No physical pain', icon: '✨' }
];

const SPORTS_ACTIVITIES = [
  { value: 'yoga', label: 'Yoga', icon: '🧘' },
  { value: 'running', label: 'Running', icon: '🏃' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'swimming', label: 'Swimming', icon: '🏊' },
  { value: 'cycling', label: 'Cycling', icon: '🚴' },
  { value: 'walking', label: 'Walking', icon: '🚶' },
  { value: 'sports', label: 'Team sports', icon: '⚽' },
  { value: 'dance', label: 'Dancing', icon: '💃' },
  { value: 'martial-arts', label: 'Martial arts', icon: '🥋' },
  { value: 'none', label: 'None currently', icon: '🛋️' }
];

const HOBBIES = [
  { value: 'reading', label: 'Reading', icon: '📚' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'art', label: 'Art/Crafts', icon: '🎨' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'cooking', label: 'Cooking', icon: '👨‍🍳' },
  { value: 'nature', label: 'Nature/Outdoors', icon: '🌳' },
  { value: 'tech', label: 'Technology', icon: '💻' },
  { value: 'social', label: 'Socializing', icon: '👥' },
  { value: 'learning', label: 'Learning new things', icon: '📖' },
  { value: 'pets', label: 'Pet care', icon: '🐾' }
];

const APPROACHES = [
  { value: 'physical', label: 'Physical therapy', icon: '💆', why: 'Body-focused healing' },
  { value: 'talk', label: 'Talk therapy', icon: '💬', why: 'Emotional support through conversation' },
  { value: 'mindfulness', label: 'Mindfulness', icon: '🧘', why: 'Present moment awareness' },
  { value: 'movement', label: 'Movement/Exercise', icon: '🏃', why: 'Active healing through motion' },
  { value: 'holistic', label: 'Holistic methods', icon: '🌿', why: 'Whole-person approach' }
];

const COMMUNICATION_STYLES = [
  { value: 'direct', label: 'Direct & practical', description: 'Get straight to solutions' },
  { value: 'gentle', label: 'Gentle & empathetic', description: 'Take time to process emotions' },
  { value: 'balanced', label: 'Balanced approach', description: 'Mix of both styles' }
];

const MOTIVATIONS = [
  { value: 'pain-relief', label: 'Relief from discomfort', description: 'Physical or emotional pain' },
  { value: 'self-improvement', label: 'Become my best self', description: 'Personal growth' },
  { value: 'life-change', label: 'Major life change', description: 'New chapter, new me' },
  { value: 'maintenance', label: 'Maintain wellness', description: 'Keep feeling good' },
  { value: 'curiosity', label: 'Curious to explore', description: 'Learn and discover' }
];

// Privacy & Trust Component
const PrivacyBadge = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/50", className)}>
    <Lock className="w-3 h-3 text-green-600" />
    <span>Your data is private and secure</span>
  </div>
);

// Why We Ask Tooltip
const WhyWeAsk = ({ reason }: { reason: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">💡 {reason}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ComprehensiveOnboarding({ onComplete, onSkip }: ComprehensiveOnboardingProps) {
  const [step, setStep] = useState(0); // Start at 0 for welcome screen
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    age: '',
    occupationType: '',
    therapeuticGoals: [],
    currentChallenges: [],
    painAreas: [],
    workStressLevel: '',
    sleepQuality: '',
    sportsActivities: [],
    activityLevel: '',
    hobbies: [],
    leisureTime: '',
    preferredApproaches: [],
    communicationStyle: '',
    primaryMotivation: ''
  });

  const totalSteps = 6; // 0=welcome, 1-5=questions, 6=completion
  const progress = (step / totalSteps) * 100;

  // Auto-save to sessionStorage (Zeigarnik Effect)
  useEffect(() => {
    if (step > 0) {
      sessionStorage.setItem('eka-onboarding-progress', JSON.stringify({ step, data }));
    }
  }, [step, data]);

  // Load saved progress on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('eka-onboarding-progress');
    if (saved) {
      try {
        const { step: savedStep, data: savedData } = JSON.parse(saved);
        setStep(savedStep);
        setData(savedData);
        toast({
          title: "Welcome back! 👋",
          description: "We've saved your progress. Let's continue where you left off."
        });
      } catch (e) {
        console.error('Failed to load saved progress:', e);
      }
    }
  }, []);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = data[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateData(field, newArray);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Welcome screen
      case 1: return data.fullName && data.age && data.occupationType; // Basic info
      case 2: return data.therapeuticGoals.length > 0; // Goals (at least one)
      case 3: return data.workStressLevel && data.sleepQuality; // Lifestyle
      case 4: return data.sportsActivities.length > 0 || data.hobbies.length > 0; // Activities
      case 5: return data.preferredApproaches.length > 0 && data.communicationStyle && data.primaryMotivation; // Preferences
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 0 || canProceed()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      
      // Feedforward: Show what's coming next
      if (step === 1) {
        toast({
          title: "Great! 👍",
          description: "Next, we'll learn about your wellness goals."
        });
      } else if (step === 2) {
        toast({
          title: "Perfect! ✨",
          description: "This helps us personalize your sessions."
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Just a moment',
        description: 'Please complete the highlighted fields to continue.'
      });
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const generateAIInsights = async (): Promise<Partial<User['personalization']>> => {
    // Simulate AI processing with Labor Illusion
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const aiPersonaProfile = `You're ${data.age ? `a ${data.age}-year-old` : 'an individual'} ${data.occupationType ? `${data.occupationType}` : ''} focused on ${data.therapeuticGoals.slice(0, 2).join(' and ') || 'wellness'}. Your journey with us is about ${data.primaryMotivation}.`;
    
    return {
      fullName: data.fullName,
      age: data.age ? parseInt(data.age) : undefined,
      occupationType: data.occupationType as any,
      therapeuticGoals: data.therapeuticGoals,
      currentChallenges: data.currentChallenges,
      painAreas: data.painAreas,
      sportsActivities: data.sportsActivities,
      activityLevel: data.activityLevel as any,
      hobbies: data.hobbies,
      leisureTime: data.leisureTime as any,
      lifestyleFactors: {
        workStressLevel: data.workStressLevel ? parseInt(data.workStressLevel) as 1 | 2 | 3 | 4 | 5 : undefined,
        sleepQuality: data.sleepQuality ? parseInt(data.sleepQuality) as 1 | 2 | 3 | 4 | 5 : undefined,
      },
      preferredApproaches: data.preferredApproaches,
      communicationStyle: data.communicationStyle as any,
      motivations: [data.primaryMotivation],
      aiPersonaProfile,
      aiRecommendedApproaches: data.preferredApproaches,
      aiPersonalizationScore: 85,
    };
  };

  const handleComplete = async () => {
    setIsGeneratingInsights(true);
    
    toast({
      title: '✨ Creating your personalized plan...',
      description: 'Our AI is understanding your unique story.'
    });

    try {
      const personalizationData = await generateAIInsights();
      onComplete(personalizationData);
      
      // Clear saved progress
      sessionStorage.removeItem('eka-onboarding-progress');
      
      // Peak-End Rule: End on high note
      toast({
        title: '🎉 You're all set!',
        description: 'We understand how to help you feel lighter and freer.',
        duration: 5000
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0" hideClose>
        <div className="relative">
          {/* Progress Bar */}
          {step > 0 && step < totalSteps && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Step {step} of {totalSteps - 1}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 0: Welcome & Framing */}
              {step === 0 && (
                <motion.div
                  key="welcome"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Welcome to Your Wellness Journey
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We'll ask you a few things so we can tailor your therapy and improve your well-being.
                    </p>
                  </div>

                  <Card className="border-primary/20 bg-primary/5 max-w-xl mx-auto">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 text-left">
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">We've helped hundreds of clients</p>
                          <p className="text-sm text-muted-foreground">
                            Each person is unique — this helps us understand your story better and create a plan that truly fits you.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col items-center gap-4 pt-4">
                    <PrivacyBadge />
                    <p className="text-xs text-muted-foreground max-w-md">
                      This takes about 2-3 minutes. You can pause anytime — we'll save your progress.
                    </p>
                  </div>

                  <Button onClick={handleNext} size="lg" className="mt-8">
                    Let's Begin
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">Let's get to know you</h2>
                      <WhyWeAsk reason="This helps us personalize your experience and address you properly" />
                    </div>
                    <p className="text-muted-foreground">
                      Just the basics — we'll keep it simple.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">What should we call you? *</Label>
                        <Input
                          id="fullName"
                          value={data.fullName}
                          onChange={(e) => updateData('fullName', e.target.value)}
                          placeholder="e.g., Sarah Johnson"
                          className="text-lg"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Only visible to you and your therapist
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Your age *</Label>
                          <Input
                            id="age"
                            type="number"
                            value={data.age}
                            onChange={(e) => updateData('age', e.target.value)}
                            placeholder="e.g., 28"
                            min="16"
                            max="120"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Currently you are *</Label>
                          <Select value={data.occupationType} onValueChange={(v) => updateData('occupationType', v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {OCCUPATION_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex flex-col items-start">
                                    <span>{type.label}</span>
                                    <span className="text-xs text-muted-foreground">{type.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <PrivacyBadge className="mx-auto w-fit" />
                </motion.div>
              )}

              {/* Step 2: Goals & Challenges */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">What brings you here?</h2>
                      <WhyWeAsk reason="This helps us suggest the right therapy methods and sessions for you" />
                    </div>
                    <p className="text-muted-foreground">
                      Select all that resonate with you. The more you share, the better we can help.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Your wellness goals *</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {THERAPEUTIC_GOALS.map((goal) => (
                            <div
                              key={goal.value}
                              onClick={() => toggleArrayItem('therapeuticGoals', goal.value)}
                              className={cn(
                                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                data.therapeuticGoals.includes(goal.value)
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              )}
                            >
                              <span className="text-2xl">{goal.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{goal.label}</div>
                              </div>
                              {data.therapeuticGoals.includes(goal.value) && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Any physical discomfort?</Label>
                        <p className="text-sm text-muted-foreground">Select areas where you feel tension or pain</p>
                        <div className="grid grid-cols-3 gap-2">
                          {PAIN_AREAS.map((area) => (
                            <div
                              key={area.value}
                              onClick={() => toggleArrayItem('painAreas', area.value)}
                              className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-center",
                                data.painAreas.includes(area.value)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <span className="text-xl">{area.icon}</span>
                              <span className="text-xs font-medium">{area.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      💙 Most clients find it helpful to select 2-3 main goals to focus on first.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Lifestyle Check-in */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">How are you feeling lately?</h2>
                      <WhyWeAsk reason="Sleep and stress levels help us understand your current state and adjust session intensity" />
                    </div>
                    <p className="text-muted-foreground">
                      This helps us understand your current wellness baseline.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Stress level at work/daily life *</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                              key={level}
                              type="button"
                              variant={data.workStressLevel === level.toString() ? 'default' : 'outline'}
                              className="flex-1 h-16 flex-col gap-1"
                              onClick={() => updateData('workStressLevel', level.toString())}
                            >
                              <span className="text-2xl">
                                {level === 1 ? '😌' : level === 2 ? '🙂' : level === 3 ? '😐' : level === 4 ? '😰' : '😫'}
                              </span>
                              <span className="text-xs">{level}</span>
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          1 = Very calm • 5 = Very stressed
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Sleep quality recently *</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Button
                              key={level}
                              type="button"
                              variant={data.sleepQuality === level.toString() ? 'default' : 'outline'}
                              className="flex-1 h-16 flex-col gap-1"
                              onClick={() => updateData('sleepQuality', level.toString())}
                            >
                              <span className="text-2xl">
                                {level === 1 ? '😴' : level === 2 ? '😪' : level === 3 ? '😐' : level === 4 ? '😊' : '✨'}
                              </span>
                              <span className="text-xs">{level}</span>
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          1 = Poor sleep • 5 = Excellent rest
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      💡 Your answers help us adjust session timing and intensity to match your energy levels.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Activities & Hobbies */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">What do you enjoy?</h2>
                      <WhyWeAsk reason="We'll incorporate activities you love into your wellness plan" />
                    </div>
                    <p className="text-muted-foreground">
                      Tell us about your activities and interests.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Physical activities you do (or want to try) *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {SPORTS_ACTIVITIES.map((sport) => (
                            <div
                              key={sport.value}
                              onClick={() => toggleArrayItem('sportsActivities', sport.value)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                data.sportsActivities.includes(sport.value)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <span className="text-xl">{sport.icon}</span>
                              <span className="text-sm font-medium flex-1">{sport.label}</span>
                              {data.sportsActivities.includes(sport.value) && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Hobbies & interests *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {HOBBIES.map((hobby) => (
                            <div
                              key={hobby.value}
                              onClick={() => toggleArrayItem('hobbies', hobby.value)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                data.hobbies.includes(hobby.value)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <span className="text-xl">{hobby.icon}</span>
                              <span className="text-sm font-medium flex-1">{hobby.label}</span>
                              {data.hobbies.includes(hobby.value) && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>How active are you typically?</Label>
                        <Select value={data.activityLevel} onValueChange={(v) => updateData('activityLevel', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level..." />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: 'sedentary', label: '🛋️ Mostly sedentary', description: 'Little exercise' },
                              { value: 'light', label: '🚶 Lightly active', description: '1-2 days/week' },
                              { value: 'moderate', label: '🏃 Moderately active', description: '3-4 days/week' },
                              { value: 'active', label: '💪 Very active', description: '5-6 days/week' },
                              { value: 'very-active', label: '⚡ Extremely active', description: 'Daily exercise' }
                            ].map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div>
                                  <div>{level.label}</div>
                                  <div className="text-xs text-muted-foreground">{level.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Free time available for self-care?</Label>
                        <Select value={data.leisureTime} onValueChange={(v) => updateData('leisureTime', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="How much time do you have?" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: 'none', label: '⏰ Almost none - Very busy' },
                              { value: 'little', label: '🕐 A little - Few hours/week' },
                              { value: 'moderate', label: '🕒 Moderate - Several hours/week' },
                              { value: 'plenty', label: '🕓 Plenty - Multiple hours/day' }
                            ].map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                    <p className="text-sm text-green-900 dark:text-green-100">
                      🌟 Great! We'll build on what you already enjoy to create sustainable wellness habits.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Preferences & Communication */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">Almost there!</h2>
                      <WhyWeAsk reason="These final preferences help us match you with the right therapist and methods" />
                    </div>
                    <p className="text-muted-foreground">
                      Just a few more details to personalize your experience.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Therapy approaches you prefer *</Label>
                        <div className="grid gap-3">
                          {APPROACHES.map((approach) => (
                            <div
                              key={approach.value}
                              onClick={() => toggleArrayItem('preferredApproaches', approach.value)}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                                data.preferredApproaches.includes(approach.value)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <span className="text-2xl">{approach.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{approach.label}</div>
                                <div className="text-xs text-muted-foreground">{approach.why}</div>
                              </div>
                              {data.preferredApproaches.includes(approach.value) && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Communication style you prefer *</Label>
                        <div className="grid gap-2">
                          {COMMUNICATION_STYLES.map((style) => (
                            <div
                              key={style.value}
                              onClick={() => updateData('communicationStyle', style.value)}
                              className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                                data.communicationStyle === style.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium">{style.label}</div>
                                <div className="text-xs text-muted-foreground">{style.description}</div>
                              </div>
                              {data.communicationStyle === style.value && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">What's your main motivation? *</Label>
                        <div className="grid gap-2">
                          {MOTIVATIONS.map((motivation) => (
                            <div
                              key={motivation.value}
                              onClick={() => updateData('primaryMotivation', motivation.value)}
                              className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                                data.primaryMotivation === motivation.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium">{motivation.label}</div>
                                <div className="text-xs text-muted-foreground">{motivation.description}</div>
                              </div>
                              {data.primaryMotivation === motivation.value && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-primary">Your privacy is sacred here</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>🔐 All data encrypted and stored securely</li>
                          <li>🚫 Never used for marketing or ads</li>
                          <li>🤝 Only shared with your therapist</li>
                          <li>💬 You can request deletion anytime</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Completion Step */}
              {step === totalSteps && (
                <motion.div
                  key="completion"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold">You're all set! 🎉</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We understand how to help you feel lighter and freer.
                    </p>
                  </div>

                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 max-w-xl mx-auto">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3 text-left">
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-2">Your story helps us find what your body truly needs</p>
                          <p className="text-sm text-muted-foreground">
                            Your personalized plan is ready. Let's begin your journey to balance and wellness.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {isGeneratingInsights ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-muted-foreground">Creating your personalized wellness plan...</p>
                    </div>
                  ) : (
                    <Button onClick={handleComplete} size="lg" className="mt-8">
                      View My Personalized Plan
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step > 0 && step < totalSteps && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  {step === totalSteps - 1 ? 'Complete' : 'Continue'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
