'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Presentation, X } from 'lucide-react';

interface PresentationStep {
  path: string;
  titleKey: string;
  descriptionKey: string;
}

const PRESETS: PresentationStep[] = [
  {
    path: '/',
    titleKey: 'TDR Presentation',
    descriptionKey: 'Welcome to the Elena Kucherova Integrative Therapy platform presentation. This is a robust, full-stack website optimized for SEO and conversion. Let\'s walk through the key components.'
  },
  {
    path: '/about',
    titleKey: 'About Elena',
    descriptionKey: 'This page builds authority and trust. It showcases Elena\'s professional background, methodology, and philosophy, which is crucial for a health-related service.'
  },
  {
    path: '/services',
    titleKey: 'Services Catalog',
    descriptionKey: 'A categorized overview of all treatments. The clean layout helps users quickly find what they need, improving User Experience (UX).'
  },
  {
    path: '/revision360',
    titleKey: 'Feature: Revision 360',
    descriptionKey: 'A specialized service highlighting the "Whole Body" approach. This landing page is designed with specific calls-to-action to drive interest in this comprehensive treatment.'
  },
  {
    path: '/personalized-services',
    titleKey: 'Segmentation & SEO',
    descriptionKey: 'These pages target specific user personas (Musicians, Athletes, Children). This strategy captures long-tail SEO traffic and deeply resonates with specific user needs.'
  },
  {
    path: '/casos',
    titleKey: 'Social Proof',
    descriptionKey: 'Testimonials and case studies (Casos Reals) provide social proof, a critical psychological trigger for converting visitors into clients.'
  },
  {
    path: '/booking',
    titleKey: 'Conversion Point',
    descriptionKey: 'The final destination for the user journey. The booking funnel is streamlined to minimize friction and maximize appointment scheduling.'
  }
];

export const TDRPresentationMode = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize from URL to avoid setState in useEffect on mount
  const [isActive, setIsActive] = useState(() => {
    // Check if window is defined (for server-side rendering safety, though this is likely client-side)
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('tdr') === 'true';
    }
    return false;
  });
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle URL changes and keyboard shortcut
  useEffect(() => {
    // In Next.js App Router, searchParams can be null during SSG/SSR but since we are client component it should be fine.
    // However, explicit useSearchParams() is safer.
    if (searchParams && searchParams.get('tdr') === 'true' && !isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Alt+P
      if (e.ctrlKey && e.altKey && e.key === 'p') {
        setIsActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchParams, isActive]);

  const matchingStepIndex = PRESETS.findIndex(step => step.path === pathname);
  // If we are on a known step, use it. Otherwise default to 0 (or previous state if we wanted to be complex, but let's keep it simple)
  // We can track "last known index" if we want to resume, but simply snapping to matching step is safer.
  const currentStepIndex = matchingStepIndex !== -1 ? matchingStepIndex : 0;

  // Note: We don't need a useEffect to sync state because we calculate it on every render based on location.

  // Handle navigation commands (Clicker / Keyboard)
  const handleNavigation = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;

    const isNext = ['PageDown', 'ArrowRight', 'ArrowDown', ' '].includes(e.key);
    const isPrev = ['PageUp', 'ArrowLeft', 'ArrowUp'].includes(e.key);
    const isExit = ['Escape'].includes(e.key);

    if (isExit) {
      setIsActive(false);
      return;
    }

    if (isNext) {
      e.preventDefault();
      const next = Math.min(currentStepIndex + 1, PRESETS.length - 1);
      if (next !== currentStepIndex) {
        router.push(PRESETS[next].path);
      }
    } else if (isPrev) {
      e.preventDefault();
      const next = Math.max(currentStepIndex - 1, 0);
      if (next !== currentStepIndex) {
        router.push(PRESETS[next].path);
      }
    }
  }, [isActive, router, currentStepIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [handleNavigation]);

  if (!isActive) return null;

  const currentStep = PRESETS[currentStepIndex];

  // Using string concatenation to avoid template literal issues
  const containerClasses = "bg-white/95 backdrop-blur-md border border-stone-200 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto transition-all duration-300 " +
    (isMinimized ? "h-12 w-12 rounded-full translate-y-4 translate-x-4" : "");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 right-8 z-[9999] max-w-md w-full pointer-events-none"
      >
        <div className={containerClasses}>

          {/* Minimized State Button */}
          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full flex items-center justify-center text-stone-600 hover:text-stone-900"
            >
              <Presentation size={20} />
            </button>
          )}

          {/* Maximized State */}
          {!isMinimized && (
            <div className="p-6 relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-stone-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                    STEP {currentStepIndex + 1}/{PRESETS.length}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 leading-tight">
                    {currentStep.titleKey}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600"
                  >
                    <span className="sr-only">Minimize</span>
                    <div className="w-3 h-0.5 bg-current my-1.5 mx-0.5"></div>
                  </button>
                  <button
                    onClick={() => setIsActive(false)}
                    className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="text-stone-600 mb-6 leading-relaxed text-sm">
                {currentStep.descriptionKey}
              </p>

              {/* Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    const next = Math.max(currentStepIndex - 1, 0);
                    router.push(PRESETS[next].path);
                  }}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="text-xs text-stone-400 font-mono">
                  Press &rarr; or Clicker
                </div>

                <button
                  onClick={() => {
                    const next = Math.min(currentStepIndex + 1, PRESETS.length - 1);
                    router.push(PRESETS[next].path);
                  }}
                  disabled={currentStepIndex === PRESETS.length - 1}
                  className="flex items-center gap-1 text-sm font-medium text-stone-900 hover:text-stone-700 disabled:opacity-30 transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

