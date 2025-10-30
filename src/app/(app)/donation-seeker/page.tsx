'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function DonationSeekerPage() {
  const { appUser: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Mock application status - in production, this comes from user data
  const [applicationStatus, setApplicationStatus] = useState<'pending' | 'approved' | 'rejected'>(
    currentUser?.donationSeekerApproved ? 'approved' : 'pending'
  );
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareNameWithDonors: true,
    shareStoryWithDonors: true,
    shareProgressWithDonors: false,
    allowDirectMessages: true,
    showInPublicDirectory: false,
  });

  // Mock stats
  const stats = {
    totalReceived: currentUser?.totalReceived || 0,
    currentMonthReceived: 125.00,
    activeDonors: 3,
    goalAmount: 500,
    sessionsCompleted: 8,
    nextSession: '2025-10-25',
  };

  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: 'Privacy settings updated',
      description: 'Your preferences have been saved.',
    });
  };

  const getStatusIcon = () => {
    switch (applicationStatus) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (applicationStatus) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Needs Attention';
    }
  };

  const getStatusDescription = () => {
    switch (applicationStatus) {
      case 'approved':
        return 'Your application has been approved. You can now receive donations.';
      case 'pending':
        return 'Your application is being reviewed by our team. This typically takes 2-3 business days.';
      case 'rejected':
        return 'Your application needs additional information. Please check your email for details.';
    }
  };

  const progressPercentage = Math.min((stats.totalReceived / stats.goalAmount) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donation Seeker Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your donation seeker profile and track support from the community
        </p>
      </div>

      {/* Application Status */}
      <Alert className={
        applicationStatus === 'approved' ? 'border-green-500/50 bg-green-500/10' :
        applicationStatus === 'pending' ? 'border-yellow-500/50 bg-yellow-500/10' :
        'border-red-500/50 bg-red-500/10'
      }>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">Application Status: {getStatusText()}</h3>
              <Badge variant={
                applicationStatus === 'approved' ? 'default' :
                applicationStatus === 'pending' ? 'secondary' :
                'destructive'
              }>
                {getStatusText()}
              </Badge>
            </div>
            <AlertDescription>
              {getStatusDescription()}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Stats Overview */}
      {applicationStatus === 'approved' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalReceived.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +€{stats.currentMonthReceived.toFixed(2)} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDonors}</div>
              <p className="text-xs text-muted-foreground">
                Supporting your journey
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sessionsCompleted}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Oct 25</div>
              <p className="text-xs text-muted-foreground">
                2:00 PM
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goal Progress */}
      {applicationStatus === 'approved' && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Support Goal</CardTitle>
            <CardDescription>
              Track progress towards your monthly therapy funding goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">€{stats.totalReceived.toFixed(2)} raised</span>
                <span className="text-muted-foreground">Goal: €{stats.goalAmount.toFixed(2)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(0)}% of monthly goal reached
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy & Data Sharing */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Privacy & Data Sharing</CardTitle>
          </div>
          <CardDescription>
            Control what information donors can see about you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base">Share name with donors</Label>
              <p className="text-sm text-muted-foreground">
                Allow donors to see your full name
              </p>
            </div>
            <Switch
              checked={privacySettings.shareNameWithDonors}
              onCheckedChange={() => handlePrivacyToggle('shareNameWithDonors')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base">Share story with donors</Label>
              <p className="text-sm text-muted-foreground">
                Let donors see your application story and reason for seeking support
              </p>
            </div>
            <Switch
              checked={privacySettings.shareStoryWithDonors}
              onCheckedChange={() => handlePrivacyToggle('shareStoryWithDonors')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base">Share progress updates</Label>
              <p className="text-sm text-muted-foreground">
                Share therapy progress and milestones with your donors
              </p>
            </div>
            <Switch
              checked={privacySettings.shareProgressWithDonors}
              onCheckedChange={() => handlePrivacyToggle('shareProgressWithDonors')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base">Allow direct messages</Label>
              <p className="text-sm text-muted-foreground">
                Let donors send you messages of encouragement
              </p>
            </div>
            <Switch
              checked={privacySettings.allowDirectMessages}
              onCheckedChange={() => handlePrivacyToggle('allowDirectMessages')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-base">Show in public directory</Label>
              <p className="text-sm text-muted-foreground">
                Appear in the public directory of donation seekers
              </p>
            </div>
            <Switch
              checked={privacySettings.showInPublicDirectory}
              onCheckedChange={() => handlePrivacyToggle('showInPublicDirectory')}
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your privacy is important. You can change these settings at any time. Financial information is never shared with donors.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Your Story (if approved) */}
      {applicationStatus === 'approved' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Story</CardTitle>
            <CardDescription>
              This is what donors see when they view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  {currentUser?.donationSeekerReason || 
                    "I'm seeking support to access mental health therapy. Your donation helps me on my journey to wellness and recovery."}
                </p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                Update Your Story
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Resources</CardTitle>
          <CardDescription>
            Get help and learn more about the donation program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Info className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Heart className="h-4 w-4 mr-2" />
            Contact Support Team
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Security Information
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
