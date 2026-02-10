"use client";

/**
 * Wallet Balance Card
 *
 * Displays the user's wallet balance with a sleek gradient card.
 */

import * as motion from "motion/react-client";
import { Wallet } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
  currency: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
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
      className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-4 w-full max-w-sm"
    >
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />

      <div className="relative flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
          <Wallet className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium">Wallet Balance</p>
          <motion.p
            className="text-foreground text-xl font-bold tabular-nums tracking-tight"
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
