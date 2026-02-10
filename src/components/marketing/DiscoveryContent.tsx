'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Brain,
  Sparkles,
  CheckCircle,
  MapPin,
  Globe,
  MessageCircle,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/marketing/LanguageContext';

interface FormData {
  location: string;
  description: string;
  userType: string;
  tensionAreas: string[];
  emotionalState: string;
  timeCommitment: string;
  budget: string;
}

interface Recommendation {
  service: string;
  description: string;
  price: string;
  duration: string;
  benefits: string[];
  icon: LucideIcon;
  color: string;
  analysis?: {
    problem?: string;
    goal?: string;
    feeling?: string;
  };
  diagnosis?: {
    profile: string;
    symptoms: string[];
    rootCause: string;
    strategy: string;
    frequency: string;
  };
}

// Fixed Keyword Weights with Multi-language support
const KEYWORD_WEIGHTS: Record<
  string,
  { category: 'physical' | 'emotional' | 'complex'; weight: number }
> = {
  // Physical (High Intensity)
  agony: { category: 'physical', weight: 5 },
  unbearable: { category: 'physical', weight: 5 },
  injury: { category: 'physical', weight: 4 },
  sciatica: { category: 'physical', weight: 4 },
  contracture: { category: 'physical', weight: 3 },
  pain: { category: 'physical', weight: 2 },
  ache: { category: 'physical', weight: 2 },
  stiff: { category: 'physical', weight: 2 },
  dolor: { category: 'physical', weight: 2 },
  lesion: { category: 'physical', weight: 4 },
  ciatica: { category: 'physical', weight: 4 },
  contractura: { category: 'physical', weight: 3 },
  боль: { category: 'physical', weight: 2 },
  травма: { category: 'physical', weight: 4 },
  ишиас: { category: 'physical', weight: 4 },
  // Catalan additions
  ferida: { category: 'physical', weight: 4 },
  lesió: { category: 'physical', weight: 4 },
  contractura_ca: { category: 'physical', weight: 3 }, // using suffix if common word conflicts but usually handled by lowercase
  mal: { category: 'physical', weight: 2 },

  // Emotional (High Intensity)
  panic: { category: 'emotional', weight: 5 },
  anxiety: { category: 'emotional', weight: 4 },
  insomnia: { category: 'emotional', weight: 4 },
  stress: { category: 'emotional', weight: 3 },
  overwhelmed: { category: 'emotional', weight: 3 },
  sad: { category: 'emotional', weight: 2 },
  ansiedad: { category: 'emotional', weight: 4 },
  insomnio: { category: 'emotional', weight: 4 },
  estres: { category: 'emotional', weight: 3 },
  agobio: { category: 'emotional', weight: 3 },
  паника: { category: 'emotional', weight: 5 },
  тревога: { category: 'emotional', weight: 4 },
  бессонница: { category: 'emotional', weight: 4 },
  стресс: { category: 'emotional', weight: 3 },
  // Catalan additions
  pànic: { category: 'emotional', weight: 5 },
  ansietat: { category: 'emotional', weight: 4 },
  insomni: { category: 'emotional', weight: 4 },
  estrès: { category: 'emotional', weight: 3 },
  atabalat: { category: 'emotional', weight: 3 },
  trist: { category: 'emotional', weight: 2 },

  // Complex/Integrative (High Intensity)
  fibromyalgia: { category: 'complex', weight: 5 },
  chronic: { category: 'complex', weight: 4 },
  migraine: { category: 'complex', weight: 4 },
  burnout: { category: 'complex', weight: 4 },
  digestive: { category: 'complex', weight: 3 },
  hormonal: { category: 'complex', weight: 3 },
  fatigue: { category: 'complex', weight: 3 },
  fibromialgia: { category: 'complex', weight: 5 },
  cronico: { category: 'complex', weight: 4 },
  migraña: { category: 'complex', weight: 4 },
  digestivo: { category: 'complex', weight: 3 },
  фибромиалгия: { category: 'complex', weight: 5 },
  хронический: { category: 'complex', weight: 4 },
  мигрень: { category: 'complex', weight: 4 },
  выгорание: { category: 'complex', weight: 4 },
  // Catalan additions
  crònic: { category: 'complex', weight: 4 },
  migranya: { category: 'complex', weight: 4 },
  fatiga: { category: 'complex', weight: 3 },
};

