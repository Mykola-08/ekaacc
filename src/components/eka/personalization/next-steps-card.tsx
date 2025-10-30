'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '@/components/eka/animated-card';

interface NextStepsCardProps {
  steps: string[];
  delay?: number;
}

export function NextStepsCard({ steps, delay = 350 }: NextStepsCardProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <AnimatedCard delay={delay}>
      <Card className="border-border bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5" />
            What's Next?
          </CardTitle>
          <CardDescription>Your personalized action plan</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <ArrowRight className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
