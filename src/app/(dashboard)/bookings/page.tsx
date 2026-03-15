import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  MoreHorizontal, 
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BookingsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 animate-fade-in max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your upcoming sessions and review appointment history.
          </p>
        </div>
        <Button className="shrink-0 gap-2 h-10 px-5 shadow-sm transition-all duration-300 hover:shadow-md active:scale-95">
          <CalendarIcon className="h-4 w-4" />
          <span>New Session</span>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-muted/50 p-1">
          <TabsTrigger 
            value="upcoming" 
            className="rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Upcoming Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Past History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 animate-in fade-in-50 duration-500">
          {/* Booking Card 1 */}
          <Card className="group overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                
                {/* Date & Time */}
                <div className="flex md:flex-col gap-3 md:gap-1 md:w-40 shrink-0 border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0 md:pr-4">
                  <div className="flex items-center gap-2 text-primary font-medium tracking-tight">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Oct 24, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                    <Clock className="h-3.5 w-3.5" />
                    <span>10:00 AM - 11:00 AM</span>
                  </div>
                </div>

                {/* Session Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0 font-medium">
                          Confirmed
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground font-normal border-border/60 shadow-none">
                          Intake Session
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight mt-2 text-foreground">
                        Therapy Session
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">SJ</AvatarFallback>
                        </Avatar>
                        <span>Dr. Sarah Jenkins</span>
                        <span className="text-border mx-1">•</span>
                        <div className="flex items-center gap-1.5 text-primary/80">
                          <Video className="h-3.5 w-3.5" />
                          <span>Google Meet</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-background shadow-xs hover:bg-muted/50 transition-colors">
                        Reschedule
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-muted text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Card 2 */}
          <Card className="group overflow-hidden bg-card/60 backdrop-blur-sm border-border/60 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 relative">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-6 p-6 opacity-80 group-hover:opacity-100 transition-opacity">
                
                <div className="flex md:flex-col gap-3 md:gap-1 md:w-40 shrink-0 border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0 md:pr-4">
                  <div className="flex items-center gap-2 font-medium tracking-tight text-foreground">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Nov 2, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                    <Clock className="h-3.5 w-3.5" />
                    <span>2:30 PM - 3:15 PM</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-amber-600 border-amber-600/20 bg-amber-500/5 font-medium shadow-none">
                          Pending
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground font-normal border-border/60 shadow-none">
                          Follow-up
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight mt-2 text-foreground">
                        Cognitive Behavioral Therapy
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">SJ</AvatarFallback>
                        </Avatar>
                        <span>Dr. Sarah Jenkins</span>
                        <span className="text-border mx-1">•</span>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>In-Person</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-background shadow-xs hover:bg-muted/50 transition-colors">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="past" className="space-y-4 animate-in fade-in-50 duration-500">
          <Card className="group overflow-hidden bg-muted/10 border-border/40 shadow-none transition-all duration-300 hover:bg-card/50 hover:border-border/60 hover:shadow-card-hover relative">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                <div className="flex items-center justify-center p-3 rounded-full bg-border/40 text-muted-foreground shrink-0">
                  <CheckCircle2 className="h-5 w-5 opacity-70" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground tracking-tight">Therapy Session</h4>
                    <span className="text-muted-foreground text-xs border border-border/60 px-1.5 py-0.5 rounded-md">Completed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Oct 10, 2025 • Dr. Sarah Jenkins</p>
                </div>
                <div className="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                  $120.00
                </div>
                <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
                  View Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
