"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { DollarSign } from 'lucide-react';

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="h-8 w-8" />
          Subscriptions
        </h1>
        <p className="text-muted-foreground">Manage subscription plans and tiers</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Subscription management functionality coming soon. Configure plans, pricing tiers, and billing here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
