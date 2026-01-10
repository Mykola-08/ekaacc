'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent } from '@/components/platform/ui/card';
import { Checkbox } from '@/components/platform/ui/checkbox';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/platform/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/platform/ui/tooltip';
import { Progress } from '@/components/platform/ui/progress';
import { useState, useEffect } from 'react';
;
;
;
;
;
;
import { 
  Loader2, ArrowRight, ArrowLeft, Check, Shield, Lock, Info, Heart, Sparkles,
  Smartphone, Monitor, Tablet, GraduationCap, Briefcase, Rocket, Search, Coffee,
  Moon, Activity, Smile, Zap, Scale, Sprout, Bone, User as UserIcon, Dumbbell, Waves, Bike,
  Footprints, Users, Music, Book, Palette, Camera, Gamepad, Utensils, Plane, Globe,
  MessageCircle, Mic, Video, Target, Star, Trophy, Lightbulb, Meh, Frown, AlertCircle, Battery, Sofa
} from 'lucide-react';
import { useToast } from '@/hooks/platform/use-toast';
;
;
;
import { cn } from '@/lib/platform/utils';
import type { User } from '@/lib/platform/types';
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
  layoutPreference: 'responsive' | 'desktop' | 'mobile';
}

interface ComprehensiveOnboardingProps {
  onComplete: (data: Partial<User['personalization']> & { layoutPreference?: string }) => void;
  onSkip?: () => void;
}

// Minimal, essential options
const LAYOUT_PREFERENCES = [
  { value: 'responsive', label: 'Auto (Recommended)', description: 'Adapts to your device', icon: <Smartphone className="w-6 h-6" /> },
  { value: 'desktop', label: 'Desktop View', description: 'Always show sidebar', icon: <Monitor className="w-6 h-6" /> },
  { value: 'mobile', label: 'Mobile View', description: 'Simplified bottom menu', icon: <Tablet className="w-6 h-6" /> }
];

const OCCUPATION_TYPES = [
  { value: 'student', label: 'Student', description: 'Currently studying', icon: <GraduationCap className="w-5 h-5" /> },
  { value: 'employed', label: 'Employed', description: 'Working full or part-time', icon: <Briefcase className="w-5 h-5" /> },
  { value: 'self-employed', label: 'Self-employed', description: 'Running own business', icon: <Rocket className="w-5 h-5" /> },
  { value: 'unemployed', label: 'Between jobs', description: 'Looking for opportunities', icon: <Search className="w-5 h-5" /> },
  { value: 'retired', label: 'Retired', description: 'Enjoying retirement', icon: <Coffee className="w-5 h-5" /> },
  { value: 'other', label: 'Other', description: 'Something else', icon: <UserIcon className="w-5 h-5" /> }
];

const THERAPEUTIC_GOALS = [
  { value: 'stress', label: 'Reduce stress', icon: <Waves className="w-6 h-6" />, why: 'Helps us focus on relaxation techniques' },
  { value: 'sleep', label: 'Better sleep', icon: <Moon className="w-6 h-6" />, why: "We'll tailor sessions for rest and recovery" },
  { value: 'pain', label: 'Manage pain', icon: <Activity className="w-6 h-6" />, why: 'Targets physical therapy methods' },
  { value: 'anxiety', label: 'Ease anxiety', icon: <Smile className="w-6 h-6" />, why: 'Focuses on calming practices' },
  { value: 'mood', label: 'Improve mood', icon: <Sparkles className="w-6 h-6" />, why: 'Enhances emotional well-being' },
  { value: 'energy', label: 'Boost energy', icon: <Zap className="w-6 h-6" />, why: 'Activating exercises and routines' },
  { value: 'balance', label: 'Work-life balance', icon: <Scale className="w-6 h-6" />, why: 'Helps prioritize self-care' },
  { value: 'growth', label: 'Personal growth', icon: <Sprout className="w-6 h-6" />, why: 'Supports your development journey' }
];

const PAIN_AREAS = [
  { value: 'neck', label: 'Neck', icon: <Bone className="w-5 h-5" /> },
  { value: 'shoulders', label: 'Shoulders', icon: <Dumbbell className="w-5 h-5" /> },
  { value: 'back-upper', label: 'Upper back', icon: <UserIcon className="w-5 h-5" /> },
  { value: 'back-lower', label: 'Lower back', icon: <UserIcon className="w-5 h-5" /> },
  { value: 'hips', label: 'Hips', icon: <Activity className="w-5 h-5" /> },
  { value: 'knees', label: 'Knees', icon: <Activity className="w-5 h-5" /> },
  { value: 'headaches', label: 'Headaches', icon: <Activity className="w-5 h-5" /> },
  { value: 'full-body', label: 'Full body tension', icon: <Activity className="w-5 h-5" /> },
  { value: 'none', label: 'No physical pain', icon: <Sparkles className="w-5 h-5" /> }
];

