'use client';

import { Button } from '../ui/button';
import { Transition } from '@headlessui/react';
import { useEffect, useState, Fragment } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // 1. Initial wait to prevent flash on super fast loads
    const initialDelay = setTimeout(() => {
      // Check if page already loaded
      if (document.readyState === 'complete') {
        startExitSequence();
      } else {
        window.addEventListener('load', startExitSequence);
      }
    }, 800);

    // 2. Slow connection fallback
    const slowTimer = setTimeout(() => {
      setIsSlow(true);
    }, 8000); // 8 seconds

    function startExitSequence() {
      // Start the visual exit
      setShowContent(false);

      // Remove from DOM after transition completes
      setTimeout(() => setIsLoading(false), 1000);
    }

    return () => {
      window.removeEventListener('load', startExitSequence);
      clearTimeout(initialDelay);
      clearTimeout(slowTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <Transition
      show={showContent}
      as={Fragment}
      leave="transition-opacity duration-700 ease-in-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 fixed inset-0 z-100 grid place-items-center backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {/* Logo Animation */}
          <Transition.Child
            as="div"
            enter="transition duration-1000 ease-out"
            enterFrom="transform scale-90 opacity-0 blur-sm"
            enterTo="transform scale-100 opacity-100 blur-none"
            leave="transition duration-500 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <h1 className="text-foreground font-serif text-4xl font-black tracking-tighter sm:text-6xl">
              EKA
            </h1>
          </Transition.Child>

          {/* Spacer to prevent layout shift when slow warning appears */}
          <div className="mt-8 flex h-24 flex-col items-center justify-center gap-4">
            {/* Standard Loader - shows until slow warning */}
            {!isSlow && (
              <Transition.Child
                as="div"
                enter="transition-opacity duration-500 delay-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="text-muted-foreground h-5 w-5 animate-spin"
                />
              </Transition.Child>
            )}

            {/* Slow Connection State */}
            <Transition
              show={isSlow}
              as={Fragment}
              enter="transition duration-500 ease-out"
              enterFrom="transform translate-y-2 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-muted-foreground text-sm font-medium">
                  Taking longer than expected...
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.location.reload()}
                  className="animate-fade-in"
                >
                  Refresh Page
                </Button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  );
}
