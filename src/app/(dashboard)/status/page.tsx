'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Construction,
  Activity,
  Server,
  Database,
  Cpu,
  Zap,
  MessageSquare,
  ExternalLink,
  BarChart3,
  Users,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for our status data
type Status = 'operational' | 'maintenance' | 'building' | 'coming-soon' | 'degraded';

interface Service {
  id: string;
  name: string;
  description: string;
  status: Status;
  uptime?: string;
  icon: string;
  latency?: number;
  error?: string;
}

interface Metric {
  label: string;
  value: string;
  icon: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface StatusData {
  services: Service[];
  metrics: Metric[];
  lastUpdated: string;
  userRole: string;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  ExternalLink,
  Cpu,
  Activity,
  Database,
  Clock,
  CheckCircle2,
  Server,
  Construction,
  AlertCircle,
  MessageSquare,
  BarChart3,
  Users,
};

// Helper components
const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    operational: 'text-success bg-success/10 border-success/20',
    maintenance: 'text-destructive bg-destructive/10 border-destructive/20',
    building: 'text-warning bg-warning/10 border-warning/20',
    'coming-soon': 'text-primary bg-primary/10 border-primary/20',
    degraded: 'text-warning bg-warning/10 border-warning/20',
  };

  const labels = {
    operational: 'Operational',
    maintenance: 'Maintenance',
    building: 'Building',
    'coming-soon': 'Coming Soon',
    degraded: 'Degraded',
  };

  const icons = {
    operational: <CheckCircle2 className="mr-1.5 h-3 w-3" />,
    maintenance: <AlertCircle className="mr-1.5 h-3 w-3" />,
    building: <Construction className="mr-1.5 h-3 w-3" />,
    'coming-soon': <Clock className="mr-1.5 h-3 w-3" />,
    degraded: <AlertCircle className="mr-1.5 h-3 w-3" />,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        styles[status]
      )}
    >
      {icons[status]}
      {labels[status]}
    </span>
  );
};

const ServiceCard = ({ service }: { service: Service }) => {
  const Icon = iconMap[service.icon] || Activity;

  return (
    <div className="rounded-lg border-none border-border/10 bg-foreground/40 p-6 backdrop-blur-sm transition-colors hover:border-border/20">
      <div className="mb-4 flex items-start justify-between">
        <div className="bg-card/5 rounded-xl p-2 text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col items-end">
          {service.uptime && (
            <span className="font-mono text-xs text-success">{service.uptime} uptime</span>
          )}
          {service.latency && (
            <span className="font-mono text-xs text-muted-foreground">{service.latency}ms</span>
          )}
        </div>
      </div>

      <h3 className="mb-1 text-lg font-semibold text-primary-foreground">{service.name}</h3>
      <p className="mb-4 h-10 text-sm text-muted-foreground">{service.description}</p>

      <div className="mt-auto flex items-center justify-between">
        <StatusBadge status={service.status} />
        {service.status === 'coming-soon' && (
          <span className="text-xs text-muted-foreground">Planned for future release</span>
        )}
        {service.status === 'building' && (
          <span className="text-xs text-muted-foreground">Discord integration coming</span>
        )}
        {service.error && (
          <span className="max-w-37.5 truncate text-xs text-destructive" title={service.error}>
            {service.error}
          </span>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ metric }: { metric: Metric }) => {
  const Icon = iconMap[metric.icon] || Activity;

  return (
    <div className="rounded-lg border-none border-border/10 bg-foreground/40 p-6 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{metric.label}</span>
        <Icon className={cn('h-4 w-4', metric.color || 'text-primary-foreground')} />
      </div>
      <div className="font-mono text-2xl font-semibold text-primary-foreground">{metric.value}</div>
    </div>
  );
};

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const services = data?.services || [];
  const metrics = data?.metrics || [];
  const overallStatus = services.every(
    (s) => s.status === 'operational' || s.status === 'coming-soon' || s.status === 'building'
  )
    ? 'operational'
    : 'degraded';

  return (
    <div className="bg-background text-foreground min-h-screen p-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">System Status</h1>
              <p className="text-muted-foreground">
                Real-time status of all LLM Council services and live system metrics
              </p>
            </div>
            {data?.userRole && (
              <span className="rounded border border-border px-2 py-1 font-mono text-xs text-muted-foreground">
                View: {data.userRole}
              </span>
            )}
          </div>
        </div>

        {/* Overall Status Banner */}
        <div
          className={cn(
            'flex items-center gap-4 rounded-lg border-none p-6',
            overallStatus === 'operational'
              ? 'border-success/20 bg-success/10'
              : 'border-warning/20 bg-warning/10'
          )}
        >
          <div
            className={cn(
              'rounded-full p-2',
              overallStatus === 'operational' ? 'bg-success/20' : 'bg-warning/20'
            )}
          >
            {overallStatus === 'operational' ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <AlertCircle className="h-6 w-6 text-warning" />
            )}
          </div>
          <div>
            <h2
              className={cn(
                'text-lg font-semibold',
                overallStatus === 'operational' ? 'text-success' : 'text-warning'
              )}
            >
              {overallStatus === 'operational'
                ? 'All Systems Operational'
                : 'System Issues Detected'}
            </h2>
            <p
              className={cn(
                'text-sm',
                overallStatus === 'operational' ? 'text-success/80' : 'text-warning/80'
              )}
            >
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h2 className="mb-6 text-xl font-semibold">Live Performance Metrics</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 border-t border-border/10 pt-8">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Status Legend</h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="font-medium text-foreground">Operational</span>
              <span className="text-muted-foreground">- Service is running normally</span>
            </div>
            <div className="flex items-center gap-2">
              <Construction className="h-4 w-4 text-warning" />
              <span className="font-medium text-foreground">Building</span>
              <span className="text-muted-foreground">- Active development or enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Coming Soon</span>
              <span className="text-muted-foreground">- Planned for future release</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-foreground">Maintenance</span>
              <span className="text-muted-foreground">- Temporarily unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
