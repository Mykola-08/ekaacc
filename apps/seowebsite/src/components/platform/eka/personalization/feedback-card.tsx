'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { HeartPulse } from 'lucide-react';
import { AnimatedCard } from '@/components/platform/eka/animated-card';
import { format } from 'date-fns';

interface FeedbackMessage {
  message: string;
  type: 'celebration' | 'encouragement' | 'tip' | 'reminder';
  date: string;
  read: boolean;
}

interface FeedbackCardProps {
  messages: FeedbackMessage[];
  maxMessages?: number;
  delay?: number;
}

export function FeedbackCard({ messages, maxMessages = 3, delay = 450 }: FeedbackCardProps) {
  if (!messages || messages.length === 0) return null;

  const getEmoji = (type: FeedbackMessage['type']) => {
    switch (type) {
      case 'celebration': return '🎉';
      case 'encouragement': return '💪';
      case 'tip': return '💡';
      case 'reminder': return '👋';
      default: return '✨';
    }
  };

  return (
    <AnimatedCard delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Wellness Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.slice(0, maxMessages).map((feedback, i) => (
            <div key={i} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-2">
                <span className="text-lg">{getEmoji(feedback.type)}</span>
                <div className="flex-1">
                  <p className="text-sm">{feedback.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(feedback.date), 'MMM d')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
