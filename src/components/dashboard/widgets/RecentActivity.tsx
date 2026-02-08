'use client';

import { Activity } from 'lucide-react';
import Link from 'next/link';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';

export function RecentActivity() {
  return (
    <div className="grid grid-cols-1">
      <DashboardCard title="Recent Transactions" icon={Activity}>
        <div className="mt-4 space-y-1">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="hover:bg-secondary group border-border -mx-4 flex cursor-pointer items-center justify-between rounded-xl border-b p-4 px-8 transition-colors last:border-0 last:pb-2"
            >
              <div className="flex items-center gap-4">
                <div className="bg-card text-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {i === 0 ? 'DT' : i === 1 ? 'RE' : 'YO'}
                </div>
                <div>
                  <p className="text-foreground text-[15px] font-semibold">
                    {i === 0 ? 'Deep Tissue Massage' : i === 1 ? 'Reflexology' : 'Yoga Class'}
                  </p>
                  <p className="text-muted-foreground text-[13px] font-medium">
                    Oct 2{i}, 2023 • 1 hour
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-foreground block text-[15px] font-semibold">-1 Credit</span>
                <span className="text-[12px] font-medium text-emerald-600">Completed</span>
              </div>
            </div>
          ))}
          <div className="border-border border-t pt-4 text-center">
            <Link
              href="/wallet"
              className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
            >
              View All Transactions
            </Link>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