const SPORTS_ACTIVITIES = [
  { value: 'yoga', label: 'Yoga', icon: <Activity className="w-5 h-5" /> },
  { value: 'running', label: 'Running', icon: <Activity className="w-5 h-5" /> },
  { value: 'gym', label: 'Gym', icon: <Dumbbell className="w-5 h-5" /> },
  { value: 'swimming', label: 'Swimming', icon: <Waves className="w-5 h-5" /> },
  { value: 'cycling', label: 'Cycling', icon: <Bike className="w-5 h-5" /> },
  { value: 'walking', label: 'Walking', icon: <Footprints className="w-5 h-5" /> },
  { value: 'sports', label: 'Team sports', icon: <Users className="w-5 h-5" /> },
  { value: 'dance', label: 'Dancing', icon: <Music className="w-5 h-5" /> },
  { value: 'martial-arts', label: 'Martial arts', icon: <Activity className="w-5 h-5" /> },
  { value: 'none', label: 'None currently', icon: <Coffee className="w-5 h-5" /> }
];

const HOBBIES = [
  { value: 'reading', label: 'Reading', icon: <Book className="w-5 h-5" /> },
  { value: 'music', label: 'Music', icon: <Music className="w-5 h-5" /> },
  { value: 'art', label: 'Art/Crafts', icon: <Palette className="w-5 h-5" /> },
  { value: 'gaming', label: 'Gaming', icon: <Gamepad className="w-5 h-5" /> },
  { value: 'cooking', label: 'Cooking', icon: <Utensils className="w-5 h-5" /> },
  { value: 'nature', label: 'Nature/Outdoors', icon: <Sprout className="w-5 h-5" /> },
  { value: 'tech', label: 'Technology', icon: <Monitor className="w-5 h-5" /> },
  { value: 'social', label: 'Socializing', icon: <Users className="w-5 h-5" /> },
  { value: 'learning', label: 'Learning new things', icon: <GraduationCap className="w-5 h-5" /> },
  { value: 'pets', label: 'Pet care', icon: <Heart className="w-5 h-5" /> }
];

const APPROACHES = [
  { value: 'physical', label: 'Physical therapy', icon: <Activity className="w-6 h-6" />, why: 'Body-focused healing' },
  { value: 'talk', label: 'Talk therapy', icon: <MessageCircle className="w-6 h-6" />, why: 'Emotional support through conversation' },
  { value: 'mindfulness', label: 'Mindfulness', icon: <Sparkles className="w-6 h-6" />, why: 'Present moment awareness' },
  { value: 'movement', label: 'Movement/Exercise', icon: <Dumbbell className="w-6 h-6" />, why: 'Active healing through motion' },
  { value: 'holistic', label: 'Holistic methods', icon: <Sprout className="w-6 h-6" />, why: 'Whole-person approach' }
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
    <Lock className="w-3 h-3 text-foreground" />
    <span>Your data is private and secure</span>
  </div>
);

// Why We Ask Tooltip
const WhyWeAsk = ({ reason }: { reason: string }) => (
  <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm flex items-center gap-2"><Info className="w-3 h-3" /> {reason}</p>
      </TooltipContent>
    </Tooltip>
);

