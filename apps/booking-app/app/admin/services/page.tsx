import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { getAdminServices, AdminService } from "@/server/admin/actions"
import { ColumnDef } from "@tanstack/react-table"

export const dynamic = "force-dynamic"

const columns: ColumnDef<AdminService>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded text-xs ${row.getValue("active") ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
        {row.getValue("active") ? "Active" : "Inactive"}
      </span>
    )
  },
  {
    accessorKey: "isPublic",
    header: "Visibility",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue("isPublic") ? "Public" : "Hidden"}</span>
    )
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = (row.getValue("tags") as string[]) || []
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="text-[10px] bg-secondary px-1 py-0.5 rounded text-secondary-foreground uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )
    }
  },
  {
      id: "actions",
      cell: ({ row }) => {
          return (
              <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/services/${row.original.id}`}>Edit</Link>
              </Button>
          )
      }
  }
]

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Check permission
  const { data: hasPermission } = await supabase.rpc('has_permission', { 
    check_user_id: user.id, 
    check_perm_key: 'manage_services' 
  });
  const isAdmin = user.user_metadata?.role === 'Admin';

  if (!hasPermission && !isAdmin) {
    return <div className="p-8 text-red-500">Unauthorized: You do not have permission to manage services.</div>;
  }

  // Fetch services via server action (direct DB which is faster/easier for admin columns)
  const data = await getAdminServices()

  return (
    <div className="h-full flex-1 flex-col space-y-6 md:space-y-8 p-4 md:p-8 md:flex">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-2 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
             Catalog of services available for booking.
          </p>
        </div>
        <Button asChild>
            <Link href="/admin/services/new">Create Service</Link>
        </Button>
      </div>
       <DataTable 
        data={data} 
        columns={columns} 
        searchKey="name"
      />
    </div>
  )
}
