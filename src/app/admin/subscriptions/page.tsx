'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getSubscriptionService } from '@/services/subscription-service';
import { SubscriptionBadge } from '@/components/eka/subscription-badge';
import { 
  Search, 
  MoreVertical, 
  Plus, 
  UserPlus, 
  UserMinus, 
  Shield, 
  TrendingUp,
  Users,
  Crown,
  Star,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import type { Subscription, SubscriptionType, SubscriptionTier } from '@/lib/subscription-types';

interface UserSubscriptionData {
  userId: string;
  userName: string;
  userEmail: string;
  subscriptions: Subscription[];
  totalSpent: number;
  joinedDate: Date;
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<UserSubscriptionData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | SubscriptionType>('all');
  const [selectedUser, setSelectedUser] = useState<UserSubscriptionData | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [newSubscriptionType, setNewSubscriptionType] = useState<SubscriptionType>('loyalty');
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);

  // Stats
  const stats = {
    totalUsers: users.length,
    loyalMembers: users.filter(u => u.subscriptions.some(s => s.type === 'loyalty' && s.status === 'active')).length,
    vipMembers: users.filter(u => u.subscriptions.some(s => s.type === 'vip' && s.status === 'active')).length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterType, users]);

  const loadSubscriptionData = async () => {
    setLoading(true);
    try {
      const service = await getSubscriptionService();
      const allTiers = await service.getSubscriptionTiers();
      setTiers(allTiers);
      
      // Mock user data - in production, fetch from user service
      const mockUsers: UserSubscriptionData[] = [
        {
          userId: 'user-1',
          userName: 'John Doe',
          userEmail: 'john@example.com',
          subscriptions: await service.getUserSubscriptions('user-1'),
          totalSpent: 199.99,
          joinedDate: new Date('2024-01-15'),
        },
        {
          userId: 'user-2',
          userName: 'Jane Smith',
          userEmail: 'jane@example.com',
          subscriptions: await service.getUserSubscriptions('user-2'),
          totalSpent: 599.99,
          joinedDate: new Date('2024-03-20'),
        },
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(user =>
        user.subscriptions.some(s => s.type === filterType && s.status === 'active')
      );
    }

    setFilteredUsers(filtered);
  };

  const handleGrantSubscription = async () => {
    if (!selectedUser) return;

    try {
      const service = await getSubscriptionService();
      const tier = tiers.find(t => t.type === newSubscriptionType);
      
      if (!tier || !tier.id) {
        console.error('Tier not found');
        return;
      }

      // Create new subscription
      await service.createSubscription(
        selectedUser.userId,
        tier.id,
        'monthly'
      );

      // Reload data
      await loadSubscriptionData();
      setGrantDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to grant subscription:', error);
    }
  };

  const handleRevokeSubscription = async (subscriptionId: string) => {
    try {
      const service = await getSubscriptionService();
      await service.cancelSubscription(subscriptionId, true); // immediate cancellation
      
      // Reload data
      await loadSubscriptionData();
      setRevokeDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to revoke subscription:', error);
    }
  };

  const getActiveSubscription = (user: UserSubscriptionData, type: SubscriptionType) => {
    return user.subscriptions.find(s => s.type === type && s.status === 'active');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user subscriptions, grant access, and view analytics
          </p>
        </div>
        <Button onClick={loadSubscriptionData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600" />
              Loyal Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.loyalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-600" />
              VIP Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.vipMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>User Subscriptions</CardTitle>
          <CardDescription>View and manage all user subscription memberships</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="loyalty">Loyal Only</SelectItem>
                <SelectItem value="vip">VIP Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <Separator />

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subscriptions</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const loyalSub = getActiveSubscription(user, 'loyalty');
                    const vipSub = getActiveSubscription(user, 'vip');

                    return (
                      <TableRow key={user.userId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.userName}</div>
                            <div className="text-sm text-gray-500">{user.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {loyalSub && <SubscriptionBadge type="loyalty" size="sm" />}
                            {vipSub && <SubscriptionBadge type="vip" size="sm" />}
                            {!loyalSub && !vipSub && (
                              <Badge variant="outline">No subscription</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">€{user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {user.joinedDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setGrantDialogOpen(true);
                                }}
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Grant Subscription
                              </DropdownMenuItem>
                              {(loyalSub || vipSub) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setRevokeDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Revoke Access
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Grant Subscription Dialog */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Subscription</DialogTitle>
            <DialogDescription>
              Give {selectedUser?.userName} access to a subscription tier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subscription-type">Subscription Type</Label>
              <Select
                value={newSubscriptionType}
                onValueChange={(value) => setNewSubscriptionType(value as SubscriptionType)}
              >
                <SelectTrigger id="subscription-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loyalty">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span>Loyal Membership</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vip">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span>VIP Membership</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-900">
                This will create an active subscription for the user. They will have immediate access to all tier benefits.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantSubscription}>
              <Plus className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Subscription Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Subscription Access</DialogTitle>
            <DialogDescription>
              Remove subscription access for {selectedUser?.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-900 font-medium">Warning</p>
              <p className="text-sm text-red-800 mt-1">
                This action will immediately revoke the user's subscription access. They will lose all premium benefits.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Active Subscriptions</Label>
              <div className="flex flex-col gap-2">
                {selectedUser?.subscriptions
                  .filter(s => s.status === 'active')
                  .map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <SubscriptionBadge type={sub.type} size="sm" />
                        <span className="text-sm">€{sub.price}/{sub.interval === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRevokeSubscription(sub.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
