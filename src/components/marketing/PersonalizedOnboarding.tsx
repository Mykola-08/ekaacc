"use client";


import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Brain, Leaf, User, Target, Sparkles, CheckCircle, ArrowLeft } from 'lucide-react';
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

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

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
      feeling: t('recommendations.massage.feeling') || 'Cos relaxat i ment en calma'
    });

    // Recommend Kinesiology/Osteopathy based on goals (Deep work, Long-term)
    if (userData.goals.includes('pain') ||
      userData.goals.includes('posture') ||
      userData.goals.includes('energy') ||
      userData.goals.includes('vitality') ||
      userData.goals.includes('stress')) {
      recommendations.push({
        id: 'kinesiology',
        title: t('services.kinesiology.title'),
        description: t('recommendations.kinesiology.description'),
        price: 70,
        duration: '60 min',
        link: '/services/kinesiology',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.kinesiology.feeling') || 'Claredat mental i energia renovada'
      });
    }

    // Recommend Kinesiology emotional/mental focus
    if (userData.goals.includes('focus') ||
      userData.goals.includes('inspiration') ||
      userData.goals.includes('lightness')) {
      recommendations.push({
        id: 'kinesiology_psy',
        title: t('services.kinesiology.subtitle') || 'Kinesiologia',
        description: t('recommendations.kinesiology.emotional_description') || t('recommendations.kinesiology.description'),
        price: 70,
        duration: '60 min',
        link: '/services/kinesiology',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.kinesiology.emotional_feeling') || 'Equilibri emocional i pau interior'
      });
    }

    // Recommend Systemic Therapy for life/relationship issues
    if (userData.goals.includes('money') ||
      userData.goals.includes('relationships') ||
      userData.goals.includes('family') ||
      userData.goals.includes('selfworth')) {
      recommendations.push({
        id: 'systemic',
        title: t('service.systemic.title') || 'Teràpia Sistèmica',
        description: t('recommendations.systemic.description') || 'Ordena els teus vincles familiars i sistèmics per desbloquejar la teva vida.',
        price: 80,
        duration: '90 min',
        link: '/services/systemic-therapy',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.systemic.feeling') || 'Ordre intern i alleujament'
      });
    }

    // Recommend Supplements for Energy/Vitality/Focus
    if (userData.goals.includes('energy') ||
      userData.goals.includes('vitality') ||
      userData.goals.includes('focus') ||
      userData.goals.includes('lightness')) {
      recommendations.push({
        id: 'supplements',
        title: t('service.supplements.title') || 'Personalized Supplements',
        description: t('recommendations.supplements.description') || 'Advanced cellular nutrition to boost your daily performance.',
        price: 0,
        duration: 'Product',
        link: '/agenyz',
        personalizedLink: getPersonalizedLink(userData.userType),
        feeling: t('recommendations.supplements.feeling') || 'Vitality from within'
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
        feeling: t('recommendations.feldenkrais.feeling') || 'Moviment lliure i sense dolor'
      });
    }

    // Add Free Consultation Fallback if not sure
    recommendations.push({
      id: 'consultation',
      title: t('services.consultation.title') || 'Consulta Gratuïta 15 min',
      description: t('services.consultation.description') || 'No estàs segura? Parlem 15 minuts sense compromís per veure com et puc ajudar.',
      price: 0,
      duration: '15 min',
      link: '/contact', // Or booking specific link
      personalizedLink: '/contact',
      feeling: t('services.consultation.feeling') || 'Claredat sobre el teu camí'
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
      senior: 'seniors'
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
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFB405]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px]" />
        </div>

        <div className="text-center max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-8 shadow-xl shadow-blue-900/5 ring-4 ring-white"
          >
            <Heart className="w-12 h-12 text-[#FFB405]" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-light text-gray-900 mb-8 leading-tight tracking-tight"
          >
            🌿 {t('onboarding.welcome.title')}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 leading-relaxed max-w-xl mx-auto font-light"
          >
            {t('onboarding.welcome.description')}
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={startOnboarding}
            className="inline-flex items-center bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-10 py-4 rounded-full transition-all duration-300 text-lg shadow-lg hover:shadow-[#FFB405]/20 hover:-translate-y-1"
          >
            {t('common.getStarted')}
            <ChevronRight className="w-6 h-6 ml-3" />
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
        className="min-h-screen bg-white py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              {t('onboarding.results.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('onboarding.results.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {rec.description}
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      #{index + 1} {t('onboarding.results.recommended')}
                    </span>
                    <div className="flex flex-col items-end">
                      {rec.price !== undefined && <PriceDisplay basePriceCents={rec.price * 100} size="lg" showCalculation={true} />}
                      {rec.duration && (
                        <span className="text-sm text-gray-500 font-medium mt-1">
                          {rec.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {rec.feeling && (
                  <div className="mb-4 bg-blue-50/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800 text-sm font-medium mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span>{t('onboarding.results.howYouWillFeel') || 'Com et sentiràs:'}</span>
                    </div>
                    <p className="text-gray-700 text-sm italic">"{rec.feeling}"</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={rec.link}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    {t('common.learnMore')}
                  </Link>
                  <Link
                    href="/booking"
                    className="flex-1 bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-4 py-2 rounded-full transition-colors duration-200 flex items-center justify-center text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {t('common.bookNow')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/booking"
              className="inline-flex items-center bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('common.bookNow')}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Processing Screen - Full Page
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8 shadow-lg">
            <Brain className="w-10 h-10 text-[#FFB405] animate-pulse" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            {t('onboarding.processing.title')}
          </h2>
          <p className="text-gray-500">
            {t('onboarding.processing.subtitle')}
          </p>
          <div className="mt-8">
            <div className="w-64 h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-[#FFB405] rounded-full"
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

  // Onboarding Form - Full Page, Single Screen
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB405]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col py-6 px-4 max-w-5xl mx-auto w-full mb-24 relative z-10">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600 font-medium">
              {t('onboarding.progress.step')} {currentStep + 1} {t('onboarding.progress.of')} {questions.length}
            </span>
            <span className="text-sm text-gray-600 font-medium">
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#FFB405] rounded-full shadow-[0_0_10px_rgba(255,180,5,0.5)]"
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
            className="flex-1 flex flex-col justify-center mb-6"
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-10 text-center tracking-tight">
              {t(`onboarding.questions.${currentQuestion.id}.title`)}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.id === 'goals'
                  ? data.goals.includes(option.id)
                  : data[currentQuestion.id as keyof OnboardingData] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelection(currentQuestion.id, option.id)}
                    className={`
                      group relative p-6 rounded-2xl transition-all duration-300 text-left min-h-[100px] flex items-center
                      border shadow-sm
                      ${isSelected
                        ? 'border-[#FFB405] bg-[#FFB405]/5 ring-1 ring-[#FFB405] shadow-md'
                        : 'border-white bg-white hover:border-[#FFB405]/50 hover:shadow-lg hover:-translate-y-1'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4 w-full relative z-10">
                      {option.icon && (
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                          ${isSelected
                            ? 'bg-[#FFB405] text-[#000035] shadow-md transform scale-110'
                            : 'bg-gray-50 text-gray-400 group-hover:bg-[#FFB405]/10 group-hover:text-[#FFB405]'}
                        `}>
                          <option.icon className="w-6 h-6" />
                        </div>
                      )}
                      <span className={`font-medium text-lg leading-tight transition-colors ${isSelected ? 'text-[#000035]' : 'text-gray-600 group-hover:text-gray-900'}`}>
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
                        <CheckCircle className="w-5 h-5 fill-current" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/50 p-4 z-50 shadow-[0_-4px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              if (currentStep === 0) {
                setShowWelcome(true);
              } else {
                setCurrentStep(prev => prev - 1);
              }
            }}
            className="px-6 py-3 rounded-full font-semibold transition-colors duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`
              px-8 py-3 rounded-full font-semibold transition-all duration-200 flex items-center
              ${canProceed()
                ? 'bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLastStep ? t('onboarding.finish') : t('common.continue')}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}





