'use client';

import { Avatar } from '@/components/platform/ui/avatar';
import { AvatarFallback } from '@/components/platform/ui/avatar';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Skeleton } from '@ekaacc/shared-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { Badge } from '@/components/platform/ui/badge';
import { Separator } from '@/components/platform/ui/separator';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, PlusCircle, Users, Activity, Calendar, Mail, Phone } from 'lucide-react';

import fxService from '@/lib/platform/services/platform-service';
import { useToast } from '@/hooks/platform/ui/use-toast';
;
;
;
;

// --- Reusable Components ---

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
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
    <Card className="text-center py-16 border-2 border-dashed">
      <Users className="mx-auto h-12 w-12 text-muted-foreground/80" />
      <h5 className="text-lg font-semibold mt-4">No Clients Found</h5>
      <p className="text-sm text-muted-foreground mt-1">
        Get started by adding your first client.
      </p>
      <Button onClick={onCreate} className="mt-4" variant="default">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Client
      </Button>
    </Card>
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
   const patients = users.filter(u => !u.role || u.role.name === 'Patient');
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
  <div className="container mx-auto p-6">
   <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
     <div>
      <h3 className="text-2xl font-bold">Clients</h3>
      <p className="text-sm text-muted-foreground">
       Manage your client relationships and view their profiles.
      </p>
     </div>
     <div className="flex gap-2">
      <Button onClick={loadClients} variant="outline" disabled={loading}>
       <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
       Refresh
      </Button>
      <Button onClick={createDemoClient} disabled={loading} variant="default">
       <PlusCircle className="w-4 h-4 mr-2" />
       New Client
      </Button>
     </div>
    </div>

    {loading ? (
     <ClientsPageSkeleton />
    ) : (
     <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <StatCard 
        title="Total Clients" 
        value={clients.length.toString()} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
       />
       <StatCard 
        title="Active This Week" 
        value="-" 
        icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
       />
       <StatCard 
        title="New This Month" 
        value="-" 
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />} 
       />
      </div>

      {/* Clients Table */}
      <Card>
       <CardContent className="p-0">
        {clients.length === 0 ? (
         <NoClientsEmptyState onCreate={createDemoClient} />
        ) : (
         <Table>
          <TableHeader>
           <TableRow>
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
           {clients.map((client) => (
            <TableRow key={client.id}>
             <TableCell>
              <Link href={`/therapist/person/${client.id}`} className="flex items-center gap-3 group">
               <Avatar className="h-8 w-8">
                <AvatarFallback>{(client.name || 'C').charAt(0).toUpperCase()}</AvatarFallback>
               </Avatar>
               <span className="font-medium group-hover:underline">
                {client.name || client.id}
               </span>
              </Link>
             </TableCell>
             <TableCell>
              <span className="text-sm text-muted-foreground">
               {client.email || '-'}
              </span>
             </TableCell>
             <TableCell className="text-right">
              <Button 
               variant="outline" 
               size="sm" 
               onClick={() => window.location.href = `/therapist/person/${client.id}`}
              >
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
   </div>
  </div>
 );
}
