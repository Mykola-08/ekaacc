'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  RefreshCw, 
  Download, 
  Settings,
  AlertTriangle,
  Calendar,
  Users,
  Clock
} from 'lucide-react';
import { 
  isSquareAppointmentsEnabled, 
  isSquareSyncEnabled, 
  isSquareImportEnabled, 
  shouldShowAlphaWarning 
} from '@/lib/feature-flags';
import { squareAppointmentsService, type SyncResult, type SyncOptions } from '@/services/square-appointments-service';

interface SquareIntegrationPanelProps {
  className?: string;
}

export function SquareIntegrationPanel({ className }: SquareIntegrationPanelProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const [isImportEnabled, setIsImportEnabled] = useState(false);
  const [showAlphaWarning, setShowAlphaWarning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    setIsEnabled(isSquareAppointmentsEnabled());
    setIsSyncEnabled(isSquareSyncEnabled());
    setIsImportEnabled(isSquareImportEnabled());
    setShowAlphaWarning(shouldShowAlphaWarning());
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await squareAppointmentsService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const handleSyncBookings = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const options: SyncOptions = {
        batchSize: 50,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      };
      
      const result = await squareAppointmentsService.syncBookings(options);
      setSyncResult(result);
      await loadSyncStatus();
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncResult({
        success: false,
        imported: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: 0,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncCustomers = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const options: SyncOptions = {
        batchSize: 50,
      };
      
      const result = await squareAppointmentsService.syncCustomers(options);
      setSyncResult(result);
      await loadSyncStatus();
    } catch (error) {
      console.error('Customer sync failed:', error);
      setSyncResult({
        success: false,
        imported: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: 0,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Square Appointments Integration
            <Badge variant="secondary" className="ml-auto">Alpha</Badge>
          </CardTitle>
          <CardDescription>
            Connect your Square Appointments to sync bookings and customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Square Appointments integration is currently disabled
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to enable this feature
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Square Appointments Integration
          <Badge variant="destructive" className="ml-auto">Alpha</Badge>
        </CardTitle>
        <CardDescription>
          Sync bookings and customers from Square Appointments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAlphaWarning && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              <strong>Alpha Feature:</strong> This integration is in early development. 
              Some features may be unstable or incomplete. Please report any issues.
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connection Status</span>
            <Badge variant={syncStatus?.connected ? "default" : "destructive"}>
              {syncStatus?.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          {syncStatus && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{syncStatus.totalBookings || 0}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Bookings
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{syncStatus.totalCustomers || 0}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" />
                  Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{syncStatus.pendingSync || 0}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sync Actions */}
        {isSyncEnabled && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                onClick={handleSyncBookings} 
                disabled={isSyncing}
                className="flex-1"
                size="sm"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Bookings
              </Button>
              
              <Button 
                onClick={handleSyncCustomers} 
                disabled={isSyncing}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Sync Customers
              </Button>
            </div>
          </div>
        )}

        {/* Import Actions */}
        {isImportEnabled && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Import Historical
              </Button>
              
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        )}

        {/* Sync Results */}
        {syncResult && (
          <Alert className={syncResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">
                  {syncResult.success ? "Sync completed successfully" : "Sync failed"}
                </div>
                
                {syncResult.imported > 0 && (
                  <div className="text-sm">
                    Imported: {syncResult.imported} items
                  </div>
                )}
                
                {syncResult.updated > 0 && (
                  <div className="text-sm">
                    Updated: {syncResult.updated} items
                  </div>
                )}
                
                {syncResult.errors.length > 0 && (
                  <div className="text-sm text-red-600">
                    Errors: {syncResult.errors.length}
                    <ul className="mt-1 list-disc pl-5">
                      {syncResult.errors.slice(0, 3).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {syncResult.errors.length > 3 && (
                        <li>... and {syncResult.errors.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Duration: {syncResult.duration}ms
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}