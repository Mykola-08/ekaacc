import { getAdminUsers } from "@/server/admin/user-actions";
import { UsersList } from "@/components/admin/users/UsersList";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
 const users = await getAdminUsers();
 return <UsersList users={users} />;
}
