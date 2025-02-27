import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
import {TeamSwitcher} from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {NavApp} from "@/components/nav-app.tsx";
import {Calendar, Home, Inbox, Search, Settings} from "lucide-react"
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Thadosoft",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navApp: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    // {
    //   title: "Inbox",
    //   url: "#",
    //   icon: Inbox,
    // },
    // {
    //   title: "Calendar",
    //   url: "#",
    //   icon: Calendar,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: Search,
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings,
    // },
  ],
  navMain: [
    {
      title: "HRM(Office & Facility Management)",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Lịch làm việc",
          url: "#",
        },
        {
          title: "Lịch tính lương",
          url: "#",
        },
        {
          title: "Thông tin nhân viên",
          url: "#",
          items: [
            {
              title: "Khởi tạo",
              url: "#",
            },
            {
              title: "Tìm kiếm",
              url: "#",
            },
          ]
        },
        {
          title: "Hợp đồng lao động",
          url: "#",
          items: [
            {
              title: "Quy định công ty",
              url: "#",
            },
            {
              title: "Phụ lục hợp đồng lao động",
              url: "#",
            },
            {
              title: "Tìm kiếm HĐ / Phụ lục HĐLĐ",
              url: "#",
            },
          ]
        },
        {
          title: "Chấm công",
          url: "#",
          items: [
            {
              title: "Tạo bảng chấm công",
              url: "#",
            },
            {
              title: "Tìm bảng chấm công",
              url: "#",
            },
          ]
        },
      ],
    },
    {
      title: "Điều vận - Technical",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Quản lý dự án",
          url: "#",
        },
      ],
    },
    {
      title: "Điều phối - Coordination",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Hợp đồng bán hàng",
          url: "#",
        },
      ],
    },
    {
      title: "Manufacturing",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "BOM",
          url: "#",
          items: [
            {
              title: "Khởi tạo",
              url: "#",
            },
            {
              title: "Tìm kiếm",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      title: "Warehouse",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Report",
          url: "#",
        },
      ],
    },
    {
      title: "Reference Profile",
      url: "#",
      icon: Settings,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <TeamSwitcher teams={data.teams}/>
          </SidebarHeader>
          <SidebarContent>
            <NavApp items={data.navApp}/>
            <NavMain items={data.navMain}/>
            {/*<NavProjects projects={data.projects}/>*/}
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user}/>
          </SidebarFooter>
          <SidebarRail/>
        </Sidebar>
  )
}
