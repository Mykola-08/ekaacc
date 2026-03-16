import React from "react";
import { Card, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Video01Icon,
  Location01Icon,
  MoreHorizontalIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your upcoming sessions and review appointment history.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
          <span>New Session</span>
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="past">Past History</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Booking Card 1 */}
            <Card className="@container/card">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Date & Time */}
                  <div className="flex md:flex-col gap-3 md:gap-1 md:w-40 shrink-0 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-2 text-primary font-medium tracking-tight">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                      <span>Oct 24, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                      <span>10:00 AM - 11:00 AM</span>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Confirmed</Badge>
                          <Badge variant="outline">Intake Session</Badge>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight mt-2">
                          Therapy Session
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs">SJ</AvatarFallback>
                          </Avatar>
                          <span>Dr. Sarah Jenkins</span>
                          <span className="text-muted-foreground/50">•</span>
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Video01Icon} className="size-3.5" />
                            <span>Google Meet</span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8">
                          <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card 2 */}
            <Card className="@container/card">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="flex md:flex-col gap-3 md:gap-1 md:w-40 shrink-0 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-2 font-medium tracking-tight">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-4 text-muted-foreground" />
                      <span>Nov 2, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                      <span>2:30 PM - 3:15 PM</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Pending</Badge>
                          <Badge variant="outline">Follow-up</Badge>
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight mt-2">
                          Cognitive Behavioral Therapy
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-xs">SJ</AvatarFallback>
                          </Avatar>
                          <span>Dr. Sarah Jenkins</span>
                          <span className="text-muted-foreground/50">•</span>
                          <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Location01Icon} className="size-3.5" />
                            <span>In-Person</span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                  <div className="flex items-center justify-center p-3 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium tracking-tight">Therapy Session</h4>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Oct 10, 2025 • Dr. Sarah Jenkins</p>
                  </div>
                  <div className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                    $120.00
                  </div>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    View Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
