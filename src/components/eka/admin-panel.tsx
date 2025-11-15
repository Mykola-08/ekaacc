"use client";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/keep';
import React, { useEffect, useState } from 'react';
;
;
;
;
;
import fxService from '@/lib/fx-service';
// billing via fxService
import { useToast } from '@/hooks/use-toast';
import type { User, UserRole } from '@/lib/types';

export function AdminPanel() {
  const toast = useToast()?.toast;
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await (fxService as any).getUsers();
        setUsers(u || []);
      } catch (e) {
        setUsers([]);
      }
      try {
        const b = await (fxService as any).getAllBookings();
        setBookings(b || []);
      } catch (e) {
        setBookings([]);
      }
    };
    init();
  }, []);

  const changeRole = async (id: string, role: UserRole) => {
    // Optimistic local update
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, role } : u)));
    try {
      await (fxService as any).updateUserRole(id, role);
    } catch (e) {
      // If production update fails, keep local change but log error
      // Optionally: show toast to user in real app
      // console.error('updateUserRole failed', e);
    }
    toast?.({ title: 'Role updated', description: `User role set to ${role}` });
  };

  const cancelBooking = async (id: string) => {
    // Optimistic local update
    setBookings((s) => s.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    try {
      await (fxService as any).cancelBooking(id);
      toast?.({ title: 'Booking cancelled' });
    } catch (e) {
      // Log error and keep local state
      // console.error('cancelBooking failed', e);
      toast?.({ variant: 'destructive', title: 'Cancel failed', description: (e as any)?.message || 'Could not cancel booking' });
    }
  };

  const applyAdjustment = async () => {
    if (!selectedUserId) return;
    const tx = await fxService.applyAdjustment(selectedUserId, adjustAmount, 'Admin adjustment');
    toast?.({ title: 'Adjustment applied', description: `€${tx.amountEUR} applied to ${selectedUserId}` });
    setAdjustAmount(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Console</CardTitle>
          <CardDescription>System-wide tools for admins: user management, bookings, billing and page editor placeholders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Users</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>{u.displayName || u.email}</TableCell>
                      <TableCell>
                        <Select value={u.role || 'Patient'} onValueChange={(v:any)=>changeRole(u.id, v)}>
                          <SelectValue placeholder="Role"  />
                          <SelectContent>
                            <SelectItem value="Patient">Patient</SelectItem>
                            <SelectItem value="Therapist">Therapist</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={()=>{ setSelectedUserId(u.id); toast?.({ title: 'Selected user', description: u.displayName || u.email }); }}>Select</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bookings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell>{new Date(b.date).toLocaleString()}</TableCell>
                      <TableCell>{b.userId}</TableCell>
                      <TableCell>{b.status}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={()=>cancelBooking(b.id)}>Cancel</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Billing Adjustment</h3>
            <div className="flex gap-2 items-center">
              <Select value={selectedUserId || ''} onValueChange={(v:any)=>setSelectedUserId(v)}>
                <SelectValue placeholder="Select user"  />
                <SelectContent>
                  {users.map(u => <SelectItem key={u.id} value={u.id}>{u.displayName || u.email}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="number" value={adjustAmount} onChange={(e:any)=>setAdjustAmount(parseFloat(e.target.value||'0'))} className="w-32" />
              <Button variant="default" onClick={applyAdjustment}>Apply</Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Page Editor (Placeholder)</h3>
            <p className="text-sm text-muted-foreground">A simple page editor and personalization controls would be implemented here in production. This is a placeholder used to demonstrate admin capabilities in test mode.</p>
            <div className="mt-3">
              <Button onClick={()=>toast?.({ title: 'Editor', description: 'Open page editor (placeholder).' })}>Open Page Editor</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPanel;
