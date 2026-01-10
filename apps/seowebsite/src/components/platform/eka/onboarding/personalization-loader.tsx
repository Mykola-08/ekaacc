'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, BrainCircuit, Sparkles, Database, UserCog } from 'lucide-react';

const STEPS = [
  { id: 'data', label: 'Gathering your responses...', icon: Database },
  { id: 'analyze', label: 'Analyzing wellness metrics...', icon: BrainCircuit },
  { id: 'personalize', label: 'Personalizing your experience...', icon: UserCog },
  { id: 'finalize', label: 'Finalizing your profile...', icon: Sparkles },
];

export function PersonalizationLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500); // Change step every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 mx-auto"
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Creating Your Profile</h2>
          
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary/10 border border-primary/20' : 'opacity-50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive || isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
