'use client';

import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { NotificationDropdown } from "./NotificationDropdown";
import { useLanguage } from '@/context/LanguageContext';

type ClientDashboardProps = {
    profile: any;
    wallet: any;
    nextBooking: any;
};

export function ClientDashboard({ profile, wallet, nextBooking }: ClientDashboardProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 p-6 md:p-10 min-h-screen animate-in fade-in duration-700">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/40 pb-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground/90">
                        {t('dashboard.welcome')}, {profile.first_name || 'Guest'}
                    </h1>
                    <p className="text-lg text-muted-foreground font-light">
                        Your wellness overview for today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                     <NotificationDropdown />
                    <Button asChild variant="secondary" className="rounded-full px-6 h-10 font-medium bg-foreground/5 hover:bg-foreground/10 text-foreground shadow-none backdrop-blur-md">
                        <Link href="/book">
                            <Plus className="w-4 h-4 mr-2 opacity-70" />
                            {t('nav.book')}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Next Session - Notion/Glass style */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl p-8 hover:bg-background/60 transition-all duration-500 shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-medium text-foreground/80 flex items-center gap-3">
                            <Calendar className="w-5 h-5 opacity-50" />
                            {t('dashboard.upcoming')}
                        </h2>
                        {nextBooking && (
                            <span className="text-xs font-mono uppercase tracking-wider opacity-60 bg-foreground/5 px-2 py-1 rounded-md">
                                Confirmed
                            </span>
                        )}
                    </div>

                    {nextBooking ? (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-medium tracking-tight text-foreground">
                                    {nextBooking.services?.title || 'Therapy Session'}
                                </h3>
                                <div className="flex flex-col gap-2 mt-4 text-muted-foreground">
                                    <div className="flex items-center gap-3 text-lg font-light">
                                        <Clock className="w-5 h-5 opacity-40" />
                                        <span>
                                            {format(new Date(nextBooking.start_time), 'EEEE, MMMM do')} • {format(new Date(nextBooking.start_time), 'h:mm a')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-base font-light opacity-80">
                                        <MapPin className="w-5 h-5 opacity-40" />
                                        <span>Main Studio, Room 3</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" className="flex-1 rounded-xl h-12 border-border/40 hover:bg-foreground/5 transition-colors text-foreground/80">
                                    Reschedule
                                </Button>
                                <Button className="flex-1 rounded-xl h-12 bg-foreground text-background hover:opacity-90 transition-opacity shadow-none">
                                    Get Directions
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-center py-6 space-y-4">
                            <div className="space-y-2">
                                <p className="text-lg font-medium text-foreground/80">No upcoming sessions</p>
                                <p className="text-muted-foreground font-light">Ready to prioritize your wellness?</p>
                            </div>
                            <Button variant="link" className="p-0 h-auto font-medium text-foreground flex items-center gap-2 group-hover:gap-3 transition-all" asChild>
                                <Link href="/book">
                                    Browse Schedule <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Wallet - Notion/Glass style */}
                <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl p-8 hover:bg-background/60 transition-all duration-500 shadow-sm hover:shadow-md flex flex-col justify-between">
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium text-foreground/80 flex items-center gap-3">
                                Credit Balance
                            </h2>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-foreground/5 -mr-2">
                                <ArrowUpRight className="w-5 h-5 opacity-40" />
                            </Button>
                        </div>
                        
                        <div>
                            <span className="text-5xl font-semibold tracking-tighter text-foreground">
                                {wallet?.balance || 0}
                            </span>
                            <span className="text-xl text-muted-foreground ml-2 font-light">Credits</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                <span className="text-muted-foreground">Membership</span>
                                <span className="font-medium">Standard</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                <span className="text-muted-foreground">Expires</span>
                                <span className="font-medium">Never</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                         <Button className="w-full rounded-xl h-12 bg-foreground/5 hover:bg-foreground/10 text-foreground font-medium border border-transparent hover:border-border/30 shadow-none transition-all">
                            Add Credits
                        </Button>
                    </div>
                </div>
            </div>
            
             {/* Recent Activity Section */}
             <div className="pt-8">
                <h3 className="text-xl font-light text-muted-foreground mb-6">Recent Activity</h3>
                <div className="rounded-3xl border border-border/40 bg-background/20 backdrop-blur-sm overflow-hidden">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-6 border-b border-border/20 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <Clock className="w-4 h-4 opacity-50" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground/90">Deep Tissue Massage</p>
                                    <p className="text-sm text-muted-foreground">Oct 2{i}, 2023</p>
                                </div>
                            </div>
                            <span className="text-sm font-mono opacity-50">-1 Credit</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
