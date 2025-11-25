'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
import { getDataService } from '@/services/data-service';
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  MessageSquare,
  Calendar,
  FileText,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lastSession?: string;
  nextSession?: string;
  totalSessions: number;
  status: 'active' | 'inactive' | 'new';
  notes?: string;
  createdAt: string;
}

interface ClientNote {
  id: string;
  content: string;
  createdAt: string;
  type: 'session' | 'general' | 'followup';
}

export default function TherapistClientsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [clientNotes, setClientNotes] = useState<ClientNote[]>([]);
  const [newNote, setNewNote] = useState('');

  const loadClients = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const service = await getDataService();
      const sessions = await service.getSessions(user.id);
      const allUsers = await service.getAllUsers();
      
      // Get unique patient IDs from therapist's sessions
      const patientIds = [...new Set(sessions.map((s: any) => s.userId))].filter(Boolean);
      
      // Map to client data
      const clientData: Client[] = patientIds.map((patientId: string) => {
        const userInfo: any = allUsers.find((u: any) => u.id === patientId) || {};
        const patientSessions = sessions.filter((s: any) => s.userId === patientId);
        const lastSession = patientSessions.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        const nextSession = patientSessions
          .filter((s: any) => new Date(s.date) > new Date())
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return {
          id: patientId,
          name: userInfo.name || userInfo.displayName || 'Unknown',
          email: userInfo.email || 'N/A',
          phone: userInfo.phoneNumber,
          lastSession: lastSession?.date,
          nextSession: nextSession?.date,
          totalSessions: patientSessions.length,
          status: nextSession ? 'active' : patientSessions.length > 0 ? 'inactive' : 'new',
          createdAt: userInfo.createdAt || new Date().toISOString()
        };
      });

      setClients(clientData);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({ title: 'Error', description: 'Failed to load clients', variant: 'destructive' });
      
      // Demo data
      setClients([
        { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+1 555-0101', lastSession: new Date().toISOString(), nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), totalSessions: 12, status: 'active', createdAt: new Date().toISOString() },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 555-0102', lastSession: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), totalSessions: 8, status: 'inactive', createdAt: new Date().toISOString() },
        { id: '3', name: 'Michael Brown', email: 'michael@example.com', phone: '+1 555-0103', lastSession: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), totalSessions: 5, status: 'active', createdAt: new Date().toISOString() },
        { id: '4', name: 'Emily Davis', email: 'emily@example.com', totalSessions: 0, status: 'new', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleAddNote = async () => {
    if (!selectedClient || !newNote.trim()) return;

    try {
      const service = await getDataService();
      // In a real implementation, this would save to the database
      toast({ title: 'Success', description: 'Note added successfully' });
      setNewNote('');
      setShowNoteDialog(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add note', variant: 'destructive' });
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    new: clients.filter(c => c.status === 'new').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'new': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and sessions</p>
        </div>
        <Button variant="outline" onClick={loadClients} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Clients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.inactive}</div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.new}</div>
                <div className="text-sm text-muted-foreground">New</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All</Button>
              <Button variant={statusFilter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('active')}>Active</Button>
              <Button variant={statusFilter === 'inactive' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('inactive')}>Inactive</Button>
              <Button variant={statusFilter === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('new')}>New</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Your assigned clients and their session history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Session</TableHead>
                <TableHead>Next Session</TableHead>
                <TableHead>Total Sessions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.lastSession ? format(new Date(client.lastSession), 'MMM d, yyyy') : 'Never'}
                    </TableCell>
                    <TableCell>
                      {client.nextSession ? format(new Date(client.nextSession), 'MMM d, yyyy') : 'Not scheduled'}
                    </TableCell>
                    <TableCell>{client.totalSessions}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowClientDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowNoteDialog(true);
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/sessions/booking?client=${client.id}`}>
                            <Calendar className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm text-muted-foreground">{selectedClient.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Total Sessions</Label>
                    <p className="text-sm text-muted-foreground">{selectedClient.totalSessions}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedClient.status)}>{selectedClient.status}</Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sessions">
                <p className="text-muted-foreground">Session history will be displayed here.</p>
              </TabsContent>
              <TabsContent value="notes">
                <div className="space-y-4">
                  <Button onClick={() => { setShowClientDialog(false); setShowNoteDialog(true); }}>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <p className="text-muted-foreground">Client notes will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClientDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>Add a note for {selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
