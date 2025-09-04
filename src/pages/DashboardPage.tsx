import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/charts"
import type { Dashboard } from "@/models/Dashboard"
import { useEffect, useState } from "react"
import { getDashboard } from "@/services/dashboardService"
import type { AuditLog } from "@/models/AuditLog"
import { get6LatestAuditLogs } from "@/services/auditLogService"
import type { LateStaft } from "@/models/Attendance"
import { get6LatestEmployeesAttendance } from "@/services/attendanceService"
import type { EmployeeOfMonth } from "@/models/EmployeeOfMonth"
import { searchEmployeeOfMonth } from "@/services/employeeOfMonthService"
import tokenService from "@/services/tokenService"
import { OrgChart, type OrgNode } from "@/components/ui/OrgChart"
import orgChartData from "@/data/orgChartData.json"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getProjects, createProject } from "@/services/projectService"
import type { Project, ProjectRequest } from "@/models/Project"
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<Dashboard[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const COLORS = [
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
  ]
  const [lateStaff, setLateStaff] = useState<LateStaft[]>([])
  const [excellentStaffs, setExcellentStaffs] = useState<EmployeeOfMonth[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])


  // Company images
  const companyImages = [
    {
      url: "https://thadosoft.com/thumbs/757x475x1/upload/photo/chinh-dien-le-tan-6427.png",
      title: "Văn phòng công ty",
      description: "Không gian làm việc hiện đại",
    },
    {
      url: "https://thadosoft.com/thumbs/757x475x1/upload/photo/thiet-ke-aits-6841.png",
      title: "Logo công ty",
      description: "Thương hiệu ThadoSoft",
    },
    {
      url: "https://thadosoft.com/upload/filemanager/AITSOLUTION%20%281%29.png",
      title: "AI Solution",
      description: "Giải pháp công nghệ AI",
    },
    {
      url: "https://thadosoft.com/upload/filemanager/z6024646018758_1927426de409fde80a46ed1e796fd91e.jpg",
      title: "Đội ngũ phát triển",
      description: "Team công nghệ chuyên nghiệp",
    },
  ]

  const fetchDashboard = async () => {
    const data = await getDashboard()
    if (data) setDashboardData(data)
  }

  const fetchLogs = async () => {
    const logs = await get6LatestAuditLogs()
    if (logs) setAuditLogs(logs)
  }

  const fetchLateStaff = async () => {
    const data = await get6LatestEmployeesAttendance()
    if (data) {
      // Bỏ phần xử lý hình ảnh closeup
      setLateStaff(data)
    }
  }

  const fetchTopEmployees = async () => {
    const res = await searchEmployeeOfMonth({}, 0, 2)
    if (res && res.content) setExcellentStaffs(res.content)
  }

  const fetchProjects = async () => {
    const data = await getProjects()
    if (data) setProjects(data)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % companyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + companyImages.length) % companyImages.length)
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      await Promise.all([fetchDashboard(), fetchLogs(), fetchLateStaff(), fetchTopEmployees(), fetchProjects()])
      setLoading(false)
    }

    const checkAndFetch = () => {
      const token = tokenService.accessToken
      if (token) {
        fetchAll()
      } else {
        const interval = setInterval(() => {
          const latestToken = tokenService.accessToken
          if (latestToken) {
            clearInterval(interval)
            fetchAll()
          }
        }, 300)
      }
    }

    checkAndFetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="space-y-8 w-full max-w-6xl mx-auto p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 mx-auto rounded-full" />
              <Skeleton className="h-4 w-48 mx-auto rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  const completedProjects = dashboardData.filter((d) => d.status === "DONE").length
  const inProgressProjects = dashboardData.filter((d) => d.status === "IN_PROGRESS").length
  const totalProgress =
    dashboardData.reduce((acc, curr) => acc + curr.progressPercentage, 0) / dashboardData.length || 0

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Enhanced Header with Glass Effect */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors font-medium">
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Báo cáo tổng quan
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content with Enhanced Background */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            {/* Enhanced Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-spin-slow pointer-events-none" />

            <div className="relative z-10">
              {/* Hero Section */}
              <div className="px-6 py-12 lg:px-8">
                <div className="mx-auto max-w-full px-4">
                  {/* Enhanced Header Section */}
                  <div className="text-center space-y-8 mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                      <span className="text-sm font-medium text-muted-foreground">Dashboard</span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                          Báo cáo
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                          Tổng quan
                        </span>
                      </h1>
                      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Theo dõi hiệu suất, quản lý nhân sự và phân tích dữ liệu toàn diện
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-foreground">{dashboardData.length}</div>
                            <div className="text-sm text-muted-foreground">Tổng dự án</div>
                          </div>
                        </div>
                      </div>

                      <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-foreground">{completedProjects}</div>
                            <div className="text-sm text-muted-foreground">Hoàn thành</div>
                          </div>
                        </div>
                      </div>

                      <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-foreground">{Math.round(totalProgress)}%</div>
                            <div className="text-sm text-muted-foreground">Tiến độ</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="space-y-8">
                    {/* Org Chart Section - Full Width */}
                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent border-b border-border/50">
                        <CardTitle className="flex items-center gap-4 text-2xl p-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                              Sơ đồ tổ chức
                            </span>
                            <p className="text-sm text-muted-foreground font-normal mt-1">Cấu trúc tổ chức công ty</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 p-8">
                        <div className="w-full overflow-x-auto border border-border/50 rounded-2xl p-8 bg-gradient-to-br from-muted/20 to-muted/10 backdrop-blur-sm">
                          <div className="min-w-[1200px]">
                            <OrgChart data={orgChartData as OrgNode} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Projects and Statistics Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Project Progress Card */}
                      <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent border-b border-border/50">
                          <CardTitle className="flex items-center gap-4 text-2xl p-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Target className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                Dự án và tiến độ
                              </span>
                              <p className="text-sm text-muted-foreground font-normal mt-1">
                                Theo dõi chi tiết từng dự án
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-8 space-y-6">
                          {dashboardData.map((item, index) => (
                            <div
                              key={index}
                              className="group/item space-y-3 p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-all duration-300 border border-border/30 hover:border-border/50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${COLORS[index % COLORS.length]} shadow-lg`}
                                  />
                                  <span className="font-semibold text-foreground group-hover/item:text-emerald-600 transition-colors">
                                    {item.projectName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={item.status === "DONE" ? "default" : "secondary"} className="text-xs">
                                    {item.status === "DONE" ? "Hoàn thành" : "Đang thực hiện"}
                                  </Badge>
                                  <span className="font-bold text-emerald-600 text-lg">
                                    {Math.floor(item.progressPercentage)}.
                                    {item.progressPercentage.toString().split(".")[1]?.charAt(0) ?? "0"}%
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <Progress value={item.progressPercentage} className="h-3 bg-muted/50" />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Statistics Chart Card */}
                      <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent border-b border-border/50">
                          <CardTitle className="flex items-center gap-4 text-2xl p-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                Biểu đồ thống kê dự án
                              </span>
                              <p className="text-sm text-muted-foreground font-normal mt-1">Phân tích dữ liệu dự án</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-8">
                          <div className="text-center mb-8 space-y-2">
                            <div className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                              {dashboardData.length}
                            </div>
                            <div className="text-muted-foreground font-medium">Tổng số dự án đang quản lý</div>
                          </div>

                          <div className="h-[200px] mb-8 p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10">
                            <PieChart
                              data={dashboardData.map((item) => ({
                                name: item.projectName,
                                value: item.progressPercentage,
                              }))}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="group/stat p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:scale-105">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover/stat:scale-110 transition-transform duration-300" />
                                <div>
                                  <div className="text-2xl font-bold text-emerald-600">{completedProjects}</div>
                                  <div className="text-xs text-muted-foreground">Hoàn thành</div>
                                </div>
                              </div>
                            </div>
                            <div className="group/stat p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-500 group-hover/stat:scale-110 transition-transform duration-300" />
                                <div>
                                  <div className="text-2xl font-bold text-orange-600">{inProgressProjects}</div>
                                  <div className="text-xs text-muted-foreground">Đang thực hiện</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Company Images Slider */}
                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent border-b border-border/50">
                        <CardTitle className="flex items-center gap-4 text-2xl">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                              Hình ảnh công ty
                            </span>
                            <p className="text-sm text-muted-foreground font-normal mt-1">
                              Không gian làm việc và thương hiệu
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader> */}
                      <CardContent className="relative z-10 p-8">
                        <div className="relative">
                          {/* Main Image Display */}
                          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/10">
                            <img
                              src={companyImages[currentImageIndex]?.url || "/placeholder.svg"}
                              alt={companyImages[currentImageIndex]?.title}
                              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Navigation Buttons */}
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                            >
                              <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                            >
                              <ChevronRight className="w-6 h-6 text-white" />
                            </button>

                            {/* Image Info */}
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                              <h4 className="font-bold text-xl mb-2">{companyImages[currentImageIndex]?.title}</h4>
                              <p className="text-white/90">{companyImages[currentImageIndex]?.description}</p>
                            </div>
                          </div>

                          {/* Thumbnail Navigation */}
                          <div className="flex justify-center gap-3 mt-6">
                            {companyImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${index === currentImageIndex
                                    ? "ring-2 ring-pink-500 scale-110"
                                    : "hover:scale-105 opacity-70 hover:opacity-100"
                                  }`}
                              >
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.title}
                                  className="w-full h-full object-cover"
                                />
                                {index === currentImageIndex && <div className="absolute inset-0 bg-pink-500/20" />}
                              </button>
                            ))}
                          </div>

                          {/* Dots Indicator */}
                          <div className="flex justify-center gap-2 mt-4">
                            {companyImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? "bg-pink-500 scale-125"
                                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Activity Log, Employees, and Attendance Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Recent Activity */}
                      <Card className="lg:col-span-2 group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent border-b border-border/50">
                          <CardTitle className="flex items-center gap-4 text-2xl p-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Activity className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                6 hoạt động gần nhất
                              </span>
                              <p className="text-sm text-muted-foreground font-normal mt-1">
                                Lịch sử hoạt động hệ thống
                              </p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-8">
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-muted/30 rounded-lg">
                                <tr>
                                  <th className="px-4 py-3 text-left font-semibold">Người dùng</th>
                                  <th className="px-4 py-3 text-left font-semibold">Hành động</th>
                                  <th className="px-4 py-3 text-left font-semibold">Tài nguyên</th>
                                  <th className="px-4 py-3 text-left font-semibold">Thời gian</th>
                                </tr>
                              </thead>
                              <tbody className="space-y-2">
                                {auditLogs.map((log, index) => (
                                  <tr
                                    key={index}
                                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                                  >
                                    <td className="px-4 py-3 font-medium">{log.username}</td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">{log.resource}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{log.createdAt}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Attendance */}
                      <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent border-b border-border/50">
                          <CardTitle className="flex items-center gap-4 text-xl p-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                Chấm công nhân viên
                              </span>
                              <p className="text-sm text-muted-foreground font-normal mt-1">Thông tin nhận diện</p>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-6 space-y-4">
                          {lateStaff.map((staff, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-all duration-300 border border-border/30 hover:border-border/50"
                            >
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-teal-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{staff.personName}</p>
                                <p className="text-sm text-muted-foreground">{staff.time}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Excellent Employees */}
                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent border-b border-border/50">
                        <CardTitle className="flex items-center gap-4 text-2xl p-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                              Nhân viên xuất sắc nhất công ty
                            </span>
                            <p className="text-sm text-muted-foreground font-normal mt-1">
                              Ghi nhận thành tích xuất sắc
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {excellentStaffs.map((item, index) => (
                            <div
                              key={item.id}
                              className="group/employee relative p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-2 border-dashed border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/10"
                            >
                              <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-br-lg rounded-tl-lg">
                                Nhân viên xuất sắc {index + 1}
                              </div>

                              <div className="flex items-center gap-4 mt-4">
                                <div className="relative">
                                  <img
                                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/30 group-hover/employee:border-yellow-500/50 transition-colors duration-300"
                                    src={item.employee.avatar || "/placeholder.svg"}
                                    alt={item.employee.fullName}
                                  />
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white" />
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <h4 className="font-bold text-lg text-foreground group-hover/employee:text-yellow-600 transition-colors duration-300">
                                    {item.employee.fullName}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.reason || "Không có mô tả"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Project Management Section */}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default DashboardPage
