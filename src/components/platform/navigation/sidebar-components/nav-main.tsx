"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/platform/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/platform/ui/sidebar"

type HugeiconGlyph = any

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: HugeiconGlyph
    isActive?: boolean
    items?: {
      title: string
      url: string
      icon?: HugeiconGlyph
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-bold uppercase tracking-widest text-[10px] opacity-50 px-4">Platform</SidebarGroupLabel>
      <SidebarMenu className="px-2 gap-1">
        {items.map((item) => (
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={cn(
                      "h-11 rounded-2xl transition-all font-semibold",
                      item.isActive ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-secondary"
                    )}
                  >
                    {item.icon && <HugeiconsIcon icon={item.icon} className="h-5 w-5" strokeWidth={2.5} />}
                    <span>{item.title}</span>
                    <HugeiconsIcon 
                      icon={ArrowRight01Icon} 
                      className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" 
                      strokeWidth={2.5}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-4 border-l border-border/50 pl-4 py-2 gap-1">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild className="h-9 rounded-xl font-medium">
                          <a href={subItem.url}>
                            {subItem.icon && <HugeiconsIcon icon={subItem.icon} className="h-4 w-4" strokeWidth={2.5} />}
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title} 
                isActive={item.isActive}
                className={cn(
                  "h-11 rounded-2xl transition-all font-semibold",
                  item.isActive ? "bg-primary/10 text-primary shadow-sm" : "hover:bg-secondary"
                )}
              >
                <a href={item.url}>
                  {item.icon && <HugeiconsIcon icon={item.icon} className="h-5 w-5" strokeWidth={2.5} />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
