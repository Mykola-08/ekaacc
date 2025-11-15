'use client';
<<<<<<< HEAD
;
;
;
;
import { Avatar, AvatarFallback, AvatarImage, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from '@/components/keep';
import { Clock, Video, CalendarOff } from 'lucide-react';
import { format } from 'date-fns';
=======

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, Video } from 'lucide-react';
>>>>>>> bbef2937e86dbdff133c47e33ad42e2cfa65c958
import type { Session } from '@/lib/types';
import Link from 'next/link';

interface NextSessionProps {
  sessions: Session[];
  isLoading: boolean;
}

export function NextSession({ sessions, isLoading }: NextSessionProps) {
  const nextSession = sessions[0];

  return (
    <Card className="bg-white dark:bg-gray-800/50 border-none shadow-sm">
      <CardHeader>
        <CardTitle>Next Session</CardTitle>
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
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <p>{new Date(nextSession.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-gray-500" />
              <p>{new Date(nextSession.date).toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center">
              <Video className="w-5 h-5 mr-3 text-gray-500" />
              <p>{nextSession.type}</p>
            </div>
            <Link href={`/sessions/${nextSession.id}`}>
              <Button className="w-full mt-4">
                View Details <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </CardContent>
    </Card>
  );
}
