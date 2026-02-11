'use client';

import { format } from 'date-fns';
import { CheckCircle, DollarSign, ShieldCheck } from 'lucide-react';
import { VerifyButton } from '@/components/admin/verify-button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface FinanceVerificationsProps {
  items: any[];
}

export function FinanceVerifications({ items }: FinanceVerificationsProps) {
  return (
    <div className="bg-background animate-fade-in min-h-screen w-full p-6 md:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-foreground font-serif text-3xl">Finance & Verification</h1>
          <p className="text-muted-foreground mt-1">
            Manage payments and identity verification requests.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-foreground text-lg font-semibold">Pending Verifications</h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>

          {items.length === 0 ? (
            <div className="bg-card border-border rounded-lg border border-dashed py-20 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <CheckCircle className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-foreground text-lg font-medium">All Clear!</h3>
              <p className="text-muted-foreground mt-1">No pending verifications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {items.map((item) => (
                <VerificationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VerificationCard({ item }: { item: any }) {
  const trustScore = item.profiles?.trust_score || 0;
  const isLowTrust = trustScore < 70;

  return (
    <Card className="border-border transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center">
        <div className="flex flex-1 items-start gap-4">
          <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <DollarSign className="text-muted-foreground h-6 w-6" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-foreground text-lg font-semibold">
                ${((item.amount || 0) / 100).toFixed(2)}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm font-medium">
                {item.service?.name}
              </span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="text-foreground font-medium">
                {item.profiles?.full_name || 'Guest'}
              </span>
              <span>{item.profiles?.email}</span>
            </div>

            <div className="text-muted-foreground mt-2 text-xs">
              Requested {format(new Date(item.start_time), 'MMM d, h:mm a')}
            </div>
          </div>
        </div>

        <div className="border-border flex w-full items-center justify-between gap-4 border-t pt-4 md:w-auto md:justify-end md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <Badge variant={isLowTrust ? 'destructive' : 'default'} className="flex gap-1">
            <ShieldCheck className="h-3 w-3" />
            Score: {trustScore}
          </Badge>

          <VerifyButton bookingId={item.id} />
        </div>
      </CardContent>
    </Card>
  );
}
