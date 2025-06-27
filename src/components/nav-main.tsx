"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | IconType;
  isActive?: boolean;
  items?: NavItem[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    const stored = localStorage.getItem("sidebar-open-items");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleItem = (title: string) => {
    setOpenItems((prev) => {
      const newState = prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title];
      localStorage.setItem("sidebar-open-items", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            openItems={openItems}
            toggleItem={toggleItem}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavItemComponent({
  item,
  openItems,
  toggleItem,
}: {
  item: NavItem;
  openItems: string[];
  toggleItem: (title: string) => void;
}) {
  const isOpen = openItems.includes(item.title);
  const location = useLocation();
  const isActive = location.pathname === item.url;

  const ref = useRef<HTMLLIElement>(null);

  // Auto scroll when item is active
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive]);

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={() => toggleItem(item.title)}
      className="group/collapsible"
    >
      <SidebarMenuItem ref={ref}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={cn(
    isActive && "bg-accent text-accent-foreground font-semibold shadow-sm"
  )}
          >
            {item.icon && <item.icon />}
            <Link to={item.url}>
              <span>{item.title}</span>
            </Link>
            {item.items && (
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {item.items && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) =>
                subItem.items ? (
                  <NavItemComponent
                    key={subItem.title}
                    item={subItem}
                    openItems={openItems}
                    toggleItem={toggleItem}
                  />
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
  );
}
