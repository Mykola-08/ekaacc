'use client';

import { useEffect, useState } from 'react';
import { listUsers, updateUserRole } from '@/app/actions/admin-users';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { SYSTEM_ROLES } from '@/lib/platform/config/role-permissions';
import { toast } from 'sonner';

export default function AdminUsersPage() {
 const [users, setUsers] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  loadUsers();
 }, []);

 const loadUsers = async () => {
  setLoading(true);
  const result = await listUsers();
  if (result.success && result.data) {
   setUsers(result.data);
  } else {
   toast.error('Failed to load users: ' + result.error);
  }
  setLoading(false);
 };

 const handleRoleChange = async (userId: string, newRole: string) => {
  const result = await updateUserRole(userId, newRole);
  if (result.success) {
   toast.success('User role updated');
   loadUsers(); // Refresh list
  } else {
   toast.error('Failed to update role: ' + result.error);
  }
 };

 if (loading) return <div>Loading users...</div>;

 return (
  <div className="space-y-6">
   <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold">User Management</h2>
    <Button onClick={loadUsers}>Refresh</Button>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>All Users</CardTitle>
    </CardHeader>
    <CardContent>
     <Table>
      <TableHeader>
       <TableRow>
        <TableHead>Email</TableHead>
        <TableHead>ID</TableHead>
        <TableHead>Current Role</TableHead>
        <TableHead>Actions</TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {users.map((user) => (
        <TableRow key={user.id}>
         <TableCell>{user.email}</TableCell>
         <TableCell className="font-mono text-xs">{user.id}</TableCell>
         <TableCell>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
           {user.user_metadata?.role || 'User'}
          </span>
         </TableCell>
         <TableCell>
          <Select 
           defaultValue={user.user_metadata?.role} 
           onValueChange={(val) => handleRoleChange(user.id, val)}
          >
           <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
           </SelectTrigger>
           <SelectContent>
            {Object.keys(SYSTEM_ROLES).map((role) => (
             <SelectItem key={role} value={role}>
              {role}
             </SelectItem>
            ))}
           </SelectContent>
          </Select>
         </TableCell>
        </TableRow>
       ))}
      </TableBody>
     </Table>
    </CardContent>
   </Card>
  </div>
 );
}