export default function DiscoveryContent() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Location, 1 = Description, 2 = UserType...
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');
  const [formData, setFormData] = useState<FormData>({
    location: '',
    description: '',
    userType: '',
    tensionAreas: [],
    emotionalState: '',
    timeCommitment: '',
    budget: '',
  });
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');

  // Move these to functional getters or keep as memos if they depend purely on 't'
  // But since 't' is from hook, we can keep them inside or use useMemo
  // For simplicity and clarity, I'll use useMemo for large arrays
  const locations = [
    { id: 'barcelona', title: t('discovery.location.barcelona'), icon: MapPin },
    { id: 'rubi', title: t('discovery.location.rubi'), icon: MapPin },
    { id: 'online', title: t('discovery.location.online'), icon: Globe },
  ];

  const userTypes = [
    {
      id: 'mother',
      title: t('discovery.userTypes.mother.title'),
      description: t('discovery.userTypes.mother.desc'),
      type: 'emotional',
    },
    {
      id: 'woman',
      title: t('discovery.userTypes.woman.title'),
      description: t('discovery.userTypes.woman.desc'),
      type: 'emotional',
    },
    {
      id: 'regular',
      title: t('discovery.userTypes.regular.title'),
      description: t('discovery.userTypes.regular.desc'),
      type: 'mixed',
    },
    {
      id: 'office',
      title: t('discovery.userTypes.office.title'),
      description: t('discovery.userTypes.office.desc'),
      type: 'physical',
    },
    {
      id: 'athlete',
      title: t('discovery.userTypes.athlete.title'),
      description: t('discovery.userTypes.athlete.desc'),
      type: 'physical',
    },
  ];

  const tensionOptions = [
    t('discovery.tension.neck'),
    t('discovery.tension.lumbar'),
    t('discovery.tension.legs'),
    t('discovery.tension.head'),
    t('discovery.tension.full'),
    t('discovery.tension.none'),
  ];

  const emotionalStates = [
    {
      id: 'stressed',
      title: t('discovery.emotional.stressed.title'),
      description: t('discovery.emotional.stressed.desc'),
    },
    {
      id: 'sad',
      title: t('discovery.emotional.sad.title'),
      description: t('discovery.emotional.sad.desc'),
    },
    {
      id: 'balanced',
      title: t('discovery.emotional.balanced.title'),
      description: t('discovery.emotional.balanced.desc'),
    },
    {
      id: 'focus_physical',
      title: t('discovery.emotional.focus_physical.title'),
      description: t('discovery.emotional.focus_physical.desc'),
    },
  ];

  const timeCommitments = [
    {
      id: 'short',
      title: t('discovery.time.short.title'),
      description: t('discovery.time.short.desc'),
    },
    {
      id: 'standard',
      title: t('discovery.time.standard.title'),
      description: t('discovery.time.standard.desc'),
    },
    {
      id: 'long',
      title: t('discovery.time.long.title'),
      description: t('discovery.time.long.desc'),
    },
  ];

  const budgetOptions = [
    {
      id: 'basic',
      title: t('discovery.budget.basic.title'),
      description: t('discovery.budget.basic.desc'),
    },
    {
      id: 'standard',
      title: t('discovery.budget.standard.title'),
      description: t('discovery.budget.standard.desc'),
    },
    {
      id: 'premium',
      title: t('discovery.budget.premium.title'),
      description: t('discovery.budget.premium.desc'),
    },
  ];

  const getRecommendation = (): Recommendation => {
    // 0. Online Location -> Online Service
    if (formData.location === 'online') {
      return {
        service: t('discovery.recommendation.online.service'),
        description: t('discovery.recommendation.online.desc'),
        price: '50-70€',
        duration: '1h',
        benefits: [
          t('discovery.recommendation.online.benefit1'),
          t('discovery.recommendation.online.benefit2'),
          t('discovery.recommendation.online.benefit3'),
          t('discovery.recommendation.online.benefit4'),
        ],
        icon: Globe,
        color: 'blue',
      };
    }

    const desc = formData.description.toLowerCase();

    // Scoring System
    const scores = {
      manual: 0,
      emotional: 0,
      integrative: 0,
      relax: 0,
    };

    // 1. Analyze Description Keywords with Weights
    Object.entries(KEYWORD_WEIGHTS).forEach(([keyword, info]) => {
      if (desc.includes(keyword)) {
        if (info.category === 'physical') scores.manual += info.weight;
        if (info.category === 'emotional') scores.emotional += info.weight;
        if (info.category === 'complex') scores.integrative += info.weight;
      }
    });

    // 2. Analyze User Type
    const selectedType = userTypes.find((obj) => obj.id === formData.userType);
    if (selectedType?.type === 'physical') scores.manual += 3;
    if (selectedType?.type === 'emotional') scores.emotional += 3;
    if (selectedType?.type === 'mixed') scores.relax += 2;

    // 3. Analyze Tension Areas
    const hasPain =
      formData.tensionAreas.length > 0 &&
      !formData.tensionAreas.includes(t('discovery.tension.none'));
    const fullBodyTension = formData.tensionAreas.includes(t('discovery.tension.full'));
    const headTension = formData.tensionAreas.includes(t('discovery.tension.head'));

    if (hasPain) scores.manual += 2;
    if (fullBodyTension) scores.integrative += 3;
    if (headTension) {
      scores.integrative += 2; // Head tension often relates to stress/posture complex
      scores.manual += 1;
    }

    // 4. Analyze Emotional State
    if (formData.emotionalState === 'stressed') scores.emotional += 3;
    if (formData.emotionalState === 'sad') scores.emotional += 2;
    if (formData.emotionalState === 'focus_physical') scores.manual += 2;
    if (formData.emotionalState === 'balanced') scores.relax += 2;

    // 5. Apply Constraints (Time & Budget)
    if (formData.timeCommitment === 'short' || formData.budget === 'basic') {
      scores.integrative -= 5; // Penalize complex treatments if time/budget is low
      scores.manual += 2; // Prefer manual for quick fixes
      scores.relax += 2;
    } else if (formData.timeCommitment === 'long' || formData.budget === 'premium') {
      scores.integrative += 4; // Boost integrative for premium/long sessions
      scores.emotional += 2;
    }

    // 6. Complex Interaction (Synergy)
    // If high physical AND high emotional score, boost integrative significantly
    if (scores.manual > 3 && scores.emotional > 3) {
      scores.integrative += 5;
    }

    // Determine Winner
    const maxScore = Math.max(scores.manual, scores.emotional, scores.integrative, scores.relax);

    // Dynamic Benefit Generation
    const generateBenefits = (baseBenefits: string[]) => {
      const dynamicBenefits = [...baseBenefits];

      // Add specific benefits based on inputs
      if (desc.includes('sleep') || desc.includes('insomnia') || desc.includes('dormir')) {
        dynamicBenefits[0] = t('casos.problems.sleep.results'); // "Improves deep sleep..."
      }
      if (desc.includes('migraine') || desc.includes('headache') || headTension) {
        dynamicBenefits[1] = t('casos.problems.migraines.results'); // "Reduces migraine frequency..."
      }
      if (selectedType?.id === 'athlete') {
        dynamicBenefits[2] = t('personalizedServices.athletes.result'); // "Faster recovery..."
      }
      if (selectedType?.id === 'office') {
        dynamicBenefits[2] = t('personalizedServices.officeWorkers.result'); // "Better posture..."
      }

      return dynamicBenefits.slice(0, 4); // Keep it to 4 items
    };

    // --- Analysis Logic ---
    const analysis: Recommendation['analysis'] = {};
    const diagnosis: Recommendation['diagnosis'] = {
      profile: '',
      symptoms: [],
      rootCause: '',
      strategy: '',
      frequency: '',
    };

    // 1. Problem & Symptoms
    if (
      formData.tensionAreas.length > 0 &&
      !formData.tensionAreas.includes(t('discovery.tension.none'))
    ) {
      analysis.problem = formData.tensionAreas.join(', ');
      diagnosis.symptoms = [...formData.tensionAreas];
    } else if (desc.length > 0) {
      const foundKeyword = Object.keys(KEYWORD_WEIGHTS).find((k) => desc.includes(k));
      if (foundKeyword) {
        analysis.problem = foundKeyword;
        diagnosis.symptoms.push(foundKeyword);
      }
    }

    // Add keywords to symptoms
    Object.keys(KEYWORD_WEIGHTS).forEach((k) => {
      if (desc.includes(k) && !diagnosis.symptoms.includes(k)) {
        diagnosis.symptoms.push(k);
      }
    });

    // 2. Goal & Profile
    if (selectedType?.id === 'athlete') analysis.goal = t('discovery.goal.athlete');
    else if (selectedType?.id === 'office') analysis.goal = t('discovery.goal.office');
    else if (formData.emotionalState === 'stressed') analysis.goal = t('discovery.goal.stress');
    else if (hasPain) analysis.goal = t('discovery.goal.pain');
    else analysis.goal = t('discovery.goal.general');

    const emotionalStateObj = emotionalStates.find((e) => e.id === formData.emotionalState);
    diagnosis.profile = `${selectedType?.title || ''} • ${emotionalStateObj?.title || ''}`;

    // 3. Feeling & Root Cause
    if (formData.emotionalState === 'stressed') analysis.feeling = t('discovery.feeling.relaxed');
    else if (formData.emotionalState === 'sad') analysis.feeling = t('discovery.feeling.energized');
    else if (formData.emotionalState === 'balanced')
      analysis.feeling = t('discovery.feeling.balanced');
    else if (hasPain) analysis.feeling = t('discovery.feeling.painfree');
    else analysis.feeling = t('discovery.feeling.relaxed');

    // Root Cause Logic
    if (
      selectedType?.id === 'office' &&
      (headTension || formData.tensionAreas.includes(t('discovery.tension.neck')))
    ) {
      diagnosis.rootCause = t('discovery.diagnosis.cause.posture');
    } else if (selectedType?.id === 'athlete') {
      diagnosis.rootCause = t('discovery.diagnosis.cause.overload');
    } else if (formData.emotionalState === 'stressed' && (headTension || fullBodyTension)) {
      diagnosis.rootCause = t('discovery.diagnosis.cause.stress');
    } else if (formData.emotionalState === 'sad') {
      diagnosis.rootCause = t('discovery.diagnosis.cause.emotional');
    } else {
      diagnosis.rootCause = t('discovery.diagnosis.cause.metabolic');
    }

    // Strategy Logic
    if (scores.integrative >= scores.manual && scores.integrative >= scores.emotional) {
      diagnosis.strategy = t('discovery.diagnosis.strategy.rebalance');
    } else if (scores.emotional > scores.manual) {
      diagnosis.strategy = t('discovery.diagnosis.strategy.regulation');
    } else {
      diagnosis.strategy = t('discovery.diagnosis.strategy.structural');
    }

    // Frequency Logic
    if (hasPain || formData.emotionalState === 'stressed' || formData.emotionalState === 'sad') {
      diagnosis.frequency = t('discovery.diagnosis.freq.high');
    } else if (formData.emotionalState === 'balanced') {
      diagnosis.frequency = t('discovery.diagnosis.freq.low');
    } else {
      diagnosis.frequency = t('discovery.diagnosis.freq.medium');
    }

    if (maxScore === scores.integrative && scores.integrative > 0) {
      return {
        service: t('discovery.recommendation.integrative.service'),
        description: t('discovery.recommendation.integrative.desc'),
        price: '90-120€',
        duration: '1,5-2h',
        benefits: generateBenefits([
          t('discovery.recommendation.integrative.benefit1'),
          t('discovery.recommendation.integrative.benefit2'),
          t('discovery.recommendation.integrative.benefit3'),
          t('discovery.recommendation.integrative.benefit4'),
        ]),
        icon: Sparkles,
        color: 'blue',
        analysis,
        diagnosis,
      };
    }

    if (maxScore === scores.emotional) {
      return {
        service: t('discovery.recommendation.emotional.service'),
        description: t('discovery.recommendation.emotional.desc'),
        price: '70€',
        duration: '1-1,5h',
        benefits: generateBenefits([
          t('discovery.recommendation.emotional.benefit1'),
          t('discovery.recommendation.emotional.benefit2'),
          t('discovery.recommendation.emotional.benefit3'),
          t('discovery.recommendation.emotional.benefit4'),
        ]),
        icon: Brain,
        color: 'purple',
        analysis,
        diagnosis,
      };
    }

    if (maxScore === scores.manual) {
      // Contextual Title for Manual Therapy
      let serviceTitle = t('discovery.recommendation.manual.service');
      if (selectedType?.id === 'athlete')
        serviceTitle += ` (${t('discovery.userTypes.athlete.title')})`;
      if (selectedType?.id === 'office')
        serviceTitle += ` (${t('discovery.userTypes.office.title')})`;

      return {
        service: serviceTitle,
        description: t('discovery.recommendation.manual.desc'),
        price: '60-75€',
        duration: '1-1,5h',
        benefits: generateBenefits([
          t('discovery.recommendation.manual.benefit1'),
          t('discovery.recommendation.manual.benefit2'),
          t('discovery.recommendation.manual.benefit3'),
          t('discovery.recommendation.manual.benefit4'),
        ]),
        icon: Heart,
        color: 'orange',
        analysis,
        diagnosis,
      };
    }

    // Default Fallback
    return {
      service: t('discovery.recommendation.relax.service'),
      description: t('discovery.recommendation.relax.desc'),
      price: '60-80€',
      duration: '1-1,5h',
      benefits: generateBenefits([
        t('discovery.recommendation.relax.benefit1'),
        t('discovery.recommendation.relax.benefit2'),
        t('discovery.recommendation.relax.benefit3'),
        t('discovery.recommendation.relax.benefit4'),
      ]),
      icon: Heart,
      color: 'green',
      analysis,
      diagnosis,
    };
  };

  const handleNext = () => {
    // Flow: 0 (Loc) -> 1 (Desc) -> 2 (User) -> 3 (Tension) -> 4 (Emotional) -> 5 (Time) -> 6 (Budget) -> 7 (Rec)
    setCurrentStep(currentStep + 1);
    if (currentStep === 6) {
      // 6 is budget, so +1 = 7 (Rec)
      setShowRecommendation(true);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.location !== '';
      case 1:
        return formData.description.length > 3; // Require at least 3 chars
      case 2:
        return formData.userType !== '';
      case 3:
        return formData.tensionAreas.length > 0;
      case 4:
        return formData.emotionalState !== '';
      case 5:
        return formData.timeCommitment !== '';
      case 6:
        return formData.budget !== '';
      default:
        return false;
    }
  };

  const recommendation = showRecommendation ? getRecommendation() : null;
  const Icon = recommendation?.icon;

  const handleBooking = () => {
    if (!selectedTime) {
      alert(t('booking.form.validationError'));
      return;
    }

    const message = `${t('booking.whatsapp.greeting', { name: 'Client' })}

${t('booking.whatsapp.service', { service: recommendation?.service || '' })}
${t('booking.whatsapp.comments', { comments: formData.description })}
${t('booking.whatsapp.location', { location: formData.location })}
${t('booking.whatsapp.time', { time: selectedTime })}`;

    const url = `https://wa.me/34658867133?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (showRecommendation && recommendation) {
    return (
      <>
        {/* Replaced SEOHead with metadata in page.tsx */}

        <section className="min-h-screen bg-linear-to-br from-white via-gray-50/50 to-blue-50/30 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-8">
            <div className="mb-12 text-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-green-100 px-6 py-3">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">
                  {t('discovery.recommendation.badge')}
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-tight font-light text-gray-900 sm:text-5xl">
                {t('discovery.recommendation.title')}
              </h1>

              <p className="mb-8 text-xl text-gray-600">{t('discovery.recommendation.subtitle')}</p>

              {recommendation.analysis && (
                <div className="mx-auto mb-12 max-w-2xl rounded-[20px] border border-blue-100 bg-blue-50 p-6 text-center">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {t('discovery.analysis.intro')}
                    {recommendation.analysis.problem && (
                      <span>
                        {' '}
                        {t('discovery.analysis.have')}{' '}
                        <strong className="font-semibold text-blue-800">
                          {recommendation.analysis.problem}
                        </strong>
                      </span>
                    )}
                    {recommendation.analysis.goal && (
                      <span>
                        {' '}
                        {t('discovery.analysis.want')}{' '}
                        <strong className="font-semibold text-blue-800">
                          {recommendation.analysis.goal}
                        </strong>
                      </span>
                    )}
                    {recommendation.analysis.feeling && (
                      <span>
                        {' '}
                        {t('discovery.analysis.feel')}{' '}
                        <strong className="font-semibold text-blue-800">
                          {recommendation.analysis.feeling}
                        </strong>
                      </span>
                    )}
                    .
                  </p>
                </div>
              )}

              {/* Toggle */}
              <div className="mb-8 inline-flex rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('basic')}
                  className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                    viewMode === 'basic'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('discovery.view.basic')}
                </button>
                <button
                  onClick={() => setViewMode('advanced')}
                  className={`rounded-lg px-6 py-2 text-sm font-medium transition-all ${
                    viewMode === 'advanced'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t('discovery.view.advanced')}
                </button>
              </div>
            </div>

            {viewMode === 'basic' ? (
              <div
                className={`rounded-[20px] border-2 bg-white shadow-xl ${getColorClasses(recommendation.color)} mb-8 p-8 sm:p-12`}
              >
                <div className="mb-8 text-center">
                  {Icon && (
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                      <Icon className="h-10 w-10 text-gray-700" />
                    </div>
                  )}

                  <h2 className="mb-4 text-3xl font-semibold text-gray-900">
                    {recommendation.service}
                  </h2>

                  <p className="mb-8 text-lg leading-relaxed text-gray-600">
                    {recommendation.description}
                  </p>

                  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-[20px] bg-gray-50 p-4 text-center">
                      <h4 className="mb-2 font-semibold text-gray-900">{t('common.price')}</h4>
                      <p className="text-2xl font-bold text-gray-800">{recommendation.price}</p>
                    </div>
                    <div className="rounded-[20px] bg-gray-50 p-4 text-center">
                      <h4 className="mb-2 font-semibold text-gray-900">{t('common.duration')}</h4>
                      <p className="text-2xl font-bold text-gray-800">{recommendation.duration}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 font-semibold text-gray-900">{t('common.benefits')}:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendation.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <div className="mr-3 h-2 w-2 shrink-0 rounded-full bg-gray-400"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 font-semibold text-gray-900">
                      {t('booking.form.timeSlot')}:
                    </h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {['morning', 'noon', 'afternoon', 'evening'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(t(`booking.options.timeSlot.${slot}`))}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            selectedTime === t(`booking.options.timeSlot.${slot}`)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {t(`booking.options.timeSlot.${slot}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.location === 'online' && (
                    <div className="mb-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                      {t('discovery.recommendation.online.note')}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button
                    onClick={handleBooking}
                    className="flex transform items-center justify-center rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg transition-colors duration-200 hover:-translate-y-0.5 hover:bg-[#128C7E] hover:shadow-xl"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('booking.direct.button')}
                  </button>
                  <button
                    onClick={() => setShowRecommendation(false)}
                    className="rounded-full bg-gray-100 px-8 py-4 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                  >
                    {t('discovery.recommendation.restart')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-[20px] border border-gray-200 bg-white p-8 shadow-xl sm:p-12">
                <h2 className="mb-8 flex items-center justify-center text-2xl font-semibold text-gray-900">
                  <ClipboardList className="mr-3 h-6 w-6 text-blue-600" />
                  {t('discovery.diagnosis.title')}
                </h2>

                <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Profile */}
                  <div className="rounded-[20px] bg-gray-50 p-6">
                    <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                      {t('discovery.diagnosis.profile')}
                    </h3>
                    <p className="text-lg font-medium text-gray-900">
                      {recommendation.diagnosis?.profile}
                    </p>
                  </div>

                  {/* Symptoms */}
                  <div className="rounded-[20px] bg-gray-50 p-6">
                    <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase">
                      {t('discovery.diagnosis.symptoms')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.diagnosis?.symptoms.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause */}
                  <div className="rounded-[20px] border border-blue-100 bg-blue-50 p-6">
                    <h3 className="mb-3 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                      {t('discovery.diagnosis.rootCause')}
                    </h3>
                    <p className="text-lg font-medium text-blue-900">
                      {recommendation.diagnosis?.rootCause}
                    </p>
                  </div>

                  {/* Strategy */}
                  <div className="rounded-[20px] border border-purple-100 bg-purple-50 p-6">
                    <h3 className="mb-3 text-sm font-semibold tracking-wider text-purple-600 uppercase">
                      {t('discovery.diagnosis.strategy')}
                    </h3>
                    <p className="text-lg font-medium text-purple-900">
                      {recommendation.diagnosis?.strategy}
                    </p>
                  </div>
                </div>

                {/* Frequency */}
                <div className="mb-12 rounded-[20px] border border-green-100 bg-green-50 p-6 text-center">
                  <h3 className="mb-3 text-sm font-semibold tracking-wider text-green-600 uppercase">
                    {t('discovery.diagnosis.frequency')}
                  </h3>
                  <p className="text-lg font-medium text-green-900">
                    {recommendation.diagnosis?.frequency}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button
                    onClick={handleBooking}
                    className="flex transform items-center justify-center rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white shadow-lg transition-colors duration-200 hover:-translate-y-0.5 hover:bg-[#128C7E] hover:shadow-xl"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('booking.direct.button')}
                  </button>
                  <button
                    onClick={() => setShowRecommendation(false)}
                    className="rounded-full bg-gray-100 px-8 py-4 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-200"
                  >
                    {t('discovery.recommendation.restart')}
                  </button>
                </div>
              </div>
            )}

            <div className="text-center text-gray-500">
              <p className="mb-4">{t('discovery.recommendation.why')}</p>
              <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
                {t('common.contact')}
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-linear-to-br from-white via-gray-50/50 to-blue-50/30 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-6 py-3">
              <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">
                {t('discovery.recommendation.badge')}
              </span>
            </div>

            <h1 className="mb-6 flex items-center justify-center gap-3 text-4xl leading-tight font-light text-gray-900 sm:text-5xl">
              👋 {t('hero.title')}
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                BETA
              </span>
            </h1>

            <p className="mb-8 text-xl text-gray-600">{t('discovery.recommendation.subtitle')}</p>

            {/* Progress indicator - 7 steps now */}
            <div className="mb-8 flex items-center justify-center space-x-2">
              {[0, 1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[20px] border border-gray-100 bg-white p-8 shadow-xl sm:p-12">
            {/* Step 0: Location */}
            {currentStep === 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  📍 {t('discovery.step.location.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step.location.subtitle')}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {locations.map((loc) => {
                    const LocIcon = loc.icon;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setFormData({ ...formData, location: loc.id })}
                        className={`flex flex-col items-center justify-center rounded-[20px] border-2 p-6 text-center transition-all duration-200 hover:shadow-lg ${
                          formData.location === loc.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                            formData.location === loc.id
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <LocIcon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{loc.title}</h3>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 1: Description */}
            {currentStep === 1 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  📝 {t('discovery.step.description.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step.description.subtitle')}</p>

                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('discovery.step.description.placeholder')}
                  className="h-40 w-full resize-none rounded-[20px] border-2 border-gray-200 p-4 text-lg focus:border-blue-500 focus:ring-0"
                />
                <p className="mt-2 text-right text-sm text-gray-500">
                  {formData.description.length}/3 {t('discovery.step.description.minChars')}
                </p>
              </div>
            )}

            {/* Step 2: User Type */}
            {currentStep === 2 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  💡 {t('discovery.step1.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step1.subtitle')}</p>

                <div className="space-y-4">
                  {userTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, userType: type.id })}
                      className={`w-full rounded-[20px] border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
                        formData.userType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="mb-2 font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Tension Areas */}
            {currentStep === 3 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  📍 {t('discovery.step2.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step2.subtitle')}</p>

                <div className="space-y-4">
                  {tensionOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        const newAreas = formData.tensionAreas.includes(option)
                          ? formData.tensionAreas.filter((area) => area !== option)
                          : [...formData.tensionAreas, option];
                        setFormData({ ...formData, tensionAreas: newAreas });
                      }}
                      className={`w-full rounded-[20px] border-2 p-4 text-left transition-all duration-200 ${
                        formData.tensionAreas.includes(option)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{option}</span>
                        {formData.tensionAreas.includes(option) && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Emotional State */}
            {currentStep === 4 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  🧘 {t('discovery.step4.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step4.subtitle')}</p>

                <div className="space-y-4">
                  {emotionalStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => setFormData({ ...formData, emotionalState: state.id })}
                      className={`w-full rounded-[20px] border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
                        formData.emotionalState === state.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="mb-2 font-semibold text-gray-900">{state.title}</h3>
                      <p className="text-sm text-gray-600">{state.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Time Commitment */}
            {currentStep === 5 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  ⏰ {t('discovery.step5.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step5.subtitle')}</p>

                <div className="space-y-4">
                  {timeCommitments.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setFormData({ ...formData, timeCommitment: time.id })}
                      className={`w-full rounded-[20px] border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
                        formData.timeCommitment === time.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="mb-2 font-semibold text-gray-900">{time.title}</h3>
                      <p className="text-sm text-gray-600">{time.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Budget */}
            {currentStep === 6 && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                  💰 {t('discovery.step6.title')}
                </h2>
                <p className="mb-8 text-gray-600">{t('discovery.step6.subtitle')}</p>

                <div className="space-y-4">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setFormData({ ...formData, budget: budget.id })}
                      className={`w-full rounded-[20px] border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
                        formData.budget === budget.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="mb-2 font-semibold text-gray-900">{budget.title}</h3>
                      <p className="text-sm text-gray-600">{budget.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
              <button
                onClick={handleBack}
                className={`flex items-center rounded-full px-6 py-3 font-medium transition-colors duration-200 ${
                  currentStep === 0
                    ? 'cursor-not-allowed text-gray-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('discovery.back')}
              </button>

              <span className="text-sm text-gray-500">
                {t('common.step')} {currentStep + 1} {t('common.of')} 7
              </span>

              <button
                onClick={handleNext}
                className={`flex items-center rounded-full px-6 py-3 font-medium transition-colors duration-200 ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
                disabled={!canProceed()}
              >
                {currentStep === 6 ? t('discovery.seeRecommendation') : t('discovery.next')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
