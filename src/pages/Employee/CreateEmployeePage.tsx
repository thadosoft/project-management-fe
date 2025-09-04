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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Hash,
  Calendar,
  Globe,
  AlertCircle,
  Save,
  Loader2,
  Sparkles,
  Shield,
  Star,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmployeeRequest {
  username: string
  avatar: string
  fullName: string
  career: string
  placeOfBirth: string
  nation: string
  gender: string
  tax: string
  email: string
  phone: string
  companyEmail: string
  emergencyContact: string
  houseHoldAddress: string
  currentAddress: string
  description: string
  employeeCode: string
  totalLeave: number
}

function CreateEmployeePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [image, setImage] = useState<string>("https://randomuser.me/api/portraits/women/21.jpg")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [employee, setEmployee] = useState<EmployeeRequest>({
    username: "",
    avatar: "",
    fullName: "",
    career: "",
    placeOfBirth: new Date().toISOString().split("T")[0],
    nation: "",
    gender: "",
    tax: "",
    email: "",
    phone: "",
    companyEmail: "",
    emergencyContact: "",
    houseHoldAddress: "",
    currentAddress: "",
    description: "",
    employeeCode: "",
    totalLeave: 0,
  })

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result as string
        setImage(base64String)
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          avatar: base64String,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!employee.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống"
    if (!employee.username.trim()) newErrors.username = "Username không được để trống"
    if (!employee.email.trim()) newErrors.email = "Email không được để trống"
    if (!employee.gender.trim()) newErrors.gender = "Giới tính không được để trống"
    if (!employee.career.trim()) newErrors.career = "Phân hệ không được để trống"
    if (!employee.placeOfBirth.trim()) newErrors.placeOfBirth = "Ngày sinh không được để trống"
    if (!employee.nation.trim()) newErrors.nation = "Quốc gia không được để trống"
    if (!employee.companyEmail.trim()) newErrors.companyEmail = "Email công ty không được để trống"
    if (!employee.houseHoldAddress.trim()) newErrors.houseHoldAddress = "Địa chỉ thường trú không được để trống"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEmployee({ ...employee, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setEmployee({ ...employee, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Employee created:", employee)
      // navigate("/search-employee")
    } catch (error) {
      setError("Có lỗi xảy ra khi tạo nhân viên")
      console.error("Lỗi khi thêm nhân viên:", error)
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

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header with gradient background */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-background via-background to-background/50 backdrop-blur-sm border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/create-employee" className="hover:text-primary transition-colors">
                      Thông tin nhân viên
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Khởi tạo nhân viên</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main content with background pattern */}
          <div className="flex-1 space-y-8 p-4 md:p-8 pt-8 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Enhanced header section */}
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Khởi tạo nhân viên
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        Điền thông tin chi tiết để tạo hồ sơ nhân viên mới trong hệ thống
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
                  >
                    <Star className="w-4 h-4 text-primary" />
                    Nhân viên mới
                  </Badge>
                  <Badge variant="secondary" className="hidden md:flex items-center gap-2 px-3 py-1.5">
                    <Shield className="w-4 h-4" />
                    Bảo mật
                  </Badge>
                </div>
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="animate-in slide-in-from-top-2 mb-6 border-destructive/50 bg-destructive/5"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Enhanced Avatar Section */}
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center pb-6 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Camera className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Ảnh đại diện
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Tải lên ảnh đại diện chuyên nghiệp cho nhân viên
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-6 pb-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <Avatar className="relative w-36 h-36 border-4 border-background shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/20">
                        <AvatarImage src={image || "/placeholder.svg"} alt="Profile" className="object-cover" />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                          {employee.fullName ? getInitials(employee.fullName) : <User className="w-12 h-12" />}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="image-upload"
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="w-8 h-8 text-white" />
                          <span className="text-xs text-white font-medium">Thay đổi</span>
                        </div>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-muted-foreground">Nhấp vào ảnh để thay đổi</p>
                      <p className="text-xs text-muted-foreground/70">Định dạng: JPG, PNG. Tối đa 5MB</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Personal Information */}
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Thông tin cá nhân
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base ml-12">
                      Thông tin cơ bản và định danh của nhân viên
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="fullName" className="text-sm font-semibold flex items-center gap-2">
                        Họ và tên <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={employee.fullName}
                        onChange={handleChange}
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.fullName ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="username" className="text-sm font-semibold flex items-center gap-2">
                        Username <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={employee.username}
                        onChange={handleChange}
                        placeholder="Tên đăng nhập"
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.username ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.username && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.username}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="gender" className="text-sm font-semibold flex items-center gap-2">
                        Giới tính <span className="text-destructive">*</span>
                      </Label>
                      <Select value={employee.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger
                          className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 ${
                            errors.gender ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                          }`}
                        >
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="placeOfBirth" className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Ngày sinh <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="placeOfBirth"
                        name="placeOfBirth"
                        type="date"
                        value={employee.placeOfBirth}
                        onChange={handleChange}
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.placeOfBirth ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.placeOfBirth && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.placeOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="nation" className="text-sm font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Quốc gia <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nation"
                        name="nation"
                        value={employee.nation}
                        onChange={handleChange}
                        placeholder="Việt Nam"
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.nation ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.nation && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.nation}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="career" className="text-sm font-semibold flex items-center gap-2">
                        <Building className="w-4 h-4 text-primary" />
                        Phân hệ <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="career"
                        name="career"
                        value={employee.career}
                        onChange={handleChange}
                        placeholder="Kỹ thuật"
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.career ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.career && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.career}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Contact Information */}
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Thông tin liên hệ
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base ml-12">
                      Email và các thông tin liên lạc quan trọng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                        Email cá nhân <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={employee.email}
                        onChange={handleChange}
                        placeholder=""
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.email ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="companyEmail" className="text-sm font-semibold flex items-center gap-2">
                        Email công ty <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="companyEmail"
                        name="companyEmail"
                        type="email"
                        value={employee.companyEmail}
                        onChange={handleChange}
                        placeholder=""
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.companyEmail ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.companyEmail && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.companyEmail}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                        className="transition-all duration-300 h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 focus:bg-background"
                      />
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="emergencyContact" className="text-sm font-semibold">
                        Liên hệ khẩn cấp
                      </Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={employee.emergencyContact}
                        onChange={handleChange}
                        className="transition-all duration-300 h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 focus:bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Address Information */}
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Thông tin địa chỉ
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base ml-12">
                      Địa chỉ thường trú và tạm trú của nhân viên
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="houseHoldAddress" className="text-sm font-semibold flex items-center gap-2">
                        Địa chỉ thường trú <span className="text-destructive">*</span>
                      </Label>
                      <textarea
                        id="houseHoldAddress"
                        name="houseHoldAddress"
                        value={employee.houseHoldAddress}
                        onChange={handleChange}
                        placeholder="Tầng 2, Nhà Số 30 Đường Số 1, Khu Nhà Ở Hưng Phú..."
                        className={`flex min-h-[100px] w-full rounded-lg border-2 bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50 focus:bg-background resize-none ${
                          errors.houseHoldAddress ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.houseHoldAddress && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.houseHoldAddress}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="currentAddress" className="text-sm font-semibold flex items-center gap-2">
                        Địa chỉ tạm trú <span className="text-destructive">*</span>
                      </Label>
                      <textarea
                        id="currentAddress"
                        name="currentAddress"
                        value={employee.currentAddress}
                        onChange={handleChange}
                        placeholder="Tầng 2, Nhà Số 30 Đường Số 1, Khu Nhà Ở Hưng Phú..."
                        className={`flex min-h-[100px] w-full rounded-lg border-2 bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 focus:border-primary/50 focus:bg-background resize-none ${
                          errors.currentAddress ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.currentAddress && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.currentAddress}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Additional Information */}
                <Card className="transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-transparent via-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <Hash className="w-5 h-5 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Thông tin bổ sung
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base ml-12">
                      Mã số thuế và thông tin mô tả thêm về nhân viên
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="tax" className="text-sm font-semibold flex items-center gap-2">
                        Mã số thuế <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="tax"
                        name="tax"
                        value={employee.tax}
                        onChange={handleChange}
                        className={`transition-all duration-300 h-12 bg-background/50 border-2 focus:border-primary/50 focus:bg-background ${
                          errors.tax ? "border-destructive/50 bg-destructive/5" : "hover:border-primary/30"
                        }`}
                      />
                      {errors.tax && (
                        <p className="text-sm text-destructive animate-in slide-in-from-top-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.tax}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="description" className="text-sm font-semibold">
                        Mô tả
                      </Label>
                      <textarea
                        id="description"
                        name="description"
                        value={employee.description}
                        onChange={handleChange}
                        placeholder="Thông tin bổ sung về nhân viên, kỹ năng, kinh nghiệm..."
                        className="flex min-h-[120px] w-full rounded-lg border-2 bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/30 focus:border-primary/50 focus:bg-background resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Submit Section */}
                <div className="flex justify-end space-x-4 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    className="transition-all duration-300 hover:scale-105 h-12 px-8 bg-background/50 border-2 hover:border-primary/30 hover:bg-background"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="transition-all duration-300 hover:scale-105 min-w-[140px] h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thông tin
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default CreateEmployeePage
