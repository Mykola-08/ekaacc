'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon } from '@hugeicons/core-free-icons';

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    sendClientErrorReport({
      message: error.message || String(error),
      stack: error.stack,
      digest: error.digest,
      level: 'error',
      context: { source: 'marketing-error-boundary' },
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="mx-auto max-w-md space-y-6"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <HugeiconsIcon icon={Alert01Icon} className="size-10 text-red-600 dark:text-red-500"  />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Vaja! Una mica de desequilibri.</h2>
          <p className="text-muted-foreground">
            Hi ha hagut un petit error tècnic. El nostre equip ja ha estat en avís.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            Tornar a l'inici
          </Button>
          <Button onClick={() => reset()}>Tornar a provar</Button>
        </div>
      </motion.div>
    </div>
  );
}
