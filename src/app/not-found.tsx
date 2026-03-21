'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background blobs for "sensations" */}
      <div className="bg-primary/20 absolute top-1/4 -left-20 h-80 w-80 rounded-full blur-3xl" />
      <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border-border/40 bg-card/60 rounded-[var(--radius)] border p-12 backdrop-blur-2xl"
        >
          <div className="">
            <h1 className="text-foreground/20 text-8xl font-light tracking-tighter">404</h1>
            <h2 className="text-foreground text-3xl font-semibold tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              It seems the path to your wellbeing took an unexpected turn. Let's get you back on
              track.
            </p>
          </div>

          <div className="flex flex-col">
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-primary/25 text-primary-foreground w-full rounded-[calc(var(--radius)*0.8)] border-none py-6"
              >
                <HugeiconsIcon icon={Home01Icon} className="mr-2 size-5" />
                Back to Home
              </Button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center py-2 text-sm font-medium transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 size-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
