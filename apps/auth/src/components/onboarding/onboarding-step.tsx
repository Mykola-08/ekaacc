'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';

interface OnboardingStepProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function OnboardingStep({
  currentStep,
  totalSteps,
  title,
  description,
  icon: Icon,
  children,
}: OnboardingStepProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Card className="shadow-2xl border-slate-200 dark:border-slate-800">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {description}
                </p>
              </div>
            </div>
            <div className="min-h-[300px] flex items-center justify-center">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
