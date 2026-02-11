'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Shield, Zap, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/morphing-toaster';
import { buyPlan } from '@/server/plans/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  credits_total: number;
  metadata: any;
}

export function PlanMarketplace({ plans }: { plans: Plan[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handlePurchase = async (plan: Plan) => {
    if (!confirm(`Confirm purchase of ${plan.name} for €${plan.price_cents / 100}?`)) return;

    setLoadingId(plan.id);
    const res = await buyPlan(plan.id);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success('Plan purchased successfully!');
      router.refresh();
    }
    setLoadingId(null);
  };

  return (
    <div className="animate-in fade-in grid grid-cols-1 gap-6 duration-500 md:grid-cols-2">
      {plans.map((plan) => {
        const isVIP = plan.name.includes('VIP');
        return (
          <div
            key={plan.id}
            className={cn(
              'group relative flex flex-col justify-between overflow-hidden transition-all duration-300',
              'rounded-lg border p-6 shadow-sm hover:shadow-sm',
              isVIP
                ? 'bg-card border-warning/30 shadow-warning/10 hover:-translate-y-1 hover:shadow-warning/20'
                : 'bg-card border-border hover:-translate-y-1 hover:shadow-md'
            )}
          >
            {isVIP && (
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-warning/20 opacity-60 blur-3xl" />
            )}

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110',
                    isVIP ? 'bg-warning/10 text-warning' : 'bg-card text-foreground'
                  )}
                >
                  {isVIP ? (
                    <Sparkles className="h-6 w-6 fill-warning/20" />
                  ) : (
                    <Shield className="h-6 w-6" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <h3 className="text-foreground text-xl font-semibold tracking-tight">{plan.name}</h3>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        isVIP ? 'bg-warning' : 'bg-primary'
                      )}
                    />
                    <span className="text-muted-foreground text-[13px] font-semibold tracking-wider uppercase">
                      {plan.credits_total} Sessions
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground min-h-[40px] text-sm leading-relaxed font-medium">
                {plan.description}
              </p>

              <div className="flex items-center gap-2 py-2">
                <span
                  className={cn(
                    'text-4xl font-semibold tracking-tighter',
                    isVIP ? 'text-warning' : 'text-foreground'
                  )}
                >
                  €{plan.price_cents / 100}
                </span>
                <span className="text-muted-foreground text-sm font-semibold">/ bundle</span>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <Button
                className={cn(
                  'h-12 w-full rounded-lg text-base font-semibold transition-all active:scale-95',
                  isVIP
                    ? 'bg-linear-to-r from-warning to-warning text-white shadow-lg shadow-warning/25 hover:from-warning/90 hover:to-warning/80'
                    : 'bg-foreground text-background hover:bg-foreground/90 shadow-lg'
                )}
                onClick={() => handlePurchase(plan)}
                disabled={!!loadingId}
              >
                {loadingId === plan.id ? 'Processing...' : 'Purchase Plan'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
