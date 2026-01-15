"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingQuestion } from '@/types/personalization';
import { toast } from 'sonner';
import { submitOnboarding } from '@/server/personalization/actions';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
         return questionOptions.map(opt => {
             if (typeof opt === 'string') return { label: opt, value: opt };
             return opt; // assume {label, value}
         });
     }
     return [];
 };

 const normalizedOptions = getOptions();

 const handleAnswer = (value: any) => {
  setAnswers(prev => ({
   ...prev,
   [currentQuestion.id]: value
  }));
 };

 const handleNext = async () => {
    // Validation: Assume required
    if (!answers[currentQuestion.id]) {
        toast.error('Please answer the question to continue');
        return;
    }

    if (isLast) {
        setIsSubmitting(true);
        try {
            const mappedAnswers = Object.entries(answers).map(([questionId, value]) => ({
                question_id: questionId,
                response_data: value
            }));
            
            await submitOnboarding(userProfileId, mappedAnswers);
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
        setCurrentIndex(prev => prev + 1);
    }
 };

 const handleBack = () => {
     if (currentIndex > 0) {
         setCurrentIndex(prev => prev - 1);
     }
 };

 if (completed) {
     return (
         <div className="min-h-screen bg-background flex items-center justify-center p-4">
             <div className="text-center animate-in zoom-in duration-500">
                 <div className="w-20 h-20 bg-[#0d9488]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0d9488]">
                     <CheckCircle2 className="w-10 h-10" />
                 </div>
                 <h1 className="text-3xl font-sans font-semibold tracking-tight text-foreground mb-2">You're All Set</h1>
                 <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
             </div>
         </div>
     )
 }

 return (
    <div className="min-h-screen bg-background flex flex-col">
        {/* Progress Bar */}
        <Progress value={progress} className="h-1 w-full rounded-none bg-black/5" indicatorClassName="bg-[#0d9488]" />

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6 pb-20 pt-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <div className="mb-2 text-sm font-bold text-[#0d9488] uppercase tracking-widest">
                        Question {currentIndex + 1} of {questions.length}
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-sans font-medium tracking-tight text-foreground mb-4 leading-tight">
                        {currentQuestion.questionText}
                    </h2>
                    
                    <div className="space-y-4 mb-12">
                        {questionType === 'single_choice' && normalizedOptions.length > 0 && (
                             <div className="grid gap-3">
                                {normalizedOptions.map((option: any) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        className={cn(
                                            "w-full cursor-pointer p-6 text-left rounded-2xl border transition-all flex items-center justify-between group glass-card hover:bg-white/80",
                                            answers[currentQuestion.id] === option.value
                                                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                                                : "border-white/40 hover:border-[#0d9488]/50"
                                        )}
                                    >
                                        <span className={cn(
                                            "text-lg font-medium transition-colors",
                                            answers[currentQuestion.id] === option.value ? "text-[#0d9488]" : "text-foreground"
                                        )}>{option.label}</span>
                                        {answers[currentQuestion.id] === option.value && (
                                            <div className="bg-[#0d9488] text-white rounded-full p-1">
                                                <Check className="w-4 h-4" />
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
                                                    ? currentAnswers.filter(a => a !== option.value)
                                                    : [...currentAnswers, option.value];
                                                handleAnswer(newAnswers);
                                            }}
                                            className={cn(
                                                "w-full cursor-pointer p-6 text-left rounded-2xl border transition-all flex items-center justify-between group glass-card hover:bg-white/80",
                                                isSelected
                                                    ? "border-[#0d9488] bg-[#0d9488]/5"
                                                    : "border-white/40 hover:border-[#0d9488]/50"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-lg font-medium transition-colors",
                                                isSelected ? "text-[#0d9488]" : "text-foreground"
                                            )}>{option.label}</span>
                                             <div className={cn(
                                                 "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                                                 isSelected ? "border-[#0d9488] bg-[#0d9488] text-white" : "border-black/20"
                                             )}>
                                                 {isSelected && <Check className="w-3 h-3" />}
                                             </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {questionType === 'scale' && (
                             <div className="flex justify-between items-center glass-panel p-8 rounded-[28px]">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className={cn(
                                            "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all",
                                            answers[currentQuestion.id] === val
                                                ? "bg-[#0d9488] text-white shadow-lg shadow-teal-500/20 scale-110"
                                                : "bg-black/5 text-muted-foreground hover:bg-black/10"
                                        )}
                                    >
                                        {val}
                                    </button>
                                ))}
                             </div>
                        )}
                        
                        {questionType === 'text' && (
                             <div className="bg-card p-2 rounded-xl border border-border shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all">
                                <Input 
                                    type="text"
                                    className="w-full p-4 h-auto border-none shadow-none text-lg bg-transparent"
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
                            className={cn(
                                currentIndex === 0 && "opacity-0 pointer-events-none"
                            )}
                         >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back
                         </Button>

                         <Button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            size="lg"
                            className="rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                         >
                            {isLast ? (isSubmitting ? 'Saving...' : 'Complete Profile') : 'Continue'}
                            {!isLast && <ArrowRight className="w-5 h-5 ml-2" />}
                         </Button>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    </div>
 );
}
