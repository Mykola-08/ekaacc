'use client';

import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSeparator,
  ActionBarSelection,
} from '@/components/ui/action-bar';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RefreshCw,
  PlusCircle,
  Activity,
  Calendar,
  Users,
  Trash2,
  Edit2,
  Archive,
} from 'lucide-react';
import { UserGroupIcon } from '@hugeicons/core-free-icons';
import { EmptyState } from '@/components/ui/empty-state';
import { PageSection } from '@/components/ui/page-section';

import fxService from '@/lib/platform/services/platform-service';
import { useToast } from '@/hooks/platform/ui/use-toast';
// --- Reusable Components ---

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </Card>
  );
}

function ClientsPageSkeleton() {
  return (
    <div className="">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="">
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
    <EmptyState
      icon={UserGroupIcon}
      title="No Clients Found"
      description="Your clients will appear here once they are added to the platform."
      action={
        <Button onClick={onCreate} variant="default">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      }
    />
  );
}

// --- Main Page Component ---

export default function TherapistClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const loadClients = useCallback(async () => {
    setLoading(true);
    setSelectedIds(new Set());
    try {
      const users: any[] = await fxService.getUsers();
      const patients = users.filter((u) => !u.role || u.role.name === 'Patient');
      setClients(patients);
    } catch {
      toast({ title: 'Error', description: 'Failed to load clients', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const router = useRouter();

  const handleNewClient = () => {
    // TODO: implement client creation flow
    toast({ title: 'Coming soon', description: 'Client creation is not yet available.' });
  };

  const toggleRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === clients.length && clients.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(clients.map((c) => c.id)));
    }
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="container mx-auto p-6">
      <div className="">
        <PageSection
          title="Clients"
          description="Manage your client relationships and view their profiles."
          level="h2"
          actions={
            <div className="flex gap-2">
              <Button onClick={loadClients} variant="outline" disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleNewClient} disabled={loading} variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Client
              </Button>
            </div>
          }
        />

        {loading ? (
          <ClientsPageSkeleton />
        ) : (
          <div className="">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Total Clients"
                value={clients.length.toString()}
                icon={<Users className="text-muted-foreground h-4 w-4" />}
              />
              <StatCard
                title="Active This Week"
                value="-"
                icon={<Activity className="text-muted-foreground h-4 w-4" />}
              />
              <StatCard
                title="New This Month"
                value="-"
                icon={<Calendar className="text-muted-foreground h-4 w-4" />}
              />
            </div>

            {/* Clients Table */}
            <Card>
              <CardContent className="p-0">
                {clients.length === 0 ? (
                  <NoClientsEmptyState onCreate={handleNewClient} />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">
                          <Checkbox
                            checked={selectedIds.size === clients.length && clients.length > 0}
                            onCheckedChange={toggleAll}
                            aria-label="Select all rows"
                          />
                        </TableHead>
                        <TableHead>
                          <span className="text-sm font-medium">Client</span>
                        </TableHead>
                        <TableHead>
                          <span className="text-sm font-medium">Contact</span>
                        </TableHead>
                        <TableHead className="text-right">
                          <span className="text-sm font-medium">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => {
                        const isSelected = selectedIds.has(client.id);
                        return (
                          <TableRow
                            key={client.id}
                            className={isSelected ? 'bg-muted/20' : ''}
                            data-state={isSelected ? 'selected' : undefined}
                          >
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleRow(client.id)}
                                aria-label={`Select ${client.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/therapist/person/${client.id}`}
                                className="group flex items-center gap-3"
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {(client.name || 'C').charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium group-hover:underline">
                                  {client.name || client.id}
                                </span>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground text-sm">
                                {client.email || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/therapist/person/${client.id}`)}
                              >
                                View Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Floating Action Bar (Dice UI) */}
            <ActionBar open={hasSelection}>
              <ActionBarSelection>{selectedIds.size} selected</ActionBarSelection>
              <ActionBarSeparator />
              <ActionBarGroup>
                <ActionBarItem
                  onClick={() => toast({ title: 'Edit', description: 'Edit logic goes here.' })}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </ActionBarItem>
                <ActionBarItem
                  onClick={() =>
                    toast({ title: 'Archived', description: 'Archived selected clients.' })
                  }
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </ActionBarItem>
                <ActionBarSeparator />
                <ActionBarItem
                  variant="destructive"
                  onClick={() =>
                    toast({ title: 'Deleted', description: 'Deleted selected clients.' })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ActionBarItem>
              </ActionBarGroup>
            </ActionBar>
          </div>
        )}
      </div>
    </div>
  );
}
