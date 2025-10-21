'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

export default function TherapistBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const inv = await fxService.getInvoicesForClient('demo-client');
      setInvoices(inv || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createInvoice = async () => {
    try {
      const res = await fxService.createInvoice('demo-client', 25, 'Test invoice');
  toast({ title: 'Invoice', description: `Invoice: ${res?.id || JSON.stringify(res)}` });
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Billing</h1>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline">Refresh</Button>
          <Button onClick={createInvoice}>Create Test Invoice</Button>
        </div>
      </div>

      <Card>
        <div className="p-4">
          {loading && <p>Loading...</p>}
          {!loading && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{i.id}</TableCell>
                    <TableCell>{i.amount}</TableCell>
                    <TableCell>{i.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
