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
      title: "Home",
      url: "/home",
      icon: Home,
    },
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
          title: "Lịch tính lương",
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
          url: "/search-bom",
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
              title: "Nhập/Xuất kho",
              url: "/warehouse-entry",
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
  const userRole = localStorage.getItem("role") || "USER";
  console.log("User role in AppSidebar:", userRole);

  const rolePermissions: { [key: string]: string[] } = {
    TECHNICAL: ["Kho công ty", "Hồ sơ tham khảo"],
    INVENTORY: ["Kho công ty"],
    USER: ["Hồ sơ tham khảo"], 
    OFM: ["HRM(Office & Facility Management)", "Thông tin nhân viên", "Kinh doanh", "Hồ sơ tham khảo"], 
    SALE: ["Kinh doanh", "Hồ sơ tham khảo"],
    PM: ["Điều vận", "Hồ sơ tham khảo"]
  };

  const allowedMenus = rolePermissions[userRole.toUpperCase()] || [];

  const filteredNavMain = data.navMain.filter((item) => {
    if (allowedMenus.length > 0) {
      return allowedMenus.includes(item.title);
    }
    return true;//trả về tất cả danh mục
  });


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavApp items={data.navApp} />
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
