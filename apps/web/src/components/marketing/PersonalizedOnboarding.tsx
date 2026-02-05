import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Brain, Leaf, User, Target, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { OnboardingData, Recommendation } from '@/shared/types';
import { cn } from '@/lib/platform/utils/css-utils';
import { Button } from '@/components/platform/ui/button';
import { Card } from '@/components/platform/ui/card';
import { BOOKING_APP_URL } from '@/lib/config';

interface Question {
  id: keyof OnboardingData;
  type: 'single' | 'multiple';
  options: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export default function PersonalizedOnboarding() {
  const { t } = useLanguage();
  const user = null;
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    userType: '',
    goals: [],
    preferredFeeling: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const questions: Question[] = [
    {
      id: 'userType',
      type: 'single',
      options: [
        { id: 'student', label: t('onboarding.userTypes.student'), icon: User },
        { id: 'office', label: t('onboarding.userTypes.office'), icon: User },
        { id: 'artist', label: t('onboarding.userTypes.artist'), icon: User },
        { id: 'musician', label: t('onboarding.userTypes.musician'), icon: User },
        { id: 'athlete', label: t('onboarding.userTypes.athlete'), icon: User },
        { id: 'parent', label: t('onboarding.userTypes.parent'), icon: User },
        { id: 'free_woman', label: t('onboarding.userTypes.freeWoman'), icon: User },
        { id: 'entrepreneur', label: t('onboarding.userTypes.entrepreneur'), icon: User },
        { id: 'therapist', label: t('onboarding.userTypes.therapist'), icon: User },
        { id: 'senior', label: t('onboarding.userTypes.senior'), icon: User },
        { id: 'other', label: t('onboarding.userTypes.other'), icon: User }
      ]
    },
    {
      id: 'goals',
      type: 'multiple',
      options: [
        { id: 'stress', label: t('onboarding.goals.stress'), icon: Heart },
        { id: 'pain', label: t('onboarding.goals.pain'), icon: Heart },
        { id: 'posture', label: t('onboarding.goals.posture'), icon: Brain },
        { id: 'sleep', label: t('onboarding.goals.sleep'), icon: Leaf },
        { id: 'energy', label: t('onboarding.goals.energy'), icon: Sparkles },
        { id: 'focus', label: t('onboarding.goals.focus'), icon: Brain },
        { id: 'bodyAwareness', label: t('onboarding.goals.bodyAwareness'), icon: Target },
        { id: 'feelGood', label: t('onboarding.goals.feelGood'), icon: Heart },
        { id: 'lightness', label: t('onboarding.goals.lightness'), icon: Sparkles },
        { id: 'inspiration', label: t('onboarding.goals.inspiration'), icon: Sparkles },
        { id: 'vitality', label: t('onboarding.goals.vitality'), icon: Sparkles },
        { id: 'money', label: t('onboarding.goals.money'), icon: Target },
        { id: 'relationships', label: t('onboarding.goals.relationships'), icon: Heart },
        { id: 'family', label: t('onboarding.goals.family'), icon: User },
        { id: 'selfworth', label: t('onboarding.goals.selfworth'), icon: Sparkles }
      ]
    },
    {
      id: 'preferredFeeling',
      type: 'single',
      options: [
        { id: 'calm', label: t('onboarding.feelings.calm'), icon: Leaf },
        { id: 'light', label: t('onboarding.feelings.light'), icon: Sparkles },
        { id: 'energized', label: t('onboarding.feelings.energized'), icon: Sparkles },
        { id: 'focused', label: t('onboarding.feelings.focused'), icon: Brain },
        { id: 'confident', label: t('onboarding.feelings.confident'), icon: Target }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleSelection = (questionId: keyof OnboardingData, optionId: string) => {
    if (questionId === 'goals') {
      setData(prev => ({
        ...prev,
        goals: prev.goals.includes(optionId)
          ? prev.goals.filter(g => g !== optionId)
          : [...prev.goals, optionId]
      }));
    } else {
      setData(prev => ({
        ...prev,
        [questionId]: optionId
      }));
    }
  };

  const canProceed = () => {
    const question = questions[currentStep];
    if (question.id === 'goals') {
      return data.goals.length > 0;
    }
    return (data[question.id] as string) !== '';
  };

  const nextStep = () => {
    if (isLastStep) {
      processResults();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const processResults = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const recs = generateRecommendations(data);
    setRecommendations(recs);
    setIsProcessing(false);
    setShowResults(true);
  };

  const generateRecommendations = (userData: OnboardingData): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Always recommend Massage
    recommendations.push({
      id: 'massage',
      title: t('services.massage.title'),
      description: t('recommendations.massage.description'),
      price: 60,
      duration: '60 min',
      link: '/services/massage',
      personalizedLink: getPersonalizedLink(userData.userType),
      feeling: t('recommendations.massage.feeling') || 'Cos relaxat i ment en calma'
    });
    
    // Add other conditional recommendations (same logic as before)
    if (userData.goals.includes('pain') || userData.goals.includes('stress')) {
       recommendations.push({
        id: 'kinesiology',
        title: t('services.kinesiology.title'),
        description: t('recommendations.kinesiology.description'),
        price: 70,
        duration: '60 min',
        link: '/services/kinesiology',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.kinesiology.feeling') || 'Claredat mental'
      });
    }

    // Add fallbacks to ensure list isn't empty
    if (recommendations.length < 2) {
      recommendations.push({
        id: 'consultation',
        title: t('services.consultation.title') || 'Consulta',
        description: 'Parlem 15 minuts sense compromís.',
        price: 0,
        duration: '15 min',
        link: '/contact',
        personalizedLink: '/contact',
        feeling: 'Claredat'
      });
    }

    // Deduplicate
    const uniqueRecs = [];
    const seen = new Set();
    for (const rec of recommendations) {
      if (!seen.has(rec.id)) {
        seen.add(rec.id);
        uniqueRecs.push(rec);
      }
    }
    return uniqueRecs;
  };

  const getPersonalizedLink = (userType: string): string => {
    const userTypeMap: Record<string, string> = {
      student: 'students',
      office: 'office-workers',
      artist: 'artists',
      musician: 'musicians',
      athlete: 'athletes',
      parent: 'parents',
      entrepreneur: 'entrepreneurs',
      therapist: 'therapists',
      senior: 'seniors'
    };
    const mappedType = userTypeMap[userType] || userType;
    return `/for-${mappedType}`;
  };

  const startOnboarding = () => {
    setShowWelcome(false);
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto relative z-10">
          <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center justify-center w-24 h-24 bg-card rounded-full mb-8 shadow-xl ring-4 ring-background">
              <Heart className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="animate-slide-up text-4xl sm:text-5xl font-light text-foreground mb-8 leading-tight tracking-tight" style={{ animationDelay: '200ms' }}>
            🌿 {t('onboarding.welcome.title')}
          </div>
          <div className="animate-slide-up text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl mx-auto font-light" style={{ animationDelay: '300ms' }}>
            {t('onboarding.welcome.description')}
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button 
                onClick={startOnboarding}
                size="lg"
                className="rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all"
            >
              {t('common.getStarted')}
              <ChevronRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              {t('onboarding.results.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('onboarding.results.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="p-6 border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {rec.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {rec.description}
                      </p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        #{index + 1} {t('onboarding.results.recommended')}
                      </span>
                      <div className="flex flex-col items-end">
                        {rec.price !== undefined && <span className="font-bold text-lg">{rec.price}€</span>}
                        {rec.duration && (
                          <span className="text-sm text-muted-foreground font-medium mt-1">
                            {rec.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {rec.feeling && (
                    <div className="mb-4 bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>{t('onboarding.results.howYouWillFeel') || 'Com et sentiràs:'}</span>
                      </div>
                      <p className="text-muted-foreground text-sm italic">"{rec.feeling}"</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="secondary" className="flex-1 rounded-full">
                         <Link href={rec.link}>{t('common.learnMore')}</Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-full shadow-md">
                         <Link href={BOOKING_APP_URL}>{t('common.bookNow')}</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="animate-fade-in text-center" style={{ animationDelay: '500ms' }}>
            <Button asChild size="lg" className="rounded-full px-8 py-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <Link href={BOOKING_APP_URL}>
                  {t('common.bookNow')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Processing Screen
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full mb-8 shadow-lg">
            <Brain className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-light text-foreground mb-4">
            {t('onboarding.processing.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('onboarding.processing.subtitle')}
          </p>
          <div className="mt-8">
            <div className="w-64 h-1.5 bg-secondary rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Onboarding Flow
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col py-6 px-4 max-w-5xl mx-auto w-full mb-24 relative z-10">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground font-medium">
              {t('onboarding.progress.step')} {currentStep + 1} {t('onboarding.progress.of')} {questions.length}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(255,180,5,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="flex-1 flex flex-col justify-center mb-6"
          >
            <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-10 text-center tracking-tight">
              {t(`onboarding.questions.${currentQuestion.id}.title`)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.id === 'goals'
                  ? data.goals.includes(option.id)
                  : data[currentQuestion.id as keyof OnboardingData] === option.id;

                return (
                  <motion.button
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={option.id}
                    onClick={() => handleSelection(currentQuestion.id, option.id)}
                    className={cn(
                      "group relative p-6 rounded-2xl transition-all duration-300 text-left min-h-[100px] flex items-center border shadow-sm",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-md"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
                    )}
                  >
                    <div className="flex items-center space-x-4 w-full relative z-10">
                      {option.icon && (
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-md transform scale-110"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <option.icon className="w-6 h-6" />
                        </div>
                      )}
                      <span className={cn(
                        "font-medium text-lg leading-tight transition-colors",
                        isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {option.label}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 text-primary animate-scale-in">
                        <CheckCircle className="w-5 h-5 fill-current" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => {
              if (currentStep === 0) {
                setShowWelcome(true);
              } else {
                setCurrentStep(prev => prev - 1);
              }
            }}
            className="rounded-full px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className={cn(
              "rounded-full px-8 py-3 shadow-lg transition-all",
              canProceed() ? "hover:shadow-xl hover:-translate-y-0.5" : ""
            )}
          >
            {isLastStep ? t('onboarding.finish') : t('common.continue')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

