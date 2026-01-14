'use client';

import { Database, HardDrive, Server, Activity } from 'lucide-react';

export default function DatabasePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            Database
          </h1>
          <p className="text-gray-500 mt-2 text-lg">System database administration.</p>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold ring-1 ring-green-600/20">
                <Activity className="w-3 h-3" />
                Healthy
            </span>
            <span className="text-sm text-gray-400 font-mono">v14.2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Primary Cluster</h3>
                    <p className="text-gray-500 text-sm">us-east-1 (N. Virginia)</p>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Connection Pool</span>
                    <span className="text-sm font-mono font-medium text-gray-900">45/100</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Cache Hit Rate</span>
                    <span className="text-sm font-mono font-medium text-gray-900">99.4%</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-mono font-medium text-gray-900">12.4 GB</span>
                 </div>
            </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col items-center justify-center text-center">
             <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Server className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900">Replicas & Backups</h3>
             <p className="text-gray-500 text-sm mb-6 max-w-xs">
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
