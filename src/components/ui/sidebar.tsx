
"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, PanelLeftClose } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// --- Context Definition ---
type SidebarContextType = {
  isExpanded: boolean
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}


// --- Provider Component ---
export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // Default to expanded on server and initial client render to prevent hydration mismatch.
  const [isExpanded, setIsExpanded] = React.useState(true)

  // After mount, safely read the cookie and update the state.
  React.useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split('=')[1]
    
    if (cookieValue !== undefined) {
      setIsExpanded(cookieValue === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile(current => !current)
    } else {
      setIsExpanded(current => {
        const newState = !current
        // Set cookie to remember the user's preference
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        return newState
      })
    }
  }

  const contextValue = React.useMemo<SidebarContextType>(
    () => ({
      isExpanded,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [isExpanded, isMobile, openMobile]
  )
    
  const dataState = isExpanded ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          style={{ ...style } as React.CSSProperties}
          className={cn("group/sidebar-wrapper", className)}
          data-state={dataState}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
})
SidebarProvider.displayName = "SidebarProvider"


// --- Sidebar Component (The frame) ---
export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { side?: "left" | "right" }
>(({ side = "left", className, children, ...props }, ref) => {
  const { isMobile, isExpanded, openMobile, setOpenMobile } = useSidebar()
  const dataState = isExpanded ? "expanded" : "collapsed";

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          className="w-[var(--sidebar-w)] bg-background p-0 [&>button]:hidden"
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Docked sidebar
  return (
    <aside
      ref={ref}
      className={cn(
        "group fixed top-0 z-50 hidden h-full flex-col border-r bg-background/95 glass transition-all duration-300 ease-in-out md:flex",
        "w-[var(--sidebar-w-collapsed)] group-data-[state=expanded]:w-[var(--sidebar-w)]",
        side === 'left' ? 'left-0' : 'right-0 border-l',
        className
      )}
      data-state={dataState}
      {...props}
    >
      {children}
    </aside>
  )
})
Sidebar.displayName = "Sidebar"


// --- Trigger Component ---
export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, children, ...props }, ref) => {
  const { toggleSidebar, isExpanded } = useSidebar()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", className)}
          onClick={(event) => {
            onClick?.(event)
            toggleSidebar()
          }}
          {...props}
        >
          {children || (isExpanded ? <PanelLeftClose /> : <PanelLeft />)}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}</TooltipContent>
    </Tooltip>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


// --- Structural Components ---
export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1 px-2", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"
