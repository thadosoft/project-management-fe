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
import { useEffect, useState } from "react"
import tokenService from "@/services/tokenService"
import type { AuditLog, SearchAuditLog } from "@/models/AuditLog"
import { searchAuditLogs } from "@/services/auditLogService"
import {
  Search,
  Calendar,
  Activity,
  User,
  Shield,
  Clock,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Settings,
  Database,
  Zap,
} from "lucide-react"

function AuditLogPage() {
  const [auditlogs, setAuditLogs] = useState<AuditLog[]>([])
  const [_, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState<number>(0)
  const [size] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<SearchAuditLog>({
    resource: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    const fetchAuditLogs = async () => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        setLoading(true)
        try {
          tokenService.accessToken = token
          const response = await searchAuditLogs(searchParams, page, size)
          setAuditLogs(response.content)
          setTotalPages(response.totalPages)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAuditLogs()
  }, [page, searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const result = await searchAuditLogs(searchParams, 0, size)
      if (result) {
        setAuditLogs(result.content)
        setTotalPages(result.totalPages)
        setPage(0)
      }
    } catch (error) {
      console.error("Error during search:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
    setCurrentPage(1)
  }

  const getActionIcon = (action: string) => {
    switch (action?.toLowerCase()) {
      case "create":
      case "add":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "update":
      case "edit":
        return <Settings className="w-4 h-4 text-blue-500" />
      case "delete":
      case "remove":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "view":
      case "read":
        return <Eye className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action?.toLowerCase()) {
      case "create":
      case "add":
        return (
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
            {action}
          </Badge>
        )
      case "update":
      case "edit":
        return (
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
            {action}
          </Badge>
        )
      case "delete":
      case "remove":
        return (
          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
            {action}
          </Badge>
        )
      case "view":
      case "read":
        return (
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
            {action}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100">
            {action}
          </Badge>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString("vi-VN")
    } catch {
      return dateString
    }
  }

  // Calculate statistics
  const totalLogs = auditlogs.length
  const uniqueUsers = new Set(auditlogs.map((log) => log.username)).size
  const recentLogs = auditlogs.filter((log) => {
    const logDate = new Date(log.createdAt)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - logDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 1
  }).length

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
                      Thông tin nhân viên
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Nhật ký hoạt động</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-4 md:p-8 space-y-8">
              {/* Enhanced Header Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <Shield className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-normal">
                        Nhật ký <span className="text-orange-500">hoạt động</span>
                      </h1>
                      <p className="text-muted-foreground mt-1">Theo dõi và giám sát các hoạt động trong hệ thống</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                  </Button>
                </div>
              </div>

              {/* Enhanced Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-50/5 hover:border-blue-500/40 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-600/80 transition-colors">
                          Tổng hoạt động
                        </p>
                        <p className="text-3xl font-bold text-blue-600 group-hover:text-blue-500 transition-colors">
                          {totalLogs}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                          <Database className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group relative transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 border border-green-500/20 bg-gradient-to-br from-card via-card to-green-50/5 hover:border-green-500/40 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="relative p-6 z-10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-green-600/80 transition-colors">
                          Người dùng hoạt động
                        </p>
                        <p className="text-3xl font-bold text-green-600 group-hover:text-green-500 transition-colors">
                          {uniqueUsers}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                          <User className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform duration-300" />
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
                          Hoạt động gần đây
                        </p>
                        <p className="text-3xl font-bold text-purple-600 group-hover:text-purple-500 transition-colors">
                          {recentLogs}
                        </p>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-500" />
                        <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                          <Zap className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Search Form */}
              <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Filter className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Bộ lọc tìm kiếm
                    </span>
                  </CardTitle>
                  <CardDescription className="ml-12">Tìm kiếm hoạt động theo chức năng và thời gian</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="resource" className="text-sm font-semibold flex items-center gap-2">
                          <Search className="w-4 h-4 text-primary" />
                          Chức năng
                        </Label>
                        <Input
                          id="resource"
                          name="resource"
                          value={searchParams.resource}
                          onChange={handleInputChange}
                          placeholder="Nhập tên chức năng..."
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="startDate" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Từ ngày
                        </Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={searchParams.startDate}
                          onChange={handleInputChange}
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="endDate" className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Đến ngày
                        </Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={searchParams.endDate}
                          onChange={handleInputChange}
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="transition-all duration-300 hover:scale-105 min-w-[120px] h-12 px-8 bg-gradient-to-r from-[#4D7C0F] to-[#79ac37] hover:from-[#79ac37] hover:to-[#4D7C0F] shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Đang tìm...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Tìm kiếm
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Enhanced Data Table */}
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                <CardHeader className="p-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Danh sách hoạt động
                    </span>
                  </CardTitle>
                  <CardDescription className="ml-12">
                    Hiển thị {auditlogs.length} bản ghi trên tổng số {totalPages * size} bản ghi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-x-auto bg-background">
                    <table className="min-w-full divide-y divide-gray-200 text-center">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người dùng
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hành động
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Chức năng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Chi tiết
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {auditlogs.map((log, index) => (
                          <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-black">{page * size + index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-left">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src="/placeholder.svg" alt={log.username} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                    {getInitials(log.username || "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-900">{log.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                {getActionIcon(log.action)}
                                {getActionBadge(log.action)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-left">
                              <div className="flex items-center gap-2">
                                {/* <Settings className="w-4 h-4 text-muted-foreground" /> */}
                                <span className="font-medium text-black">{log.resource}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-left max-w-xs">
                              <div className="truncate text-sm text-gray-600" title={log.details}>
                                {log.details}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                {/* <Clock className="w-4 h-4 text-muted-foreground" /> */}
                                <span className="text-sm font-mono text-black">{log.createdAt}</span>
                              </div>
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
                        disabled={page === 0 || loading}
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
                        disabled={page >= totalPages - 1 || loading}
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

export default AuditLogPage
