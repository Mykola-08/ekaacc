'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProgressContextType {
  isLoading: boolean;
  progress: number;
  message: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  updateProgress: (progress: number, message?: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading...');

  const startLoading = useCallback((msg = 'Loading...') => {
    setIsLoading(true);
    setProgress(0);
    setMessage(msg);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  const updateProgress = useCallback((newProgress: number, msg?: string) => {
    setProgress(newProgress);
    if (msg) setMessage(msg);
  }, []);

  // Auto-increment progress for better UX
  useEffect(() => {
    if (!isLoading || progress >= 90) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 10 + 5;
        return Math.min(prev + increment, 90);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading, progress]);

  return (
    <ProgressContext.Provider
      value={{ isLoading, progress, message, startLoading, stopLoading, updateProgress }}
    >
      <AnimatePresence>
        {isLoading && (
          <>
            {/* Top progress bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              exit={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="from-primary to-primary fixed top-0 right-0 left-0 z-50 h-1 origin-left bg-linear-to-r via-purple-500"
            />

            {/* Loading overlay for long operations */}
            {progress < 30 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-background/80 fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
              >
                <div className="space-y-4 text-center">
                  <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                  <p className="text-muted-foreground text-sm">{message}</p>
                  <p className="text-primary text-xs font-semibold">{Math.round(progress)}%</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
