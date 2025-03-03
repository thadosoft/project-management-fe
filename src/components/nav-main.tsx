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
import {Link} from "react-router";
import {IconType} from "react-icons";

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon | IconType
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

function NavItemComponent({item}: { item: NavItem }) {
  return (
      <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon/>}
              <Link to={item.url}><span>{item.title}</span></Link>
              {item.items && (
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {item.items && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) =>
                      subItem.items ? (
                          <NavItemComponent key={subItem.title} item={subItem} />
                      ) : (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                      )
                  )}
                </SidebarMenuSub>
              </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
  )
}
