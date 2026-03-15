'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon, ChartBarLineIcon, Brain02Icon } from '@hugeicons/core-free-icons';


export default function AIInsightsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personalized mental health and wellness insights.</p>
      </div>
      
      <div className="grid gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
            <div className="p-4 rounded-lg bg-muted">
              <HugeiconsIcon icon={SparklesIcon} className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Daily Summary</h3>
            <p className="text-muted-foreground text-sm">Your most recent check-ins summarized by our AI model.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
            <div className="p-4 rounded-lg bg-muted">
              <HugeiconsIcon icon={ChartBarLineIcon} className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Mood Tracking</h3>
            <p className="text-muted-foreground text-sm">Identify patterns in your well-being over the last month.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
            <div className="p-4 rounded-lg bg-muted">
              <HugeiconsIcon icon={Brain02Icon} className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Predictive Care</h3>
            <p className="text-muted-foreground text-sm">Suggestions tailored to your current trajectory.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
