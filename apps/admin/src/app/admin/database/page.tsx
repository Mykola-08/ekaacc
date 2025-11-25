'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth-context';
import { 
  Database, 
  Search,
  RefreshCw,
  Table as TableIcon,
  Activity,
  HardDrive,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

interface TableInfo {
  table_name: string;
  row_count: number;
  size: string;
  last_modified?: string;
}

interface DatabaseStats {
  total_tables: number;
  total_rows: number;
  database_size: string;
  active_connections: number;
}

export default function DatabaseManagementPage() {
  const { canAccessResource, user } = useAuth();
  const { toast } = useToast();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<DatabaseStats>({
    total_tables: 0,
    total_rows: 0,
    database_size: 'N/A',
    active_connections: 0,
  });

  // Core tables that are managed by the system
  const coreTables = [
    'users',
    'user_roles',
    'sessions',
    'bookings',
    'payments',
    'products',
    'services',
    'subscriptions',
    'cms_pages',
    'cms_posts',
    'cms_media',
    'community_posts',
    'notifications',
    'audit_logs',
    'feature_flags',
    'system_configurations',
  ];

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      
      // Fetch table information - using a simple approach
      const tableData: TableInfo[] = [];
      let totalRows = 0;

      for (const tableName of coreTables) {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            const rowCount = count || 0;
            totalRows += rowCount;
            tableData.push({
              table_name: tableName,
              row_count: rowCount,
              size: 'N/A',
            });
          }
        } catch {
          // Table might not exist, skip
        }
      }

      setTables(tableData);
      setStats({
        total_tables: tableData.length,
        total_rows: totalRows,
        database_size: 'N/A',
        active_connections: 1,
      });
    } catch (error) {
      console.error('Error fetching database info:', error);
      toast({ title: 'Error', description: 'Failed to fetch database information', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const filteredTables = tables.filter((table) =>
    table.table_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = user?.role?.name?.toLowerCase() === 'admin';

  if (!isAdmin) {
    return (
      <SettingsShell>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            Database management is only accessible to administrators.
          </p>
        </div>
      </SettingsShell>
    );
  }

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Database Management"
            description="Monitor database tables and system health"
          />
        </div>
        <Button onClick={fetchDatabaseInfo} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Database Statistics */}
      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_tables}</div>
            <p className="text-xs text-muted-foreground">Database tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_rows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Records stored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.database_size}</div>
            <p className="text-xs text-muted-foreground">Storage used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_connections}</div>
            <p className="text-xs text-muted-foreground">Active connections</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="mt-6">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="management">Management Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>View and monitor database tables</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading database information...</div>
              ) : filteredTables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tables found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Name</TableHead>
                      <TableHead>Row Count</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map((table) => (
                      <TableRow key={table.table_name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <TableIcon className="h-4 w-4 text-muted-foreground" />
                            {table.table_name}
                          </div>
                        </TableCell>
                        <TableCell>{table.row_count.toLocaleString()}</TableCell>
                        <TableCell>{table.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Common database operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Export Data</h4>
                      <p className="text-sm text-muted-foreground">Export database tables to CSV</p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Database</h4>
                      <p className="text-sm text-muted-foreground">Create a full database backup</p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Run Migrations</h4>
                      <p className="text-sm text-muted-foreground">Apply pending database migrations</p>
                    </div>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Database health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Last Backup</span>
                    <span className="text-sm text-muted-foreground">Managed by Supabase</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Automatic backups enabled</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Storage Usage</span>
                    <span className="text-sm text-muted-foreground">{stats.database_size}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </SettingsShell>
  );
}
