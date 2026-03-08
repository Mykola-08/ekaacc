import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PermissionMatrixClient } from './permission-matrix';

export default async function PermissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const role = user.app_metadata?.role?.toLowerCase();
  if (role !== 'admin' && role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch all role permissions and users for the matrix
  const [permissionsRes, usersRes] = await Promise.all([
    supabase
      .from('role_permissions')
      .select('*')
      .order('role')
      .order('permission_group')
      .order('action'),
    supabase
      .from('profiles')
      .select('auth_id, full_name, email, role')
      .order('full_name')
      .limit(200),
  ]);

  const rolePermissions = permissionsRes.data || [];
  const users = usersRes.data || [];

  // Derive available roles, groups, actions from DB
  const roles = [...new Set(rolePermissions.map((r: any) => r.role))].sort();
  const groups = [...new Set(rolePermissions.map((r: any) => r.permission_group))].sort();
  const actions = [...new Set(rolePermissions.map((r: any) => r.action))].sort();

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Manage role-based permissions and user overrides.
        </p>
      </div>

      <PermissionMatrixClient
        rolePermissions={rolePermissions}
        roles={roles}
        groups={groups}
        actions={actions}
        users={users}
      />
    </div>
  );
}
