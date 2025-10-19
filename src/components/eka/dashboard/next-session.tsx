'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Video, CalendarOff } from 'lucide-react';
import { format } from 'date-fns';
import type { Session } from '@/lib/types';
import Link from 'next/link';

interface NextSessionProps {
    sessions: Session[] | null;
    isLoading: boolean;
}

export function NextSession({ sessions, isLoading }: NextSessionProps) {
  const nextSession = sessions?.[0];

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                      </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </CardContent>
          </Card>
      )
  }

  if (!nextSession) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Next Session</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">No upcoming sessions</p>
                <p className="text-sm text-muted-foreground mt-1">Ready to book your next appointment?</p>
                <Button className="mt-4" asChild>
                    <Link href="/therapies">Book a Session</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Next Session</CardTitle>
        <CardDescription>
            {format(new Date(nextSession.date), "EEEE, MMMM d, yyyy")} at {nextSession.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={nextSession.therapistAvatarUrl} />
                <AvatarFallback>{nextSession.therapist.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">with {nextSession.therapist}</p>
                <p className="text-sm text-muted-foreground">{nextSession.type}</p>
            </div>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{nextSession.duration} minutes</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>Online Session</span>
            </div>
        </div>
        <div className="flex gap-2 pt-2">
            <Button className="w-full">Join Now</Button>
            <Button variant="outline" className="w-full">Reschedule</Button>
        </div>
      </CardContent>
    </Card>
  );
}
