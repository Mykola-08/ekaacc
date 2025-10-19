'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { Session } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getSquareBookings } from "@/lib/square";
import { useUser } from "@/firebase";

export default function SessionsPage() {
  const { user: firebaseUser, isUserLoading: isAuthLoading } = useUser();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchBookings() {
      if (isAuthLoading) return; // Wait for user auth state
      if (!firebaseUser) {
        setError("You must be logged in to view your sessions.");
        setIsLoading(false);
        return;
      }
      
      // For this demo, we'll assume the user's phone number is stored on the auth object.
      // In a real app, this would come from the user's profile in your database.
      const userPhoneNumber = firebaseUser.phoneNumber || process.env.NEXT_PUBLIC_DEMO_PHONE_NUMBER;

      if (!userPhoneNumber) {
          setError("Your user profile does not have a phone number linked, which is required to find your Square bookings.");
          setIsLoading(false);
          return;
      }


      setIsLoading(true);
      try {
        const squareBookings = await getSquareBookings(userPhoneNumber);
        setSessions(squareBookings);
      } catch (err: any) {
        setError(err.message || "Failed to load bookings. Please check your connection or Square configuration.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [firebaseUser, isAuthLoading]);

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
            {(isLoading || isAuthLoading) && (
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
            {!isLoading && !isAuthLoading && sessions && sessions.length > 0 && sessions.map((session) => (
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
             {!isLoading && !isAuthLoading && (!sessions || sessions.length === 0) && (
                <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
                        <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{error ? "An Error Occurred" : "No Sessions Found"}</h3>
                        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                            {error || "We couldn't find any Square bookings linked to your phone number. Make sure you use the same phone number for both your EKA account and your Square bookings."}
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
