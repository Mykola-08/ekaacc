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
    <div className="flex flex-col h-full py-2">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight px-2 text-foreground">EKA STUDIO</h2>
      </div>
      <div className="space-y-2 px-4 flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all active:scale-95 duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground bg-transparent"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] stroke-[2.5px]", isActive ? "text-white" : "text-current")} />
              {item.title}
            </Link>
          )
        })}
      </div>
      <div className="p-6 border-t border-border/50 mt-auto">
         <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                AD
            </div>
            <div>
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@eka.com</p>
            </div>
         </div>
      </div>
    </div>
  )
}

export function AdminSidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("w-64 bg-sidebar rounded-[36px] ml-4 my-4 hidden md:flex flex-col border border-border shadow-sm", className)}>
      <AdminSidebarContent />
    </aside>
  )
}
