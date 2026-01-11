'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarCheck, AlertCircle, Users, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { glassEffect, appleShadow } from "@/lib/ui-utils";

interface TherapistDashboardProps {
  schedule: any[];
}

export function TherapistDashboard({ schedule }: TherapistDashboardProps) {
  const pendingVerifications = schedule.filter(s => s.is_identity_verified === false).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
       <header className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-serif text-primary mb-2">
            Today's Overview
            </h1>
            <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d")}
            </p>
        </div>
        <div className="text-right">
            <span className="text-2xl font-bold">{schedule.length}</span>
            <span className="text-muted-foreground ml-2">sessions</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn("border-0", glassEffect, appleShadow)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{schedule.length}</div>
                <p className="text-xs text-muted-foreground">For today</p>
            </CardContent>
        </Card>
        <Card className={cn("border-0", glassEffect, appleShadow)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", pendingVerifications > 0 ? "text-amber-600" : "")}>
                    {pendingVerifications}
                </div>
                <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
        </Card>
        <Card className={cn("border-0", glassEffect, appleShadow)}>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Break</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1:00 PM</div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium mb-4">Agenda</h2>
        {schedule.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-2xl">
                No sessions scheduled for today.
            </div>
        ) : (
            schedule.map((session, i) => (
                <Card key={session.id} className={cn("border-0 flex overflow-hidden", glassEffect, appleShadow)}>
                     <div className="w-24 bg-primary/10 flex flex-col items-center justify-center p-4 text-primary">
                        <span className="text-lg font-bold">{format(new Date(session.start_time), "h:mm")}</span>
                        <span className="text-xs uppercase">{format(new Date(session.start_time), "a")}</span>
                     </div>
                     <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-medium">{session.client_name || 'Guest Client'}</h3>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                session.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            )}>
                                {session.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{session.service_name}</p>
                        
                        {session.is_identity_verified === false && (
                            <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-2 rounded-lg inline-block">
                                <AlertCircle className="w-4 h-4" />
                                <span>Identity Verification Needed</span>
                            </div>
                        )}
                     </div>
                </Card>
            ))
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-medium mb-4 mt-8">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'Manage Clients', href: '/admin/users', icon: Users },
            { label: 'Full Calendar', href: '/admin/bookings', icon: Calendar },
            { label: 'Verify Payments', href: '/admin/finance', icon: CreditCard },
            { label: 'Settings', href: '/admin', icon: CalendarCheck } // Placeholder
        ].map(action => (
            <Button 
                key={action.label} 
                variant="secondary" 
                className="h-24 flex flex-col gap-2 text-md font-medium rounded-2xl bg-white/50 dark:bg-black/20 hover:bg-white/80"
                asChild
            >
              <Link href={action.href} prefetch={true} className="flex flex-col items-center justify-center w-full h-full">
                <action.icon className="w-6 h-6 mb-1 opacity-70" />
                {action.label}
              </Link>
            </Button>
        ))}
      </div>
    </div>
  );
}
