'use client';

import { Database, HardDrive, Server, Activity, Shield, Clock, Gauge } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DatabasePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight">Database</h1>
          <p className="text-muted-foreground mt-2 text-lg">System database administration.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-success text-success-foreground gap-1.5">
            <Activity className="h-3 w-3" />
            Healthy
          </Badge>
          <span className="text-muted-foreground/80 font-mono text-sm">PostgreSQL v14.2</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connection Pool</CardTitle>
            <Gauge className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">45/100</div>
            <p className="text-muted-foreground text-xs">Active connections</p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full transition-all duration-300" style={{ width: '45%' }} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Activity className="text-success h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">99.4%</div>
            <p className="text-muted-foreground text-xs">Buffer cache efficiency</p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-success h-full transition-all duration-300" style={{ width: '99.4%' }} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="text-warning h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12.4 GB</div>
            <p className="text-muted-foreground text-xs">Of 50 GB allocated</p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-warning h-full transition-all duration-300" style={{ width: '24.8%' }} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="text-chart-4 h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">99.99%</div>
            <p className="text-muted-foreground text-xs">Last 30 days</p>
            <div className="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
              <div className="bg-chart-4 h-full transition-all duration-300" style={{ width: '99.99%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Primary Cluster</CardTitle>
                <CardDescription>Supabase managed PostgreSQL</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">Region</span>
                <span className="text-foreground font-mono text-sm font-medium">eu-west-1</span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">Instance Size</span>
                <span className="text-foreground font-mono text-sm font-medium">Micro</span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">Max Connections</span>
                <span className="text-foreground font-mono text-sm font-medium">100</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground text-sm">Extensions</span>
                <span className="text-foreground font-mono text-sm font-medium">12 active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-xl">
                <Shield className="text-success h-5 w-5" />
              </div>
              <div>
                <CardTitle>Security &amp; Backups</CardTitle>
                <CardDescription>Data protection and recovery</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">RLS Enabled</span>
                <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>
              </div>
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">SSL Mode</span>
                <span className="text-foreground font-mono text-sm font-medium">Required</span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-3">
                <span className="text-muted-foreground text-sm">Auto Backups</span>
                <Badge variant="default" className="bg-success text-success-foreground">Daily</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground text-sm">PITR</span>
                <span className="text-foreground font-mono text-sm font-medium">7 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border rounded-2xl lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-muted/40 flex h-10 w-10 items-center justify-center rounded-xl">
                <Server className="text-muted-foreground h-5 w-5" />
              </div>
              <div>
                <CardTitle>Replicas &amp; Read Distribution</CardTitle>
                <CardDescription>Configure read replicas and manage connection pooling</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Read Replicas</p>
                <p className="text-foreground mt-1 text-lg font-semibold">0 active</p>
                <p className="text-muted-foreground text-xs">Available on Pro plan</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Pooler Mode</p>
                <p className="text-foreground mt-1 text-lg font-semibold">Transaction</p>
                <p className="text-muted-foreground text-xs">PgBouncer via Supavisor</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">Avg Query Time</p>
                <p className="text-foreground mt-1 text-lg font-semibold">2.3 ms</p>
                <p className="text-muted-foreground text-xs">P95 latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