export function ComprehensiveOnboarding({ onComplete, onSkip }: ComprehensiveOnboardingProps) {
  const [step, setStep] = useState(0); // Start at 0 for welcome screen
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
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
    primaryMotivation: '',
    layoutPreference: 'responsive'
  });

  const totalSteps = 7; // 0=welcome, 1-6=questions
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessage, setAnalysisMessage] = useState('');
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
        setData(prev => ({ ...prev, ...savedData })); // Merge to ensure new fields exist
        toast({
          title: "Welcome back!",
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
      case 6: return !!data.layoutPreference; // App Experience
      default: return true;
    }
  };

  const handleNext = () => {
    if (step === 0 || canProceed()) {
      // Show transition message before moving to next step
      const messages = {
        0: "Let's get to know you better...",
        1: "Now, let's explore your wellness goals...",
        2: "Tell us about your daily life...",
        3: "What keeps you active?",
        4: "Finally, your therapy preferences...",
        5: "One last thing...",
      };
      
      if (step < 6 && messages[step as keyof typeof messages]) {
        setTransitionMessage(messages[step as keyof typeof messages]);
        setShowTransition(true);
        
        setTimeout(() => {
          setShowTransition(false);
          setStep(prev => Math.min(prev + 1, totalSteps));
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
      } else {
        setStep(prev => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateAIInsights = async (): Promise<Partial<User['personalization']> & { layoutPreference?: string }> => {
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
      layoutPreference: data.layoutPreference,
    };
  };

  const handleComplete = async () => {
    // Move to analysis screen (step 8)
    setStep(8);
    setIsGeneratingInsights(true);
    
    // Simulate AI analysis with realistic progress updates
    const analysisSteps = [
      { progress: 0, message: 'Analyzing your wellness goals...', duration: 600 },
      { progress: 15, message: 'Understanding your lifestyle patterns...', duration: 500 },
      { progress: 35, message: 'Evaluating your therapeutic preferences...', duration: 700 },
      { progress: 55, message: 'Matching you with optimal approaches...', duration: 600 },
      { progress: 70, message: 'Creating personalized recommendations...', duration: 500 },
      { progress: 85, message: 'Finalizing your wellness profile...', duration: 400 },
      { progress: 100, message: 'Your personalized plan is ready!', duration: 300 }
    ];

    try {
      // Run analysis steps with progress updates
      for (const step of analysisSteps) {
        await new Promise(resolve => setTimeout(resolve, step.duration));
        setAnalysisProgress(step.progress);
        setAnalysisMessage(step.message);
      }

      // Generate final personalization data
      const personalizationData = await generateAIInsights();
      
      // Wait a moment to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onComplete(personalizationData);
      
      // Clear saved progress
      sessionStorage.removeItem('eka-onboarding-progress');
      
      // Peak-End Rule: End on high note
      toast({
        title: 'You are all set!',
        description: 'We understand how to help you feel lighter and freer.',
        duration: 5000
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Something went wrong. Please try again.'
      });
      setStep(5); // Go back to last step
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
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Transition Screen */}
      {showTransition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-background flex items-center justify-center"
        >
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-foreground" />
            <p className="text-xl font-medium text-foreground">{transitionMessage}</p>
          </div>
        </motion.div>
      )}

      <div className="h-full w-full overflow-y-auto">
        <div className="relative max-w-4xl mx-auto min-h-full flex flex-col">
          {/* Progress Bar */}
          {step > 0 && step < totalSteps && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Step {step} of {totalSteps - 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col p-6 md:p-8 lg:p-12">
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
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-foreground/20 to-muted-foreground/5 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground/60 bg-clip-text text-transparent">
                      Welcome to Your Wellness Journey
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We'll ask you a few things so we can tailor your therapy and improve your well-being.
                    </p>
                  </div>

                  <Card className="border-foreground/20 bg-foreground/5 max-w-xl mx-auto">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 text-left">
                        <Sparkles className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
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
                              <SelectValue placeholder="Select..."  />
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
                                  ? "border-foreground bg-muted shadow-sm"
                                  : "border-border hover:border-muted-foreground hover:bg-muted/50"
                              )}
                            >
                              <span className="text-2xl">{goal.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{goal.label}</div>
                              </div>
                              {data.therapeuticGoals.includes(goal.value) && (
                                <Check className="w-5 h-5 text-foreground" />
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
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

                  <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
                    <Heart className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      Most clients find it helpful to select 2-3 main goals to focus on first.
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
                                {level === 1 ? <Sparkles className="w-6 h-6" /> : 
                                 level === 2 ? <Smile className="w-6 h-6" /> : 
                                 level === 3 ? <Meh className="w-6 h-6" /> : 
                                 level === 4 ? <Frown className="w-6 h-6" /> : 
                                 <Zap className="w-6 h-6" />}
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
                                {level === 1 ? <AlertCircle className="w-6 h-6" /> : 
                                 level === 2 ? <Frown className="w-6 h-6" /> : 
                                 level === 3 ? <Meh className="w-6 h-6" /> : 
                                 level === 4 ? <Smile className="w-6 h-6" /> : 
                                 <Sparkles className="w-6 h-6" />}
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

                  <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">
                      Your answers help us adjust session timing and intensity to match your energy levels.
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <span className="text-xl">{sport.icon}</span>
                              <span className="text-sm font-medium flex-1">{sport.label}</span>
                              {data.sportsActivities.includes(sport.value) && (
                                <Check className="w-4 h-4 text-foreground" />
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <span className="text-xl">{hobby.icon}</span>
                              <span className="text-sm font-medium flex-1">{hobby.label}</span>
                              {data.hobbies.includes(hobby.value) && (
                                <Check className="w-4 h-4 text-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>How active are you typically?</Label>
                        <Select value={data.activityLevel} onValueChange={(v) => updateData('activityLevel', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level..."  />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              { value: 'sedentary', label: 'Mostly sedentary', icon: <Sofa className="w-4 h-4" />, description: 'Little exercise' },
                              { value: 'light', label: 'Lightly active', icon: <Footprints className="w-4 h-4" />, description: '1-2 days/week' },
                              { value: 'moderate', label: 'Moderately active', icon: <Activity className="w-4 h-4" />, description: '3-4 days/week' },
                              { value: 'active', label: 'Very active', icon: <Dumbbell className="w-4 h-4" />, description: '5-6 days/week' },
                              { value: 'very-active', label: 'Extremely active', icon: <Zap className="w-4 h-4" />, description: 'Daily exercise' }
                            ].map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  {level.icon}
                                  <div>
                                    <div>{level.label}</div>
                                    <div className="text-xs text-muted-foreground">{level.description}</div>
                                  </div>
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
                            <SelectValue placeholder="How much time do you have?"  />
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

                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" /> Great! We'll build on what you already enjoy to create sustainable wellness habits.
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <span className="text-2xl">{approach.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{approach.label}</div>
                                <div className="text-xs text-muted-foreground">{approach.why}</div>
                              </div>
                              {data.preferredApproaches.includes(approach.value) && (
                                <Check className="w-5 h-5 text-foreground" />
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium">{style.label}</div>
                                <div className="text-xs text-muted-foreground">{style.description}</div>
                              </div>
                              {data.communicationStyle === style.value && (
                                <Check className="w-5 h-5 text-foreground" />
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
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <div className="flex-1 text-left">
                                <div className="font-medium">{motivation.label}</div>
                                <div className="text-xs text-muted-foreground">{motivation.description}</div>
                              </div>
                              {data.primaryMotivation === motivation.value && (
                                <Check className="w-5 h-5 text-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="border-2 border-foreground/20 bg-gradient-to-r from-foreground/5 to-muted-foreground/10 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-foreground">Your privacy is sacred here</p>
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

              {/* Step 6: App Experience */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">App Experience</h2>
                      <WhyWeAsk reason="Choose how you want to interact with the app" />
                    </div>
                    <p className="text-muted-foreground">
                      Select your preferred layout style. You can change this later in settings.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Preferred Layout *</Label>
                        <div className="grid gap-3">
                          {LAYOUT_PREFERENCES.map((pref) => (
                            <div
                              key={pref.value}
                              onClick={() => updateData('layoutPreference', pref.value)}
                              className={cn(
                                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                                data.layoutPreference === pref.value
                                  ? "border-foreground bg-foreground/5"
                                  : "border-border hover:border-foreground/50"
                              )}
                            >
                              <span className="text-2xl">{pref.icon}</span>
                              <div className="flex-1 text-left">
                                <div className="font-medium">{pref.label}</div>
                                <div className="text-xs text-muted-foreground">{pref.description}</div>
                              </div>
                              {data.layoutPreference === pref.value && (
                                <Check className="w-5 h-5 text-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                    <Check className="w-10 h-10 text-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold">You're all set!</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      We understand how to help you feel lighter and freer.
                    </p>
                  </div>

                  <Card className="border-foreground/20 bg-gradient-to-br from-foreground/5 to-muted-foreground/10 max-w-xl mx-auto">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3 text-left">
                        <Sparkles className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
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
                      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
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

              {/* Step 8: Analysis & Loading Screen */}
              {step === 8 && (
                <motion.div
                  key="analysis"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8 py-12 min-h-[70vh] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-foreground/20 to-muted-foreground/5 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-12 h-12 text-foreground animate-pulse" />
                  </div>

                  <div className="space-y-3 max-w-md">
                    <h2 className="text-3xl font-bold">Creating Your Personalized Plan</h2>
                    <p className="text-muted-foreground text-lg">
                      {analysisMessage || 'Analyzing your responses...'}
                    </p>
                  </div>

                  <div className="w-full max-w-md space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Analysis Progress</span>
                      <span className="font-bold text-foreground text-lg">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md w-full text-left">
                    <Card className={cn(
                      "transition-all duration-300",
                      analysisProgress >= 25 ? "border-foreground/50 bg-foreground/5" : "opacity-50"
                    )}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                          {analysisProgress >= 25 ? (
                            <Check className="w-5 h-5 text-foreground" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Goals Analysis</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={cn(
                      "transition-all duration-300",
                      analysisProgress >= 50 ? "border-foreground/50 bg-foreground/5" : "opacity-50"
                    )}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                          {analysisProgress >= 50 ? (
                            <Check className="w-5 h-5 text-foreground" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Lifestyle Matching</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={cn(
                      "transition-all duration-300",
                      analysisProgress >= 75 ? "border-foreground/50 bg-foreground/5" : "opacity-50"
                    )}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                          {analysisProgress >= 75 ? (
                            <Check className="w-5 h-5 text-foreground" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">AI Recommendations</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={cn(
                      "transition-all duration-300",
                      analysisProgress >= 100 ? "border-foreground/50 bg-foreground/5" : "opacity-50"
                    )}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center gap-2">
                          {analysisProgress >= 100 ? (
                            <Check className="w-5 h-5 text-foreground" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">Profile Complete</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step > 0 && step < totalSteps && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t">
                <Button
                  variant="outline"
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
      </div>
    </div>
  );
}
