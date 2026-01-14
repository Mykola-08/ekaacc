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
 Loader2
} from 'lucide-react';
import { cn } from '@/lib/platform/utils/css-utils';

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
 Users
};

// Helper components
const StatusBadge = ({ status }: { status: Status }) => {
 const styles = {
  operational: 'text-green-400 bg-green-400/10 border-green-400/20',
  maintenance: 'text-red-400 bg-red-400/10 border-red-400/20',
  building: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'coming-soon': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  degraded: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
 };

 const labels = {
  operational: 'Operational',
  maintenance: 'Maintenance',
  building: 'Building',
  'coming-soon': 'Coming Soon',
  degraded: 'Degraded',
 };

 const icons = {
  operational: <CheckCircle2 className="w-3 h-3 mr-1.5" />,
  maintenance: <AlertCircle className="w-3 h-3 mr-1.5" />,
  building: <Construction className="w-3 h-3 mr-1.5" />,
  'coming-soon': <Clock className="w-3 h-3 mr-1.5" />,
  degraded: <AlertCircle className="w-3 h-3 mr-1.5" />,
 };

 return (
  <span className={cn(
   "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
   styles[status]
  )}>
   {icons[status]}
   {labels[status]}
  </span>
 );
};

const ServiceCard = ({ service }: { service: Service }) => {
 const Icon = iconMap[service.icon] || Activity;
 
 return (
  <div className="bg-black/40 border-none border-white/10 rounded-[32px] p-6 backdrop-blur-sm hover:border-white/20 transition-colors">
   <div className="flex items-start justify-between mb-4">
    <div className="p-2 bg-card/5 rounded-xl text-white">
     <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col items-end">
     {service.uptime && (
      <span className="text-xs font-mono text-green-400">
       {service.uptime} uptime
      </span>
     )}
     {service.latency && (
      <span className="text-xs font-mono text-zinc-500">
       {service.latency}ms
      </span>
     )}
    </div>
   </div>
   
   <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
   <p className="text-sm text-zinc-400 mb-4 h-10">{service.description}</p>
   
   <div className="flex items-center justify-between mt-auto">
    <StatusBadge status={service.status} />
    {service.status === 'coming-soon' && (
     <span className="text-xs text-zinc-500">Planned for future release</span>
    )}
    {service.status === 'building' && (
     <span className="text-xs text-zinc-500">Discord integration coming</span>
    )}
    {service.error && (
     <span className="text-xs text-red-400 truncate max-w-[150px]" title={service.error}>
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
  <div className="bg-black/40 border-none border-white/10 rounded-[32px] p-6 backdrop-blur-sm">
   <div className="flex items-center justify-between mb-2">
    <span className="text-sm text-zinc-400">{metric.label}</span>
    <Icon className={cn("w-4 h-4", metric.color || "text-white")} />
   </div>
   <div className="text-2xl font-bold text-white font-mono">
    {metric.value}
   </div>
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
   <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-white animate-spin" />
   </div>
  );
 }

 const services = data?.services || [];
 const metrics = data?.metrics || [];
 const overallStatus = services.every(s => s.status === 'operational' || s.status === 'coming-soon' || s.status === 'building') 
  ? 'operational' 
  : 'degraded';

 return (
  <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
   <div className="max-w-6xl mx-auto space-y-12">
    
    {/* Header */}
    <div className="space-y-2">
     <div className="flex justify-between items-start">
      <div>
       <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
       <p className="text-zinc-400">Real-time status of all LLM Council services and live system metrics</p>
      </div>
      {data?.userRole && (
       <span className="text-xs font-mono text-zinc-600 border border-zinc-800 px-2 py-1 rounded">
        View: {data.userRole}
       </span>
      )}
     </div>
    </div>

    {/* Overall Status Banner */}
    <div className={cn(
     "border-none rounded-[32px] p-6 flex items-center gap-4",
     overallStatus === 'operational' 
      ? "bg-green-500/10 border-green-500/20" 
      : "bg-yellow-500/10 border-yellow-500/20"
    )}>
     <div className={cn(
      "p-2 rounded-full",
      overallStatus === 'operational' ? "bg-green-500/20" : "bg-yellow-500/20"
     )}>
      {overallStatus === 'operational' ? (
       <CheckCircle2 className="w-6 h-6 text-green-500" />
      ) : (
       <AlertCircle className="w-6 h-6 text-yellow-500" />
      )}
     </div>
     <div>
      <h2 className={cn(
       "text-lg font-semibold",
       overallStatus === 'operational' ? "text-green-400" : "text-yellow-400"
      )}>
       {overallStatus === 'operational' ? "All Systems Operational" : "System Issues Detected"}
      </h2>
      <p className={cn(
       "text-sm",
       overallStatus === 'operational' ? "text-green-400/80" : "text-yellow-400/80"
      )}>
       Last updated: {lastUpdated}
      </p>
     </div>
    </div>

    {/* Metrics Grid */}
    <div>
     <h2 className="text-xl font-semibold mb-6">Live Performance Metrics</h2>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
       <MetricCard key={metric.label} metric={metric} />
      ))}
     </div>
    </div>

    {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {services.map((service) => (
      <ServiceCard key={service.id} service={service} />
     ))}
    </div>

    {/* Legend */}
    <div className="border-t border-white/10 pt-8 mt-12">
     <h3 className="text-sm font-semibold text-white mb-4">Status Legend</h3>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="flex items-center gap-2">
       <CheckCircle2 className="w-4 h-4 text-green-400" />
       <span className="text-white font-medium">Operational</span>
       <span className="text-zinc-500">- Service is running normally</span>
      </div>
      <div className="flex items-center gap-2">
       <Construction className="w-4 h-4 text-yellow-400" />
       <span className="text-white font-medium">Building</span>
       <span className="text-zinc-500">- Active development or enhancement</span>
      </div>
      <div className="flex items-center gap-2">
       <Clock className="w-4 h-4 text-blue-400" />
       <span className="text-white font-medium">Coming Soon</span>
       <span className="text-zinc-500">- Planned for future release</span>
      </div>
      <div className="flex items-center gap-2">
       <AlertCircle className="w-4 h-4 text-red-400" />
       <span className="text-white font-medium">Maintenance</span>
       <span className="text-zinc-500">- Temporarily unavailable</span>
      </div>
     </div>
    </div>

   </div>
  </div>
 );
}
