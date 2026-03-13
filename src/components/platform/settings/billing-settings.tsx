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
import {
  Loader2,
  Check,
  AlertTriangle,
  Download,
  ExternalLink,
  Receipt,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/platform/supabase/client';
import { useRouter } from 'next/navigation';
import {
  getInvoices,
  getSubscription,
  getPaymentMethods,
  type InvoiceRecord,
  type SubscriptionDetail,
  type PaymentMethod,
} from '@/app/actions/billing';

export function BillingSettings() {
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionDetail | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [sub, inv, pm] = await Promise.all([
        getSubscription().catch(() => null),
        getInvoices().catch(() => []),
        getPaymentMethods().catch(() => []),
      ]);

      setSubscription(sub);
      setInvoices(inv);
      setPaymentMethods(pm);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Portal error:', data.error);
      }
    } catch (error) {
      console.error('Error opening portal:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      {/* Current Subscription */}
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>Manage your plan and billing details</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{subscription.plan_name}</h3>
                  <StatusBadge status={subscription.status} showIcon={false} />
                  {subscription.cancel_at_period_end && (
                    <Badge
                      variant="outline"
                      className="border-warning/30 bg-warning/10 text-warning"
                    >
                      Cancels at period end
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {subscription.cancel_at_period_end
                    ? `Access until ${new Date(subscription.current_period_end).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">
                  {new Intl.NumberFormat('en-IE', {
                    style: 'currency',
                    currency: subscription.plan_currency,
                  }).format(subscription.plan_price)}
                  <span className="text-muted-foreground text-sm font-normal">
                    /{subscription.plan_interval}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="bg-muted/30 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                <ShieldCheck className="text-muted-foreground/50 h-7 w-7" />
              </div>
              <p className="text-foreground font-medium">You are on the Free plan</p>
              <p className="text-muted-foreground mt-1 mb-4 text-sm">
                Upgrade to unlock premium features and priority support.
              </p>
              <Button onClick={() => router.push('/finances?tab=plans')} className="rounded-xl">
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
        {subscription && (
          <CardFooter className="bg-muted/50 px-6 py-4">
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="rounded-xl"
            >
              {portalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Manage Subscription
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Payment Methods */}
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="text-primary h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Cards on file for subscriptions and purchases</CardDescription>
            </div>
            {paymentMethods.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                className="rounded-xl"
              >
                Manage
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="border-border bg-muted/30 flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-card text-muted-foreground flex h-10 w-14 items-center justify-center rounded-lg text-xs font-semibold tracking-wider uppercase shadow-sm">
                      {pm.brand}
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">•••• {pm.last4}</p>
                      <p className="text-muted-foreground text-xs">
                        Expires {String(pm.exp_month).padStart(2, '0')}/{pm.exp_year}
                      </p>
                    </div>
                  </div>
                  {pm.is_default && (
                    <Badge variant="secondary" className="rounded-full text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <CreditCard className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No payment methods on file.{' '}
                {subscription
                  ? 'Add one via the subscription portal.'
                  : 'A card will be added when you subscribe.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="text-primary h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>Recent invoices and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-border hover:bg-muted/30 flex items-center justify-between rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-success/10 text-success'
                          : invoice.status === 'open'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {invoice.status === 'paid' ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Receipt className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {invoice.description || 'Payment'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(invoice.created_at).toLocaleDateString('en-IE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-foreground font-semibold">
                        {new Intl.NumberFormat('en-IE', {
                          style: 'currency',
                          currency: invoice.currency,
                        }).format(invoice.amount_cents / 100)}
                      </span>
                      <div className="mt-0.5">
                        <Badge
                          variant={invoice.status === 'paid' ? 'secondary' : 'outline'}
                          className="text-2xs capitalize"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                    {invoice.stripe_invoice_url && (
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <a
                          href={invoice.stripe_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View invoice"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Receipt className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8" />
              <p className="text-foreground font-medium">No billing history yet</p>
              <p className="text-muted-foreground text-sm">
                Invoices will appear here once you make a purchase.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
