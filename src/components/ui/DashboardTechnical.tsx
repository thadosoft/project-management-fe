"use client"

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
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart } from "@/components/charts"
import type { Dashboard } from "@/models/Dashboard"
import { useEffect, useState, useRef } from "react"
import { getDashboard } from "@/services/dashboardService"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuditLog } from "@/models/AuditLog"
import { get6LatestAuditLogs } from "@/services/auditLogService"
import { ItemProject } from "@/components/item-project"
import { getProjects, createProject } from "@/services/projectService"
import type { Project, ProjectRequest } from "@/models/Project"
import {
  Plus,
  FolderOpen,
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Activity,
  ArrowRight,
  Zap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Rocket,
  Star,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { OrgChart, type OrgNode } from "@/components/ui/OrgChart"
import orgChartData from "@/data/orgChartData.json"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

function DashboardTechnical() {
  const [dashboardData, setDashboardData] = useState<Dashboard[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const COLORS = [
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
  ]
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState<string>("")
  const [newProjectDescription, setNewProjectDescription] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = useState<"chart" | "project">("chart")
  const [showComponents, setShowComponents] = useState<boolean>(false)
  const componentsRef = useRef<HTMLDivElement>(null)

  const handleCreateProject = async () => {
    const projectRequest: ProjectRequest = {
      name: newProjectName,
      description: newProjectDescription,
      userId: localStorage.getItem("id")!,
    }
    const projectCreated: Project | null = await createProject(projectRequest)
    if (projectCreated) {
      setNewProjectName("")
      setNewProjectDescription("")
      setIsDialogOpen(false)
      setProjects((prev) => [...prev, projectCreated])
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await getDashboard()
      if (data) {
        setDashboardData(data)
      }
    }

    const fetchLogs = async () => {
      const logs = await get6LatestAuditLogs()
      if (logs) {
        setAuditLogs(logs)
      }
    }

    const fetchProjects = async () => {
      const data = await getProjects()
      if (data) setProjects(data)
    }

    const fetchAll = async () => {
      setLoading(true)
      await Promise.all([fetchDashboard(), fetchLogs(), fetchProjects()])
      setLoading(false)
    }

    fetchAll()
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

  const handleToggleComponents = () => {
    setShowComponents(true)
    // Scroll to components after a short delay to ensure they're rendered
    setTimeout(() => {
      componentsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }

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
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Khối kỹ thuật
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
                      <span className="text-sm font-medium text-muted-foreground">Dashboard Kỹ thuật</span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                          Quản lý
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                          Dự án Kỹ thuật
                        </span>
                      </h1>
                      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Theo dõi tiến độ, quản lý tài nguyên và tối ưu hóa hiệu suất của các dự án kỹ thuật
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <FolderOpen className="w-6 h-6" />
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
                            <div className="text-sm text-muted-foreground">Tiến độ TB</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Toggle Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      {!showComponents ? (
                        <Button
                          onClick={handleToggleComponents}
                          size="lg"
                          className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Activity className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Xem thống kê & sơ đồ
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      ) : (
                        <>
                          {expandedSection === "chart" ? (
                            <Button
                              onClick={() => setExpandedSection("project")}
                              size="lg"
                              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <FolderOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                              Xem danh sách dự án
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setExpandedSection("chart")}
                              size="lg"
                              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <Activity className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                              Quay lại thống kê
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                          )}

                          <Button
                            onClick={() => setShowComponents(false)}
                            size="lg"
                            variant="outline"
                            className="group relative overflow-hidden border-2 border-muted-foreground/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <X className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            Ẩn thống kê
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Components Section - Only show when toggled */}
                  {showComponents && (
                    <div ref={componentsRef} className="animate-in slide-in-from-bottom-8 duration-1000 ease-out">
                      {/* Section: Enhanced Charts & Analytics */}
                      {expandedSection === "chart" && (
                        <div className="animate-in slide-in-from-right-4 duration-700 space-y-8">
                          {/* Org Chart Section - Full Width */}
                          <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent border-b border-border/50">
                              <CardTitle className="flex items-center gap-4 text-2xl">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <Users className="w-6 h-6" />
                                </div>
                                <div>
                                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                    Sơ đồ tổ chức
                                  </span>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">
                                    Cấu trúc nhóm kỹ thuật
                                  </p>
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

                          {/* Enhanced Analytics Grid */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Progress Tracking Card */}
                            <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent border-b border-border/50">
                                <CardTitle className="flex items-center gap-4 text-2xl">
                                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Target className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                      Tiến độ dự án
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
                                        <Badge
                                          variant={item.status === "DONE" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
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

                            {/* Enhanced Statistics Card */}
                            <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <CardHeader className="relative z-10 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent border-b border-border/50">
                                <CardTitle className="flex items-center gap-4 text-2xl">
                                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                      Thống kê tổng quan
                                    </span>
                                    <p className="text-sm text-muted-foreground font-normal mt-1">
                                      Phân tích dữ liệu dự án
                                    </p>
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
                        </div>
                      )}

                      {/* Section: Enhanced Project Gallery */}
                      {expandedSection === "project" && (
                        <div className="animate-in slide-in-from-left-4 duration-700">
                          <Card className="border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
                              <CardTitle className="flex items-center gap-4 text-2xl">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                                  <FolderOpen className="w-6 h-6" />
                                </div>
                                <div>
                                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                    Danh sách dự án
                                  </span>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">
                                    Quản lý tất cả dự án kỹ thuật
                                  </p>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                              <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {projects.map((project, index) => (
                                  <div
                                    key={project.id}
                                    className="group transition-all duration-500 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 relative cursor-pointer"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    onClick={() => navigate(`/project/task/${project.id}`)}
                                  >
                                    <div className="relative overflow-hidden rounded-2xl">
                                      <ItemProject project={project} removeProject={handleDeleteProject} />

                                      {/* Hover Overlay */}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center rounded-2xl">
                                        <div className="text-center space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                            <FolderOpen className="w-4 h-4 text-white" />
                                            <span className="text-white font-medium text-sm">Xem chi tiết</span>
                                          </div>
                                          <div className="w-8 h-0.5 bg-white/60 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-200"></div>
                                        </div>
                                      </div>

                                      {/* Subtle glow effect */}
                                      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-primary/30 group-hover:ring-offset-2 group-hover:ring-offset-background transition-all duration-300"></div>
                                    </div>
                                  </div>
                                ))}

                                {/* Enhanced Create Project Card */}
                                <Dialog modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                  <DialogTrigger asChild>
                                    <div className="group h-[23vh] rounded-2xl bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 cursor-pointer hover:from-primary/10 hover:via-primary/5 hover:to-primary/10 border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 transition-all duration-500 flex flex-col p-8 items-center justify-center hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                      <div className="relative z-10 space-y-4 text-center">
                                        <div className="p-4 rounded-full bg-gradient-to-br from-primary to-primary/200 text-white shadow-lg">
                                          <Plus className="w-8 h-8 text-primary group-hover:rotate-90 transition-transform duration-300" />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                            Tạo dự án mới
                                          </div>
                                          <div className="text-xs text-muted-foreground mt-1">
                                            Bắt đầu dự án kỹ thuật mới
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent
                                    onInteractOutside={(event) => event.preventDefault()}
                                    className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none"
                                  >
                                    <Card className="border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-700/70 backdrop-blur-xl shadow-2xl">
                                      <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent border-b border-border/50">
                                        <CardTitle className="flex items-center gap-4 text-xl">
                                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/200 text-white shadow-lg">
                                            <Sparkles className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                              Tạo dự án mới
                                            </span>
                                            <p className="text-sm text-muted-foreground font-normal mt-1">
                                              Khởi tạo dự án kỹ thuật
                                            </p>
                                          </div>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="p-8">
                                        <form className="space-y-6">
                                          <div className="space-y-3">
                                            <Label
                                              htmlFor="name"
                                              className="text-sm font-semibold flex items-center gap-2"
                                            >
                                              <Star className="w-4 h-4 text-primary" />
                                              Tên dự án
                                            </Label>
                                            <Input
                                              id="name"
                                              placeholder="Nhập tên dự án..."
                                              value={newProjectName}
                                              onChange={(e) => setNewProjectName(e.target.value)}
                                              className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 rounded-xl"
                                            />
                                          </div>
                                          <div className="space-y-3">
                                            <Label
                                              htmlFor="description"
                                              className="text-sm font-semibold flex items-center gap-2"
                                            >
                                              <Calendar className="w-4 h-4 text-primary" />
                                              Mô tả
                                            </Label>
                                            <Input
                                              id="description"
                                              placeholder="Mô tả ngắn gọn về dự án..."
                                              value={newProjectDescription}
                                              onChange={(e) => setNewProjectDescription(e.target.value)}
                                              className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 rounded-xl"
                                            />
                                          </div>
                                        </form>
                                      </CardContent>
                                      <CardFooter className="flex justify-center pb-8">
                                        {newProjectName !== "" &&
                                        !projects.some((p) => p.name.toLowerCase() === newProjectName.toLowerCase()) ? (
                                          <Button
                                            onClick={handleCreateProject}
                                            size="lg"
                                            className="group relative overflow-hidden min-w-[160px] h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white border-0 shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 rounded-xl"
                                          >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                            Tạo dự án
                                          </Button>
                                        ) : (
                                          <Button
                                            disabled
                                            size="lg"
                                            className="min-w-[160px] h-12 px-8 opacity-50 cursor-not-allowed rounded-xl"
                                          >
                                            <Zap className="w-5 h-5 mr-2" />
                                            Tạo dự án
                                          </Button>
                                        )}
                                      </CardFooter>
                                    </Card>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default DashboardTechnical
