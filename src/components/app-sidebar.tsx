import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  HistoryIcon,
  LucideWarehouse,
  Map,
  PieChart,
  Settings2Icon,
  Warehouse,
} from "lucide-react"
import { useLocation } from "react-router-dom";

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
import { useEffect, useRef } from "react";
import { ModeToggle } from "./mode-toggle"
import { BsDeviceHdd, BsPeople } from "react-icons/bs";
import { useSidebar } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "AITS",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navApp: [
    {
      title: "Tổng quan",
      url: "/home",
      icon: Home,
    },
  ],
  navMain: [
    {
      title: "Hành chính nhân sự",
      url: "#",
      icon: BsPeople,
      isActive: true,
      items: [
        {
          title: "Theo dõi chấm công",
          url: "/attendance-sheet",
        },
        {
          title: "Bảng tính lương",
          url: "#",
          isActive: true,
          items: [
            {
              title: "Tạo bảng chấm công tháng",
              url: "/create-attendance-sheet",
            },
            {
              title: "Tìm kiếm bảng chấm công",
              url: "/search-attendance-sheet",
            },
          ]
        },
        {
          title: "Thông tin nhân viên",
          url: "#",
          isActive: true,
          items: [
            {
              title: "Khởi tạo tài khoản",
              url: "/create-employee",
            },
            {
              title: "Tìm kiếm tài khoản",
              url: "/search-employee",
            },
          ]
        },
        {
          title: "Thông tin Hành chính & nhân sự",
          url: "#",
          isActive: true,
          // items: [
          //   {
          //     title: "Khởi tạo tài khoản",
          //     url: "/create-employee",
          //   },
          //   {
          //     title: "Tìm kiếm tài khoản",
          //     url: "/search-employee",
          //   },
          // ]
        },
        {
          title: "Nhân viên xuất sắc tháng",
          url: "/employee-of-month",
        },
      ],
    },
    // {
    //   title: "Kinh doanh",
    //   icon: SiAudiotechnica,
    //   url: "#",
    //   isActive: true,
    //   items: [
    //     {
    //       title: "Quản lý khách hàng",
    //       url: "#",
    //     },
    //     {
    //       title: "Quản lý đối tác - cung cấp",
    //       url: "#",
    //     },
    //     {
    //       title: "Tạo phiếu báo giá",
    //       url: "/create-bom",
    //     },
    //     {
    //       title: "Tìm kiếm báo giá",
    //       url: "/search-bom",
    //     },
    //     {
    //       title: "Thông tin phòng kinh doanh",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Khối kỹ thuật",
      icon: Settings2Icon,
      url: "/technical-dashboard",
      isActive: true,
      items: [
        {
          title: "Quản lý dự án",
          url: "/project",
        },
        {
          title: "Các sản phẩm đóng gói",
          url: "/project",
        }, {
          title: "Bảng trắng",
          url: "/white-boards",
        },
        {
          title: "Thông tin phòng kỹ thuật",
          url: "/project",
        },
      ],
    },

    {
      title: "Kho công ty",
      icon: Warehouse,
      url: "#",
      isActive: true,
      items: [
        {
          title: "Quản lý vật tư",
          icon: BsDeviceHdd,
          url: "",
          isActive: true,
          items: [
            {
              title: "Loại vật tư",
              icon: SiAudiotechnica,
              url: "/create-material-categories",
            },
            {
              title: "Vật tư",
              url: "/create-material",
            },
            {
              title: "Tìm kiếm vật tư",
              url: "/search-material",
            },
          ],
        },

        {
          title: "Quản lý kho",
          icon: LucideWarehouse,
          url: "",
          isActive: true,
          items: [
            {
              title: "Nhập kho",
              url: "/warehouse-entry",
            },
            {
              title: "Xuất kho",
              url: "/warehouse-outry",
            },
            {
              title: "Tìm kiếm nhập/xuất kho",
              url: "/search-warehouse",
            },
          ],
        },
        
      ],
    },

    {
          title: "Tủ sách AITS",
          icon: LucideWarehouse,
          url: "",
          isActive: true,
          items: [
            {
              title: "Thư viện",
              url: "/book",
            },
            {
              title: "Lịch sử thư viện",
              url: "/book-statistics",
            },
          ],
    },
    {
      title: "Hồ sơ lưu trữ",
      url: "/profile",
      icon: CgProfile,
    },
    {
      title: "Nhật ký hoạt động",
      url: "/audit-log",
      icon: HistoryIcon,
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
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const SCROLL_KEY = "sidebar-scroll-position"

  // lưu scroll position
  useEffect(() => {
    const ref = scrollRef.current
    if (!ref) return
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_KEY, String(ref.scrollTop))
    }
    ref.addEventListener("scroll", handleScroll)
    return () => ref.removeEventListener("scroll", handleScroll)
  }, [])

  // khôi phục scroll position
  useEffect(() => {
    const ref = scrollRef.current
    if (!ref) return
    const pos = Number(sessionStorage.getItem(SCROLL_KEY) || "0")
    setTimeout(() => {
      ref.scrollTop = pos
    }, 0)
  }, [location.pathname])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="sidebar-scroll" ref={scrollRef}>
        <NavApp items={data.navApp} />
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {!isCollapsed && (
          <div className="mt-4 flex flex-row items-center justify-center gap-3">
            <NavUser />
            <ModeToggle />
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
