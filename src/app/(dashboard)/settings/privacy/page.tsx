'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/platform/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/morphing-toaster';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Key,
  FileLock,
  Database,
  Activity,
  Settings,
  Globe,
  Smartphone,
  Mail,
} from 'lucide-react';

// Polyfill EKA components locally
const PageContainer = ({ children, className }: any) => (
  <div className={`container mx-auto p-6 ${className || ''}`}>{children}</div>
);
const SurfacePanel = ({ children, className }: any) => (
  <div className={`bg-card rounded-xl border p-6 ${className || ''}`}>{children}</div>
);
const PageHeader = ({ title, description }: any) => (
  <div className="mb-8">
    <h1 className="text-3xl font-semibold">{title}</h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

interface DataExportRequest {
  format: 'json' | 'csv' | 'pdf';
  includeAI: boolean;
  includeActivity: boolean;
  includePersonal: boolean;
  dateRange: '30d' | '90d' | '1y' | 'all';
}

interface PrivacyAudit {
  id: string;
  timestamp: number;
  action: string;
  section: string;
  metadata?: Record<string, any>;
}

interface DataAccessLog {
  id: string;
  timestamp: number;
  accessor: string;
  action: string;
  section: string;
  ip?: string;
  userAgent?: string;
}

interface PrivacySettings {
  dataSharing: {
    aiTraining: boolean;
    thirdPartyServices: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  visibility: {
    profileVisibility: 'public' | 'private' | 'connections';
    showOnlineStatus: boolean;
    allowSearch: boolean;
    showActivity: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    aiAlerts: boolean;
  };
  dataRetention: {
    activityLogs: number; // days
    chatHistory: number; // days
    aiInsights: number; // days
    backupRetention: number; // days
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    sessionTimeout: number; // minutes
    ipWhitelist: string[];
  };
}

export default function PrivacyControlsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: {
      aiTraining: true,
      thirdPartyServices: false,
      analytics: true,
      marketing: false,
    },
    visibility: {
      profileVisibility: 'connections',
      showOnlineStatus: true,
      allowSearch: true,
      showActivity: false,
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      aiAlerts: true,
    },
    dataRetention: {
      activityLogs: 90,
      chatHistory: 180,
      aiInsights: 365,
      backupRetention: 30,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
      ipWhitelist: [],
    },
  });

  const [dataExportRequest, setDataExportRequest] = useState<DataExportRequest>({
    format: 'json',
    includeAI: true,
    includeActivity: true,
    includePersonal: true,
    dateRange: '90d',
  });

  const [privacyAudit, setPrivacyAudit] = useState<PrivacyAudit[]>([]);
  const [accessLogs, setAccessLogs] = useState<DataAccessLog[]>([]);

  // Load privacy settings and audit logs
  useEffect(() => {
    if (user?.id) {
      loadPrivacySettings();
      loadPrivacyAudit();
      loadAccessLogs();

      // Track page visit
      // const aiPersonalization = new AIPersonalizationService();
      // aiPersonalization.trackUserInteraction({
      //   id: `interaction_${Date.now()}`,
      //   userId: user.id,
      //   type: 'page_view',
      //   timestamp: new Date(),
      //   metadata: {
      //     action: 'privacy_settings_accessed',
      //     section: 'privacy_controls',
      //   },
      //   context: {
      //     page: 'privacy-controls',
      //     section: 'privacy_controls',
      //   },
      // });
    }
  }, [user?.id]);

  const loadPrivacySettings = async () => {
    try {
      if (user?.id) {
        const raw =
          typeof window !== 'undefined'
            ? localStorage.getItem(`privacy_settings_${user.id}`)
            : null;
        if (raw) {
          setPrivacySettings(JSON.parse(raw));
          return;
        }
      }
      // Fallback simulated load
      const settings = await new Promise<PrivacySettings>((resolve) =>
        setTimeout(() => resolve(privacySettings), 300)
      );
      setPrivacySettings(settings);
    } catch (error) {
      toast.error('Failed to load privacy settings');
    }
  };

  const loadPrivacyAudit = async () => {
    try {
      // Simulate loading audit logs
      const audit: PrivacyAudit[] = [
        {
          id: '1',
          timestamp: Date.now() - 86400000,
          action: 'privacy_setting_changed',
          section: 'data_sharing',
          metadata: { setting: 'aiTraining', oldValue: false, newValue: true },
        },
        {
          id: '2',
          timestamp: Date.now() - 172800000,
          action: 'data_export_requested',
          section: 'data_management',
          metadata: { format: 'json', range: '90d' },
        },
        {
          id: '3',
          timestamp: Date.now() - 259200000,
          action: 'privacy_level_changed',
          section: 'visibility',
          metadata: { oldLevel: 'public', newLevel: 'connections' },
        },
      ];
      setPrivacyAudit(audit);
    } catch (error) {
      console.error('Failed to load privacy audit');
    }
  };

  const loadAccessLogs = async () => {
    try {
      // Simulate loading access logs
      const logs: DataAccessLog[] = [
        {
          id: '1',
          timestamp: Date.now() - 3600000,
          accessor: 'user_session',
          action: 'login',
          section: 'account',
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0...',
        },
        {
          id: '2',
          timestamp: Date.now() - 7200000,
          accessor: 'ai_service',
          action: 'data_access',
          section: 'wellness_data',
        },
      ];
      setAccessLogs(logs);
    } catch (error) {
      console.error('Failed to load access logs');
    }
  };

  const savePrivacySettings = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (user?.id) {
        localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(privacySettings));
      }

      // Track privacy setting changes
      // if (user?.id) {
      //   const aiPersonalization = new AIPersonalizationService();
      //   aiPersonalization.trackUserInteraction({
      //     id: `interaction_${Date.now()}`,
      //     userId: user.id,
      //     type: 'form_submit',
      //     timestamp: new Date(),
      //     metadata: {
      //       section: 'privacy_controls',
      //       ai_training: privacySettings.dataSharing.aiTraining,
      //       profile_visibility: privacySettings.visibility.profileVisibility,
      //       data_retention: privacySettings.dataRetention,
      //     },
      //     context: {
      //       page: 'privacy-controls',
      //       section: 'privacy_controls',
      //     },
      //   });
      // }

      toast.success('Privacy settings updated successfully');
    } catch (error) {
      toast.error('Failed to update privacy settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Track data export
      // if (user?.id) {
      //   const aiPersonalization = new AIPersonalizationService();
      //   aiPersonalization.trackUserInteraction({
      //     id: `interaction_${Date.now()}`,
      //     userId: user.id,
      //     type: 'form_submit',
      //     timestamp: new Date(),
      //     metadata: {
      //       section: 'privacy_controls',
      //       action: 'data_export',
      //       ...dataExportRequest,
      //     },
      //     context: {
      //       page: 'privacy-controls',
      //       section: 'privacy_controls',
      //     },
      //   });
      // }

      toast.success('Data export initiated. You will receive an email with download instructions.');
      setShowDataExport(false);
    } catch (error) {
      toast.error('Failed to initiate data export');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      toast.error('Please type the exact confirmation text');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success('Account deletion request submitted. You will receive a confirmation email.');
      setShowDeleteConfirm(false);
      setDeleteConfirmation('');
    } catch (error) {
      toast.error('Failed to process account deletion request');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <PageContainer>
      <SurfacePanel className="p-8">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <PageHeader
            icon={Shield}
            title="Privacy & Data Controls"
            description="Manage your data, privacy settings, and account security"
          />

          {/* Privacy Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Shield className="text-primary mr-3 h-6 w-6" />
                  Privacy Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="bg-success/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <CheckCircle className="text-success h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1 font-semibold">Data Protection</h3>
                    <p className="text-muted-foreground text-sm">
                      Your data is encrypted and protected
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <Eye className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1 font-semibold">Transparency</h3>
                    <p className="text-muted-foreground text-sm">Full visibility into data usage</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-accent/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <Settings className="text-accent h-6 w-6" />
                    </div>
                    <h3 className="text-foreground mb-1 font-semibold">Control</h3>
                    <p className="text-muted-foreground text-sm">
                      Complete control over your privacy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Settings */}
            <div className="lg:col-span-2">
              {/* Data Sharing Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="text-primary mr-2 h-5 w-5" />
                      Data Sharing Preferences
                    </CardTitle>
                    <CardDescription>Control how your data is shared and used</CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">AI Training Data</h4>
                          <p className="text-muted-foreground text-sm">
                            Allow AI to learn from your interactions
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.dataSharing.aiTraining}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              dataSharing: { ...privacySettings.dataSharing, aiTraining: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Third-Party Services</h4>
                          <p className="text-muted-foreground text-sm">
                            Share data with integrated services
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.dataSharing.thirdPartyServices}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              dataSharing: {
                                ...privacySettings.dataSharing,
                                thirdPartyServices: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Analytics & Improvements</h4>
                          <p className="text-muted-foreground text-sm">
                            Help improve our services with usage data
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.dataSharing.analytics}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              dataSharing: { ...privacySettings.dataSharing, analytics: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Marketing Communications</h4>
                          <p className="text-muted-foreground text-sm">
                            Receive personalized recommendations
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.dataSharing.marketing}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              dataSharing: { ...privacySettings.dataSharing, marketing: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Visibility Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="text-success mr-2 h-5 w-5" />
                      Visibility Controls
                    </CardTitle>
                    <CardDescription>
                      Manage who can see your information and activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <div className="">
                      <div>
                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                        <Select
                          value={privacySettings.visibility.profileVisibility}
                          onValueChange={(value: 'public' | 'private' | 'connections') =>
                            setPrivacySettings({
                              ...privacySettings,
                              visibility: {
                                ...privacySettings.visibility,
                                profileVisibility: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public - Anyone can view</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private - Only you</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Online Status</h4>
                          <p className="text-muted-foreground text-sm">Show when you're online</p>
                        </div>
                        <Switch
                          checked={privacySettings.visibility.showOnlineStatus}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              visibility: {
                                ...privacySettings.visibility,
                                showOnlineStatus: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Profile Search</h4>
                          <p className="text-muted-foreground text-sm">
                            Allow others to find you via search
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.visibility.allowSearch}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              visibility: { ...privacySettings.visibility, allowSearch: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Activity Feed</h4>
                          <p className="text-muted-foreground text-sm">Show your recent activity</p>
                        </div>
                        <Switch
                          checked={privacySettings.visibility.showActivity}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              visibility: { ...privacySettings.visibility, showActivity: checked },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="text-destructive mr-2 h-5 w-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Protect your account with advanced security features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <div className="">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-muted-foreground text-sm">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.security.twoFactor}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              security: { ...privacySettings.security, twoFactor: checked },
                            })
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Login Alerts</h4>
                          <p className="text-muted-foreground text-sm">
                            Get notified of new login attempts
                          </p>
                        </div>
                        <Switch
                          checked={privacySettings.security.loginAlerts}
                          onCheckedChange={(checked) =>
                            setPrivacySettings({
                              ...privacySettings,
                              security: { ...privacySettings.security, loginAlerts: checked },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout</Label>
                        <Select
                          value={privacySettings.security.sessionTimeout.toString()}
                          onValueChange={(value) =>
                            setPrivacySettings({
                              ...privacySettings,
                              security: {
                                ...privacySettings.security,
                                sessionTimeout: parseInt(value),
                              },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Actions & Logs */}
            <div className="">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="text-accent mr-2 h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowDataExport(true)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export My Data
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.open('/legal/privacy', '_blank')}
                    >
                      <FileLock className="mr-2 h-4 w-4" />
                      Privacy Policy
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.open('/legal/terms', '_blank')}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Terms of Service
                    </Button>
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="text-warning mr-2 h-5 w-5" />
                      Recent Privacy Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      {privacyAudit.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                          No recent activity
                        </p>
                      ) : (
                        privacyAudit.map((audit) => (
                          <div
                            key={audit.id}
                            className="bg-muted/40 flex items-start rounded-xl p-3"
                          >
                            <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-foreground text-sm font-medium">
                                {audit.action.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {formatTimestamp(audit.timestamp)}
                              </p>
                              {audit.metadata && (
                                <p className="text-muted-foreground mt-1 text-xs">
                                  {JSON.stringify(audit.metadata).substring(0, 50)}...
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Access Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCheck className="text-success mr-2 h-5 w-5" />
                      Data Access Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      {accessLogs.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center text-sm">
                          No access logs
                        </p>
                      ) : (
                        accessLogs.map((log) => (
                          <div key={log.id} className="bg-muted/40 flex items-start rounded-xl p-3">
                            <div className="bg-success mt-2 h-2 w-2 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-foreground text-sm font-medium">
                                {log.action.toUpperCase()} - {log.section}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {log.accessor} • {formatTimestamp(log.timestamp)}
                              </p>
                              {log.ip && (
                                <p className="text-muted-foreground mt-1 text-xs">IP: {log.ip}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Button onClick={savePrivacySettings} disabled={isLoading} size="lg">
              {isLoading ? 'Saving...' : 'Save Privacy Settings'}
            </Button>
          </motion.div>
        </div>

        {/* Data Export Dialog */}
        <Dialog open={showDataExport} onOpenChange={setShowDataExport}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Export Your Data</DialogTitle>
              <DialogDescription>Choose format, range, and what to include.</DialogDescription>
            </DialogHeader>
            <div className="">
              <div>
                <Label>Export Format</Label>
                <Select
                  value={dataExportRequest.format}
                  onValueChange={(value) =>
                    setDataExportRequest({ ...dataExportRequest, format: value as any })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date Range</Label>
                <Select
                  value={dataExportRequest.dateRange}
                  onValueChange={(value) =>
                    setDataExportRequest({ ...dataExportRequest, dateRange: value as any })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="">
                <div className="flex items-center">
                  <Switch
                    checked={dataExportRequest.includePersonal}
                    onCheckedChange={(checked) =>
                      setDataExportRequest({ ...dataExportRequest, includePersonal: checked })
                    }
                  />
                  <Label>Include Personal Information</Label>
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={dataExportRequest.includeActivity}
                    onCheckedChange={(checked) =>
                      setDataExportRequest({ ...dataExportRequest, includeActivity: checked })
                    }
                  />
                  <Label>Include Activity Logs</Label>
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={dataExportRequest.includeAI}
                    onCheckedChange={(checked) =>
                      setDataExportRequest({ ...dataExportRequest, includeAI: checked })
                    }
                  />
                  <Label>Include AI Insights</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                className="flex-1 sm:flex-none"
                onClick={handleDataExport}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Export Data'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setShowDataExport(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Account Deletion Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="text-destructive h-5 w-5" />
                Delete Account
              </DialogTitle>
              <DialogDescription>
                This action is irreversible. All your data will be permanently deleted and cannot be
                recovered.
              </DialogDescription>
            </DialogHeader>
            <div className="">
              <p className="text-muted-foreground text-sm">
                To confirm account deletion, please type: <strong>DELETE MY ACCOUNT</strong>
              </p>
              <Input
                placeholder="Type DELETE MY ACCOUNT"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="border-destructive/40 focus:border-destructive focus:ring-destructive"
              />
            </div>
            <DialogFooter className="gap-3 sm:gap-0">
              <Button
                variant="destructive"
                className="flex-1 sm:flex-none"
                onClick={handleAccountDeletion}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Delete Account'}
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SurfacePanel>
    </PageContainer>
  );
}
