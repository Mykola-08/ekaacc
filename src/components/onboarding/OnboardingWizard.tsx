'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingQuestion } from '@/types/personalization';
import { toast } from '@/components/ui/morphing-toaster';
// import { submitOnboarding } from '@/server/personalization/actions';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface OnboardingWizardProps {
  questions: OnboardingQuestion[];
  userProfileId: string;
}

export function OnboardingWizard({ questions, userProfileId }: OnboardingWizardProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Type helpers
  const questionType = currentQuestion?.type;
  const questionOptions = currentQuestion?.options;

  // Helper to normalize options
  const getOptions = () => {
    if (!questionOptions) return [];
    if (Array.isArray(questionOptions)) {
      return questionOptions.map((opt) => {
        if (typeof opt === 'string') return { label: opt, value: opt };
        return opt; // assume {label, value}
      });
    }
    return [];
  };

  const normalizedOptions = getOptions();

  const handleAnswer = (value: any) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = async () => {
    // Validation: Assume required
    if (!currentQuestion) return;
    if (!answers[currentQuestion.id]) {
      toast.error('Please answer the question to continue');
      return;
    }

    if (isLast) {
      setIsSubmitting(true);
      try {
        const mappedAnswers = Object.entries(answers).map(([questionId, value]) => ({
          question_id: questionId,
          response_data: value,
        }));

        // await submitOnboarding(userProfileId, mappedAnswers);
        await new Promise(resolve => setTimeout(resolve, 500));
        setCompleted(true);
        setTimeout(() => {
          window.location.href = '/'; // Go to dashboard
        }, 2000);
      } catch (error) {
        console.error(error);
        toast.error('Failed to save your profile. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (completed) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="animate-in zoom-in text-center duration-500">
          <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-foreground mb-2 font-sans text-3xl font-semibold tracking-tight">
            You're All Set
          </h1>
          <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Progress Bar */}
      <Progress value={progress} className="bg-primary/10 h-1 w-full rounded-none" />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pt-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
              Question {currentIndex + 1} of {questions.length}
            </div>

            <h2 className="text-foreground mb-4 font-sans text-3xl leading-tight font-medium tracking-tight md:text-4xl">
              {currentQuestion.questionText}
            </h2>

            <div className="mb-12 space-y-4">
              {questionType === 'single_choice' && normalizedOptions.length > 0 && (
                <div className="grid gap-3">
                  {normalizedOptions.map((option: any) => (
                    <div
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={cn(
                        'group glass-card flex w-full cursor-pointer items-center justify-between rounded-lg border p-6 text-left transition-all hover:bg-white/80',
                        answers[currentQuestion.id] === option.value
                          ? 'border-primary ring-primary ring-1'
                          : 'hover:border-primary/50 border-white/40'
                      )}
                    >
                      <span
                        className={cn(
                          'text-lg font-medium transition-colors',
                          answers[currentQuestion.id] === option.value
                            ? 'text-primary'
                            : 'text-foreground'
                        )}
                      >
                        {option.label}
                      </span>
                      {answers[currentQuestion.id] === option.value && (
                        <div className="bg-primary rounded-full p-1 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {questionType === 'multi_choice' && normalizedOptions.length > 0 && (
                <div className="grid gap-3">
                  {normalizedOptions.map((option: any) => {
                    const currentAnswers = (answers[currentQuestion.id] as any[]) || [];
                    const isSelected = currentAnswers.includes(option.value);

                    return (
                      <div
                        key={option.value}
                        onClick={() => {
                          const newAnswers = isSelected
                            ? currentAnswers.filter((a) => a !== option.value)
                            : [...currentAnswers, option.value];
                          handleAnswer(newAnswers);
                        }}
                        className={cn(
                          'group glass-card flex w-full cursor-pointer items-center justify-between rounded-lg border p-6 text-left transition-all hover:bg-white/80',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50 border-white/40'
                        )}
                      >
                        <span
                          className={cn(
                            'text-lg font-medium transition-colors',
                            isSelected ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {option.label}
                        </span>
                        <div
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                            isSelected ? 'border-primary bg-primary text-white' : 'border-black/20'
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {questionType === 'scale' && (
                <div className="glass-panel flex items-center justify-between rounded-lg p-8">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-xl font-semibold transition-all md:h-16 md:w-16',
                        answers[currentQuestion.id] === val
                          ? 'bg-primary shadow-primary/20 scale-110 text-white shadow-lg'
                          : 'text-muted-foreground bg-black/5 hover:bg-black/10'
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {questionType === 'text' && (
                <div className="bg-card border-border focus-within:ring-ring rounded-xl border p-2 shadow-sm transition-all focus-within:ring-2">
                  <Input
                    type="text"
                    className="h-auto w-full border-none bg-transparent p-4 text-lg shadow-none"
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentIndex === 0}
                className={cn(currentIndex === 0 && 'pointer-events-none opacity-0')}
              >
                <ChevronLeft className="mr-1 h-5 w-5" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                size="lg"
                className="h-14 rounded-full px-8 text-lg shadow-lg transition-all hover:-translate-y-1 hover:shadow-sm"
              >
                {isLast ? (isSubmitting ? 'Saving...' : 'Complete Profile') : 'Continue'}
                {!isLast && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
