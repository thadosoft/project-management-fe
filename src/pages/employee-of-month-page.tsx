"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Trophy,
  Calendar,
  User,
  Award,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Medal,
  Users,
  AlertCircle,
  Save,
  Loader2,
  Eye,
  EyeOff,
  PieChart,
  Activity,
} from "lucide-react"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import {
  CreateEmployeeOfTheMonth,
  deleteEmployeeOfMonth,
  searchEmployeeOfMonth,
} from "@/services/employeeOfMonthService"
import type { CreateEmployeeOfMonth, EmployeeOfMonth } from "@/models/EmployeeOfMonth"
import { getAllEmployees } from "@/services/employee/EmployeeService"

dayjs.extend(customParseFormat)

export default function EmployeeOfMonthPage() {
  const [form, setForm] = useState<CreateEmployeeOfMonth>({
    awardDate: dayjs().format("YYYY-MM-DDTHH:mm"),
  })

  const [employeeOfMonth, setEmployeeOfMonth] = useState<EmployeeOfMonth[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [employees, setEmployees] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOfMonth | null>(null)
  const [showCharts, setShowCharts] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  const handleDelete = async (employee: EmployeeOfMonth) => {
    if (!employee.id) return

    try {
      await deleteEmployeeOfMonth(employee.id)
      await fetchEmployeeOfMonth(currentPage)
      setDeleteDialogOpen(false)
      setSelectedEmployee(null)
    } catch (error) {
      setError("Xoá thất bại")
    }
  }

  const fetchEmployeeOfMonth = async (page: number) => {
    const res = await searchEmployeeOfMonth({}, page - 1, 10)
    if (res) {
      setEmployeeOfMonth(res.content)
      setTotalPages(res.totalPages)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.awardDate) {
      setError("Vui lòng chọn ngày nhận thưởng")
      return
    }

    if (!form.employeeId) {
      setError("Vui lòng chọn nhân viên")
      return
    }

    if (!form.reason) {
      setError("Vui lòng nhập lý do")
      return
    }

    const date = dayjs(form.awardDate, "YYYY-MM-DDTHH:mm")

    if (!date.isValid()) {
      setError("Ngày không hợp lệ")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        ...form,
        awardDate: date.format("YYYY-MM-DDTHH:mm:ss"),
        month: date.month() + 1,
        year: date.year(),
      }

      await CreateEmployeeOfTheMonth(payload)
      await fetchEmployeeOfMonth(currentPage)

      // Reset form
      setForm({
        awardDate: dayjs().format("YYYY-MM-DDTHH:mm"),
      })
    } catch (error) {
      setError("Có lỗi xảy ra khi thêm nhân viên của tháng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"

    // Check if it's in DD/MM/YYYY HH:mm:ss format
    if (dateString.includes("/")) {
      const [datePart, timePart] = dateString.split(" ")
      if (datePart && timePart) {
        const [day, month, year] = datePart.split("/")
        const formatted = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${timePart}`
        const parsed = new Date(formatted)
        return isNaN(parsed.getTime()) ? "Invalid Date" : parsed.toLocaleString("vi-VN")
      }
    }

    // Try parsing as ISO string
    const parsed = new Date(dateString)
    return isNaN(parsed.getTime()) ? "Invalid Date" : parsed.toLocaleString("vi-VN")
  }

  useEffect(() => {
    if (employees.length > 0 && !form.employeeId) {
      setForm((prev) => ({ ...prev, employeeId: employees[0].id?.toString() }))
    }
  }, [employees])

  useEffect(() => {
    // Use getAllEmployees for the dropdown as in the original code
    getAllEmployees().then((res) => {
      if (res) {
        setEmployees(res)
      }
    })

    fetchEmployeeOfMonth(currentPage)
  }, [currentPage])

  // Calculate statistics
  // Calculate statistics with debug
  console.log("employeeOfMonth data:", employeeOfMonth)
  console.log(
    "employee IDs:",
    employeeOfMonth.map((emp) => emp.employee?.id),
  )

  const currentMonthAwards = employeeOfMonth.filter(
    (emp) => emp.month === dayjs().month() + 1 && emp.year === dayjs().year(),
  ).length

  const totalAwards = employeeOfMonth.length

  const employeeIds = employeeOfMonth.map((emp) => emp.employee?.id).filter((id) => id !== undefined)
  const uniqueEmployeeIds = new Set(employeeIds)
  console.log("Unique employee IDs:", Array.from(uniqueEmployeeIds))

  const uniqueEmployees = uniqueEmployeeIds.size

  // Chart data calculations
  const getChartData = () => {
    // Get all employees count
    const totalEmployeesCount = employees.length

    // Get awarded employees count (unique)
    const awardedEmployeesCount = uniqueEmployees

    // Monthly breakdown for current year
    const currentYear = dayjs().year()
    const monthlyData = []

    for (let month = 1; month <= 12; month++) {
      const monthAwards = employeeOfMonth.filter((emp) => emp.month === month && emp.year === currentYear).length

      monthlyData.push({
        name: `Tháng ${month}`,
        value: monthAwards,
        color: month <= dayjs().month() + 1 ? "#10b981" : "#e5e7eb",
      })
    }

    // Award distribution data
    const awardDistributionData = [
      { name: "Đã nhận thưởng", value: awardedEmployeesCount, color: "#10b981" },
      { name: "Chưa nhận thưởng", value: totalEmployeesCount - awardedEmployeesCount, color: "#ef4444" },
    ]

    return { monthlyData, awardDistributionData }
  }

  const { monthlyData, awardDistributionData } = getChartData()

  // Simple chart components
  const PieChartComponent = ({ data, title }: { data: any[]; title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    return (
      <Card className="transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/50">
        <CardHeader className="text-center mb-3">
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

  const LineChartComponent = ({ data, title }: { data: any[]; title: string }) => {
    const maxValue = Math.max(...data.map((item) => item.value), 1)
    const chartWidth = 400
    const chartHeight = 200
    const padding = 40

    // Calculate points for the line
    const points = data.map((item, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1)
      const y = chartHeight - padding - (item.value / maxValue) * (chartHeight - 2 * padding)
      return { x, y, value: item.value, name: item.name }
    })

    // Create path string for the line
    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? "M" : "L"
      return `${path} ${command} ${point.x} ${point.y}`
    }, "")

    // Create area path for gradient fill
    const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`

    return (
      <Card className="transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full overflow-x-auto">
            <svg width={chartWidth} height={chartHeight + 60} className="mx-auto">
              {/* Grid lines */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = chartHeight - padding - (i * (chartHeight - 2 * padding)) / 4
                return (
                  <line
                    key={i}
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )
              })}

              {/* Area fill */}
              <path d={areaData} fill="url(#areaGradient)" className="transition-all duration-1000" />

              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-1000"
              />

              {/* Data points */}
              {points.map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-500 hover:r-8"
                  />
                  {/* Value labels */}
                  <text
                    x={point.x}
                    y={point.y - 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-current"
                    fill="#374151"
                  >
                    {point.value}
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {points.map((point, index) => (
                <text
                  key={index}
                  x={point.x}
                  y={chartHeight - padding + 20}
                  textAnchor="middle"
                  className="text-xs fill-current"
                  fill="#6b7280"
                >
                  T{index + 1}
                </text>
              ))}

              {/* Y-axis labels */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = chartHeight - padding - (i * (chartHeight - 2 * padding)) / 4
                const value = Math.round((i * maxValue) / 4)
                return (
                  <text
                    key={i}
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-current"
                    fill="#6b7280"
                  >
                    {value}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Số lượng giải thưởng</span>
            </div>
          </div>
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
                    <BreadcrumbLink href="/home" className="hover:text-primary transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Nhân viên của tháng</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 space-y-8 p-4 md:p-8 pt-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Enhanced Header Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-normal">
                        Nhân viên của <span className="text-yellow-500">tháng</span>
                      </h1>
                      <p className="text-muted-foreground mt-1">Ghi nhận và tôn vinh những nhân viên xuất sắc</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowCharts(!showCharts)}>
                    {showCharts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCharts ? "Ẩn biểu đồ" : "Xem biểu đồ"}
                  </Button>
                  <Badge
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border-yellow-500/20"
                  >
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Vinh danh
                  </Badge>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 border border-yellow-500/20 bg-gradient-to-br from-card via-card to-yellow-50/5 hover:border-yellow-500/40 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-yellow-600/80 transition-colors">
                          Tháng này
                        </p>
                        <p className="text-3xl font-bold text-yellow-600 group-hover:text-yellow-500 transition-colors">
                          {currentMonthAwards}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 border border-yellow-500/20 group-hover:border-yellow-500/40 transition-all duration-300">
                          <Medal className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 border border-orange-500/20 bg-gradient-to-br from-card via-card to-orange-50/5 hover:border-orange-500/40 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-600/80 transition-colors">
                          Tổng giải thưởng
                        </p>
                        <p className="text-3xl font-bold text-orange-600 group-hover:text-orange-500 transition-colors">
                          {totalAwards}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-orange-500/15 to-orange-500/5 border border-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300">
                          <Award className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 border border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-50/5 hover:border-purple-500/40 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-600/80 transition-colors">
                          Nhân viên xuất sắc
                        </p>
                        <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-500 transition-colors">
                          {uniqueEmployees}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                          <Users className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
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
                      <p className="text-muted-foreground">Phân tích trực quan dữ liệu nhân viên của tháng</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PieChartComponent data={awardDistributionData} title="Phân bố tổng quát" />
                    <LineChartComponent data={monthlyData} title={`Thống kê theo tháng năm ${dayjs().year()}`} />
                  </div>
                </div>
              )}

              {error && (
                <Alert
                  variant="destructive"
                  className="animate-in slide-in-from-top-2 mb-6 border-destructive/50 bg-destructive/5"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Enhanced Form */}
              <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm mb-8">
                <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Thêm nhân viên của tháng
                    </span>
                  </CardTitle>
                  <CardDescription className="ml-12">
                    Ghi nhận và tôn vinh những nhân viên có thành tích xuất sắc
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="employeeId" className="text-sm font-semibold flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Nhân viên <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={form.employeeId?.toString()}
                          onValueChange={(value) => handleSelectChange("employeeId", value)}
                        >
                          <SelectTrigger className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300">
                            <SelectValue placeholder="Chọn nhân viên" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id?.toString() || ""}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.fullName} />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(employee.fullName || "")}
                                    </AvatarFallback>
                                  </Avatar>
                                  {employee.fullName}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="awardDate" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Ngày nhận thưởng <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="awardDate"
                          name="awardDate"
                          type="datetime-local"
                          value={form.awardDate || ""}
                          onChange={handleChange}
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="reason" className="text-sm font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Lý do <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="reason"
                          name="reason"
                          value={form.reason || ""}
                          onChange={handleChange}
                          placeholder="Hoàn thành xuất sắc dự án..."
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="transition-all duration-300 hover:scale-105 min-w-[140px] h-12 px-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang thêm...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Thêm nhân viên
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Enhanced Data Table */}
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Danh sách nhân viên của tháng
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Hiển thị {employeeOfMonth.length} bản ghi trên tổng số {totalPages * 10} bản ghi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-x-auto bg-background">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nhân viên
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tháng/Năm
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày nhận thưởng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lý do
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employeeOfMonth.map((employee) => (
                          <tr key={employee.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage
                                    src={employee.employee?.avatar || "/placeholder.svg"}
                                    alt={employee.employee?.fullName || ""}
                                  />
                                  <AvatarFallback className="text-sm bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                    {getInitials(employee.employee?.fullName || "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{employee.employee?.fullName || "N/A"}</p>
                                  <p className="text-sm text-gray-500">ID: {employee.employee.employeeCode}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Badge  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                {employee.monthYear || `${employee.month}/${employee.year}`}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                              {formatDate(employee.awardDate || "")}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{employee.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className=""
                                    onClick={() => setSelectedEmployee(employee)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Xác nhận xóa</DialogTitle>
                                    <DialogDescription>
                                      Bạn có chắc chắn muốn xóa nhân viên "{selectedEmployee?.employee?.fullName}" khỏi
                                      danh sách nhân viên của tháng{" "}
                                      {selectedEmployee?.monthYear ||
                                        `${selectedEmployee?.month}/${selectedEmployee?.year}`}
                                      ?
                                      <br />
                                      Hành động này không thể hoàn tác.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                      Hủy
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => selectedEmployee && handleDelete(selectedEmployee)}
                                    >
                                      Xóa
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                      </Button>

                      <span className="px-4 py-2 text-sm font-medium">
                        {currentPage} / {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
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
