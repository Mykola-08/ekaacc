'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CreditCard, ArrowRight, Plus } from "lucide-react";
import Link from 'next/link';
import { NotificationDropdown } from "./NotificationDropdown";
import { useLanguage } from '@/context/LanguageContext';

type ClientDashboardProps = {
    profile: any;
    wallet: any;
    nextBooking: any;
};

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
    const today = new Date();
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 p-4 md:p-8 min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground tracking-tight">
                        {t('dashboard.welcome')}, {profile.first_name || 'Guest'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here is your wellness overview for today.
                    </p>
                </div>
                <div className="flex gap-2">
                     <NotificationDropdown />
                    <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                        <Link href="/book">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('nav.book')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Next Session Card */}
                <div className="h-full">
                    <Card className="h-full hover:scale-[1.01] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-lg font-medium text-foreground">
                                <div className="p-2 rounded-full bg-teal-100 text-teal-700">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                {t('dashboard.upcoming')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {nextBooking ? (
                                <div className="space-y-6">
                                    <div className="bg-card/50 border border-white/60 rounded-xl p-4 transition-colors hover:bg-card/70">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {nextBooking.services?.title || 'Therapy Session'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {format(new Date(nextBooking.start_time), 'EEEE, MMMM do')} at {format(new Date(nextBooking.start_time), 'h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-sm bg-card/40 p-4 rounded-xl border border-white/40">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">Main Studio, Room 3</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-xl h-11 border-white/60 bg-card/50 hover:bg-card">Reschedule</Button>
                                        <Button variant="secondary" className="flex-1 rounded-xl h-11 bg-teal-100/50 hover:bg-teal-100 text-teal-800">Get Directions</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                                    <div className="bg-card/50 p-4 rounded-full">
                                        <Calendar className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">No upcoming sessions</p>
                                        <p className="text-sm text-muted-foreground">Ready to prioritize your wellness?</p>
                                    </div>
                                    <Button variant="default" className="rounded-full px-6" asChild>
                                        <Link href="/book">Browse Schedule</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Wallet / Balance Card */}
                <div className="h-full">
                    <Card className="h-full hover:scale-[1.01] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-3 text-lg font-medium text-foreground">
                                <div className="p-2 rounded-full bg-green-500/10 dark:bg-green-500/20">
                                    <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                Your Balance
                            </CardTitle>
                            <CardDescription>Available credits</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="bg-muted/30 rounded-2xl p-8 text-center border border-dashed border-border">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-4xl md:text-5xl font-bold text-foreground">
                                        {wallet?.balance || 0}
                                    </span>
                                    <span className="text-muted-foreground font-medium text-lg">credits</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button className="w-full gap-2 rounded-xl h-12 text-base font-semibold" size="lg">
                                Top Up Wallet <ArrowRight className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

            </div>
        </div>
    );
}
