'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/platform/supabase/client';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  plan_type: string;
  tier: {
    name: string;
    monthly_price: number;
    currency: string;
  };
}

export function BillingSettings() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const {
        data: { user },
      } = await (supabase.auth as any).getUser();
      if (!user) return;

      // Fetch active subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*, tier:subscription_tiers(*)')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      if (subData) {
        setSubscription(subData);
      }

      // Fetch invoices (mock or real if table populated)
      // const { data: invoiceData } = await supabase.from('invoices').select('*').eq('user_id', user.id).limit(5);
      // setInvoices(invoiceData || []);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening portal:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>Manage your plan and billing details</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{subscription.tier.name}</h3>
                  <StatusBadge status={subscription.status} showIcon={false} />
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {subscription.cancel_at_period_end
                    ? `Ends on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: subscription.tier.currency,
                  }).format(subscription.tier.monthly_price)}
                  <span className="text-muted-foreground text-sm font-normal">/month</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-4">You are currently on the Free plan.</p>
              <Button onClick={() => router.push('/pricing')}>Upgrade Plan</Button>
            </div>
          )}
        </CardContent>
        {subscription && (
          <CardFooter className="bg-muted/50 px-6 py-4">
            <Button variant="outline" onClick={handleManageSubscription} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Manage Subscription
            </Button>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your recent invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-muted-foreground text-sm">{invoice.number}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: invoice.currency,
                      }).format(invoice.amount_paid / 100)}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No invoices found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
