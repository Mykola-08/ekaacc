'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';

export function RecentActivity() {
    return (
        <div className="grid grid-cols-1">
            <DashboardCard title="Recent Transactions" icon={Activity}>
                <div className="space-y-1 mt-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary transition-colors group cursor-pointer -mx-4 px-8 border-b border-border last:border-0 last:pb-2">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-foreground font-bold text-sm">
                                    {i === 0 ? 'DT' : i === 1 ? 'RE' : 'YO'}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-[15px]">
                                        {i === 0 ? 'Deep Tissue Massage' : i === 1 ? 'Reflexology' : 'Yoga Class'}
                                    </p>
                                    <p className="text-[13px] text-muted-foreground font-medium">Oct 2{i}, 2023 • 1 hour</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[15px] font-semibold text-foreground">
                                    -1 Credit
                                </span>
                                <span className="text-[12px] text-emerald-600 font-medium">Completed</span>
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-border text-center">
                        <Link href="/wallet" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                            View All Transactions
                        </Link>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
}
