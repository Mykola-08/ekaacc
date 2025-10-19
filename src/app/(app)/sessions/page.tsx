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
import { useUser, useFirestore, useCollection, collection, query, where, useMemoFirebase } from "@/firebase";
import { useUserContext } from "@/context/user-context";

// Helper function to map Firestore booking data to the app's Session type
const mapBookingToSession = (booking: any): AppSession => {
    const getStatus = (status: string): 'Upcoming' | 'Completed' | 'Canceled' => {
        const startTime = new Date(booking.start_at || 0);
        const isPast = startTime < new Date();

        switch (status) {
            case 'ACCEPTED': return isPast ? 'Completed' : 'Upcoming';
            case 'DECLINED_BY_SELLER':
            case 'CANCELLED_BY_CUSTOMER':
            case 'CANCELLED_BY_SELLER': return 'Canceled';
            case 'NO_SHOW': return 'Completed';
            default: return isPast ? 'Completed' : 'Upcoming';
        }
    };
    
    const serviceName = booking.appointment_segments?.[0]?.service_variation_data?.name || 'Unknown Service';
    const duration = booking.appointment_segments?.[0]?.duration_minutes || 0;
    
    // In a real app with a `teams` collection, you'd fetch the team member name here
    const therapistName = 'EKA Therapist'; 

    return {
        id: booking.id,
        therapist: therapistName,
        therapistAvatarUrl: 'https://i.pravatar.cc/150?u=square', // Placeholder
        date: booking.start_at,
        time: new Date(booking.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: Number(duration),
        status: getStatus(booking.status),
        type: serviceName,
        userId: booking.customer_id
    };
};

export default function SessionsPage() {
  const { currentUser, isLoading: isUserLoading } = useUserContext();
  const firestore = useFirestore();

  // Query the 'bookings' collection based on the logged-in user's Square customer ID.
  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !currentUser?.squareCustomerId) return null;
    return query(collection(firestore, 'bookings'), where('customer_id', '==', currentUser.squareCustomerId));
  }, [firestore, currentUser]);

  const { data: bookings, isLoading: isLoadingBookings, error } = useCollection(bookingsQuery);
  
  const sessions = bookings?.map(mapBookingToSession)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const isLoading = isUserLoading || (currentUser && isLoadingBookings);

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
            {isLoading && (
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
            {!isLoading && sessions && sessions.length > 0 && sessions.map((session) => (
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
             {!isLoading && (!sessions || sessions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                        <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{error ? "An Error Occurred" : "No Sessions Found"}</h3>
                        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                            {error ? error.message : "We couldn't find any sessions in your account. Ready to book your first one?"}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">Book a Session</Button>
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
