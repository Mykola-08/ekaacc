import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, ArrowUpRight, Wallet, Activity } from "lucide-react";
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardLayout } from './DashboardLayout';
import { DashboardHeader } from './DashboardHeader';
import { SingleTherapistProfile } from '@/components/profile/SingleTherapistProfile';
import { WelcomeBanner } from './widgets/WelcomeBanner';
import { StatsCard } from './widgets/StatsCard';
import { RecentActivity } from './widgets/RecentActivity';

type ClientDashboardProps = {
    profile: any;
    wallet: any;
    nextBooking: any;
    singleTherapist?: { display_name: string | null; name: string } | null;
    exerciseStats?: any;
};

export function ClientDashboard({ profile, wallet, nextBooking, singleTherapist, exerciseStats }: ClientDashboardProps) {
    const { t } = useLanguage();

    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* Header */}
                <DashboardHeader
                    title={singleTherapist ? 'Therapist Overview' : 'Client Overview'}
                    showDate={false}
                />

                {/* Welcome Banner */}
                <WelcomeBanner
                    title={singleTherapist
                        ? `Welcome Back`
                        : `${t('dashboard.welcome')}, ${profile.first_name || 'Guest'}`
                    }
                    subtitle={singleTherapist
                        ? `Manage your sessions with ${singleTherapist.display_name || singleTherapist.name}.`
                        : 'Track your wellness journey, balance, and upcoming appointments.'
                    }
                    action={
                        <Button asChild className="rounded-[18px] h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-0 font-semibold active:scale-95 transition-transform">
                            <Link href="/book">
                                <Plus className="w-5 h-5 mr-2" strokeWidth={2.75} />
                                {t('nav.book')}
                            </Link>
                        </Button>
                    }
                />

                {singleTherapist && <SingleTherapistProfile therapist={singleTherapist} />}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Wallet/Credits */}
                    <Link href="/wallet" className="block h-full">
                        <StatsCard
                            icon={Wallet}
                            label="Balance"
                            value={<span>{wallet?.balance || 0} <span className="text-lg text-muted-foreground font-medium">credits</span></span>}
                            colorClass="bg-blue-50 text-blue-600"
                            action={<ArrowUpRight className="w-5 h-5 text-muted-foreground/50" />}
                            className="cursor-pointer h-full"
                        />
                    </Link>

                    {/* Next Session (Custom Card to handle specific layout) */}
                    <div className="bg-card p-6 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-all group lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-[14px] bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calendar className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            {nextBooking && <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold uppercase">Upcoming</span>}
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Next Session</span>
                            {nextBooking ? (
                                <Link href="/bookings" className="block hover:opacity-80 transition-opacity">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                                        <div className="text-2xl font-bold text-foreground tracking-tight truncate">{nextBooking.services?.title}</div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-secondary px-3 py-1 rounded-full w-fit">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(nextBooking.start_time), 'MMM do, h:mm a')}
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="text-xl font-semibold text-muted-foreground">No upcoming sessions</div>
                            )}
                        </div>
                    </div>

                    {/* Check In Action (Quick Action Style) */}
                    <Link href="/book" className="bg-card p-6 rounded-[28px] border border-border shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-40">
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-[14px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-lg font-bold text-foreground">Book Now</div>
                            <div className="text-sm text-muted-foreground font-medium">Schedule a new visit</div>
                        </div>
                    </Link>
                </div>


                {/* Recent Activity Section */}
                <h3 className="text-xl font-semibold text-foreground px-1">Recent Activity</h3>
                <RecentActivity />
            </div>
        </DashboardLayout>
    );
}
