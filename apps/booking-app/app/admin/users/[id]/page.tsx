import { getAdminUserById } from "@/server/admin/user-actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { UserEditForm } from "./user-edit-form"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, History, KeyRound, ShieldAlert } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAdminUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.fullName || "Unnamed User"}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">{user.email}</span>
            <Badge variant="outline">{user.role}</Badge>
            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update the user's personal details and role permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UserEditForm user={user} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Booking History</CardTitle>
                    <CardDescription>View past and upcoming bookings for this user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/50 rounded-md p-8 text-center text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-3 opacity-50" />
                        <p>No booking history available yet.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Perform administrative tasks.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button variant="outline" className="justify-start">
                        <KeyRound className="mr-2 h-4 w-4" />
                        Send Password Reset
                    </Button>
                    <Button variant="outline" className="justify-start text-destructive hover:bg-destructive/10">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Ban User
                    </Button>
                    
                    <Separator className="my-2" />
                    
                    <div className="text-xs text-muted-foreground space-y-2">
                        <div className="flex justify-between">
                            <span>User ID</span>
                            <span className="font-mono">{user.id.substring(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Created At</span>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Last Login</span>
                            <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="bg-primary/10 p-2 rounded-full h-fit">
                                <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Account Created</p>
                                <p className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        {/* More items would go here */}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
