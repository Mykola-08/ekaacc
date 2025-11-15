'use client';

import { Progress } from '@/components/keep';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
;

const loadingMessages = [
  'Preparing your dashboard...',
  'Loading your sessions...',
  'Fetching wellness data...',
  'Almost ready...',
];

export default function AdvancedLoading() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Simulate realistic loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Stop at 95% until actual load completes
        const increment = Math.random() * 15 + 5; // Random increment between 5-20
        return Math.min(prev + increment, 95);
      });
    }, 300);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <Loader2 className="h-16 w-16 text-primary relative z-10" />
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <AnimatePresence mode="wait">
                <motion.span
                  key={messageIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-muted-foreground flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                  {loadingMessages[messageIndex]}
                </motion.span>
              </AnimatePresence>
              
              <span className="font-semibold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Tip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-xs text-muted-foreground"
          >
            💡 Tip: Track your daily mood to discover wellness patterns
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
