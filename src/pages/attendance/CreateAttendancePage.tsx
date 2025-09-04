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
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import type { CreateAttendanceResponse } from "@/models/Attendance"
import { getMonthlyAttendance, CreateMonthlyAttendance } from "@/services/attendanceService"
import {
  Calendar,
  Clock,
  Users,
  Plus,
  RefreshCw,
  CalendarDays,
  UserCheck,
  Sun,
  Coffee,
  Building,
  Plane,
  Heart,
  Sparkles,
  X,
  User,
  TrendingUp,
} from "lucide-react"

function CreateAttendancePage() {
  const currentDate = new Date()
  const [year, setYear] = useState<number>(currentDate.getFullYear())
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1)
  const [attendanceData, setAttendanceData] = useState<CreateAttendanceResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [creating, setCreating] = useState<boolean>(false)
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState<number | null>(null)

  const handleLoadData = async () => {
    setLoading(true)
    try {
      const data = await getMonthlyAttendance(year, month)
      if (data) {
        setAttendanceData(data)
      }
    } catch (error) {
      console.error("Failed to fetch attendance data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleLoadData()
  }, [year, month])

  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month - 1, day)
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      return {
        date: formattedDate,
        dayOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()],
      }
    })
  }

  const handleCreateAttendance = async () => {
    setCreating(true)
    try {
      const response = await CreateMonthlyAttendance(year, month)
      if (response) {
        alert("Tạo bảng chấm công thành công")
        handleLoadData()
      } else {
        alert("Tạo bảng chấm công thất bại - dữ liệu đã tồn tại")
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo bảng chấm công")
    } finally {
      setCreating(false)
    }
  }

  const days = getDaysInMonth(year, month)

  const getShiftStyle = (shiftName: string, isSunday: boolean) => {
    if (isSunday) return "bg-yellow-300 text-black"

    switch (shiftName) {
      case "C":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
      case "S":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm"
      case "CN":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm"
      case "NM":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
      case "P":
        return "bg-gradient-to-r from-cyan-400 to-cyan-500 text-white shadow-sm"
      case "L":
        return "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-sm"
      default:
        return "bg-white hover:bg-gray-50 transition-colors"
    }
  }

  const getShiftIcon = (shiftName: string) => {
    switch (shiftName) {
      case "C":
        return <Coffee className="w-3 h-3" />
      case "S":
        return <Sun className="w-3 h-3" />
      case "CN":
        return <Clock className="w-3 h-3" />
      case "NM":
        return <Building className="w-3 h-3" />
      case "P":
        return <Plane className="w-3 h-3" />
      case "L":
        return <Heart className="w-3 h-3" />
      default:
        return null
    }
  }

  const legendItems = [
    { color: "bg-yellow-300", label: "Chủ nhật", icon: <Sun className="w-4 h-4" /> },
    {
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      label: "Cả ngày",
      icon: <Clock className="w-4 h-4" />,
    },
    { color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "Ca sáng", icon: <Sun className="w-4 h-4" /> },
    {
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      label: "Ca chiều",
      icon: <Coffee className="w-4 h-4" />,
    },
    { color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "Nhà máy", icon: <Building className="w-4 h-4" /> },
    { color: "bg-gradient-to-r from-cyan-400 to-cyan-500", label: "Phép", icon: <Plane className="w-4 h-4" /> },
    { color: "bg-gradient-to-r from-pink-500 to-pink-600", label: "Lễ", icon: <Heart className="w-4 h-4" /> },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="space-y-8 w-full max-w-6xl mx-auto p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 mx-auto rounded-full" />
              <Skeleton className="h-4 w-48 mx-auto rounded-full" />
            </div>
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  const handleRowClick = (empIndex: number) => {
    setSelectedEmployeeIndex(selectedEmployeeIndex === empIndex ? null : empIndex)
  }

  const selectedEmployee = selectedEmployeeIndex !== null ? attendanceData[selectedEmployeeIndex] : null

  // Calculate attendance statistics for selected employee
  const getEmployeeStats = (employee: CreateAttendanceResponse) => {
    const workDays = employee.dailyAttendance.filter((a) => a.shiftName && a.shiftName !== "-")
    const shiftCounts = workDays.reduce(
      (acc, curr) => {
        acc[curr.shiftName] = (acc[curr.shiftName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalWorkDays: workDays.length,
      shiftCounts,
      totalDaysInMonth: days.length,
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Enhanced Header */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors font-medium">
                      Tổng quan
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Tạo bảng chấm công tháng
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

            <div className="relative z-10 flex">
              {/* Main Content Area */}
              <div className={`flex-1 p-8 transition-all duration-300 ${selectedEmployee ? "mr-80" : ""}`}>
                <div className="mx-auto max-w-full">
                  {/* Header Section */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                        <span className="text-sm font-medium text-muted-foreground">Quản lý chấm công</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                          Chấm công tháng
                        </span>
                      </h1>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="appearance-none text-black bg-white backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 pr-10 text-sm font-medium hover:border-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {[...Array(12)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                Tháng {i + 1}
                              </option>
                            ))}
                          </select>
                          <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>

                        <div className="relative">
                          <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="appearance-none text-black bg-white backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 pr-10 text-sm font-medium hover:border-border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {[...Array(5)].map((_, i) => {
                              const y = currentDate.getFullYear() - i
                              return (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              )
                            })}
                          </select>
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleLoadData}
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          className="group border-2 hover:scale-105 transition-all duration-300 bg-transparent"
                        >
                          <RefreshCw
                            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-300`}
                          />
                          Tải lại
                        </Button>

                        <Button
                          onClick={handleCreateAttendance}
                          disabled={creating}
                          size="sm"
                          className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {creating ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                          )}
                          {creating ? "Đang tạo..." : "Tạo bảng chấm công"}
                          <Sparkles className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">{attendanceData.length}</div>
                            <div className="text-sm text-muted-foreground">Tổng nhân viên</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <CalendarDays className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">{days.length}</div>
                            <div className="text-sm text-muted-foreground">Ngày trong tháng</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <UserCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              {month}/{year}
                            </div>
                            <div className="text-sm text-muted-foreground">Tháng/Năm</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Attendance Table */}
                  <Card className="group border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
                              <th
                                className="border-r border-border/30 px-4 py-4 text-center text-sm font-semibold text-foreground min-w-[120px]"
                                rowSpan={2}
                              >
                                Mã NV
                              </th>
                              <th
                                className="border-r border-border/30 px-4 py-4 text-center text-sm font-semibold text-foreground min-w-[150px]"
                                rowSpan={2}
                              >
                                Họ và tên
                              </th>
                              {days.map((day, index) => (
                                <th
                                  key={index}
                                  className={`border-r border-border/30 px-2 py-2 text-center text-xs font-semibold w-10 ${
                                    day.dayOfWeek === "CN" ? "bg-yellow-200/50 text-yellow-800" : "text-foreground"
                                  }`}
                                >
                                  {index + 1}
                                </th>
                              ))}
                            </tr>
                            <tr className="bg-gradient-to-r from-muted/30 to-muted/20 border-b border-border/50">
                              {days.map((day, index) => (
                                <th
                                  key={index}
                                  className={`border-r border-border/30 px-2 py-2 text-center text-xs font-semibold w-10 ${
                                    day.dayOfWeek === "CN" ? "bg-yellow-200/50 text-yellow-800" : "text-foreground"
                                  }`}
                                >
                                  {day.dayOfWeek}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceData.map((employee, empIndex) => (
                              <tr
                                key={empIndex}
                                onClick={() => handleRowClick(empIndex)}
                                className={`cursor-pointer transition-all duration-300 ${
                                  selectedEmployeeIndex === empIndex
                                    ? "bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 ring-2 ring-blue-500/30 ring-inset shadow-lg scale-[1.01]"
                                    : "hover:bg-muted/20"
                                }`}
                              >
                                <td
                                  className={`border-r border-b border-border/30 px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
                                    selectedEmployeeIndex === empIndex ? "bg-blue-500/10 font-bold text-blue-600" : ""
                                  }`}
                                >
                                  {employee.employeeCode}
                                </td>
                                <td
                                  className={`border-r border-b border-border/30 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                    selectedEmployeeIndex === empIndex ? "bg-blue-500/10 font-bold text-blue-600" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {selectedEmployeeIndex === empIndex && (
                                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                                    )}
                                    {employee.fullName}
                                  </div>
                                </td>
                                {days.map((day, index) => {
                                  const attendance = employee.dailyAttendance.find((a) => a.workDate === day.date)
                                  const isSunday = day.dayOfWeek === "CN"
                                  const shiftName = attendance?.shiftName || ""

                                  return (
                                    <td
                                      key={index}
                                      className={`border-r border-b border-border/30 px-2 py-3 text-center text-xs font-medium transition-all duration-200 ${
                                        selectedEmployeeIndex === empIndex
                                          ? `${getShiftStyle(shiftName, isSunday)} ring-1 ring-blue-500/20`
                                          : getShiftStyle(shiftName, isSunday)
                                      }`}
                                    >
                                      <div className="flex items-center justify-center gap-1">
                                        {getShiftIcon(shiftName)}
                                        <span>{attendance ? shiftName : "-"}</span>
                                      </div>
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Legend */}
                  <Card className="mt-8 border-0 bg-transparent dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-lg">
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {legendItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-all duration-300 hover:scale-105"
                          >
                            <div
                              className={`w-6 h-6 rounded-md ${item.color} shadow-sm flex items-center justify-center text-white`}
                            >
                              {item.icon}
                            </div>
                            <span className="text-sm font-medium text-foreground">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Employee Details Sidebar */}
              {selectedEmployee && (
                <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-gradient-to-br from-white/95 to-white/85 dark:from-slate-900/95 dark:to-slate-800/85 backdrop-blur-xl border-l border-border/50 shadow-2xl z-40 overflow-y-auto transition-all duration-300 animate-in slide-in-from-right">
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">Chi tiết nhân viên</h3>
                          <p className="text-sm text-muted-foreground">Thông tin chấm công</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedEmployeeIndex(null)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-500/10 hover:text-red-600 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Employee Info */}
                    <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-sm">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {selectedEmployee.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{selectedEmployee.fullName}</h4>
                            <p className="text-sm text-muted-foreground">Mã NV: {selectedEmployee.employeeCode}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Statistics */}
                    {(() => {
                      const stats = getEmployeeStats(selectedEmployee)
                      return (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Thống kê tháng {month}/{year}
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                              <CardContent className="p-3 text-center">
                                <div className="text-2xl font-bold text-emerald-600">{stats.totalWorkDays}</div>
                                <div className="text-xs text-muted-foreground">Ngày làm việc</div>
                              </CardContent>
                            </Card>

                            <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                              <CardContent className="p-3 text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                  {stats.totalDaysInMonth - stats.totalWorkDays}
                                </div>
                                <div className="text-xs text-muted-foreground">Ngày nghỉ</div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Shift Breakdown */}
                          <div className="space-y-3">
                            <h5 className="font-medium text-foreground">Chi tiết ca làm việc:</h5>
                            <div className="space-y-2">
                              {Object.entries(stats.shiftCounts).map(([shift, count]) => (
                                <div
                                  key={shift}
                                  className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                                >
                                  <div className="flex items-center gap-2">
                                    {getShiftIcon(shift)}
                                    <span className="text-sm font-medium">
                                      {shift === "CN"
                                        ? "Cả ngày"
                                        : shift === "S"
                                          ? "Ca sáng"
                                          : shift === "C"
                                            ? "Ca chiều"
                                            : shift === "NM"
                                              ? "Nhà máy"
                                              : shift === "P"
                                                ? "Phép"
                                                : shift === "L"
                                                  ? "Lễ"
                                                  : shift}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">{count}</span>
                                    <span className="text-xs text-muted-foreground">ngày</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Attendance Rate */}
                          <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Tỷ lệ chấm công</span>
                                <span className="text-sm font-bold text-blue-600">
                                  {Math.round((stats.totalWorkDays / stats.totalDaysInMonth) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted/30 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(stats.totalWorkDays / stats.totalDaysInMonth) * 100}%`,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default CreateAttendancePage
