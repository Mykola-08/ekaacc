'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Heart,
  Brain,
  Leaf,
  User,
  Target,
  Sparkles,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/marketing/LanguageContext';
// import { useSupabaseAuth } from '@/context/marketing/SupabaseAuthContext';
// import { supabase } from '@/lib/marketing/supabase';
import PriceDisplay from './PriceDisplay';
import { OnboardingData, Recommendation } from '@/shared/marketing/types';

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
  // const { user } = useSupabaseAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    userType: '',
    goals: [],
    preferredFeeling: '',
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
        { id: 'other', label: t('onboarding.userTypes.other'), icon: User },
      ],
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
        { id: 'selfworth', label: t('onboarding.goals.selfworth'), icon: Sparkles },
      ],
    },
    {
      id: 'preferredFeeling',
      type: 'single',
      options: [
        { id: 'calm', label: t('onboarding.feelings.calm'), icon: Leaf },
        { id: 'light', label: t('onboarding.feelings.light'), icon: Sparkles },
        { id: 'energized', label: t('onboarding.feelings.energized'), icon: Sparkles },
        { id: 'focused', label: t('onboarding.feelings.focused'), icon: Brain },
        { id: 'confident', label: t('onboarding.feelings.confident'), icon: Target },
      ],
    },
  ];

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleSelection = (questionId: keyof OnboardingData, optionId: string) => {
    if (questionId === 'goals') {
      setData((prev) => ({
        ...prev,
        goals: prev.goals.includes(optionId)
          ? prev.goals.filter((g) => g !== optionId)
          : [...prev.goals, optionId],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [questionId]: optionId,
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
      setCurrentStep((prev) => prev + 1);
    }
  };

  const processResults = async () => {
    setIsProcessing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate recommendations based on user data
    const recs = generateRecommendations(data);
    setRecommendations(recs);

    /*
    // Save to Supabase if user is logged in
    if (user) {
      try {
        await supabase.from('user_onboarding').upsert({
          user_id: user.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: data as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recommendations: recs as any,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      } catch (error) {
        console.error('Error saving onboarding data:', error);
      }
    }
    */
    setIsProcessing(false);
    setShowResults(true);
  };

  const generateRecommendations = (userData: OnboardingData): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Always recommend Massage (Fast Result, Pleasant)
    recommendations.push({
      id: 'massage',
      title: t('services.massage.title'),
      description: t('recommendations.massage.description'),
      price: 60,
      duration: '60 min',
      link: '/services/massage',
      personalizedLink: getPersonalizedLink(userData.userType),
      feeling: t('recommendations.massage.feeling') || 'Cos relaxat i ment en calma',
    });

    // Recommend Kinesiology/Osteopathy based on goals (Deep work, Long-term)
    if (
      userData.goals.includes('pain') ||
      userData.goals.includes('posture') ||
      userData.goals.includes('energy') ||
      userData.goals.includes('vitality') ||
      userData.goals.includes('stress')
    ) {
      recommendations.push({
        id: 'kinesiology',
        title: t('services.kinesiology.title'),
        description: t('recommendations.kinesiology.description'),
        price: 70,
        duration: '60 min',
        link: '/services/kinesiology',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.kinesiology.feeling') || 'Claredat mental i energia renovada',
      });
    }

    // Recommend Kinesiology emotional/mental focus
    if (
      userData.goals.includes('focus') ||
      userData.goals.includes('inspiration') ||
      userData.goals.includes('lightness')
    ) {
      recommendations.push({
        id: 'kinesiology_psy',
        title: t('services.kinesiology.subtitle') || 'Kinesiologia',
        description:
          t('recommendations.kinesiology.emotional_description') ||
          t('recommendations.kinesiology.description'),
        price: 70,
        duration: '60 min',
        link: '/services/kinesiology',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling:
          t('recommendations.kinesiology.emotional_feeling') ||
          'Equilibri emocional i pau interior',
      });
    }

    // Recommend Systemic Therapy for life/relationship issues
    if (
      userData.goals.includes('money') ||
      userData.goals.includes('relationships') ||
      userData.goals.includes('family') ||
      userData.goals.includes('selfworth')
    ) {
      recommendations.push({
        id: 'systemic',
        title: t('service.systemic.title') || 'Teràpia Sistèmica',
        description:
          t('recommendations.systemic.description') ||
          'Ordena els teus vincles familiars i sistèmics per desbloquejar la teva vida.',
        price: 80,
        duration: '90 min',
        link: '/services/systemic-therapy',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.systemic.feeling') || 'Ordre intern i alleujament',
      });
    }

    // Recommend Supplements for Energy/Vitality/Focus
    if (
      userData.goals.includes('energy') ||
      userData.goals.includes('vitality') ||
      userData.goals.includes('focus') ||
      userData.goals.includes('lightness')
    ) {
      recommendations.push({
        id: 'supplements',
        title: t('service.supplements.title') || 'Personalized Supplements',
        description:
          t('recommendations.supplements.description') ||
          'Advanced cellular nutrition to boost your daily performance.',
        price: 0,
        duration: 'Product',
        link: '/agenyz',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.supplements.feeling') || 'Vitality from within',
      });
    }

    // Ensure we have at least 2 recommendations
    if (recommendations.length < 2) {
      recommendations.push({
        id: 'feldenkrais',
        title: t('services.feldenkrais.title'),
        description: t('recommendations.feldenkrais.description'),
        price: 60,
        duration: '60 min',
        link: '/services/feldenkrais',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.feldenkrais.feeling') || 'Moviment lliure i sense dolor',
      });
    }

    // Add Free Consultation Fallback if not sure
    recommendations.push({
      id: 'consultation',
      title: t('services.consultation.title') || 'Consulta Gratuïta 15 min',
      description:
        t('services.consultation.description') ||
        'No estàs segura? Parlem 15 minuts sense compromís per veure com et puc ajudar.',
      price: 0,
      duration: '15 min',
      link: '/contact', // Or booking specific link
      personalizedLink: '/contact',
      feeling: t('services.consultation.feeling') || 'Claredat sobre el teu camí',
    });

    const uniqueRecs = [];
    const seen = new Set();
    for (const rec of recommendations) {
      if (!seen.has(rec.id)) {
        seen.add(rec.id);
        uniqueRecs.push(rec);
      }
    }
    return uniqueRecs; // Return all unique recs, including consultation if applicable
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
      senior: 'seniors',
    };

    const mappedType = userTypeMap[userType] || userType;
    return `/for-${mappedType}`;
  };

  const startOnboarding = () => {
    setShowWelcome(false);
  };

  // Welcome Screen - Full Page
  if (showWelcome) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 px-4"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#FFB405]/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-4 shadow-blue-900/5 ring-white"
          >
            <Heart className="h-12 w-12 text-[#FFB405]" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-4xl leading-tight font-light tracking-tight text-gray-900 sm:text-5xl"
          >
            🌿 {t('onboarding.welcome.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-12 max-w-xl text-xl leading-relaxed font-light text-gray-600"
          >
            {t('onboarding.welcome.description')}
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={startOnboarding}
            className="inline-flex items-center rounded-full bg-[#FFB405] px-10 py-4 text-lg font-semibold text-[#000035] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#e8a204] hover:shadow-[#FFB405]/20"
          >
            {t('common.getStarted')}
            <ChevronRight className="ml-3 h-6 w-6" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Results Screen - Full Page
  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white px-4 py-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mb-4 text-3xl font-light text-gray-900">
              {t('onboarding.results.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t('onboarding.results.subtitle')}
            </p>
          </div>

          <div className="mb-8 grid gap-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{rec.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{rec.description}</p>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between gap-2 md:w-auto md:flex-col md:items-end md:justify-start">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      #{index + 1} {t('onboarding.results.recommended')}
                    </span>
                    <div className="flex flex-col items-end">
                      {rec.price !== undefined && (
                        <PriceDisplay
                          basePriceCents={rec.price * 100}
                          size="lg"
                          showCalculation={true}
                        />
                      )}
                      {rec.duration && (
                        <span className="mt-1 text-sm font-medium text-gray-500">
                          {rec.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {rec.feeling && (
                  <div className="mb-4 rounded-lg bg-blue-50/50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-800">
                      <Sparkles className="h-4 w-4" />
                      <span>{t('onboarding.results.howYouWillFeel') || 'Com et sentiràs:'}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{rec.feeling}"</p>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={rec.link}
                    className="flex flex-1 items-center justify-center rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                  >
                    {t('common.learnMore')}
                  </Link>
                  <Link
                    href="/book"
                    className="flex flex-1 transform items-center justify-center rounded-full bg-[#FFB405] px-4 py-2 text-sm font-semibold text-[#000035] shadow-md transition-colors duration-200 hover:-translate-y-0.5 hover:bg-[#e8a204] hover:shadow-lg"
                  >
                    {t('common.bookNow')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/book"
              className="inline-flex transform items-center rounded-full bg-[#FFB405] px-8 py-4 font-semibold text-[#000035] shadow-lg transition-colors duration-200 hover:-translate-y-1 hover:bg-[#e8a204] hover:shadow-xl"
            >
              {t('common.bookNow')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Processing Screen - Full Page
  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <Brain className="h-10 w-10 animate-pulse text-[#FFB405]" />
          </div>
          <h2 className="mb-4 text-2xl font-light text-gray-900">
            {t('onboarding.processing.title')}
          </h2>
          <p className="text-gray-500">{t('onboarding.processing.subtitle')}</p>
          <div className="mt-8">
            <div className="mx-auto h-1.5 w-64 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-full rounded-full bg-[#FFB405]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Form - Full Page, Single Screen
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#FFB405]/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[100px]" />

      <div className="relative z-10 mx-auto mb-24 flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              {t('onboarding.progress.step')} {currentStep + 1} {t('onboarding.progress.of')}{' '}
              {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-[#FFB405] shadow-[0_0_10px_rgba(255,180,5,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.3 }}
            className="mb-6 flex flex-1 flex-col justify-center"
          >
            <h2 className="mb-10 text-center text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
              {t(`onboarding.questions.${currentQuestion.id}.title`)}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentQuestion.options.map((option) => {
                const isSelected =
                  currentQuestion.id === 'goals'
                    ? data.goals.includes(option.id)
                    : data[currentQuestion.id as keyof OnboardingData] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelection(currentQuestion.id, option.id)}
                    className={`group relative flex min-h-[100px] items-center rounded-[20px] border p-6 text-left shadow-sm transition-all duration-300 ${
                      isSelected
                        ? 'border-[#FFB405] bg-[#FFB405]/5 shadow-md ring-1 ring-[#FFB405]'
                        : 'border-white bg-white hover:-translate-y-1 hover:border-[#FFB405]/50 hover:shadow-lg'
                    } `}
                  >
                    <div className="relative z-10 flex w-full items-center space-x-4">
                      {option.icon && (
                        <div
                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                            isSelected
                              ? 'scale-110 transform bg-[#FFB405] text-[#000035] shadow-md'
                              : 'bg-gray-50 text-gray-400 group-hover:bg-[#FFB405]/10 group-hover:text-[#FFB405]'
                          } `}
                        >
                          <option.icon className="h-6 w-6" />
                        </div>
                      )}
                      <span
                        className={`text-lg leading-tight font-medium transition-colors ${isSelected ? 'text-[#000035]' : 'text-gray-600 group-hover:text-gray-900'}`}
                      >
                        {option.label}
                      </span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 text-[#FFB405]"
                      >
                        <CheckCircle className="h-5 w-5 fill-current" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/50 bg-white/80 p-4 shadow-[0_-4px_30px_rgba(0,0,0,0.03)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => {
              if (currentStep === 0) {
                setShowWelcome(true);
              } else {
                setCurrentStep((prev) => prev - 1);
              }
            }}
            className="flex items-center rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('common.back')}
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`flex items-center rounded-full px-8 py-3 font-semibold transition-all duration-200 ${
              canProceed()
                ? 'transform bg-[#FFB405] text-[#000035] shadow-lg hover:-translate-y-0.5 hover:bg-[#e8a204] hover:shadow-xl'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            } `}
          >
            {isLastStep ? t('onboarding.finish') : t('common.continue')}
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
