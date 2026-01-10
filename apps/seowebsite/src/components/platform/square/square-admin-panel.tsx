'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Alert, AlertDescription } from '@/components/platform/ui/alert';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Switch } from '@/components/platform/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/platform/ui/select";
import { 
  Loader2, 
  RefreshCw, 
  Settings,
  AlertTriangle,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  TestTube,
  BarChart3
} from 'lucide-react';
import { 
  isSquareAppointmentsEnabled, 
  isSquareSyncEnabled, 
  isSquareImportEnabled, 
  shouldShowAlphaWarning 
} from '@/lib/platform/feature-flags';
import { squareAppointmentsService } from '@/services/square-appointments-service';
import SyncMonitoringDashboard from './sync-monitoring-dashboard';

interface SquareAdminPanelProps {
  className?: string;
}

interface ConnectionStatus {
  connected: boolean;
  environment: string;
  lastTest: string | null;
  error: string | null;
}

export function SquareAdminPanel({ className }: SquareAdminPanelProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showAlphaWarning, setShowAlphaWarning] = useState(false);
  const [activeTab, setActiveTab] = useState<'configuration' | 'monitoring'>('configuration');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    environment: 'unknown',
    lastTest: null,
    error: null,
  });
  
  const [config, setConfig] = useState({
    accessToken: '',
    environment: 'Sandbox' as 'Sandbox' | 'Production',
    webhookSecret: '',
    locationId: '',
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  useEffect(() => {
    setIsEnabled(isSquareAppointmentsEnabled());
    setShowAlphaWarning(shouldShowAlphaWarning());
    loadConfiguration();
    loadConnectionStatus();
  }, []);

  const loadConfiguration = () => {
    // Load from environment or local storage
    setConfig({
      accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: (process.env.SQUARE_ENV as 'Sandbox' | 'Production') || 'Sandbox',
      webhookSecret: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '',
      locationId: process.env.SQUARE_LOCATION_ID || '',
    });
  };

  const loadConnectionStatus = async () => {
    try {
      const status = await squareAppointmentsService.getSyncStatus();
      setSyncStatus(status);
      setConnectionStatus(prev => ({
        ...prev,
        connected: status.connected,
        environment: config.environment,
      }));
    } catch (error) {
      console.error('Failed to load connection status:', error);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setConnectionStatus(prev => ({ ...prev, error: null }));
    
    try {
      const isConnected = await squareAppointmentsService.testConnection();
      setConnectionStatus({
        connected: isConnected,
        environment: config.environment,
        lastTest: new Date().toISOString(),
        error: isConnected ? null : 'Connection test failed',
      });
    } catch (error) {
      setConnectionStatus({
        connected: false,
        environment: config.environment,
        lastTest: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would save to your backend
      // For now, we'll just test the connection
      await handleTestConnection();
      
      // Show success message
      setConnectionStatus(prev => ({
        ...prev,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEnabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Square Appointments Admin
            <Badge variant="secondary" className="ml-auto">Alpha</Badge>
          </CardTitle>
          <CardDescription>
            Configure and manage Square Appointments integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Square Appointments integration is currently disabled
            </p>
            <p className="text-sm text-muted-foreground">
              Enable it in your environment configuration to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {showAlphaWarning && (
        <Alert className="mb-6 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Alpha Feature:</strong> Square Appointments integration is in early development. 
            Some features may be unstable. Please report any issues to the development team.
          </AlertDescription>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('configuration')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'configuration'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monitoring'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Sync Monitoring
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && <SyncMonitoringDashboard />}
      {activeTab === 'configuration' && (
        <div className="grid gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              Current connection status with Square API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Status</span>
              <div className="flex items-center gap-2">
                {connectionStatus.connected ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={connectionStatus.connected ? "default" : "destructive"}>
                  {connectionStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge variant="outline">{connectionStatus.environment}</Badge>
            </div>

            {connectionStatus.lastTest && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Test</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(connectionStatus.lastTest).toLocaleString()}
                </span>
              </div>
            )}

            {connectionStatus.error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {connectionStatus.error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleTestConnection} 
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Configure your Square Appointments connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="sq0atp-..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={config.environment}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, environment: value as 'Sandbox' | 'Production' }))}
                >
                  <SelectTrigger id="environment" className="w-full">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sandbox">Sandbox</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Signature Key</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={config.webhookSecret}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
                  placeholder="Webhook signature key..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">Location ID (Optional)</Label>
                <Input
                  id="locationId"
                  value={config.locationId}
                  onChange={(e) => setConfig(prev => ({ ...prev, locationId: e.target.value }))}
                  placeholder="Leave empty for all locations"
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveConfiguration} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Sync Statistics */}
        {syncStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Sync Statistics
              </CardTitle>
              <CardDescription>
                Current synchronization statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{syncStatus.totalBookings || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Total Bookings
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{syncStatus.totalCustomers || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    Total Customers
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{syncStatus.pendingSync || 0}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending Sync
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">-</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Last Sync
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      )}
    </div>
  );
}