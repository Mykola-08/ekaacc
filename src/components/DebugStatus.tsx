"use client";

import React, { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  env: string;
  database?: string;
  services?: Record<string, string>;
  error?: string;
}

export function DebugStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setStatus({
        status: 'error',
        timestamp: new Date().toISOString(),
        env: 'unknown',
        error: e.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {isOpen && (
        <div className="mb-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg w-80 text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">System Status</h3>
            <button 
              onClick={checkHealth}
              className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-2 py-1 rounded"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
          
          {status ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={status.status === 'ok' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {status.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Env:</span>
                <span>{status.env}</span>
              </div>
              {status.database && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Database:</span>
                  <span className={status.database === 'connected' ? 'text-green-600' : 'text-red-600'}>
                    {status.database}
                  </span>
                </div>
              )}
              {status.error && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded text-xs break-all">
                  {status.error}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2 pt-2 border-t">
                Last check: {new Date(status.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">Loading status...</div>
          )}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-full shadow-lg font-medium text-xs transition-colors
          ${isOpen 
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
            : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-800'}
        `}
      >
        {isOpen ? 'Close Debug' : '🐞 Debug'}
      </button>
    </div>
  );
}
