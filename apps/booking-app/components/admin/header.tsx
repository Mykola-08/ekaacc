"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebarContent } from "@/components/admin/sidebar"
import { Menu, Sun, Bell } from "lucide-react"
import { useState } from "react"

export function AdminHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
             {/* Pass onClick to close the sheet when a link is clicked */}
            <AdminSidebarContent onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
