import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PieChart, DonutChart } from "@/components/charts"


function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrProjectPageer:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Báo cáo tổng quan</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="">
            <div className="pb-6">
              <img src="src/assets/imgs/bg.png" alt="" />
            </div>
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Zone Monitoring */}
                <Card className="border shadow-sm p-4">
                  <div className="mb-2">
                    <h2 className="text-base font-medium">Tổng quan cảnh báo từng khu vực</h2>
                    <p className="text-xs text-gray-500">14/5m - Ngày 7 ngày qua</p>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Khu vực chính</span>
                        <span>1000</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "52.4%" }}></div>
                        </div>
                        <span className="ml-2 text-xs">52.4%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Khu vực nhà xe kho bãi</span>
                        <span>1000</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "16.6%" }}></div>
                        </div>
                        <span className="ml-2 text-xs">16.6%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Khu vực nghỉ ngơi, giải trí</span>
                        <span>1000</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "17.2%" }}></div>
                        </div>
                        <span className="ml-2 text-xs">17.2%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Khu vực công</span>
                        <span>1000</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "14.6%" }}></div>
                        </div>
                        <span className="ml-2 text-xs">14.6%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Personnel Chart */}
                <Card className="border shadow-sm p-4">
                  <div className="mb-2">
                    <h2 className="text-base font-medium">Tổng Sản Lượng Nhân Diện Được</h2>
                    <p className="text-xs text-gray-500">14/5m - Ngày 7 ngày qua</p>
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-3xl font-bold">167</div>
                    <div className="text-xs text-gray-500">Tổng Số Người</div>
                  </div>
                  <div className="h-[180px] mt-2">
                    <PieChart />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                      <span>Phù hợp: 53</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                      <span>Không có bạt: 30</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                      <span>Rách bạt: 23</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                      <span>Khác: 1</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Recent Activity */}
                <Card className="border shadow-sm p-4">
                  <div className="mb-2">
                    <h2 className="text-base font-medium">Hoạt Động Gần Đây</h2>
                  </div>
                  {/* <ActivityLog /> */}
                </Card>

                {/* Import/Export Chart */}
                <Card className="border shadow-sm p-4">
                  <div className="mb-2">
                    <h2 className="text-base font-medium">Nhân viên xuất xắc nhất công ty</h2>
                  </div>
                  <div className="h-[180px] mt-2">
                    <DonutChart />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span>Vật gửi cho: 70</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                      <span>Chưa đạt yêu cầu: 30</span>
                    </div>
                  </div>
                </Card>

                {/* Cameras */}
                <Card className="border shadow-sm p-4">
                  <div className="mb-2">
                    <h2 className="text-base font-medium">Nhân viên đi trễ công ty</h2>
                    <p className="text-xs text-gray-500">Tổng quan hình ảnh điện</p>
                  </div>
                  <div className="mt-2">
                    
                  </div>
                </Card>
              </div>

              {/* Event Statistics */}
              <Card className="border shadow-sm p-4 mb-4">
                <div className="mb-2 flex justify-between items-center">
                  <h2 className="text-base font-medium">Thống Kê Sự Kiện</h2>
                  <Button variant="destructive" size="sm" className="text-xs">
                    Delete Selected
                  </Button>
                </div>
                <div className="overflow-x-auto">
                 
                </div>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default DashboardPage;