'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useData } from '@/context/unified-data-context';
import { useToast } from '@/hooks/use-toast';

export default function TherapistClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useData();
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const users: any[] = await fxService.getUsers();
      // Filter out therapists and admins, show patients
      const patients = users.filter(u => !u.role || u.role === 'Patient');
      setClients(patients);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const createDemoClient = async () => {
    // For mock mode we will call updateUser with a new id to simulate create
    const id = `mock-${Date.now()}`;
    const data = { id, name: `Demo Client ${clients.length + 1}`, email: `demo${clients.length + 1}@example.com`, role: 'Patient' };
    try {
      await fxService.updateUser(id, data);
      await loadClients();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <div className="flex gap-2">
          <Button onClick={loadClients} variant="outline">Refresh</Button>
          <Button onClick={createDemoClient}>Create Demo Client</Button>
        </div>
      </div>

      <Card>
        <div className="p-4">
          {loading && <p className="text-sm">Loading...</p>}
          {!loading && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map(c => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/therapist/person/${c.id}`} className="text-blue-600 hover:underline">{c.name || c.id}</Link>
                    </TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => window.location.assign(`/therapist/bookings?client=${c.id}`)}>Bookings</Button>
                        <Button size="sm" variant="ghost" onClick={async () => { await fxService.createNotification({ title: 'Test message', body: `Hello ${c.name || c.id}` }); toast({ title: 'Sent', description: 'Test notification sent.' }); }}>Message</Button>
                      </div>
                    </TableCell>
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
