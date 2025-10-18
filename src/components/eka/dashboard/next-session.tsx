import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { sessions } from '@/lib/data';
import { Clock, Video } from 'lucide-react';
import { format } from 'date-fns';

export function NextSession() {
  const nextSession = sessions.find(s => s.status === 'Upcoming');

  if (!nextSession) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Next Session</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You have no upcoming sessions.</p>
                <Button className="mt-4">Book a new session</Button>
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
