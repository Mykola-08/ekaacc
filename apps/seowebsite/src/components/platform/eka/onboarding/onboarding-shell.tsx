'use client';

import { motion } from 'framer-motion';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
