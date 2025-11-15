'use client';

;
;
;
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import { CalendarDays, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '@/components/eka/animated-card';
import Link from 'next/link';

interface SessionRecommendation {
  title: string;
  description: string;
  type: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationsCardProps {
  sessions?: SessionRecommendation[];
  delay?: number;
}

export function SessionRecommendationsCard({ sessions, delay = 200 }: RecommendationsCardProps) {
  if (!sessions || sessions.length === 0) return null;

  return (
    <AnimatedCard delay={delay}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Recommended Sessions for You
          </CardTitle>
          <CardDescription>Based on your goals and activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, i) => (
            <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{session.title}</h4>
                    <Badge variant={
                      session.priority === 'high' ? 'destructive' :
                      session.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {session.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{session.description}</p>
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {session.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <Button asChild className="w-full mt-2">
            <Link href="/sessions/booking">
              Book a Session
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
