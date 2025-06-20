import * as React from "react"
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
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
import { useEffect, useRef } from "react";

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
  ],
  navApp: [
    {
      title: "Trang chủ",
      url: "/home",
      icon: Home,
    },
  ],
  navMain: [
    {
      title: "Hành chính nhân sự",
      url: "#",
      icon: PiFinnTheHuman,
      isActive: true,
      items: [
        {
          title: "Bảng chấm công",
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
    {
      title: "Kinh doanh",
      icon: SiAudiotechnica,
      url: "#",
      isActive: true,
      items: [
        {
          title: "Quản lý khách hàng",
          url: "#",
        },
        {
          title: "Quản lý đối tác - cung cấp",
          url: "#",
        },
        {
          title: "Tạo phiếu báo giá",
          url: "/create-bom",
        },
        {
          title: "Tìm kiếm báo giá",
          url: "/search-bom",
        },
        {
          title: "Thông tin phòng kinh doanh",
          url: "#",
        },
      ],
    },
    {
      title: "Khối kỹ thuật",
      icon: SiAudiotechnica,
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
      icon: SiAudiotechnica,
      url: "#",
      isActive: true,
      items: [
        {
          title: "Quản lý vật tư",
          icon: SiAudiotechnica,
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
          icon: SiAudiotechnica,
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
      title: "Hồ sơ lưu trữ",
      url: "/profile",
      icon: CgProfile,
    },
    {
      title: "Nhật ký hoạt động",
      url: "/audit-log",
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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // const userRole = localStorage.getItem("role") || "USER";

  // const rolePermissions: { [key: string]: string[] } = {
  //   TECHNICAL: ["Kho công ty", "Hồ sơ lưu trữ"],
  //   INVENTORY: ["Kho công ty"],
  //   USER: ["Hồ sơ lưu trữ"],
  //   OFM: ["Hành chính nhân sự", "Thông tin nhân viên", "Kinh doanh", "Hồ sơ lưu trữ"],
  //   SALE: ["Kinh doanh", "Hồ sơ lưu trữ"],
  //   PM: ["Khối kỹ thuật", "Hồ sơ lưu trữ"]
  // };

  // const allowedMenus = rolePermissions[userRole.toUpperCase()] || [];

  // const filteredNavMain = data.navMain.filter((item) => {
  //   if (allowedMenus.length > 0) {
  //     return allowedMenus.includes(item.title);
  //   }
  //   return true;
  // });


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-scroll">
        <NavApp items={data.navApp} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
