import { getAdminUsers } from "@/server/admin/user-actions"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your platform users and their permissions.</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>A list of all users currently registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  )
}
