'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { ArrowRight, Calendar, Clock, Video } from 'lucide-react';
import type { Session } from '@/lib/platform/types';
import Link from 'next/link';

interface NextSessionProps {
  sessions: Session[];
  isLoading: boolean;
}

export function NextSession({ sessions, isLoading }: NextSessionProps) {
  const nextSession = sessions[0];

  return (
    <Card className="border-0 bg-muted/20 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-foreground text-lg">Next Session</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        ) : nextSession ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
              <p className="text-foreground">{new Date(nextSession.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
              <p className="text-foreground">{new Date(nextSession.date).toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center">
              <Video className="w-5 h-5 mr-3 text-muted-foreground" />
              <p className="text-foreground">{nextSession.type}</p>
            </div>
            <Link href={`/sessions/${nextSession.id}`}>
              <Button variant="default" className="w-full mt-6 rounded-xl">
                View Session Details <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming sessions.</p>
        )}
      </CardContent>
    </Card>
  );
}
