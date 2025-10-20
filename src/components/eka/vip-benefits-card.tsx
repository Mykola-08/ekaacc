'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Calendar, Percent, UserCheck, Sparkles } from 'lucide-react';
import { VipBadge } from './vip-badge';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';

interface VipBenefitsCardProps {
  user: User;
  className?: string;
}

export function VipBenefitsCard({ user, className }: VipBenefitsCardProps) {
  if (!user.isVip || !user.vipTier) {
    return null;
  }

  const benefits = user.vipBenefits;
  const expiresAt = user.vipExpiresAt ? new Date(user.vipExpiresAt) : null;
  const daysRemaining = expiresAt
    ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className={cn('border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            VIP Membership
          </CardTitle>
          <VipBadge tier={user.vipTier} />
        </div>
        <CardDescription>
          {daysRemaining !== null && daysRemaining > 0 ? (
            <span>Valid for {daysRemaining} more days</span>
          ) : daysRemaining !== null && daysRemaining <= 0 ? (
            <span className="text-red-600">Expired</span>
          ) : (
            <span>Active membership</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Your Benefits</h4>
          <div className="grid gap-2">
            {benefits?.priorityBooking && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Priority booking access</span>
              </div>
            )}
            
            {benefits?.discountPercentage && benefits.discountPercentage > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span>{benefits.discountPercentage}% discount on all services</span>
              </div>
            )}
            
            {benefits?.freeSessionsPerMonth && benefits.freeSessionsPerMonth > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span>{benefits.freeSessionsPerMonth} free session{benefits.freeSessionsPerMonth > 1 ? 's' : ''} per month</span>
              </div>
            )}
            
            {benefits?.dedicatedTherapist && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>Dedicated therapist support</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
