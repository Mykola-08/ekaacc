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
                    <Card className="h-full border-none shadow-sm rounded-[32px] bg-white transition-all hover:shadow-lg">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-gray-900">Upcoming Session</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            {nextBooking ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {nextBooking.services?.title || 'Therapy Session'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-gray-500 font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {format(new Date(nextBooking.start_time), 'EEEE, MMMM do')} at {format(new Date(nextBooking.start_time), 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-sm bg-gray-50 p-4 rounded-2xl border-0">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <MapPin className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">Main Studio, Room 3</span>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" className="flex-1 rounded-xl h-12 border-gray-200 hover:bg-gray-50 text-gray-700">Reschedule</Button>
                                        <Button variant="secondary" className="flex-1 rounded-xl h-12 bg-gray-100 hover:bg-gray-200 text-gray-900">Get Directions</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <div className="bg-gray-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No upcoming sessions scheduled.</p>
                                    <Button variant="default" className="rounded-full px-8" asChild>
                                        <Link href="/book">Browse Schedule &rarr;</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Wallet / Balance Card */}
                <div className="h-full animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <Card className="h-full rounded-[32px] border-none shadow-sm bg-white transition-all hover:shadow-lg">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-900">Your Balance</span>
                            </CardTitle>
                            <CardDescription className="text-base text-gray-500 pl-[3.25rem]">Credits available for use</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-8 pt-4">
                            <div className="bg-gray-50 rounded-3xl p-6 text-center">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-bold text-gray-900">
                                        {wallet?.balance || 0}
                                    </span>
                                    <span className="text-gray-500 font-medium text-lg">credits</span>
                                </div>
                            </div>

                            <div className="space-y-3 bg-gray-50 rounded-2xl p-5">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600">Membership Status</span>
                                    <span className="text-green-600 bg-white px-2 py-0.5 rounded-md shadow-sm">Active</span>
                                </div>
                                <Progress value={75} className="h-3 rounded-full bg-gray-200" />
                                <p className="text-xs text-gray-400 text-right font-medium">
                                    Renews on {format(new Date(new Date().setDate(today.getDate() + 14)), 'MMM do')}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            <Button className="w-full gap-2 rounded-xl h-12 text-base font-semibold" size="lg">
                                Top Up Wallet <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </div>

            {/* Quick Actions / Recommendations */}
            <div className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                   <h2 className="text-xl font-semibold text-gray-900 ml-2">Recommended for you</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['Deep Tissue', 'Reflexology', 'Aromatherapy'].map((item, i) => (
                        <div key={item} className="animate-slide-up" style={{ animationDelay: `${300 + (i * 100)}ms` }}>
                            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group rounded-[24px] bg-white border-none shadow-sm h-full">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <span className="font-medium text-lg text-gray-900">{item}</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
