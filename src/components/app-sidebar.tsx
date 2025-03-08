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

import { SiAudiotechnica } from "react-icons/si";
import { PiFinnTheHuman } from "react-icons/pi";

const data = {
  user: {
    name: "Trung Dũng",
    email: "dung.nt@thadosoft.com",
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
      url: "/home",
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
          title: "Bảng chấm công",
          url: "/attendance-sheet",
        },
        {
          title: "Thông tin nhân viên",
          url: "#",
          isActive: true,
          items: [
            {
              title: "Khởi tạo người dùng",
              url: "/create-employee",
            },
            {
              title: "Tìm kiếm người dùng",
              url: "/search-employee",
            },
          ]
        },
      ],
    },
    {
      title: "Kinh doanh",
      icon: SiAudiotechnica,
      url: "#",
      isActive: true,
      items: [
        {
          title: "Phiếu báo giá",
          url: "/create-bom",
        },
        {
          title: "Tìm kiếm báo giá",
          url: "/project",
        },
      ],
    },
    {
      title: "Điều vận",
      icon: SiAudiotechnica,
      url: "#",
      isActive: true,
      items: [
        {
          title: "Quản lý dự án",
          url: "/project",
        },
      ],
    },
    {
      title: "Kỹ thuật",
      icon: SiAudiotechnica,
      url: "",
      isActive: true,
      items: [
        {
          title: "Quản lý loại vật tư",
          icon: SiAudiotechnica,
          url: "/create-material-categories",
          // items: [
          //   {
          //     title: "Thêm loại vật tư",
          //     url: "/create-material-categories",
          //   },
          //   {
          //     title: "Tìm kiếm loại vật tư",
          //     url: "/search-material-categories",
          //   },
          // ],
        },
        {
          title: "Quản lý vật tư",
          icon: SiAudiotechnica,
          url: "",
          isActive: true,
          items: [
            {
              title: "Thêm vật tư",
              url: "/create-material",
            },
            {
              title: "Tìm kiếm vật tư",
              url: "/search-material",
            },
          ],
        },
      ],
    },
    // {
    //   title: "Điều phối - Coordination",
    //   url: "#",
    //   icon: GiConcentrationOrb,
    //   items: [
    //     {
    //       title: "Hợp đồng bán hàng",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Manufacturing",
    //   url: "#",
    //   icon: MdOutlinePrecisionManufacturing,
    //   items: [
    //     {
    //       title: "BOM",
    //       url: "#",
    //       items: [
    //         {
    //           title: "Khởi tạo",
    //           url: "#",
    //         },
    //         {
    //           title: "Tìm kiếm",
    //           url: "#",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: "Warehouse",
    //   url: "#",
    //   icon: Warehouse,
    //   items: [
    //     {
    //       title: "Report",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Hồ sơ tham khảo",
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
