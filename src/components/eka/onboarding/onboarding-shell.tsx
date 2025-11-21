'use client';

import { motion } from 'framer-motion';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 md:p-10 bg-[#f4f7fb] bg-[radial-gradient(circle_at_top_left,#e7f0ff,transparent_35%),radial-gradient(circle_at_bottom_right,#dbeafe,transparent_30%)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_80%)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
