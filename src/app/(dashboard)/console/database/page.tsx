'use client';

import { Database, HardDrive, Server, Activity } from 'lucide-react';

export default function DatabasePage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-4xl font-bold tracking-tight">
            Database
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">System database administration.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-600/20">
            <Activity className="h-3 w-3" />
            Healthy
          </span>
          <span className="text-muted-foreground/80 font-mono text-sm">v14.2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-2xl p-8 shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl text-white">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-bold">Primary Cluster</h3>
              <p className="text-muted-foreground text-sm">us-east-1 (N. Virginia)</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border py-3">
              <span className="text-muted-foreground text-sm">Connection Pool</span>
              <span className="text-foreground font-mono text-sm font-medium">45/100</span>
            </div>
            <div className="flex items-center justify-between border-b border-border py-3">
              <span className="text-muted-foreground text-sm">Cache Hit Rate</span>
              <span className="text-foreground font-mono text-sm font-medium">99.4%</span>
            </div>
            <div className="flex items-center justify-between border-b border-border py-3">
              <span className="text-muted-foreground text-sm">Storage Used</span>
              <span className="text-foreground font-mono text-sm font-medium">12.4 GB</span>
            </div>
          </div>
        </div>

        <div className="bg-card flex flex-col items-center justify-center rounded-2xl p-8 text-center shadow-xl ring-1 shadow-slate-200/50 ring-slate-100">
          <div className="bg-muted/40 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Server className="text-muted-foreground/80 h-8 w-8" />
          </div>
          <h3 className="text-foreground text-lg font-bold">Replicas &amp; Backups</h3>
          <p className="text-muted-foreground mb-6 max-w-xs text-sm">
            Configure read replicas, manage automated backups, and handle point-in-time recovery.
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Manage Configuration &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
