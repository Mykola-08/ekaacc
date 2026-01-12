'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingQuestion } from '@/types/personalization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { submitOnboarding } from '@/server/personalization/actions';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface OnboardingWizardProps {
  questions: OnboardingQuestion[];
  userProfileId: string;
}

export function OnboardingWizard({ questions, userProfileId }: OnboardingWizardProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id]) {
      toast.error('Please provide an answer');
      return;
    }

    if (isLast) {
      setIsSubmitting(true);
      try {
        const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
          questionId: qId,
          value: val
        }));
        await submitOnboarding(userProfileId, formattedAnswers);
        toast.success("All set! Thanks.");
      } catch (e) {
        toast.error("Something went wrong.");
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-serif mb-2 text-foreground">Welcome</h1>
          <div className="flex gap-1 justify-center">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx <= currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20"
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <Card className="border shadow-lg bg-card text-card-foreground">
              <CardHeader>
                <CardTitle className="text-xl text-center leading-relaxed font-semibold">
                  {currentQuestion.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionInput 
                  question={currentQuestion} 
                  value={answers[currentQuestion.id]} 
                  onChange={handleAnswer} 
                />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-12 text-lg rounded-xl" 
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Finishing...' : (isLast ? 'Complete' : 'Continue')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuestionInput({ question, value, onChange }: { 
  question: OnboardingQuestion, 
  value: any, 
  onChange: (val: any) => void 
}) {
  const options = question.options as string[] | any;

  switch (question.type) {
    case 'single_choice':
      return (
        <div className="flex flex-col gap-3">
          {Array.isArray(options) && options.map((opt: string) => (
            <motion.button
              layout
              key={opt}
              onClick={() => onChange(opt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-4 rounded-xl text-left transition-colors border",
                value === opt 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border bg-secondary/30 hover:bg-secondary"
              )}
            >
              <span className="font-medium text-foreground">{opt}</span>
            </motion.button>
          ))}
        </div>
      );
    
    case 'multi_choice': {
      const currentValues = (Array.isArray(value) ? value : []) as string[];
      return (
        <div className="grid grid-cols-2 gap-3">
          {Array.isArray(options) && options.map((opt: string) => {
            const isSelected = currentValues.includes(opt);
            return (
              <motion.button
                layout
                key={opt}
                onClick={() => {
                  const newValues = isSelected 
                    ? currentValues.filter(v => v !== opt)
                    : [...currentValues, opt];
                  onChange(newValues);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-3 rounded-xl text-center transition-colors border text-sm",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                    : "border-border bg-secondary/30 hover:bg-secondary"
                )}
              >
                <span className="text-foreground">{opt}</span>
              </motion.button>
            );
          })}
        </div>
      );
    }

    case 'scale': {
      const min = options?.min || 1;
      const max = options?.max || 10;
      return (
        <div className="py-8 px-2">
            <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                <span>Low</span>
                <span>High</span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                value={value || Math.ceil((min + max)/2)} 
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center mt-4 text-2xl font-bold font-serif text-foreground">
                {value || Math.ceil((min + max)/2)}
            </div>
        </div>
      );
    }

    default:
      return (
        <div className="space-y-2">
            <Label>Your Answer</Label>
            <Input 
                value={value || ''} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder="Type here..."
                className="h-12 text-lg"
            />
        </div>
      );
  }
}
