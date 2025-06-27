"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import {
  Search,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Timer,
  CalendarDays,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  EyeOff,
} from "lucide-react"
import { searchGroupedAttendances } from "@/services/attendanceService"

interface AttendanceRecord {
  personId: string
  personName: string
  date: string
  checkIn: string | null
  checkOut: string | null
}

function AttendancePage() {
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([])
  const [showCharts, setShowCharts] = useState(false)

  const today = new Date()
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  const [searchAttendanceRequest, setSearchAttendanceRequest] = useState({
    personName: "",
    startDate: today.toISOString().split("T")[0],
    endDate: endOfDay.toISOString().split("T")[0],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchAttendanceRequest((prev) => ({
      ...prev,
      [name]: value ? value : "",
    }))
  }

  const calculateMinutesDiff = (actualTimeStr: string | null, baseTimeStr: string): number => {
    if (!actualTimeStr) return 0

    const [datePart, timePart] = actualTimeStr.split(" ")
    const [day, month, year] = datePart.split("/")
    const actual = new Date(`${year}-${month}-${day}T${timePart}`)
    const base = new Date(`${year}-${month}-${day}T${baseTimeStr}`)

    const diff = actual.getTime() - base.getTime()
    return diff > 0 ? Math.floor(diff / 60000) : 0
  }

  const calculateEarlyLeaveMinutes = (actualTimeStr: string | null, baseTimeStr: string): number => {
    if (!actualTimeStr) return 0

    const [datePart, timePart] = actualTimeStr.split(" ")
    const [day, month, year] = datePart.split("/")
    const actual = new Date(`${year}-${month}-${day}T${timePart}`)
    const base = new Date(`${year}-${month}-${day}T${baseTimeStr}`)

    const diff = base.getTime() - actual.getTime()
    return diff > 0 ? Math.floor(diff / 60000) : 0
  }

  const formatDateTime = (value: string | null) => {
    if (!value) return "Chưa có"

    // Tách chuỗi dd/MM/yyyy HH:mm:ss
    const [datePart, timePart] = value.split(" ")
    if (!datePart || !timePart) return "Invalid"

    const [day, month, year] = datePart.split("/")
    const formatted = `${year}-${month}-${day}T${timePart}`

    const parsed = new Date(formatted)
    return isNaN(parsed.getTime()) ? "Invalid" : parsed.toLocaleString("en-GB")
  }

  const fetchGroupedAttendances = async () => {
    try {
      const data = await searchGroupedAttendances(searchAttendanceRequest, page, size)
      if (data) {
        setAttendances(data.content)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error("Error fetching grouped attendances:", error)
    }
  }

  useEffect(() => {
    fetchGroupedAttendances()
  }, [page, size])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0) // reset về page đầu tiên khi tìm kiếm mới
    fetchGroupedAttendances()
  }

  const getStatusBadge = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Chưa check-in
        </Badge>
      )
    }
    if (!checkOut) {
      return (
        <Badge variant="secondary" className="gap-1">
          <Timer className="w-3 h-3" />
          Chưa check-out
        </Badge>
      )
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
        <CheckCircle className="w-3 h-3" />
        Hoàn thành
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Calculate summary statistics
  const totalEmployees = attendances.length
  const presentEmployees = attendances.filter((a) => a.checkIn && a.checkOut).length
  const lateEmployees = attendances.filter((a) => calculateMinutesDiff(a.checkIn, "08:30:00") > 0).length
  const overtimeEmployees = attendances.filter((a) => calculateMinutesDiff(a.checkOut, "23:59:59") > 0).length
  const earlytimeEmployees = attendances.filter((a) => calculateEarlyLeaveMinutes(a.checkOut, "17:45:00") > 0).length
  // const absentEmployees = attendances.filter((a) => !a.checkIn).length
  const incompleteCheckoutEmployees = attendances.filter((a) => a.checkIn && !a.checkOut).length
  const incompleteCheckinEmployees = attendances.filter((a) => !a.checkIn && a.checkOut).length

  // Chart data calculations
  const getChartData = () => {
    const statusData = [
      { name: "Hoàn thành", value: presentEmployees, color: "#10b981" },
      { name: "Chưa check-out", value: incompleteCheckoutEmployees, color: "#f59e0b" },
      { name: "Chưa check-in", value: incompleteCheckinEmployees, color: "#ef4444" },
    ]

    const performanceData = [
      { name: "Đúng giờ", value: totalEmployees - lateEmployees, color: "#10b981" },
      { name: "Đi trễ", value: lateEmployees, color: "#ef4444" },
      { name: "Về sớm", value: earlytimeEmployees, color: "#f59e0b" },
      { name: "Làm thêm", value: overtimeEmployees, color: "#3b82f6" },
    ]

    return { statusData, performanceData }
  }

  const { statusData, performanceData } = getChartData()

  // Simple chart components
  const PieChartComponent = ({ data, title }: { data: any[]; title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    return (
      <Card className="transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/50">
        <CardHeader className="text-center mb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48">
            <svg width="192" height="192" className="transform -rotate-90">
              <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${(percentage / 100) * 502.65} 502.65`
                const strokeDashoffset = -currentAngle * 5.0265
                currentAngle += percentage

                return (
                  <circle
                    key={index}
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-muted-foreground">Tổng</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-sm font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const BarChartComponent = ({ data, title }: { data: any[]; title: string }) => {
    const maxValue = Math.max(...data.map((item) => item.value))

    return (
      <Card className="transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Enhanced Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-background via-background to-background/50 backdrop-blur-sm border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Bảng chấm công</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 space-y-8 p-4 md:p-8 pt-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Enhanced Header Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {/* <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Clock className="w-6 h-6 text-primary" />
                    </div> */}
                    <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-normal">
                        Bảng <span className="text-indigo-600">chấm công</span>
                      </h1>
                      <p className="text-muted-foreground mt-3">Theo dõi và quản lý thời gian làm việc của nhân viên</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCharts(!showCharts)}>
                    {showCharts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCharts ? "Ẩn biểu đồ" : "Xem biểu đồ"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={fetchGroupedAttendances}>
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                  </Button>
                </div>
              </div>

              {/* Enhanced Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-50/5 hover:border-blue-500/40 hover:scale-105 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600/80 transition-colors">
                          Tổng ghi nhận
                        </p>
                        <p className="text-3xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                          {totalEmployees}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                          <Users className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 border border-green-500/20 bg-gradient-to-br from-card via-card to-green-50/5 hover:border-green-500/40 hover:scale-105 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600/80 transition-colors">
                          Hoàn thành
                        </p>
                        <p className="text-3xl font-bold text-green-600 group-hover:text-green-500 transition-colors">
                          {presentEmployees}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                          <CheckCircle className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 border border-red-500/20 bg-gradient-to-br from-card via-card to-red-50/5 hover:border-red-500/40 hover:scale-105 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-red-600/80 transition-colors">
                          Đi trễ
                        </p>
                        <p className="text-3xl font-bold text-red-600 group-hover:text-red-500 transition-colors">
                          {lateEmployees}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/20 group-hover:border-red-500/40 transition-all duration-300">
                          <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 border border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-50/5 hover:border-purple-500/40 hover:scale-105 overflow-hidden">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Animated border glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600/80 transition-colors">
                          Làm thêm
                        </p>
                        <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-500 transition-colors">
                          {overtimeEmployees}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                          <TrendingUp className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section - Only show when toggled */}
              {showCharts && (
                <div className="mb-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Biểu đồ thống kê</h2>
                      <p className="text-muted-foreground">Phân tích trực quan dữ liệu chấm công</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PieChartComponent data={statusData} title="Tổng quát" />
                    <BarChartComponent data={performanceData} title="Hiệu suất làm việc" />
                  </div>
                </div>
              )}

              {/* Enhanced Search Form */}
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm mb-8">
                <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Filter className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Bộ lọc tìm kiếm
                    </span>
                  </CardTitle>
                  <CardDescription className="ml-12">Tìm kiếm và lọc dữ liệu chấm công theo tiêu chí</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="personName" className="text-sm font-semibold flex items-center gap-2">
                          <Search className="w-4 h-4 text-primary" />
                          Tên nhân viên
                        </Label>
                        <Input
                          id="personName"
                          name="personName"
                          value={searchAttendanceRequest.personName}
                          onChange={handleInputChange}
                          placeholder="Nhập tên nhân viên..."
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Chấm công từ ngày
                        </Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={searchAttendanceRequest.startDate}
                          onChange={handleInputChange}
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-primary" />
                          Chấm công đến ngày
                        </Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={searchAttendanceRequest.endDate}
                          onChange={handleInputChange}
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        type="submit"
                        className="transition-all duration-300 hover:scale-105 min-w-[120px] h-12 px-8 bg-gradient-to-r from-[#4D7C0F] to-[#79ac37] hover:from-[#79ac37] hover:to-[#4D7C0F] shadow-lg hover:shadow-xl"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Enhanced Data Table */}
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                <CardHeader className="mb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Dữ liệu chấm công
                    </span>
                  </CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-x-auto bg-background">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                            Tên nhân viên
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã nhân viên
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-in
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-out
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trễ (phút)
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            OT (phút)
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Về sớm (phút)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendances.map((attend, index) => (
                          <tr key={`${attend.personId}-${attend.date}`} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{page * size + index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-left">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg" alt={attend.personName} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                    {getInitials(attend.personName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{attend.personName}</p>
                                  <p className="text-sm text-gray-500">{attend.date}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                              {attend.personId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(attend.checkIn, attend.checkOut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                              {formatDateTime(attend.checkIn)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                              {formatDateTime(attend.checkOut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {calculateMinutesDiff(attend.checkIn, "08:30:00")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {calculateMinutesDiff(attend.checkOut, "23:30:00")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                              {calculateEarlyLeaveMinutes(attend.checkOut, "17:45:00")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Enhanced Pagination */}
                  <div className="flex justify-center mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                      </Button>

                      <span className="px-4 py-2 text-sm font-medium">
                        {page + 1} / {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        className="gap-1"
                      >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default AttendancePage
