'use client';

;
;
;
;
;
;
;
;
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Eye, Clock, Euro, Filter, Search } from 'lucide-react';
import type { PaymentRequest, PaymentStatus, PaymentMethod } from '@/lib/wallet-types';

// --- Reusable Components ---

export function StatCard({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

export function PaymentsFilter({
    statusFilter, onStatusChange,
    methodFilter, onMethodChange,
    searchQuery, onSearchChange
}: {
    statusFilter: string; onStatusChange: (value: string) => void;
    methodFilter: string; onMethodChange: (value: string) => void;
    searchQuery: string; onSearchChange: (value: string) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={statusFilter} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select value={methodFilter} onValueChange={onMethodChange}>
                            <SelectTrigger>
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="bizum">Bizum</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Search</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, etc."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const getStatusBadge = (status: PaymentStatus) => {
    const colors: Record<PaymentStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
        pending: 'warning',
        confirmed: 'success',
        rejected: 'error',
        cancelled: 'secondary',
        expired: 'secondary',
    };
    return <Badge color={colors[status]}>{status}</Badge>;
};

const getMethodBadge = (method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
        bizum: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cash: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        wallet: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return <Badge className={colors[method]}>{method}</Badge>;
};

export function PaymentsTable({
    payments,
    onViewProof,
    onConfirm,
    onReject
}: {
    payments: PaymentRequest[];
    onViewProof: (payment: PaymentRequest) => void;
    onConfirm: (payment: PaymentRequest) => void;
    onReject: (payment: PaymentRequest) => void;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Requests ({payments.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No payment requests found.</TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div className="font-medium">{payment.userName}</div>
                                            <div className="text-sm text-muted-foreground">{payment.userEmail}</div>
                                        </TableCell>
                                        <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>{getMethodBadge(payment.method)}</TableCell>
                                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell>{new Date(payment.createdAt as string).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                {payment.status === 'pending' ? (
                                                    <>
                                                        {(payment.proofImageUrl || payment.proofText) && (
                                                            <Button size="sm" variant="outline" onClick={() => onViewProof(payment)}><Eye className="h-4 w-4" /></Button>
                                                        )}
                                                        <Button size="sm" variant="default" onClick={() => onConfirm(payment)}><Check className="h-4 w-4" /></Button>
                                                        <Button size="sm" variant="outline" onClick={() => onReject(payment)}><X className="h-4 w-4" /></Button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        {payment.confirmedByName ? `By ${payment.confirmedByName}` : 'Processed'}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export function PaymentsPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <Skeleton className="h-40" />
            <Skeleton className="h-96" />
        </div>
    );
}
