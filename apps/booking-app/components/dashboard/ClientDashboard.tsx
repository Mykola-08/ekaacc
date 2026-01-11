'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Wallet, Calendar, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClientDashboardProps {
  profile: any;
  wallet: { balanceCents: number; pointsBalance: number };
  nextBooking: any;
  recommendation?: any; // To be implemented later
}

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">
          Welcome back, {profile.full_name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Your wellness journey continues.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Session Card */}
        <Card className={cn("border-0 overflow-hidden relative", glassEffect, appleShadow)}>
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Next Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextBooking ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium">{nextBooking.service_name}</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(nextBooking.start_time), "EEEE, MMMM d 'at' h:mm a")}
                  </p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="rounded-full">Reschedule</Button>
                   <Button variant="ghost" size="sm" className="rounded-full text-destructive">Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <p className="mb-4">No upcoming sessions.</p>
                <Button className="rounded-full" asChild>
                  <Link href="/#services" prefetch={true}>Book Now</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wallet & Points Card */}
        <Card className={cn("border-0", glassEffect, appleShadow)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-muted-foreground">Balance</span>
              <span className="text-2xl font-serif font-medium">
                ${(wallet.balanceCents / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4" /> Points
              </span>
              <span className="text-xl font-medium text-amber-600 dark:text-amber-400">
                {wallet.pointsBalance}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'Book Session', href: '/#services' },
            { label: 'History', href: '/history' },
            { label: 'My Plan', href: '/plan' },
            { label: 'Contact', href: '/contact' }
        ].map(action => (
            <Button 
                key={action.label} 
                variant="secondary" 
                className="h-16 text-lg font-medium rounded-2xl bg-white/50 dark:bg-black/20 hover:bg-white/80"
                asChild
            >
              <Link href={action.href} prefetch={true} className="flex items-center justify-center w-full h-full">
                {action.label}
              </Link>
            </Button>
        ))}
      </div>
    </div>
  );
}

