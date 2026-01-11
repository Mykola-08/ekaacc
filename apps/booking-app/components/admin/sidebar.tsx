"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  Settings,
  AlertTriangle,
  Package,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Package,
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: CreditCard,
  },
  {
    title: "Community",
    href: "/admin/community", // Assuming we want to moderate the forum
    icon: MessageSquare,
  },
  {
    title: "Error Logs",
    href: "/admin/errors",
    icon: AlertTriangle,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebarContent({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight px-2">EKA STUDIO</h2>
      </div>
      <div className="space-y-1 px-4 flex-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            prefetch={true}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
      <div className="p-6 border-t mt-auto">
         <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                AD
            </div>
            <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@eka.com</p>
            </div>
         </div>
      </div>
    </div>
  )
}

export function AdminSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("w-64 border-r bg-card h-screen sticky top-0 hidden md:flex flex-col", className)}>
      <AdminSidebarContent />
    </div>
  )
}
