'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, CreditCard, Star, ChevronRight, Activity, 
  BookOpen, Heart, TrendingUp, Sparkles, MapPin 
} from 'lucide-react';
import { useAuth } from '@/contexts/platform/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/platform/ui/card';
import { Badge } from '@/components/platform/ui/badge';
import { Progress } from '@/components/platform/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';

interface UserDashboardProps {
  upcomingSession?: {
      start_time: string;
      service?: { name: string };
  } | null;
  walletBalance?: number;
}

export function UserDashboard({ upcomingSession, walletBalance }: UserDashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const sessionDate = upcomingSession ? new Date(upcomingSession.start_time) : null;
  const formattedDate = sessionDate ? sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None';
  const formattedTime = sessionDate ? sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
  const serviceName = upcomingSession?.service?.name || 'Session';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('dashboard.welcome', { name: user?.first_name || 'Guest' })}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.subtitle') || 'Track your wellness journey and upcoming sessions.'}
          </p>
        </div>
        <div className="flex gap-2">
           <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all">
              <Link href="/services">
                 <Sparkles className="w-4 h-4 mr-2" />
                 {t('common.bookNow')}
              </Link>
           </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <TabsList className="bg-muted/50 p-1 rounded-full">
              <TabsTrigger value="overview" className="rounded-full">{t('dashboard.tabs.overview') || 'Overview'}</TabsTrigger>
              <TabsTrigger value="schedule" className="rounded-full">{t('dashboard.tabs.schedule') || 'Schedule'}</TabsTrigger>
              <TabsTrigger value="wallet" className="rounded-full">{t('dashboard.tabs.wallet') || 'Wallet'}</TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="animate-slide-up">
                <Card className="hover:shadow-lg transition-all duration-300 rounded-[32px] border-none shadow-sm bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.nextSession')}</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-3xl font-bold tracking-tight text-foreground">{formattedDate}</div>
                    {upcomingSession ? (
                      <p className="text-sm text-muted-foreground mt-1 font-medium">{formattedTime} • {serviceName}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground/80 mt-1">Book your session</p>
                    )}
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <Card className="hover:shadow-lg transition-all duration-300 rounded-[32px] border-none shadow-sm bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.credits')}</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-3xl font-bold tracking-tight text-foreground">{walletBalance !== undefined ? (walletBalance / 100).toFixed(2) : '0.00'} €</div>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Available balance</p>
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Card className="hover:shadow-lg transition-all duration-300 rounded-[32px] border-none shadow-sm bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.wellnessScore')}</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-3xl font-bold tracking-tight text-foreground">85</div>
                    <Progress value={85} className="mt-3 h-2 rounded-full bg-muted" />
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Card className="hover:shadow-lg transition-all duration-300 rounded-[32px] border-none shadow-sm bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.stats.streak')}</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="text-3xl font-bold tracking-tight text-foreground">3 {t('common.days')}</div>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">Keep it up!</p>
                  </CardContent>
                </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Card className="h-full rounded-[32px] border-none shadow-sm bg-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-semibold text-foreground">{t('dashboard.upcoming.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">{t('dashboard.upcoming.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="space-y-4">
                     {/* Mock Data Item */}
                     <div className="flex items-center p-4 bg-muted/30 rounded-2xl transition-colors hover:bg-muted/80">
                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                            <span className="font-bold text-orange-700 text-lg">22</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Deep Tissue Massage</p>
                          <p className="text-sm text-muted-foreground">Today at 4:00 PM</p>
                        </div>
                        <div className="ml-auto font-medium flex items-center gap-2">
                            <Badge variant="secondary" className="bg-card hover:bg-card text-green-700 shadow-sm border border-gray-100 rounded-lg px-3 py-1">Confirmed</Badge>
                        </div>
                     </div>
                     <div className="flex items-center p-4 bg-muted/30 rounded-2xl transition-colors hover:bg-muted/80">
                        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                             <span className="font-bold text-blue-700 text-lg">28</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">Kinesiology Session</p>
                          <p className="text-sm text-muted-foreground">Oct 28 at 11:00 AM</p>
                        </div>
                        <div className="ml-auto font-medium flex items-center gap-2">
                            <Badge variant="secondary" className="bg-card hover:bg-card text-blue-700 shadow-sm border border-gray-100 rounded-lg px-3 py-1">Pending</Badge>
                        </div>
                     </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-2xl h-12">
                        {t('common.viewAll')} <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="col-span-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Card className="h-full bg-gray-900 text-white border-0 shadow-lg relative overflow-hidden rounded-[32px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardHeader className="p-8 pb-4 relative z-10">
                  <CardTitle className="text-white text-xl font-semibold">{t('dashboard.promo.title') || 'Premium Plan'}</CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    {t('dashboard.promo.description') || 'Upgrade to unlock exclusive benefits.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8 relative z-10">
                   <ul className="space-y-4 text-sm font-medium">
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-card/10 flex items-center justify-center">
                            <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                        <span>10% off all sessions</span>
                      </li>
                      <li className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-card/10 flex items-center justify-center">
                            <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                        <span>Priority booking</span>
                      </li>
                      <li className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-full bg-card/10 flex items-center justify-center">
                            <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                        <span>Free cancellation</span>
                      </li>
                   </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0 relative z-10 mt-auto">
                    <Button variant="secondary" className="w-full font-bold h-12 rounded-2xl bg-card text-foreground hover:bg-muted border-0">
                        {t('common.upgrade')}
                    </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
