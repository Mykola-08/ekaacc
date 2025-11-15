'use client';

import { Avatar, AvatarFallback, Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/keep';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, PlusCircle, Users, Activity, Calendar } from 'lucide-react';

import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
;
;
;
;
;

// --- Reusable Components ---

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function ClientsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function NoClientsEmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Clients Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first client.</p>
            <Button onClick={onCreate} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Client
            </Button>
        </div>
    );
}

// --- Main Page Component ---

export default function TherapistClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const users: any[] = await fxService.getUsers();
      const patients = users.filter(u => !u.role || u.role === 'Patient');
      setClients(patients);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load clients', variant: 'destructive' });
    } finally { 
      setLoading(false); 
    }
  }, [toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const createDemoClient = async () => {
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

  return (
    <SettingsShell>
      <SettingsHeader
        title="Clients"
        description="Manage your client relationships and view their profiles."
      >
        <div className="flex gap-2">
          <Button onClick={loadClients} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={createDemoClient} disabled={loading}>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </SettingsHeader>

      {loading ? (
        <ClientsPageSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Clients" value={clients.length.toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="Active This Week" value="-" icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
            <StatCard title="New This Month" value="-" icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
          </div>

          <Card>
            <CardContent className="p-0">
              {clients.length === 0 ? (
                <NoClientsEmptyState onCreate={createDemoClient} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <Link href={`/therapist/person/${client.id}`} className="flex items-center gap-3 group">
                            <Avatar>
                              <AvatarFallback>{(client.name || 'C').charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium group-hover:underline">{client.name || client.id}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{client.email || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/therapist/person/${client.id}`}>
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </SettingsShell>
  );
}
