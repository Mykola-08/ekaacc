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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Database,
  RefreshCw,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

interface TableInfo {
  name: string;
  rowCount: number;
  lastUpdated?: string;
}

interface RecordData {
  [key: string]: any;
}

// Constants for display formatting
const MAX_CELL_LENGTH = 50;

const availableTables = [
  { name: 'users', displayName: 'Users', description: 'User accounts and profiles' },
  { name: 'sessions', displayName: 'Sessions', description: 'Therapy sessions' },
  { name: 'bookings', displayName: 'Bookings', description: 'Appointment bookings' },
  { name: 'services', displayName: 'Services', description: 'Available services' },
  { name: 'products', displayName: 'Products', description: 'Products and packages' },
  { name: 'payments', displayName: 'Payments', description: 'Payment transactions' },
  { name: 'subscriptions', displayName: 'Subscriptions', description: 'User subscriptions' },
  { name: 'user_roles', displayName: 'User Roles', description: 'Role definitions' },
  { name: 'cms_pages', displayName: 'CMS Pages', description: 'Website pages' },
  { name: 'cms_posts', displayName: 'CMS Posts', description: 'Blog posts' },
  { name: 'reports', displayName: 'Reports', description: 'Therapy reports' },
  { name: 'notifications', displayName: 'Notifications', description: 'User notifications' },
];

export default function DatabaseManagementPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('tables');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<RecordData[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordData | null>(null);
  const [editFormData, setEditFormData] = useState<RecordData>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [tableStats, setTableStats] = useState<TableInfo[]>([]);
  const pageSize = 20;

  // Load table statistics
  const loadTableStats = useCallback(async () => {
    const stats: TableInfo[] = [];
    
    for (const table of availableTables) {
      try {
        const { count } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
        
        stats.push({
          name: table.name,
          rowCount: count || 0,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        stats.push({
          name: table.name,
          rowCount: 0
        });
      }
    }
    
    setTableStats(stats);
  }, []);

  // Load table data
  const loadTableData = useCallback(async () => {
    if (!selectedTable) return;
    
    setLoading(true);
    try {
      // Get count
      const { count } = await supabase
        .from(selectedTable)
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get data with pagination
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTableColumns(Object.keys(data[0]));
        setTableData(data);
      } else {
        setTableData([]);
        setTableColumns([]);
      }
    } catch (error) {
      console.error(`Error loading ${selectedTable}:`, error);
      toast({
        title: 'Error',
        description: `Failed to load data from ${selectedTable}`,
        variant: 'destructive'
      });
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTable, page, toast]);

  useEffect(() => {
    loadTableStats();
  }, [loadTableStats]);

  useEffect(() => {
    if (selectedTable) {
      loadTableData();
    }
  }, [selectedTable, loadTableData]);

  const handleUpdateRecord = async () => {
    if (!selectedTable || !selectedRecord) return;

    try {
      const { error } = await supabase
        .from(selectedTable)
        .update(editFormData)
        .eq('id', selectedRecord.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Record updated successfully' });
      setShowEditDialog(false);
      setSelectedRecord(null);
      loadTableData();
    } catch (error) {
      console.error('Error updating record:', error);
      toast({ title: 'Error', description: 'Failed to update record', variant: 'destructive' });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!selectedTable) return;
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast({ title: 'Success', description: 'Record deleted successfully' });
      loadTableData();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({ title: 'Error', description: 'Failed to delete record', variant: 'destructive' });
    }
  };

  const handleExportTable = async () => {
    if (!selectedTable) return;

    try {
      const { data, error } = await supabase
        .from(selectedTable)
        .select('*');

      if (error) throw error;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTable}_export_${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: 'Success', description: 'Data exported successfully' });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({ title: 'Error', description: 'Failed to export data', variant: 'destructive' });
    }
  };

  const filteredData = tableData.filter(record => {
    const searchLower = searchQuery.toLowerCase();
    return Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value).slice(0, MAX_CELL_LENGTH) + '...';
    if (typeof value === 'string' && value.length > MAX_CELL_LENGTH) return value.slice(0, MAX_CELL_LENGTH) + '...';
    return String(value);
  };

  const getTableInfo = (tableName: string) => {
    return availableTables.find(t => t.name === tableName) || { name: tableName, displayName: tableName, description: '' };
  };

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Database Management"
            description="View and manage database records across all tables."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadTableStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Stats
          </Button>
        </div>
      </div>

      <Alert className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Warning: Modifying database records directly can affect application behavior. Proceed with caution.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="tables">Tables Overview</TabsTrigger>
          <TabsTrigger value="browser">Data Browser</TabsTrigger>
        </TabsList>

        {/* Tables Overview */}
        <TabsContent value="tables">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTables.map((table) => {
              const stats = tableStats.find(s => s.name === table.name);
              return (
                <Card key={table.name} className="cursor-pointer hover:border-primary transition-colors" onClick={() => { setSelectedTable(table.name); setActiveTab('browser'); setPage(1); }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TableIcon className="h-4 w-4" />
                      {table.displayName}
                    </CardTitle>
                    <Badge variant="secondary">{stats?.rowCount || 0} rows</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Table: <code className="bg-muted px-1 rounded">{table.name}</code>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Data Browser */}
        <TabsContent value="browser">
          {!selectedTable ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a table from the overview to browse data</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTable(null)}>
                    ← Back to Tables
                  </Button>
                  <div>
                    <h3 className="text-lg font-semibold">{getTableInfo(selectedTable).displayName}</h3>
                    <p className="text-sm text-muted-foreground">{getTableInfo(selectedTable).description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportTable}>
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button variant="outline" onClick={loadTableData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {totalCount} total records
                </div>
              </div>

              {/* Data Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableColumns.slice(0, 6).map((column) => (
                            <TableHead key={column} className="whitespace-nowrap">
                              {column}
                            </TableHead>
                          ))}
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : filteredData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredData.map((record, idx) => (
                            <TableRow key={record.id || idx}>
                              {tableColumns.slice(0, 6).map((column) => (
                                <TableCell key={column} className="max-w-[200px] truncate">
                                  {formatCellValue(record[column])}
                                </TableCell>
                              ))}
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRecord(record);
                                      setShowViewDialog(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRecord(record);
                                      setEditFormData({ ...record });
                                      setShowEditDialog(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRecord(record.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Record Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Record</DialogTitle>
            <DialogDescription>Full record details</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-start">
                  <Label className="text-right font-medium">{key}</Label>
                  <div className="col-span-2">
                    <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value ?? 'null')}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>Modify record fields</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              {Object.entries(editFormData).map(([key, value]) => {
                // Skip id and timestamps for editing
                if (key === 'id' || key === 'created_at' || key === 'updated_at') {
                  return (
                    <div key={key} className="grid grid-cols-3 gap-4 items-center">
                      <Label className="text-right">{key}</Label>
                      <div className="col-span-2">
                        <Input value={String(value ?? '')} disabled className="bg-muted" />
                      </div>
                    </div>
                  );
                }

                const isObject = typeof value === 'object' && value !== null;
                
                return (
                  <div key={key} className="grid grid-cols-3 gap-4 items-start">
                    <Label className="text-right pt-2">{key}</Label>
                    <div className="col-span-2">
                      {isObject ? (
                        <Textarea
                          value={JSON.stringify(value, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setEditFormData({ ...editFormData, [key]: parsed });
                            } catch {
                              // Keep as string if invalid JSON
                            }
                          }}
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={String(value ?? '')}
                          onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateRecord}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
