'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Background blobs for "sensations" */}
      <div className="bg-primary/20 absolute top-1/4 -left-20 h-80 w-80 rounded-full blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 rounded-3xl border border-white/40 bg-white/60 p-12 shadow-sm backdrop-blur-2xl"
        >
          <div className="space-y-4">
            <h1 className="text-foreground/20 text-8xl font-light tracking-tighter">404</h1>
            <h2 className="text-foreground text-3xl font-semibold tracking-tight">
              Page Not Found
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              It seems the path to your wellbeing took an unexpected turn. Let's get you back on
              track.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-primary/25 w-full rounded-[16px] border-none py-6 text-white shadow-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center py-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
