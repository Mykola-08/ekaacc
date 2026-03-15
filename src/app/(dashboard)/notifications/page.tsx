import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellIcon, CheckIcon } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto py-8 w-full px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Keep track of your activity and updates.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckIcon className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          <div className="p-4 sm:p-6 flex gap-4 items-start hover:bg-muted/50 transition-colors">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
            <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
              <BellIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Your upcoming session is confirmed</p>
              <p className="text-sm text-muted-foreground">Dr. Smith has confirmed your appointment for tomorrow at 2:00 PM.</p>
              <p className="text-xs text-muted-foreground pt-1">2 hours ago</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex gap-4 items-start hover:bg-muted/50 transition-colors">
            <div className="mt-1 h-2 w-2 rounded-full bg-transparent flex-shrink-0" />
            <div className="p-2 bg-muted rounded-full flex-shrink-0">
              <BellIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">New resource available</p>
              <p className="text-sm text-muted-foreground">A new meditation guide has been added to your library based on your preferences.</p>
              <p className="text-xs text-muted-foreground pt-1">Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
