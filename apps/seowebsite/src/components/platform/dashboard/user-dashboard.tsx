'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, CreditCard, Star, ChevronRight, Activity, 
  BookOpen, Heart, TrendingUp, Sparkles, MapPin 
} from 'lucide-react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
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
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.stats.nextSession')}</CardTitle>
                    <Calendar className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formattedDate}</div>
                    {upcomingSession ? (
                      <p className="text-xs text-muted-foreground">{formattedTime} • {serviceName}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Book your session</p>
                    )}
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.stats.credits')}</CardTitle>
                    <CreditCard className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{walletBalance !== undefined ? (walletBalance / 100).toFixed(2) : '0.00'} €</div>
                    <p className="text-xs text-muted-foreground">Available balance</p>
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.stats.wellnessScore')}</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85</div>
                    <Progress value={85} className="mt-2 h-1.5" />
                  </CardContent>
                </Card>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.stats.streak')}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3 {t('common.days')}</div>
                    <p className="text-xs text-muted-foreground">Keep it up!</p>
                  </CardContent>
                </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{t('dashboard.upcoming.title')}</CardTitle>
                  <CardDescription>{t('dashboard.upcoming.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                     {/* Mock Data Item */}
                     <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Deep Tissue Massage</p>
                          <p className="text-sm text-muted-foreground">Today at 4:00 PM</p>
                        </div>
                        <div className="ml-auto font-medium flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Confirmed</Badge>
                        </div>
                     </div>
                     <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Kinesiology Session</p>
                          <p className="text-sm text-muted-foreground">Oct 28 at 11:00 AM</p>
                        </div>
                        <div className="ml-auto font-medium flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>
                        </div>
                     </div>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        {t('common.viewAll')}
                    </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="col-span-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Card className="h-full bg-primary text-primary-foreground border-0 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-white">{t('dashboard.promo.title') || 'Premium Plan'}</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    {t('dashboard.promo.description') || 'Upgrade to unlock exclusive benefits.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-white text-white" />
                        <span>10% off all sessions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-white text-white" />
                        <span>Priority booking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-white text-white" />
                        <span>Free cancellation</span>
                      </li>
                   </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" className="w-full font-semibold">
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
