"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import React, { memo } from 'react';
;
;
;
import { Calendar, Clock, User, Video, MapPin, CheckCircle2 } from "lucide-react";
import { format } from 'date-fns';
import type { Session } from '@/lib/types';

interface OptimizedSessionCardProps {
  session: Session;
  onReschedule?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
  onJoin?: (sessionId: string) => void;
}

// Memoized component to prevent unnecessary re-renders
const OptimizedSessionCard = memo(function OptimizedSessionCard({
  session,
  onReschedule,
  onCancel,
  onJoin,
}: OptimizedSessionCardProps) {
  const sessionDate = new Date(session.date);
  const isUpcoming = sessionDate > new Date();
  const isPast = sessionDate < new Date();
  const isToday = format(sessionDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Memoize status badge rendering
  const statusBadge = React.useMemo(() => {
    const statusConfig = {
      Upcoming: { variant: "default" as const, icon: Calendar },
      Completed: { variant: "secondary" as const, icon: CheckCircle2 },
      Canceled: { variant: "destructive" as const, icon: Calendar },
    };

    const config = statusConfig[session.status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {session.status}
      </Badge>
    );
  }, [session.status]);

  // Memoize action buttons
  const actionButtons = React.useMemo(() => {
    if (isPast || session.status === 'Completed' || session.status === 'Canceled') {
      return null;
    }

    const isOnline = session.location?.toLowerCase().includes('online') || session.location?.toLowerCase().includes('video');

    return (
      <div className="flex gap-2 mt-4">
        {isToday && isOnline && onJoin && (
          <Button onClick={() => onJoin(session.id)} size="sm" className="gap-2">
            <Video className="h-4 w-4" />
            Join Session
          </Button>
        )}
        {isUpcoming && onReschedule && (
          <Button 
            onClick={() => onReschedule(session.id)} 
            variant="outline" 
            size="sm"
          >
            Reschedule
          </Button>
        )}
        {isUpcoming && onCancel && (
          <Button 
            onClick={() => onCancel(session.id)} 
            variant="ghost" 
            size="sm"
          >
            Cancel
          </Button>
        )}
      </div>
    );
  }, [isPast, isToday, isUpcoming, session.id, session.location, session.status, onJoin, onReschedule, onCancel]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {session.type === 'Individual' ? 'Individual Therapy' : 'Group Session'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {session.therapist}
            </CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(sessionDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{session.time}</span>
          </div>

          {/* Location or Video link */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {session.location?.toLowerCase().includes('online') || session.location?.toLowerCase().includes('video') ? (
              <>
                <Video className="h-4 w-4" />
                <span>Online Session</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                <span>{session.location || 'In-Person'}</span>
              </>
            )}
          </div>

          {/* Notes if any */}
          {session.notes && (
            <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded-md">
              {session.notes}
            </p>
          )}

          {/* Action Buttons */}
          {actionButtons}
        </div>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.session.id === nextProps.session.id &&
    prevProps.session.status === nextProps.session.status &&
    prevProps.session.date === nextProps.session.date &&
    prevProps.onReschedule === nextProps.onReschedule &&
    prevProps.onCancel === nextProps.onCancel &&
    prevProps.onJoin === nextProps.onJoin
  );
});

export default OptimizedSessionCard;
