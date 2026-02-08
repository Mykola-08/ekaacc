'use client';

import { DollarSign, CreditCard, Check } from 'lucide-react';

export default function SubscriptionsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            Subscriptions
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage pricing tiers and billing settings.
          </p>
        </div>
      </div>

      <div className="bg-card relative overflow-hidden rounded-2xl p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/2 rounded-full bg-green-50/50 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-foreground text-2xl font-bold">Subscription Management</h2>
          <p className="text-muted-foreground mt-2 mb-8 max-w-md">
            Configure subscription plans, manage pricing tiers, and handle billing operations
            securely.
          </p>
          <span className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
            <CreditCard className="h-4 w-4" />
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
