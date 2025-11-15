'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Notification, NotificationDescription, NotificationTitle } from '@/components/keep';
import { useState } from 'react';
;
;
;
;
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Database, 
  Shield, 
  Users,
  Settings as SettingsIcon
} from 'lucide-react';
import { initializeCommunityDatabase } from '@/firebase/firestore/community-init';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';

const setupStepsConfig = [
  { title: 'Database Collections', description: 'Create Firestore collections with initial data', icon: Database },
  { title: 'Security Rules', description: 'Already deployed in firestore.rules', icon: Shield },
  { title: 'Type Definitions', description: 'Already available in community-types.ts', icon: SettingsIcon },
  { title: 'Service Layer', description: 'Already implemented in community-service.ts', icon: Users },
];

const nextStepsContent = [
  { step: '1', title: 'Deploy Security Rules', description: 'The security rules are already in firestore.rules. Deploy them using:', code: 'firebase deploy --only firestore:rules' },
  { step: '2', title: 'Create Firestore Indexes', description: 'Required composite indexes will be auto-created when you first query, or you can create them manually in the Firebase Console.' },
  { step: '3', title: 'Enable Navigation', description: 'Uncomment the community link in src/components/eka/app-sidebar.tsx to enable user access.' },
  { step: '4', title: 'Test the Feature', description: 'Navigate to /community to test posts, comments, groups, and all community features.' },
];

const createdCollections = ['community_posts', 'community_comments', 'community_reactions', 'community_groups', 'community_group_members', 'community_group_invitations', 'community_group_join_requests', 'community_follows', 'community_notifications', 'community_reports', 'community_user_profiles', 'community_analytics'];

function SetupStepsGrid({ currentStatus }: { currentStatus: 'idle' | 'loading' | 'success' | 'error' }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {setupStepsConfig.map((step, idx) => {
                let status: 'complete' | 'in-progress' | 'pending' = 'complete';
                if (idx === 0) status = currentStatus === 'success' ? 'complete' : currentStatus === 'loading' ? 'in-progress' : 'pending';
                return (
                    <Card key={step.title}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${status === 'complete' ? 'bg-green-50 text-green-600 dark:bg-green-950' : status === 'in-progress' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950' : 'bg-muted text-muted-foreground'}`}>
                                    <step.icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{step.title}</CardTitle>
                                        {status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                        {status === 'in-progress' && <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                );
            })}
        </div>
    );
}

export default function CommunitySetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${log}`]);
  };

  const handleInitialize = async () => {
    setStatus('loading');
    setLogs([]);
    addLog('Starting community database initialization...');
    try {
      addLog('Creating default groups...');
      const result = await initializeCommunityDatabase();
      addLog('✅ Database initialized successfully');
      setStatus('success');
      setMessage(result.message);
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setStatus('error');
      setMessage(error.message || 'Failed to initialize database');
      console.error('Initialization error:', error);
    }
  };

  return (
    <SettingsShell>
        <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            <SettingsHeader
                title="Community Setup"
                description="Initialize the community and groups backend infrastructure for your app."
            />
        </div>

        <div className="space-y-6 mt-6">
            <SetupStepsGrid currentStatus={status} />

            <Card>
                <CardHeader>
                    <CardTitle>Initialize Database</CardTitle>
                    <CardDescription>Create the community database structure with default groups. This only needs to be run once.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleInitialize} disabled={status === 'loading' || status === 'success'} size="lg" className="w-full">
                        {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {status === 'success' ? 'Database Initialized ✓' : 'Initialize Community Database'}
                    </Button>
                    {status === 'success' && <Notification><CheckCircle2 className="h-4 w-4" /><NotificationTitle>Success!</NotificationTitle><NotificationDescription>Community database initialized successfully.</NotificationDescription></Notification>}
                    {status === 'error' && <Notification><AlertCircle className="h-4 w-4" /><NotificationTitle>Error</NotificationTitle><NotificationDescription>{message}</NotificationDescription></Notification>}
                    {logs.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Setup Logs</h4>
                            <div className="bg-muted rounded-lg p-4 space-y-1 max-h-64 overflow-y-auto font-mono text-xs">{logs.map((log, idx) => <div key={idx} className="text-muted-foreground">{log}</div>)}</div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Next Steps</CardTitle><CardDescription>After initialization, follow these steps.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    {nextStepsContent.map(item => (
                        <div key={item.step} className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-1">{item.step}</Badge>
                            <div>
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                {item.code && <code className="block mt-2 bg-muted p-2 rounded text-xs">{item.code}</code>}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {status === 'success' && (
                <Card>
                    <CardHeader><CardTitle>✅ Created Collections</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">{createdCollections.map(c => <Badge key={c} variant="background" className="justify-center text-xs">{c}</Badge>)}</div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>📚 Documentation</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">For complete documentation, API reference, and usage examples, see:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                        <li><strong>COMMUNITY_BACKEND_GUIDE.md</strong> - Complete implementation guide</li>
                        <li><strong>src/lib/community-types.ts</strong> - Type definitions</li>
                        <li><strong>src/services/community-service.ts</strong> - Service layer API</li>
                        <li><strong>src/firebase/community-rules.txt</strong> - Security rules reference</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </SettingsShell>
  );
}
