'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useCallback } from 'react';
import { getSubscriptionService } from '@/services/subscription-service';
import { SubscriptionBadge } from '@/components/eka/subscription-badge';
import { Plus, Star, Crown, DollarSign } from 'lucide-react';
import type { Subscription, SubscriptionType, SubscriptionTier } from '@/lib/subscription-types';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import {
    StatCard,
    SubscriptionFilters,
    SubscriptionsTable,
    SubscriptionsPageSkeleton,
    STATS_CONFIG
} from './components';

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

  const loadSubscriptionData = useCallback(async () => {
    setLoading(true);
    try {
      const service = await getSubscriptionService();
      const allTiers = await service.getSubscriptionTiers();
      setTiers(allTiers);
      
      // This is mock data. In a real app, you'd fetch this from your user service
      // and then enrich it with subscription data.
      const mockUsers: UserSubscriptionData[] = [
        {
          userId: 'user-1',
          userName: 'Alice Johnson',
          userEmail: 'alice@example.com',
          subscriptions: await service.getUserSubscriptions('user-1'),
          totalSpent: 250.50,
          joinedDate: new Date('2024-02-10'),
        },
        {
          userId: 'user-2',
          userName: 'Bob Williams',
          userEmail: 'bob@example.com',
          subscriptions: await service.getUserSubscriptions('user-2'),
          totalSpent: 75.00,
          joinedDate: new Date('2024-05-01'),
        },
        {
          userId: 'user-3',
          userName: 'Charlie Brown',
          userEmail: 'charlie@example.com',
          subscriptions: [],
          totalSpent: 0,
          joinedDate: new Date('2024-06-15'),
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  const filterUsers = useCallback(() => {
    let filtered = users;
    if (searchQuery) {
      filtered = filtered.filter(
        user =>
          user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(user =>
        user.subscriptions.some(s => s.type === filterType && s.status === 'active')
      );
    }
    setFilteredUsers(filtered);
  }, [searchQuery, filterType, users]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleGrantSubscription = async () => {
    if (!selectedUser) return;
    try {
      const service = await getSubscriptionService();
      const tier = tiers.find(t => t.type === newSubscriptionType);
      if (!tier || !tier.id) {
        console.error('Tier not found');
        return;
      }
      await service.createSubscription(selectedUser.userId, tier.id, 'monthly');
      await loadSubscriptionData();
      setGrantDialogOpen(false);
    } catch (error) {
      console.error('Failed to grant subscription:', error);
    }
  };

  const handleRevokeSubscription = async (subscriptionId: string) => {
    try {
      const service = await getSubscriptionService();
      await service.cancelSubscription(subscriptionId, true); // immediate cancellation
      await loadSubscriptionData();
      setRevokeDialogOpen(false);
    } catch (error) {
      console.error('Failed to revoke subscription:', error);
    }
  };

  const handleTableAction = (user: UserSubscriptionData, action: 'grant' | 'revoke' | 'view') => {
      setSelectedUser(user);
      if (action === 'grant') setGrantDialogOpen(true);
      if (action === 'revoke') setRevokeDialogOpen(true);
      // 'view' action can be implemented here
  };

  const stats = {
    totalUsers: users.length,
    loyalMembers: users.filter(u => u.subscriptions.some(s => s.type === 'loyalty' && s.status === 'active')).length,
    vipMembers: users.filter(u => u.subscriptions.some(s => s.type === 'vip' && s.status === 'active')).length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
  };

  return (
    <SettingsShell>
        <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <SettingsHeader
                title="Subscription Management"
                description="Oversee user subscriptions, grant access, and view key metrics."
            />
        </div>

        {loading ? <SubscriptionsPageSkeleton /> : (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATS_CONFIG.map(stat => (
                        <StatCard 
                            key={stat.key} 
                            title={stat.title} 
                            value={stat.key === 'totalRevenue' ? `€${stats.totalRevenue.toFixed(2)}` : stats[stat.key as keyof typeof stats].toString()} 
                            icon={stat.icon}
                            iconClass={stat.iconClass}
                        />
                    ))}
                </div>

                <SubscriptionFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterType={filterType}
                    onFilterChange={(value) => setFilterType(value as 'all' | SubscriptionType)}
                    onExport={() => alert('Export functionality not implemented.')}
                />

                <SubscriptionsTable users={filteredUsers} onAction={handleTableAction} />
            </div>
        )}

      {/* Grant Subscription Dialog */}
      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <ModalContent>
          <DialogHeader>
            <DialogTitle>Grant Subscription</DialogTitle>
            <DialogDescription>Give {selectedUser?.userName} access to a subscription tier.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subscription-type">Subscription Type</Label>
              <Select value={newSubscriptionType} onValueChange={(value) => setNewSubscriptionType(value as SubscriptionType)}>
                <SelectValue placeholder="Select type"  />
                <SelectContent>
                  <SelectItem value="loyalty"><div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /><span>Loyal Membership</span></div></SelectItem>
                  <SelectItem value="vip"><div className="flex items-center gap-2"><Crown className="w-4 h-4 text-purple-500" /><span>VIP Membership</span></div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <AlertDescription>This will create an active subscription for the user, granting immediate access.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGrantSubscription}><Plus className="w-4 h-4 mr-2" />Grant Access</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Subscription Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <ModalContent>
          <DialogHeader>
            <DialogTitle>Revoke Subscription Access</DialogTitle>
            <DialogDescription>Remove subscription access for {selectedUser?.userName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert>
              <AlertDescription>This action will immediately revoke the user's subscription access. This cannot be undone.</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Active Subscriptions</Label>
              {selectedUser?.subscriptions.filter(s => s.status === 'active').map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <SubscriptionBadge type={sub.type} size="sm" />
                    <span className="text-sm font-mono">€{sub.price}/{sub.interval === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleRevokeSubscription(sub.id)}>Revoke</Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
