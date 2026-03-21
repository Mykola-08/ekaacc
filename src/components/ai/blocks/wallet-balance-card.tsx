'use client';

/**
 * Wallet Balance Card
 *
 * Displays the user's wallet balance with a sleek gradient card.
 */

import * as motion from 'motion/react-client';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wallet01Icon } from '@hugeicons/core-free-icons';

interface WalletBalanceProps {
  balance: number;
  currency: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function WalletBalanceCard({ balance, currency }: WalletBalanceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="from-primary/10 via-primary/5 relative w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)*0.8)] border bg-linear-to-br to-transparent p-4"
    >
      {/* Decorative circle */}
      <div className="bg-primary/5 absolute -top-6 -right-6 h-24 w-24 rounded-full" />

      <div className="relative flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-[var(--radius)]">
          <HugeiconsIcon icon={Wallet01Icon} className="text-primary size-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">Wallet Balance</p>
          <motion.p
            className="text-foreground text-xl font-semibold tracking-tight tabular-nums"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {formatCurrency(balance, currency)}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
