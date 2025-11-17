'use client';

import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { AnimatedCard } from '@/components/eka/animated-card';

interface WelcomeHeroProps {
  message: string;
  delay?: number;
}

export function WelcomeHero({ message, delay = 0 }: WelcomeHeroProps) {
  return (
    <AnimatedCard delay={delay}>
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold mb-2">{message}</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
