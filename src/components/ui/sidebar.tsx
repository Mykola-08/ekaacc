
"use client"

import * as React from "react"
import { PanelLeft, PanelLeftClose } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from 'framer-motion'
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

// --- Client-Side State Wrapper ---
function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(true)

  // On mount, safely read the cookie and update the state on the client.
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
      <div
        style={{}}
        className="group/sidebar-wrapper"
        data-state={dataState}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}


// --- Provider Component ---
export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <TooltipProvider delayDuration={0}>
        <div ref={ref} {...props}>
            <SidebarWrapper>
                {children}
            </SidebarWrapper>
        </div>
    </TooltipProvider>
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

  // Desktop: Docked sidebar with smooth width animation
  return (
    <motion.div
      ref={ref as any}
      initial={false}
      animate={{ width: isExpanded ? 'var(--sidebar-w)' : 'var(--sidebar-w-collapsed)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 h-screen flex flex-col bg-background border-r overflow-hidden shadow-sm",
        side === 'left' ? 'left-0 z-30' : 'right-0 border-l z-30',
        className
      )}
      data-state={dataState}
      {...(props as any)}
    >
      {children}
    </motion.div>
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
          variant="outline"
          size="sm"
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
  React.ComponentProps<"div"> & { isCollapsed?: boolean }
>(({ className, isCollapsed, ...props }, ref) => (
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
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
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
    className={cn("group/menu-item relative list-none", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"
