'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeaderSkeleton, StatsSkeleton, TableSkeleton } from '@/components/eka/loading-skeletons';

export default function TherapistClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      toast({ title: 'Error', description: 'Failed to load clients', variant: 'destructive' });
    } finally { 
      setLoading(false); 
    }
  };

  const createDemoClient = async () => {
    // For mock mode we will call updateUser with a new id to simulate create
    const id = `mock-${Date.now()}`;
    const data = { id, name: `Demo Client ${clients.length + 1}`, email: `demo${clients.length + 1}@example.com`, role: 'Patient' };
    try {
      await fxService.updateUser(id, data);
      toast({ title: 'Success', description: 'Demo client created' });
      await loadClients();
    } catch (e) { 
      console.error(e);
      toast({ title: 'Error', description: 'Failed to create client', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <PageHeaderSkeleton />
        <StatsSkeleton />
        <Card className="shadow-lg border-border/50">
          <div className="p-6">
            <TableSkeleton />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Clients
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your client relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={loadClients} 
              variant="outline" 
              disabled={loading}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <Button 
              onClick={createDemoClient} 
              disabled={loading}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Client
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="shadow-lg border-border/50">
        <div className="p-6">
          {!loading && clients.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-muted-foreground font-medium">No clients found</p>
              <p className="text-sm text-muted-foreground mt-1">Click "New Client" to get started</p>
            </div>
          )}
          {!loading && clients.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Link 
                        href={`/therapist/person/${client.id}`} 
                        className="font-medium text-primary hover:underline flex items-center gap-2 group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                          {(client.name || client.id).charAt(0).toUpperCase()}
                        </div>
                        {client.name || client.id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.email || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.assign(`/therapist/bookings?client=${client.id}`)}
                          className="hover:bg-primary/5 hover:border-primary/50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Bookings
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={async () => { 
                            await fxService.createNotification({ title: 'Test message', body: `Hello ${client.name || client.id}` }); 
                            toast({ title: 'Sent', description: 'Test notification sent.' }); 
                          }}
                          className="hover:bg-primary/5 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Message
                        </Button>
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
