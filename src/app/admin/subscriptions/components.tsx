'use client';

;
;
;
;
;
;
;
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dropdown, DropdownAction, DropdownContent, DropdownItem, Input, Select, SelectContent, SelectItem, SelectValue, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/keep';
import { SelectTrigger } from '@/components/ui/select';
import { SubscriptionBadge } from '@/components/eka/subscription-badge';
import type { Subscription, SubscriptionType } from '@/lib/subscription-types';
import { Search, Filter, Download, MoreVertical, UserPlus, UserMinus, Shield, Users, Crown, Star, TrendingUp } from 'lucide-react';

interface UserSubscriptionData {
    userId: string;
    userName: string;
    userEmail: string;
    subscriptions: Subscription[];
    totalSpent: number;
    joinedDate: Date;
}

// --- Reusable Components ---

export function StatCard({ title, value, icon: Icon, iconClass }: { title: string, value: string, icon: React.ElementType, iconClass?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-muted-foreground ${iconClass}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export function SubscriptionFilters({
    searchQuery,
    onSearchChange,
    filterType,
    onFilterChange,
    onExport
}: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterType: string;
    onFilterChange: (value: string) => void;
    onExport: () => void;
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={onFilterChange}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subscriptions</SelectItem>
                                <SelectItem value="loyalty">Loyal Only</SelectItem>
                                <SelectItem value="vip">VIP Only</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={onExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function SubscriptionsTable({
    users,
    onAction
}: {
    users: UserSubscriptionData[];
    onAction: (user: UserSubscriptionData, action: 'grant' | 'revoke' | 'view') => void;
}) {
    const getActiveSubscription = (user: UserSubscriptionData, type: SubscriptionType) => {
        return user.subscriptions.find(s => s.type === type && s.status === 'active');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Subscriptions</CardTitle>
                <CardDescription>A list of all users and their subscription status.</CardDescription>
            </CardHeader>
            <CardContent>
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
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const loyalSub = getActiveSubscription(user, 'loyalty');
                                    const vipSub = getActiveSubscription(user, 'vip');
                                    return (
                                        <TableRow key={user.userId}>
                                            <TableCell>
                                                <div className="font-medium">{user.userName}</div>
                                                <div className="text-sm text-muted-foreground">{user.userEmail}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {loyalSub && <SubscriptionBadge type="loyalty" size="sm" />}
                                                    {vipSub && <SubscriptionBadge type="vip" size="sm" />}
                                                    {!loyalSub && !vipSub && <Badge variant="border" className="text-muted-foreground">None</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>€{user.totalSpent.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(user.joinedDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Dropdown>
                                                    <DropdownAction asChild>
                                                        <Button variant="outline" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownAction>
                                                    <DropdownContent align="end">
                                                        <DropdownItem onClick={() => onAction(user, 'grant')}>
                                                            <UserPlus className="mr-2 h-4 w-4" /> Grant
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => onAction(user, 'revoke')} disabled={!loyalSub && !vipSub}>
                                                            <UserMinus className="mr-2 h-4 w-4" /> Revoke
                                                        </DropdownItem>
                                                        <div className="my-1 h-px bg-muted" />
                                                        <DropdownItem onClick={() => onAction(user, 'view')}>
                                                            <Shield className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownItem>
                                                    </DropdownContent>
                                                </Dropdown>
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
    );
}

export function SubscriptionsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <Skeleton className="h-24" />
            <Skeleton className="h-96" />
        </div>
    );
}

export const STATS_CONFIG = [
    { title: 'Total Users', key: 'totalUsers', icon: Users },
    { title: 'Loyal Members', key: 'loyalMembers', icon: Star, iconClass: 'text-amber-500' },
    { title: 'VIP Members', key: 'vipMembers', icon: Crown, iconClass: 'text-purple-500' },
    { title: 'Total Revenue', key: 'totalRevenue', icon: TrendingUp, iconClass: 'text-green-500' },
];
