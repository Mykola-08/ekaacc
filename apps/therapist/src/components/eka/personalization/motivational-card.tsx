'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { AnimatedCard } from '@/components/eka/animated-card';

interface MotivationalCardProps {
  messages: string[];
  delay?: number;
}

export function MotivationalCard({ messages, delay = 50 }: MotivationalCardProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <AnimatedCard delay={delay}>
      <Card className="border-amber-200 dark:border-amber-900 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Sparkles className="h-5 w-5" />
            Your Daily Inspiration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {messages.map((msg: string, i: number) => (
            <p key={i} className="text-sm italic text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <span className="text-lg">✨</span>
              <span>{msg}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
