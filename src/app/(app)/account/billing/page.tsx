"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useData } from '@/context/unified-data-context';
import { useToast } from '@/hooks/use-toast';

export default function AccountBillingPage() {
  const { currentUser } = useData();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const inv = await fxService.getInvoicesForClient(currentUser?.id || currentUser?.uid || 'guest');
        if (!mounted) return;
        setInvoices(inv || []);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [currentUser]);

  const pay = async (invId: string) => {
    try {
      await fxService.markInvoicePaid(invId);
      toast({ title: 'Paid', description: 'Invoice marked as paid (mock)' });
      setInvoices(prev => prev.map(i => i.id === invId ? { ...i, paid: true } : i));
    } catch (e) { console.error(e); toast({ title: 'Error', description: 'Failed to mark as paid', variant: 'destructive' }); }
  };

  if (!currentUser) return <div className="p-4">Please log in</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Card className="p-4">
        <h3 className="font-semibold">Invoices</h3>
        <div className="mt-3 space-y-2">
          {invoices.length === 0 && <div className="text-sm text-muted-foreground">No invoices found.</div>}
          {invoices.map(inv => (
            <div key={inv.id} className="p-3 bg-muted rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{inv.description || 'Invoice'}</div>
                <div className="text-sm text-muted-foreground">{new Date(inv.date).toLocaleDateString()} — {inv.amount}€</div>
              </div>
              <div>
                {inv.paid ? <span className="text-sm text-green-600">Paid</span> : <Button size="sm" onClick={() => pay(inv.id)}>Mark Paid</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold">Payment Methods</h3>
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-muted rounded">No payment methods saved (mock)</div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline">Add Card</Button>
            <Button variant="outline">Connect Stripe</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
