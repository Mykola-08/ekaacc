'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { NotificationDropdown } from "./NotificationDropdown";

type ClientDashboardProps = {
    profile: any;
    wallet: any;
    nextBooking: any;
};

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
    const today = new Date();

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 p-4 md:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif text-foreground">
                        Welcome back, {profile.first_name || 'Guest'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here is your wellness overview for today.
                    </p>
                </div>
                <div className="flex gap-2">
                     <NotificationDropdown />
                    <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
                        <Link href="/book">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Book New Session
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Next Session Card */}
                <div className="h-full animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <Card className="h-full border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-md rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Upcoming Session
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextBooking ? (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-serif text-foreground">
                                            {nextBooking.services?.title || 'Therapy Session'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {format(new Date(nextBooking.start_time), 'EEEE, MMMM do')} at {format(new Date(nextBooking.start_time), 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm bg-background/50 p-3 rounded-lg border">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>Main Studio, Room 3</span>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" className="w-full rounded-full">Reschedule</Button>
                                        <Button variant="secondary" className="w-full rounded-full">Get Directions</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                                    <Button variant="link" asChild>
                                        <Link href="/book">Browse Schedule &rarr;</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Wallet / Balance Card */}
                <div className="h-full animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Card className="h-full rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Your Balance
                            </CardTitle>
                            <CardDescription>Credits available for use</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold font-serif text-foreground">
                                    {wallet?.balance || 0}
                                </span>
                                <span className="text-muted-foreground">credits</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Membership Status</span>
                                    <span className="font-medium text-primary">Active</span>
                                </div>
                                <Progress value={75} className="h-2" />
                                <p className="text-xs text-muted-foreground text-right">
                                    Renews on {format(new Date(new Date().setDate(today.getDate() + 14)), 'MMM do')}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full gap-2 rounded-full">
                                Top Up Wallet <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </div>

            {/* Quick Actions / Recommendations */}
            <div className="space-y-4">
                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                   <h2 className="text-xl font-semibold">Recommended for you</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Deep Tissue', 'Reflexology', 'Aromatherapy'].map((item, i) => (
                        <div key={item} className="animate-slide-up" style={{ animationDelay: `${300 + (i * 100)}ms` }}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer group rounded-[1.5rem]">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <span className="font-medium">{item}</span>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
