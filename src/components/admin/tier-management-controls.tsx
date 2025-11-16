'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Link2,
  Settings,
  Search,
  Filter
} from 'lucide-react';
import { 
  VIPTierDetails, 
  LoyaltyTierDetails, 
  VIPTier, 
  LoyaltyTier, 
  TierValidationResult,
  TierAuditLog 
} from '@/lib/subscription-types';

interface UserTierData {
  userId: string;
  userName: string;
  userEmail: string;
  currentVIPTier: VIPTier | null;
  currentLoyaltyTier: LoyaltyTier | null;
  vipValidation: TierValidationResult | null;
  loyaltyValidation: TierValidationResult | null;
  totalSpend: number;
  totalSessions: number;
  subscriptionDuration: number;
  referralCount: number;
  loyaltyPoints: number;
  lastActivity: string;
}

interface TierManagementControlsProps {
  userId: string;
  onTierUpdate?: (userId: string, tierType: 'vip' | 'loyalty', newTier: string) => void;
}

export function TierManagementControls({ userId, onTierUpdate }: TierManagementControlsProps) {
  const [userData, setUserData] = useState<UserTierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVIPTier, setSelectedVIPTier] = useState<VIPTier | null>(null);
  const [selectedLoyaltyTier, setSelectedLoyaltyTier] = useState<LoyaltyTier | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [auditLogs, setAuditLogs] = useState<TierAuditLog[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    loadUserData();
    loadAuditLogs();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API calls
      const mockUserData: UserTierData = {
        userId: userId,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        currentVIPTier: 'silver',
        currentLoyaltyTier: 'member',
        vipValidation: {
          isValid: true,
          requirementsMet: false,
          missingRequirements: ['Minimum spend of €500 required (current: €250.00)', 'Minimum 20 sessions required (current: 12)'],
          currentMetrics: { totalSpend: 250, totalSessions: 12, subscriptionDuration: 2, referralCount: 1 },
          requiredMetrics: { minimumSpend: 500, minimumSessions: 20, minimumDuration: 3, referralCount: 2 }
        },
        loyaltyValidation: {
          isValid: true,
          requirementsMet: true,
          missingRequirements: [],
          currentMetrics: { loyaltyPoints: 1500, subscriptionDuration: 6, referralCount: 3 },
          requiredMetrics: { minimumPoints: 1000, minimumDuration: 3, referralCount: 3 }
        },
        totalSpend: 250,
        totalSessions: 12,
        subscriptionDuration: 2,
        referralCount: 1,
        loyaltyPoints: 1500,
        lastActivity: '2024-01-15T10:30:00Z'
      };
      setUserData(mockUserData);
      setError(null);
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    // This would load actual audit logs
    const mockLogs: TierAuditLog[] = [
      {
        id: '1',
        userId: userId,
        adminId: 'admin-1',
        action: 'tier_assigned',
        newTier: 'silver',
        tierType: 'vip',
        reason: 'User requested upgrade',
        createdAt: new Date().toISOString()
      }
    ];
    setAuditLogs(mockLogs);
  };

  const handleTierAssignment = async (tierType: 'vip' | 'loyalty', newTier: string) => {
    if (!reason.trim()) {
      setError('Please provide a reason for this tier assignment');
      return;
    }

    try {
      // This would make an API call to assign the tier
      console.log(`Assigning ${tierType} tier ${newTier} to user ${userId}`);
      
      // Log the action
      const auditLog: Omit<TierAuditLog, 'id' | 'createdAt'> = {
        userId,
        adminId: 'current-admin-id', // This would come from auth context
        action: 'tier_assigned',
        newTier,
        tierType,
        reason,
        notes: notes.trim() || undefined
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload data
      await loadUserData();
      await loadAuditLogs();
      
      // Reset form
      setReason('');
      setNotes('');
      setError(null);
      
      if (onTierUpdate) {
        onTierUpdate(userId, tierType, newTier);
      }
    } catch (err) {
      setError('Failed to assign tier');
    }
  };

  const handleTierRevocation = async (tierType: 'vip' | 'loyalty') => {
    if (!reason.trim()) {
      setError('Please provide a reason for this tier revocation');
      return;
    }

    try {
      // This would make an API call to revoke the tier
      console.log(`Revoking ${tierType} tier from user ${userId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reload data
      await loadUserData();
      await loadAuditLogs();
      
      // Reset form
      setReason('');
      setNotes('');
      setError(null);
    } catch (err) {
      setError('Failed to revoke tier');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-600">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>User data not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Information
          </CardTitle>
          <CardDescription>Current tier status and user metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-lg font-semibold">{userData.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-lg">{userData.userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current VIP Tier</label>
                <div className="flex items-center gap-2">
                  {userData.currentVIPTier ? (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP {userData.currentVIPTier.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No VIP Tier</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Current Loyalty Tier</label>
                <div className="flex items-center gap-2">
                  {userData.currentLoyaltyTier ? (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                      <Star className="w-3 h-3 mr-1" />
                      {userData.currentLoyaltyTier.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge variant="outline">No Loyalty Tier</Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Total Spend</label>
                <p className="text-lg font-semibold text-green-600">€{userData.totalSpend.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Loyalty Points</label>
                <p className="text-lg font-semibold text-purple-600">{userData.loyaltyPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userData.totalSessions}</div>
              <div className="text-sm text-gray-600">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userData.subscriptionDuration}</div>
              <div className="text-sm text-gray-600">Months Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userData.referralCount}</div>
              <div className="text-sm text-gray-600">Referrals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Date(userData.lastActivity).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Last Activity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Tier Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            VIP Tier Management
          </CardTitle>
          <CardDescription>Assign or revoke VIP tiers for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current VIP Status
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {userData.vipValidation && (
                    <div>
                      {userData.vipValidation.requirementsMet ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">Requirements Met</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center text-orange-600">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="text-sm">Requirements Not Met</span>
                          </div>
                          {userData.vipValidation.missingRequirements.map((req, index) => (
                            <div key={index} className="text-xs text-gray-600 ml-6">
                              • {req}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign VIP Tier
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedVIPTier || ''}
                  onChange={(e) => setSelectedVIPTier(e.target.value as VIPTier)}
                >
                  <option value="">Select VIP Tier</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => selectedVIPTier && handleTierAssignment('vip', selectedVIPTier)}
                disabled={!selectedVIPTier || !reason}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Assign VIP Tier
              </Button>
              <Button
                onClick={() => handleTierRevocation('vip')}
                disabled={!userData.currentVIPTier || !reason}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Revoke VIP Tier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Tier Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Loyalty Tier Management
          </CardTitle>
          <CardDescription>Assign or revoke loyalty tiers for this user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Loyalty Status
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {userData.loyaltyValidation && (
                    <div>
                      {userData.loyaltyValidation.requirementsMet ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <span className="text-sm">Requirements Met</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center text-orange-600">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="text-sm">Requirements Not Met</span>
                          </div>
                          {userData.loyaltyValidation.missingRequirements.map((req, index) => (
                            <div key={index} className="text-xs text-gray-600 ml-6">
                              • {req}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Loyalty Tier
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedLoyaltyTier || ''}
                  onChange={(e) => setSelectedLoyaltyTier(e.target.value as LoyaltyTier)}
                >
                  <option value="">Select Loyalty Tier</option>
                  <option value="member">Member (Free)</option>
                  <option value="elite">Elite (Premium)</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => selectedLoyaltyTier && handleTierAssignment('loyalty', selectedLoyaltyTier)}
                disabled={!selectedLoyaltyTier || !reason}
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Assign Loyalty Tier
              </Button>
              <Button
                onClick={() => handleTierRevocation('loyalty')}
                disabled={!userData.currentLoyaltyTier || !reason}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Revoke Loyalty Tier
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Action Configuration
          </CardTitle>
          <CardDescription>Configure the tier assignment/revocation details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter the reason for this tier change..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={2}
                placeholder="Any additional notes or context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  min="1"
                  max="365"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setShowValidation(!showValidation)}
                  variant="outline"
                  className="w-full"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {showValidation ? 'Hide' : 'Show'} Validation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Recent tier changes and admin actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">
                    {log.action === 'tier_assigned' ? (
                      <Shield className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {log.action.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.tierType.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{log.reason}</p>
                    {log.notes && (
                      <p className="text-xs text-gray-500 mt-1">{log.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Admin Dashboard Component
export function TierAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Mock users data
  const mockUsers = [
    { id: 'user-1', name: 'John Doe', email: 'john@example.com', vipTier: 'silver', loyaltyTier: 'member' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', vipTier: 'gold', loyaltyTier: 'elite' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com', vipTier: null, loyaltyTier: 'member' },
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tier Management Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className={`cursor-pointer transition-colors ${
                  selectedUser === user.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {user.vipTier && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                          <Crown className="w-3 h-3 mr-1" />
                          {user.vipTier.toUpperCase()}
                        </Badge>
                      )}
                      {user.loyaltyTier && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                          <Star className="w-3 h-3 mr-1" />
                          {user.loyaltyTier.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tier Management</h2>
          {selectedUser ? (
            <TierManagementControls userId={selectedUser} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a user to manage their tiers</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}