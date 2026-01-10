"use client";

;
;
import { Badge } from '@/components/platform/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import type { User } from "@/lib/platform/types";
import { cn } from "@/lib/platform/utils";

interface TimelineEvent {
  id: string;
  date: string;
  type: 'session' | 'report' | 'payment' | 'note' | 'form' | 'goal';
  title: string;
  description?: string;
  status?: 'completed' | 'pending' | 'cancelled';
  metadata?: {
    duration?: number;
    therapist?: string;
    amount?: number;
    [key: string]: any;
  };
}

interface ClientActivityTimelineProps {
  client: User;
}

export function ClientActivityTimeline({ client }: ClientActivityTimelineProps) {
  // Mock data - in real implementation, this would come from the database
  const events: TimelineEvent[] = [
    {
      id: '1',
      date: '2025-10-20T10:00:00',
      type: 'session' as const,
      title: 'Physical Therapy Session',
      description: 'Completed session focusing on lower back pain management',
      status: 'completed' as const,
      metadata: { duration: 60, therapist: 'Dr. Sarah Johnson' },
    },
    {
      id: '2',
      date: '2025-10-20T09:30:00',
      type: 'form' as const,
      title: 'Pre-Session Assessment',
      description: 'Patient submitted pre-session health assessment',
      status: 'completed' as const,
    },
    {
      id: '3',
      date: '2025-10-19T14:00:00',
      type: 'report' as const,
      title: 'Session Report Generated',
      description: 'Therapist completed detailed session notes and recommendations',
      status: 'completed' as const,
    },
    {
      id: '4',
      date: '2025-10-18T16:00:00',
      type: 'payment' as const,
      title: 'Payment Processed',
      description: 'Package purchase: 10 Session Wellness Package (€650)',
      status: 'completed' as const,
      metadata: { amount: 650 },
    },
    {
      id: '5',
      date: '2025-10-17T11:00:00',
      type: 'session' as const,
      title: 'Initial Consultation',
      description: 'First consultation session completed',
      status: 'completed' as const,
      metadata: { duration: 90, therapist: 'Dr. Sarah Johnson' },
    },
    {
      id: '6',
      date: '2025-10-15T09:00:00',
      type: 'goal' as const,
      title: 'Treatment Goal Set',
      description: 'Achieve 80% reduction in lower back pain within 10 sessions',
      status: 'pending' as const,
    },
    {
      id: '7',
      date: '2025-10-25T14:00:00',
      type: 'session' as const,
      title: 'Follow-up Session',
      description: 'Scheduled follow-up for progress assessment',
      status: 'pending' as const,
      metadata: { duration: 60, therapist: 'Dr. Sarah Johnson' },
    },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'session':
        return Calendar;
      case 'report':
        return FileText;
      case 'payment':
        return CreditCard;
      case 'note':
        return MessageSquare;
      case 'form':
        return CheckCircle2;
      case 'goal':
        return Activity;
      default:
        return Clock;
    }
  };

  const getEventColor = (type: TimelineEvent['type'], status?: string) => {
    if (status === 'cancelled') return 'text-foreground bg-muted/50';
    if (status === 'pending') return 'text-muted-foreground bg-muted/30';
    
    switch (type) {
      case 'session':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
      case 'report':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-950';
      case 'payment':
        return 'text-green-600 bg-green-100 dark:bg-green-950';
      case 'form':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950';
      case 'goal':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Future dates
    if (diffDays < 0) {
      const futureDays = Math.abs(diffDays);
      if (futureDays === 1) return 'Tomorrow';
      return `In ${futureDays} days`;
    }
    
    // Past and present dates
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          Complete history of sessions, payments, forms, and interactions with {client.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          
          {events.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const colorClass = getEventColor(event.type, event.status);
            
            return (
              <div key={event.id} className="relative pl-12">
                {/* Timeline node */}
                <div className={cn(
                  "absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background",
                  colorClass
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Event content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.status && (
                          <Badge 
                            variant={event.status === 'completed' ? 'default' : 'outline'}
                            className={cn('text-xs', 
                              event.status === 'completed' ? 'text-success border-success/20 bg-success/5' :
                              event.status === 'pending' ? 'text-warning border-warning/20 bg-warning/5' :
                              'text-destructive border-destructive/20 bg-destructive/5'
                            )}
                          >
                            {event.status}
                          </Badge>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                      {event.metadata && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {event.metadata.duration && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {event.metadata.duration} min
                            </Badge>
                          )}
                          {event.metadata.therapist && (
                            <Badge variant="outline" className="text-xs">
                              {event.metadata.therapist}
                            </Badge>
                          )}
                          {event.metadata.amount && (
                            <Badge variant="outline" className="text-xs">
                              €{event.metadata.amount}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                      <div>{formatDate(event.date)}</div>
                      <div className="text-xs">{formatTime(event.date)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
