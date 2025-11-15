"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import React from 'react';
;
;
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

const PACKAGES = [
  { id: 'pkg-basic-10', name: 'Wellness Pack - 10 sessions', priceEUR: 350, sessions: 10 },
  { id: 'pkg-pro-5', name: 'Focus Pack - 5 sessions', priceEUR: 200, sessions: 5 },
  { id: 'pkg-trial-1', name: 'Trial - 1 session', priceEUR: 30, sessions: 1 },
];

export function BillingPackages({ clientId }: { clientId: string }) {
  const { toast } = useToast();

  const handleBuy = async (pkg: any) => {
    try {
      const cs = await fxService.createCheckoutSessionForPackage(clientId, pkg.id, pkg.priceEUR);
      // Open the mock checkout URL in a new tab (mock will route to success page)
      if (cs && (cs as any).url) {
        window.open((cs as any).url, '_blank');
        toast({ title: 'Checkout started', description: `Opened checkout for ${pkg.name}` });
      } else {
        toast({ variant: 'destructive', title: 'Checkout failed', description: 'Could not create checkout session.' });
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Checkout failed', description: (e as any)?.message || 'Could not start checkout' });
    }
  };

  return (
    <div className="space-y-4">
      {PACKAGES.map(pkg => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
            <CardDescription>{pkg.sessions} sessions • €{pkg.priceEUR}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Includes {pkg.sessions} sessions redeemable by the client.</div>
              </div>
              <div>
                <Button onClick={() => handleBuy(pkg)}>Buy</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
