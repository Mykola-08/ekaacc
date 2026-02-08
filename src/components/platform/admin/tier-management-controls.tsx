'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Alert, AlertDescription } from '@/components/platform/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/platform/ui/select';
import { Textarea } from '@/components/platform/ui/textarea';
import { Label } from '@/components/platform/ui/label';
import { Input } from '@/components/platform/ui/input';
import { useAdminTiers } from '@/hooks/platform/use-tiers';
import type { VIPTier, LoyaltyTier } from '@/lib/platform/types/subscription-types';
import {
  User,
  Crown,
  Star,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Search,
  History,
  BarChart3,
} from 'lucide-react';

interface TierManagementControlsProps {
  userId?: string;
  onTierUpdate?: (userId: string, tierType: 'vip' | 'loyalty', newTier: string) => void;
}

export function TierManagementControls({ userId, onTierUpdate }: TierManagementControlsProps) {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [tierType, setTierType] = useState<'vip' | 'loyalty'>('vip');
  const [reason, setReason] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'management' | 'audit'>('overview');

  const { users, auditLogs, analytics, assignTier, revokeTier, validateTierEligibility, error } =
    useAdminTiers();

  const handleAssignTier = async () => {
    if (!selectedTier || !reason) return;

    try {
      await assignTier(userId || 'user-123', tierType, selectedTier as any, reason);
      setSelectedTier('');
      setReason('');
      if (onTierUpdate) {
        onTierUpdate(userId || 'user-123', tierType, selectedTier);
      }
    } catch (err) {
      console.error('Failed to assign tier:', err);
    }
  };

  const handleRevokeTier = async () => {
    if (!selectedTier || !reason) return;

    try {
      await revokeTier(
        userId || 'user-123',
        tierType,
        selectedTier as VIPTier | LoyaltyTier,
        reason
      );
      setReason('');
      if (onTierUpdate) {
        onTierUpdate(userId || 'user-123', tierType, '');
      }
    } catch (err) {
      console.error('Failed to revoke tier:', err);
    }
  };

  const handleValidateEligibility = async () => {
    try {
      await validateTierEligibility(userId || 'user-123', tierType, selectedTier as any);
    } catch (err) {
      console.error('Failed to validate eligibility:', err);
    }
  };

  if (users.length === 0 && !error) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="management">
            <Settings className="mr-2 h-4 w-4" />
            Management
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="mr-2 h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* User Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Search and manage user tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Search users..." className="w-full" />
                </div>
                {users.length > 0 && (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-muted/30 flex items-center justify-between rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium">{user.displayName}</p>
                          <p className="text-muted-foreground text-sm">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.currentTiers.map((tier) => (
                            <Badge key={`${tier.tierType}-${tier.tierName}`} variant="outline">
                              {tier.tierType.toUpperCase()} {tier.tierName.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tier Users</CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalTierUsers || 150}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">VIP Users</CardTitle>
                <Crown className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics
                    ? analytics.tierDistribution.vip.silver +
                      analytics.tierDistribution.vip.gold +
                      analytics.tierDistribution.vip.platinum
                    : 100}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loyalty Users</CardTitle>
                <Star className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics
                    ? analytics.tierDistribution.loyalty.member +
                      analytics.tierDistribution.loyalty.elite
                    : 120}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          {/* Tier Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tier Management
              </CardTitle>
              <CardDescription>Manage user tiers and eligibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label
                      htmlFor="tier-type"
                      className="text-foreground/90 mb-2 block text-sm font-medium"
                    >
                      Tier Type
                    </Label>
                    <Select
                      value={tierType}
                      onValueChange={(value) => setTierType(value as 'vip' | 'loyalty')}
                    >
                      <SelectTrigger id="tier-type" className="w-full">
                        <SelectValue placeholder="Select tier type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP Tier</SelectItem>
                        <SelectItem value="loyalty">Loyalty Tier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="select-tier"
                      className="text-foreground/90 mb-2 block text-sm font-medium"
                    >
                      Select Tier
                    </Label>
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger
                        id="select-tier"
                        className="w-full"
                        role="combobox"
                        aria-label="Select tier"
                      >
                        <SelectValue placeholder="Select Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tierType === 'vip' ? (
                          <>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            <SelectItem value="platinum">Platinum</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="elite">Elite</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="reason"
                    className="text-foreground/90 mb-2 block text-sm font-medium"
                  >
                    Reason
                  </Label>
                  <Textarea
                    id="reason"
                    className="w-full"
                    rows={3}
                    placeholder="Enter the reason for this tier change..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAssignTier}
                    disabled={!selectedTier || !reason}
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Assign Tier
                  </Button>

                  <Button
                    onClick={handleRevokeTier}
                    disabled={!reason}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Revoke Tier
                  </Button>

                  <Button
                    onClick={handleValidateEligibility}
                    disabled={!selectedTier}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Validate Eligibility
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          {userId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>Current tier status and user metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">Name</label>
                      <p className="text-lg font-semibold">John Doe</p>
                    </div>
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">Email</label>
                      <p className="text-lg">john.doe@example.com</p>
                    </div>
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">
                        Current VIP Tier
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-linear-to-r from-blue-500 to-purple-600">
                          <Crown className="mr-1 h-3 w-3" />
                          VIP SILVER
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">
                        Current Loyalty Tier
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-linear-to-r from-amber-500 to-orange-600">
                          <Star className="mr-1 h-3 w-3" />
                          MEMBER
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">Total Spend</label>
                      <p className="text-lg font-semibold text-green-600">€250.00</p>
                    </div>
                    <div>
                      <label className="text-foreground/90 text-sm font-medium">
                        Loyalty Points
                      </label>
                      <p className="text-lg font-semibold text-purple-600">1,500</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Recent tier changes and admin actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="bg-muted/30 flex items-start gap-3 rounded-lg p-3">
                      <div className="mt-1">
                        {log.action === 'assign' ? (
                          <Shield className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {log.action === 'assign' ? 'VIP Silver Assigned' : 'Tier Revoked'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {log.tierType.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{log.reason}</p>
                        <p className="text-muted-foreground/80 mt-2 text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">User: Test User</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
