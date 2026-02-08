'use client';

import { DollarSign, CreditCard, Check } from 'lucide-react';

export default function SubscriptionsPage() {
 return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
     <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
      Subscriptions
     </h1>
     <p className="text-muted-foreground mt-2 text-lg">Manage pricing tiers and billing settings.</p>
    </div>
   </div>

   <div className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden">
     <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
     
     <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <DollarSign className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Subscription Management</h2>
        <p className="text-muted-foreground max-w-md mt-2 mb-8">
            Configure subscription plans, manage pricing tiers, and handle billing operations securely.
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium">
            <CreditCard className="w-4 h-4" />
            Coming Soon
        </span>
     </div>
   </div>
  </div>
 );
}

