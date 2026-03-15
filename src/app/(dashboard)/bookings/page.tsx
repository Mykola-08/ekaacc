import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Button>New Booking</Button>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>No upcoming sessions found.</p>
              <Button variant="outline" className="mt-4">Schedule One</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
