"use client"

import {ChevronRight, type LucideIcon} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export function NavMain({items}: { items: NavItem[] }) {
  return (
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
              <NavItemComponent key={item.title} item={item}/>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
}

// Component đệ quy hiển thị menu con
function NavItemComponent({item}: { item: NavItem }) {
  return (
      <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon/>}
              <span>{item.title}</span>
              {item.items && (
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {item.items && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        {subItem.items ? (
                            <NavItemComponent item={subItem}/>
                        ) : (
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
  )
}
