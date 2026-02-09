"use client";

/**
 * Services List Card
 *
 * Displays available wellness/therapy services in a beautiful grid.
 */

import * as motion from "motion/react-client";
import { Sparkles, Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  currency: string;
}

interface ServicesListProps {
  services: Service[];
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ServicesListCard({ services }: ServicesListProps) {
  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-2xl border p-4 w-full max-w-sm"
      >
        <p className="text-muted-foreground text-sm">No services found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card rounded-2xl border p-4 w-full max-w-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-primary h-4 w-4" />
        <p className="text-sm font-semibold">Available Services</p>
      </div>

      <div className="space-y-2">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-muted/50 group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-muted"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>{s.duration} min</span>
              </div>
            </div>
            <div className="text-primary ml-3 flex-shrink-0 text-sm font-semibold">
              {formatCurrency(s.price, s.currency)}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
