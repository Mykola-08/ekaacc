'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { Session as AppSession, User } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import fxService from '@/lib/fx-service';
import { useAuth } from "@/context/auth-context";
import { useAppStore } from "@/store/app-store";
import { PersonalizationEngine } from '@/lib/personalization-engine';

// Helper to map mock booking to session type
const mapBookingToSession = (booking: any): AppSession => {
  const dateValue = booking.date ? new Date(booking.date) : new Date();
  const status = (booking.status || '').toString().toLowerCase();
  let statusLabel: AppSession['status'] = 'Upcoming';
  if (status === 'cancelled' || status === 'canceled' || status === 'no_show') {
    statusLabel = 'Canceled';
  } else if (status === 'completed' || status === 'checked_out' || status === 'done') {
    statusLabel = 'Completed';
  }

  const therapistName = booking.therapistName
    || booking.therapist
    || booking.teamMemberName
    || booking.therapistId
    || 'Assigned therapist';

  const sessionType = booking.serviceName || booking.type || 'Therapy Session';

  return {
    id: booking.id,
    therapist: therapistName,
    therapistAvatarUrl: booking.therapistAvatarUrl || 'https://i.pravatar.cc/150?u=square',
    date: dateValue.toISOString(),
    time: dateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: booking.durationMinutes || booking.duration || 60,
    status: statusLabel,
    type: sessionType,
    userId: booking.userId,
  };
};

export default function SessionsPage() {
  const { appUser: currentUser, refreshAppUser, loading: isUserLoading } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const [sessions, setSessions] = useState<AppSession[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const updateUserData = async (updates: Partial<User>) => {
    if (!currentUser || !dataService) return;
    try {
      await dataService.updateUser(currentUser.id, updates);
      await refreshAppUser();
    } catch (e) {
      console.error("Failed to update user data", e);
    }
  };

  useEffect(() => {
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fxService.getBookingsForUser(currentUser.uid || currentUser.id || 'user1', {
      email: currentUser.email,
      phone: currentUser.phoneNumber,
    })
      .then(bookings => {
        setSessions(
          bookings
            .map(mapBookingToSession)
            .sort((a: AppSession, b: AppSession) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
        setError(null);
      })
      .catch(e => setError(e))
      .finally(() => setIsLoading(false));
  }, [currentUser, isUserLoading]);

  useEffect(() => {
    // Track page visit
    if (currentUser) {
      try {
        const updated = PersonalizationEngine.trackActivity(currentUser, {
          type: 'page-visit',
          data: {
            page: '/sessions',
            timestamp: new Date().toISOString(),
          }
        });
        updateUserData({ activityData: { ...(currentUser.activityData || {}), ...updated } });
      } catch (e) {
        console.error('Failed to track sessions page visit', e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
        <CardDescription>Manage your past and upcoming sessions booked via Square.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Therapist</TableHead>
              <TableHead className="min-w-[150px]">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[150px]">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isUserLoading) && (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            )}
            {!isLoading && !isUserLoading && sessions && sessions.length > 0 && sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium whitespace-nowrap">{session.therapist}</TableCell>
                <TableCell className="whitespace-nowrap">{session.type}</TableCell>
                <TableCell>
                  <Badge variant={session.status === 'Upcoming' ? 'default' : session.status === 'Canceled' ? 'destructive' : 'secondary'}>{session.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">{format(new Date(session.date), "MMMM d, yyyy")}</TableCell>
                <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem disabled={session.status !== 'Upcoming'}>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem disabled={session.status !== 'Upcoming'}>Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && !isUserLoading && (!sessions || sessions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                        <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{error ? "An Error Occurred" : "No Sessions Found"}</h3>
                        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                            {error ? error.message : "We couldn't find any sessions in your account. Ready to book your first one?"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                            try {
                              if (currentUser) {
                                const updated = PersonalizationEngine.trackActivity(currentUser, {
                                  type: 'feature-use',
                                  data: {
                                    feature: 'sessions',
                                    action: 'book-click',
                                    timestamp: new Date().toISOString(),
                                  }
                                });
                                updateUserData({ activityData: { ...(currentUser.activityData || {}), ...updated } });
                              }
                            } catch (e) {
                              console.error('Failed to track book action', e);
                            }
                            // Navigate to booking page
                            window.location.href = '/sessions/booking';
                        }}>Book a Session</Button>
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
