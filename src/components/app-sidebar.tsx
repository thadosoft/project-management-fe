import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Warehouse,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavApp } from "@/components/nav-app.tsx";
import { Home } from "lucide-react"
import { CgProfile } from "react-icons/cg";

import { MdOutlinePrecisionManufacturing } from "react-icons/md";
import { GiConcentrationOrb } from "react-icons/gi";
import { SiAudiotechnica } from "react-icons/si";
import { PiFinnTheHuman } from "react-icons/pi";

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
      icon: PiFinnTheHuman,
      isActive: true,
      items: [
        {
          title: "Lịch làm việc",
          url: "#",
        },
        // {
        //   title: "Lịch tính lương",
        //   url: "#",
        // },
        {
          title: "Thông tin nhân viên",
          url: "#",
          items: [
            {
              title: "Khởi tạo",
              url: "/create-employee",
            },
            {
              title: "Tìm kiếm",
              url: "/search-employee",
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
      icon: SiAudiotechnica,
      items: [
        {
          title: "Quản lý dự án",
          url: "/project",
        },
      ],
    },
    {
      title: "Điều phối - Coordination",
      url: "#",
      icon: GiConcentrationOrb,
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
      icon: MdOutlinePrecisionManufacturing,
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
      icon: Warehouse,
      items: [
        {
          title: "Report",
          url: "#",
        },
      ],
    },
    {
      title: "Reference Profile",
      url: "/profile",
      icon: CgProfile,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavApp items={data.navApp} />
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects}/>*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
