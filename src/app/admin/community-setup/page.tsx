/**
 * Community Feature Setup Script
 * Run this script to initialize the community database when ready to launch
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Database, 
  Shield, 
  Users,
  Settings
} from 'lucide-react';
import { initializeCommunityDatabase } from '@/firebase/firestore/community-init';

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

  const setupSteps = [
    {
      title: 'Database Collections',
      description: 'Create Firestore collections with initial data',
      icon: Database,
      status: status === 'success' ? 'complete' : status === 'loading' ? 'in-progress' : 'pending',
    },
    {
      title: 'Security Rules',
      description: 'Already deployed in firestore.rules',
      icon: Shield,
      status: 'complete',
    },
    {
      title: 'Type Definitions',
      description: 'Already available in community-types.ts',
      icon: Settings,
      status: 'complete',
    },
    {
      title: 'Service Layer',
      description: 'Already implemented in community-service.ts',
      icon: Users,
      status: 'complete',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Community Setup</h1>
        <p className="text-muted-foreground text-lg">
          Initialize the community and groups backend infrastructure
        </p>
      </div>

      {/* Setup Steps */}
      <div className="grid gap-4 md:grid-cols-2">
        {setupSteps.map((step) => (
          <Card key={step.title}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-3 rounded-lg ${
                step.status === 'complete' 
                  ? 'bg-green-500/10 text-green-600' 
                  : step.status === 'in-progress'
                  ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-gray-500/10 text-gray-600'
              }`}>
                <step.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  {step.status === 'complete' && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {step.status === 'in-progress' && (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                </div>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Action Card */}
      <Card>
        <CardHeader>
          <CardTitle>Initialize Database</CardTitle>
          <CardDescription>
            Click the button below to create the community database structure with default groups and sample data.
            This only needs to be run once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleInitialize} 
            disabled={status === 'loading' || status === 'success'}
            size="lg"
            className="w-full"
          >
            {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === 'success' ? 'Database Initialized ✓' : 'Initialize Community Database'}
          </Button>

          {/* Status Messages */}
          {status === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Community database has been initialized successfully. Check the logs below for details.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Setup Logs:</h4>
              <div className="bg-muted rounded-lg p-4 space-y-1 max-h-64 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-muted-foreground">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            After initialization, follow these steps to complete the setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <h4 className="font-semibold">Deploy Security Rules</h4>
                <p className="text-sm text-muted-foreground">
                  The security rules are already in firestore.rules. Deploy them using:
                  <code className="block mt-1 bg-muted p-2 rounded text-xs">
                    firebase deploy --only firestore:rules
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <h4 className="font-semibold">Create Firestore Indexes</h4>
                <p className="text-sm text-muted-foreground">
                  Required composite indexes will be auto-created when you first query, or you can create them manually in the Firebase Console.
                  See COMMUNITY_BACKEND_GUIDE.md for the full list.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <h4 className="font-semibold">Enable Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Uncomment the community link in src/components/eka/app-sidebar.tsx to enable user access.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <h4 className="font-semibold">Test the Feature</h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to /community to test posts, comments, groups, and all community features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Reference */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            For complete documentation, API reference, and usage examples, see:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li><strong>COMMUNITY_BACKEND_GUIDE.md</strong> - Complete implementation guide</li>
            <li><strong>src/lib/community-types.ts</strong> - Type definitions</li>
            <li><strong>src/services/community-service.ts</strong> - Service layer API</li>
            <li><strong>src/firebase/community-rules.txt</strong> - Security rules reference</li>
          </ul>
        </CardContent>
      </Card>

      {/* Created Collections */}
      {status === 'success' && (
        <Card>
          <CardHeader>
            <CardTitle>✅ Created Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                'community_posts',
                'community_comments',
                'community_reactions',
                'community_groups',
                'community_group_members',
                'community_group_invitations',
                'community_group_join_requests',
                'community_follows',
                'community_notifications',
                'community_reports',
                'community_user_profiles',
                'community_analytics',
              ].map((collection) => (
                <Badge key={collection} variant="secondary" className="justify-center">
                  {collection}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
