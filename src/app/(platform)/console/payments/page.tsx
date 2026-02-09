'use client';

import { CreditCard, Wallet, Receipt, Filter } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            Payments
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            View and manage payment transactions.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="text-foreground/90 bg-card border-border hover:bg-muted/30 inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-colors">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-foreground/90">
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-card relative flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-50/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/3 rounded-full bg-indigo-50/50 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-100 opacity-50 blur-lg" />
            <div className="bg-card relative flex h-24 w-24 items-center justify-center rounded-full shadow-sm ring-1 ring-slate-100">
              <Receipt className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <h2 className="text-foreground mb-3 text-2xl font-bold">Transaction History</h2>
          <p className="text-muted-foreground mb-8">
            Seamlessly track payments, manage refunds, and view detailed transaction logs. The
            payment management system is currently being upgraded.
          </p>

          <div className="text-muted-foreground/80 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-4 w-4" />
              Stripe Integrated
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4" />
              Secure Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
