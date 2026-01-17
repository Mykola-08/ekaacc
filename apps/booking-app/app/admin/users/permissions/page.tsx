import { createClient } from '@/lib/supabase/server';
import { PermissionManager } from "@/components/admin/users/PermissionManager";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { redirect } from "next/navigation";
import { getAllUserPermissions } from "@/lib/permissions";

interface PageProps {
    params: {
        id: string;
    }
}

export default async function UserPermissionsPage({ params }: PageProps) {
    const supabase = await createClient();

    // Check Admin Access
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser || currentUser.user_metadata.role !== 'admin') {
        redirect('/');
    }

    // Fetch Target User
    const { data: targetUserResponse, error } = await supabase.auth.admin.getUserById(params.id);
    const targetUser = targetUserResponse?.user;

    if (!targetUser || error) {
        return <div>User not found</div>;
    }

    // Fetch Permissions
    // Note: getAllUserPermissions helper returns objects with { ...permission, hasAccess, source }
    // We need to map `id` correctly if the helper returns it differently, but it likely returns permission table ID as ID.
    const permissions = await getAllUserPermissions(params.id);
    const safePermissions = permissions.map(p => ({
        id: p.id,
        code: p.code,
        description: p.description,
        hasAccess: p.hasAccess,
        source: p.source as 'role' | 'override' | 'none'
    }));

    return (
        <DashboardLayout profile={currentUser.user_metadata}>
            <PermissionManager
                userId={targetUser.id}
                userName={targetUser.user_metadata?.full_name || targetUser.email || 'Unknown User'}
                initialPermissions={safePermissions}
            />
        </DashboardLayout>
    );
}
