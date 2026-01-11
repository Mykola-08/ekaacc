'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/business", label: "Corporate" },
    { href: "/pricing", label: "Plans" },
    { href: "/journal", label: "Journal" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">EKA BALANCE</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Trigger Placeholder - simple for now */}
        <div className="md:hidden flex items-center w-full">
            <Link href="/" className="font-bold flex-1">EKA</Link>
            {/* Mobile Nav could go here */}
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or items could go here */}
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild onClick={() => {}} className="hidden md:flex" variant="outline" size="sm">
               <Link href="/onboarding">Get Started</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/book/general">Book Now</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
