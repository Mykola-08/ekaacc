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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const squareBookings = await getSquareBookings();
        setSessions(squareBookings);
      } catch (err) {
        setError("Failed to load bookings. Please check your connection or Square configuration.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

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
                        <p className="mt-1 text-sm text-muted-foreground">
                            {error || "You haven't booked any sessions through Square yet."}
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
