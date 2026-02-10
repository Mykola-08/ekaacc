'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  features: string[];
  interval: string | null;
  stripe_price_id: string | null;
  active: boolean;
  credits_total: number;
  validity_days: number | null;
}

export function PlansTab() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plan_definition')
        .select('*')
        .eq('active', true)
        .order('price_cents', { ascending: true });

      if (data) {
        setPlans(
          data.map((d: any) => ({
            ...d,
            features: (d.metadata as any)?.features ?? [],
            interval: d.validity_days ? `${d.validity_days} days` : null,
          }))
        );
      }
      if (error) console.error('Error fetching plans:', error);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 py-20 text-center">
        <Crown className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-foreground">No plans available</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon for subscription options.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${plans.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
      {plans.map((plan, idx) => (
        <Card
          key={plan.id}
          className="relative rounded-lg border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-sm"
        >
          {idx === Math.floor(plans.length / 2) && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <div className="pt-2 text-3xl font-semibold">
              €{(plan.price_cents / 100).toFixed(2)}
              <span className="text-base font-normal text-muted-foreground">
                {' '}/ {plan.credits_total} session{plan.credits_total !== 1 ? 's' : ''}
              </span>
            </div>
            {plan.description && (
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-600" />
              {plan.credits_total} session credit{plan.credits_total !== 1 ? 's' : ''}
            </div>
            {plan.validity_days && (
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                Valid for {plan.validity_days} days
              </div>
            )}
            {plan.features?.map((feature, fidx) => (
              <div key={fidx} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                {feature}
              </div>
            ))}
          </CardContent>
          <div className="flex justify-center p-4">
            <Button
              className="w-full rounded-lg font-semibold"
              onClick={() => router.push(`/subscribe?plan=${plan.id}`)}
            >
              Get {plan.name}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
