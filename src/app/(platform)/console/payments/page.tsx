'use client';

import { CreditCard, Wallet, Receipt, Filter } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
            Payments
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">View and manage payment transactions.</p>
        </div>
        
        <div className="flex gap-2">
            <button className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-foreground/90 bg-card border border-border hover:bg-muted/30 shadow-sm transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
            </button>
            <button className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-sm transition-colors">
                Export Data
            </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 relative overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto">
           <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-50 animate-pulse" />
                <div className="h-24 w-24 bg-card rounded-full flex items-center justify-center relative shadow-sm ring-1 ring-slate-100">
                    <Receipt className="w-10 h-10 text-blue-600" />
                </div>
           </div>
           
           <h2 className="text-2xl font-bold text-foreground mb-3">Transaction History</h2>
           <p className="text-muted-foreground mb-8">
               Seamlessly track payments, manage refunds, and view detailed transaction logs. The payment management system is currently being upgraded.
           </p>
           
           <div className="flex items-center gap-4 text-sm text-muted-foreground/80">
                <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    Stripe Integrated
                </span>
                <span className="h-4 w-px bg-gray-200" />
                <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Secure Processing
                </span>
           </div>
        </div>
      </div>
    </div>
  );
}

