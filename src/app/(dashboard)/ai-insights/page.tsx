'use client';

import React from 'react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, ChartBarLineIcon, Brain02Icon } from '@hugeicons/core-free-icons';

export default function AIInsightsPage() {
  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader 
        title="AI Assistant" 
        subtitle="Your personalized mental health and wellness insights." 
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/5">
            <HugeiconsIcon icon={SparklesIcon} className="size-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Daily Summary</h3>
          <p className="text-muted-foreground text-sm">Your most recent check-ins summarized by our AI model.</p>
        </div>
        
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/5">
            <HugeiconsIcon icon={ChartBarLineIcon} className="size-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Mood Tracking</h3>
          <p className="text-muted-foreground text-sm">Identify patterns in your well-being over the last month.</p>
        </div>
        
        <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/5">
            <HugeiconsIcon icon={Brain02Icon} className="size-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Predictive Care</h3>
          <p className="text-muted-foreground text-sm">Suggestions tailored to your current trajectory.</p>
        </div>
      </div>
    </div>
  );
}
