'use client';

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
        error: e.message,
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
    <div className="fixed right-4 bottom-4 z-50 font-sans">
      {isOpen && (
        <div className="mb-2 w-80 rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">System Status</h3>
            <button
              onClick={checkHealth}
              className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {loading ? 'Checking...' : 'Refresh'}
            </button>
          </div>

          {status ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span
                  className={
                    status.status === 'ok'
                      ? 'font-medium text-green-600'
                      : 'font-medium text-red-600'
                  }
                >
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
                  <span
                    className={status.database === 'connected' ? 'text-green-600' : 'text-red-600'}
                  >
                    {status.database}
                  </span>
                </div>
              )}
              {status.error && (
                <div className="mt-2 rounded bg-red-50 p-2 text-xs break-all text-red-600 dark:bg-red-900/20">
                  {status.error}
                </div>
              )}
              <div className="mt-2 border-t pt-2 text-xs text-gray-400">
                Last check: {new Date(status.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">Loading status...</div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full px-3 py-2 text-xs font-medium shadow-lg transition-colors ${
          isOpen
            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
            : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white'
        } `}
      >
        {isOpen ? 'Close Debug' : '🐞 Debug'}
      </button>
    </div>
  );
}
