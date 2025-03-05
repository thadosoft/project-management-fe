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
      url: "/",
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
        // {
        //   title: "Lịch làm việc",
        //   url: "#",
        // },
        // {
        //   title: "Lịch tính lương",
        //   url: "#",
        // },
        {
          title: "Thông tin nhân viên",
          url: "#",
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
        // {
        //   title: "Hợp đồng lao động",
        //   url: "#",
        //   items: [
        //     {
        //       title: "Quy định công ty",
        //       url: "#",
        //     },
        //     {
        //       title: "Phụ lục hợp đồng lao động",
        //       url: "#",
        //     },
        //     {
        //       title: "Tìm kiếm HĐ / Phụ lục HĐLĐ",
        //       url: "#",
        //     },
        //   ]
        // },
        // {
        //   title: "Chấm công",
        //   url: "#",
        //   items: [
        //     {
        //       title: "Tạo bảng chấm công",
        //       url: "#",
        //     },
        //     {
        //       title: "Tìm bảng chấm công",
        //       url: "#",
        //     },
        //   ]
        // },
      ],
    },
    {
      title: "Điều vận",
      icon: SiAudiotechnica,
      url: "#",
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
      items: [
        {
          title: "Quản lý loại vật tư",
          icon: SiAudiotechnica,
          url: "",
          items: [
            {
              title: "Thêm loại vật tư",
              url: "/create-material-categories",
            },
            {
              title: "Tìm kiếm loại vật tư",
              url: "/search-material-categories",
            },
          ],
        },
        {
          title: "Quản lý vật tư",
          icon: SiAudiotechnica,
          url: "",
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
