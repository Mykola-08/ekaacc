'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Shield, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
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
              'rounded-2xl border p-6 shadow-sm hover:shadow-xl',
              isVIP
                ? 'bg-card border-amber-200 shadow-amber-100/50 hover:-translate-y-1 hover:shadow-amber-200/50'
                : 'bg-card border-border hover:-translate-y-1 hover:shadow-md'
            )}
          >
            {isVIP && (
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-100 opacity-60 blur-3xl" />
            )}

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110',
                    isVIP ? 'bg-amber-50 text-amber-600' : 'bg-card text-foreground'
                  )}
                >
                  {isVIP ? (
                    <Sparkles className="h-6 w-6 fill-amber-100" />
                  ) : (
                    <Shield className="h-6 w-6" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <h3 className="text-foreground text-xl font-bold tracking-tight">{plan.name}</h3>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        isVIP ? 'bg-amber-500' : 'bg-blue-500'
                      )}
                    />
                    <span className="text-muted-foreground text-[13px] font-bold tracking-wider uppercase">
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
                    'text-4xl font-bold tracking-tighter',
                    isVIP ? 'text-amber-950' : 'text-foreground'
                  )}
                >
                  €{plan.price_cents / 100}
                </span>
                <span className="text-muted-foreground text-sm font-bold">/ bundle</span>
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <Button
                className={cn(
                  'h-12 w-full rounded-lg text-base font-bold transition-all active:scale-95',
                  isVIP
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-amber-700'
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
