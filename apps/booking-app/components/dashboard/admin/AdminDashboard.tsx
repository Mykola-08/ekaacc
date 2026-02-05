'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { WelcomeBanner } from '../widgets/WelcomeBanner';
import { Users, Activity, TrendingUp, Shield, BarChart3, Database } from "lucide-react";
import { StatsCard } from '../widgets/StatsCard';
import { SystemStatus } from '../widgets/SystemStatus';
import { RecentAdminActivity } from '../widgets/RecentAdminActivity';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminDashboard({ profile, stats }: any) {
    return (
        <DashboardLayout profile={profile}>
            <div className="space-y-6 animate-in fade-in duration-500">
                <WelcomeBanner 
                    title="System Administration," 
                    firstName={profile.first_name || 'Admin'}
                    subtitle="Platform health and user metrics overview." 
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard 
                        icon={Users} 
                        label="Total Users" 
                        value={stats?.users_total || 0} 
                        colorClass="bg-blue-50 text-blue-600"
                    />
                    <StatsCard 
                        icon={TrendingUp} 
                        label="Revenue MTD" 
                        value={`€${(stats?.revenue_mtd || 0) / 100}`} 
                        colorClass="bg-emerald-50 text-emerald-600"
                    />
                    <StatsCard 
                        icon={Activity} 
                        label="Active Plans" 
                        value={stats?.active_plans || 0} 
                        colorClass="bg-violet-50 text-violet-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <SystemStatus />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="p-6 rounded-[36px] bg-[#FEFFFE] border-[#F5F5F5] shadow-sm flex items-center gap-4 group hover:border-primary/20 hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-[16px] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-6 h-6" strokeWidth={2.75} />
                                </div>
                                <div>
                                    <div className="font-bold tracking-tight text-[#222222]">Analytics</div>
                                    <div className="text-xs text-muted-foreground font-medium">Detailed usage reports</div>
                                </div>
                            </Card>
                            <Card className="p-6 rounded-[36px] bg-[#FEFFFE] border-[#F5F5F5] shadow-sm flex items-center gap-4 group hover:border-amber-500/20 hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-[16px] bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                    <Database className="w-6 h-6" strokeWidth={2.75} />
                                </div>
                                <div>
                                    <div className="font-bold tracking-tight text-[#222222]">Database</div>
                                    <div className="text-xs text-muted-foreground font-medium">Direct query access</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <RecentAdminActivity />
                        
                        <Card className="p-8 bg-primary rounded-[36px] shadow-lg shadow-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform relative z-10">
                                <Shield className="w-7 h-7" strokeWidth={2.75} />
                            </div>
                            <h4 className="font-bold text-xl mb-2 tracking-tight text-white relative z-10">Security Protocols</h4>
                            <p className="text-sm text-white/80 mb-8 max-w-[200px] font-medium relative z-10">Access system wide security logs and audit trails.</p>
                            <div className="flex gap-3 w-full justify-center relative z-10">
                                <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold px-8 h-11 border-none shadow-none">Review</Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
