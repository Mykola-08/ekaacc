import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { getAdminBookings } from "@/server/admin/actions"
import { Booking } from "@/types/booking"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

// Standardize formatting
const formatCurrency = (amountCents: number, currency: string) => {
 return new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: currency,
 }).format(amountCents / 100)
}

const columns: ColumnDef<Booking>[] = [
 {
  accessorKey: "status",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
  cell: ({ row }) => {
   const status = row.getValue("status") as string
   return (
    <span className={`capitalize px-2 py-1 rounded text-xs font-medium border ${
     status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
     status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
     status === 'canceled' ? 'bg-red-50 text-red-700 border-red-200' :
     'bg-gray-50 text-gray-700 border-gray-200'
    }`}>
     {status}
    </span>
   )
  },
 },
 {
  accessorKey: "serviceName",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
 },
 {
  accessorKey: "displayName",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  cell: ({ row }) => {
    const name = row.getValue("displayName") as string
    const email = row.original.email
    return (
     <div className="flex flex-col">
      <span className="font-medium">{name || 'Guest'}</span>
      <span className="text-xs text-muted-foreground">{email}</span>
     </div>
    )
  }
 },
 {
  accessorKey: "startTime",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  cell: ({ row }) => {
   const date = new Date(row.getValue("startTime"))
   return (
    <div className="flex flex-col">
      <span>{format(date, "MMM d, yyyy")}</span>
      <span className="text-xs text-muted-foreground">{format(date, "h:mm a")}</span>
    </div>
   )
  },
 },
 {
  accessorKey: "basePriceCents",
  header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
  cell: ({ row }) => {
   const amount = parseFloat(row.getValue("basePriceCents"))
   return <div className="font-medium">{formatCurrency(amount, row.original.currency)}</div>
  },
 },
 {
   accessorKey: "paymentStatus",
   header: "Payment",
   cell: ({ row }) => (
     <span className="text-xs uppercase text-muted-foreground">{row.getValue("paymentStatus")}</span>
   )
 }
]

export default async function AdminBookingsPage() {
 const data = await getAdminBookings()

 return (
  <div className="h-full flex-1 flex-col space-y-6 md:space-y-8 p-4 md:p-8 md:flex">
   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-2 md:space-y-0">
    <div>
     <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
     <p className="text-muted-foreground">
      Manage upcoming and past appointments.
     </p>
    </div>
   </div>
   <DataTable 
    data={data} 
    columns={columns} 
    searchKey="displayName"
   />
  </div>
 )
}
