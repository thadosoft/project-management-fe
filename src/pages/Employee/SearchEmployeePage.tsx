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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { removeEmployee, searchEmployees } from "@/services/employee/EmployeeService"
import type { Employee, SearchEmployeeRequest } from "@/models/EmployeeRequest"
import { useNavigate } from "react-router"
import tokenService from "@/services/tokenService"
import { Search, Eye, Trash2, Users, Building2, ChevronLeft, ChevronRight } from "lucide-react"

function SearchEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [_, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState<number>(0)
  const [size] = useState<number>(5)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState<SearchEmployeeRequest>({
    fullName: "",
    career: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      tokenService.accessToken = token
      loadEmployees()
    }
  }, [page])

  const loadEmployees = async () => {
    setLoading(true)
    try {
      const response = await searchEmployees(searchParams, page, size)
      setEmployees(response.content)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    setCurrentPage(1)
    await loadEmployees()
  }

  const handleViewDetail = (employeeId: number) => {
    navigate(`/detail-employee/${employeeId}`)
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      await removeEmployee(employeeId)
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== employeeId))
    } catch (error) {
      console.error("Lỗi khi xoá nhân viên:", error)
    }
  }

  const getGenderBadge = (gender: string) => {
    return gender === "Nam" ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Nam
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
        Nữ
      </Badge>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/home">Thông tin nhân viên</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tìm kiếm nhân viên</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex-1 space-y-6 p-6">
            {/* Search Form */}
            <Card className="border-green-200 shadow-sm">
              <CardHeader className="pb-4 ml-6">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Search className="h-5 w-5 text-green-600" />
                  Tìm kiếm thông tin nhân viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Tên nhân viên
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={searchParams.fullName}
                        onChange={handleInputChange}
                        placeholder="Tên"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="career" className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Phòng ban
                      </Label>
                      <Input
                        id="career"
                        name="career"
                        value={searchParams.career}
                        onChange={handleInputChange}
                        placeholder="Phòng ban"
                        className="h-10"
                      />
                    </div>
                    <div className="flex justify-start border-t pt-6">
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-3 flex justify-center"
                      disabled={loading}
                    >
                      <Search className="h-4 w-4" />
                      {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                    </Button>
                  </div>
                  </div>
                  
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold p-4">
                  Danh sách nhân viên ({employees.length} kết quả)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Không tìm thấy nhân viên nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {employees.map((employee) => (
                      <Card key={employee.id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.fullName} />
                                <AvatarFallback className="bg-green-100 text-green-700">
                                  {employee.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{employee.fullName}</h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>📧 {employee.email}</span>
                                  <span>🏢 {employee.career || "Chưa cập nhật"}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right space-y-1">
                                {getGenderBadge(employee.gender)}
                                <div className="text-xs text-muted-foreground">MST: {employee.tax || "N/A"}</div>
                                <div className="text-xs text-muted-foreground">
                                  Sinh: {employee.placeOfBirth || "N/A"}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetail(employee.id)}
                                  className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Xem
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Xoá
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Xác nhận xoá nhân viên</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xoá nhân viên <strong>{employee.fullName}</strong>? Hành
                                        động này không thể hoàn tác.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteEmployee(employee.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Xoá
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        Trang {page + 1} / {totalPages}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default SearchEmployeePage
