"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookBorrowForm } from "@/components/book-borrow-form"
import { searchBookLoans, createBookLoan } from "@/services/bookLoanService"
import type { BookLoan, CreateBookLoanRequest, BookLoanRequest } from "@/models/BookLoan"
import { getBookLoanStats } from "@/services/bookLoanService"
import type { BookLoanStatsResponse } from "@/models/BookLoan"
import { BookOpen, CheckCircle2, Clock, Eye, ChevronDown, ChevronUp, Loader2, RefreshCw, CheckCircle } from "lucide-react"
import { BookDetailsModal } from "./BookLoanDetailsModal"
import { ProfileCard } from "@/components/profile-card"
import toast from "react-hot-toast";
import { checkOverdueBookLoans } from "@/services/bookLoanService"
import { markBookLoanAsReturned } from "@/services/bookLoanService"
import { NotificationModal } from "@/components/NotificationModal"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { BookLoanTable } from "./BookLoanTable"

function BookStatisticsPage() {
  const [books, setBooks] = useState<BookLoan[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookLoan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  //thong ke so luong theo trang thai
  const [stats, setStats] = useState<BookLoanStatsResponse>({
    borrowedCount: 0,
    returnedCount: 0,
    overdueCount: 0,
  })

  // xem chi tiet sach
  const handleViewDetails = (book: BookLoan) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  //trả sách
  const handleReturnBook = async (book: BookLoan) => {
    try {
      setIsSubmitting(true);
      await markBookLoanAsReturned(book.id);
      setNotification({
        open: true,
        message: "Đã trả sách thành công!",
        type: "success",
      });
      const request: BookLoanRequest = {};
      const response = await searchBookLoans(request, 0, 10);
      if (response?.content) setBooks(response.content);
    } catch (error) {
      setNotification({
        open: true,
        message: "Không thể trả sách!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  //khai báo modal thông báo
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    type: "success" | "error" | "warning"
  }>({
    open: false,
    message: "",
    type: "success",
  })


  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const request: BookLoanRequest = {}
        const response = await searchBookLoans(request, 0, 100) // page=0, size=100
        if (response?.content) {
          setBooks(response.content)
        } else {
          setBooks([])
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const totalPages = Math.ceil(books.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBooks = books.slice(startIndex, endIndex)

  const handleAddBook = async (formData: CreateBookLoanRequest) => {
  setIsSubmitting(true)
  try {
    const newBookLoan = await createBookLoan(formData)
    setNotification({
      open: true,
      message: "Đã mượn sách thành công!",
      type: "success",
    })

    if (newBookLoan) {
      // cập nhật danh sách phiếu mượn
      const loanResponse = await searchBookLoans({}, 0, 100)
      if (loanResponse?.content) setBooks(loanResponse.content)

      // ✅ cập nhật lại danh sách sách
      await searchBookLoans({}, 0, 100)
    }
  } catch (error) {
    console.error("Error adding book:", error)
    setNotification({
      open: true,
      message: "Không thể mượn sách!",
      type: "error",
    })
  } finally {
    setIsSubmitting(false)
  }
}


  const handleCheckOverdue = async () => {
    setIsSubmitting(true)
    try {
      const message = await checkOverdueBookLoans()
      // toast.success(message || "Thành công!");
      setNotification({
        open: true,
        message: message || "Đã cập nhật thành công!",
        type: "success",
      });

      // sau khi cập nhật xong, fetch lại danh sách và thống kê
      const request: BookLoanRequest = {}
      const response = await searchBookLoans(request, 0, 10)
      if (response?.content) setBooks(response.content)

      const statsData = await getBookLoanStats()
      if (statsData) setStats(statsData)
    } catch (error) {
      console.error("Error checking overdue:", error)
      toast.error("Đã xảy ra lỗi khi kiểm tra phiếu quá hạn.")
    } finally {
      setIsSubmitting(false)
    }
  }


  const borrowForm = useMemo(() => (
    <BookBorrowForm onSubmit={handleAddBook} isLoading={isSubmitting} />
  ), [isSubmitting]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookLoanStats()
        if (data) {
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 w-full max-w-6xl mx-auto p-6">
          <Skeleton className="h-8 w-48 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/home" className="hover:text-primary transition-colors font-medium">
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Thống kê sách
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div
            className="flex-1 relative min-h-screen overflow-hidden 
                bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 
                dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800"
          >
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div
              className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent 
                  rounded-full blur-3xl animate-pulse pointer-events-none"
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent 
                  rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"
            />

            {/* Content */}
            <div className="relative z-10 px-6 py-12 lg:px-8 max-w-full mx-auto">
              {/* Hero Section */}
              <div className="text-center space-y-8 mb-12">
                <div
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Quản lý thư viện</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight space-y-2">
                  <span
                    className="block bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 
                         dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent"
                  >
                    Thư viện
                  </span>
                  <span
                    className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
                         bg-clip-text text-transparent animate-gradient"
                  >
                    Sách AITS
                  </span>
                </h1>

                <div className="space-y-3">
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Quản lý và theo dõi thông tin sách trong thư viện công ty
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="flex justify-between items-center ">
                      {borrowForm}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowContactInfo(!showContactInfo)}
                      className="gap-2 hover:bg-primary/10"
                    >
                      {showContactInfo ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ẩn thông tin liên hệ
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Hiện thông tin liên hệ
                        </>
                      )}
                    </Button>
                  </div>

                  {showContactInfo && (
                    <div className="animate-in fade-in duration-300">
                      <ProfileCard
                        name="Mrs.Tien"
                        title="Quản lý thư viện"
                        email="tien.ntu@thadosoft.com"
                        phone="+84 853552097"
                        avatar="https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/468279569_2080239279045625_1679455235350617662_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=XsAPMqT7_TQQ7kNvwEWIXMY&_nc_oc=Adkcx8Q895jlOK9XLRHGJME9FVjUwfNFkjm3gBWmn04Yk8LCUIVpbuQezA0uZLpMuLi-ZYcnzK8qdvr0jE4WTFmD&_nc_zt=24&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=_CRCrJDHNbNbEpcrGvmGXw&oh=00_AfdXa7j3mMFkW_1JdZONhlZCXOjQ7PeqWADtY1x6lC9UAg&oe=68FE0FD2"
                      />
                    </div>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                  {[
                    {
                      icon: BookOpen,
                      value: books.length,
                      label: "Tổng phiếu",
                      bgFrom: "from-blue-500",
                      bgTo: "to-blue-600",
                      shadow: "hover:shadow-blue-500/10",
                    },
                    {
                      icon: CheckCircle,
                      value: stats.borrowedCount,
                      label: "Đang mượn",
                      bgFrom: "from-emerald-500",
                      bgTo: "to-emerald-600",
                      shadow: "hover:shadow-emerald-500/10",
                    },
                    {
                      icon: CheckCircle2,
                      value: stats.returnedCount,
                      label: "Đã trả",
                      bgFrom: "from-emerald-500",
                      bgTo: "to-emerald-600",
                      shadow: "hover:shadow-emerald-500/10",
                    },
                    {
                      icon: Clock,
                      value: stats.overdueCount,
                      label: "Quá hạn",
                      bgFrom: "from-orange-500",
                      bgTo: "to-orange-600",
                      shadow: "hover:shadow-orange-500/10",
                    },
                  ].map(({ icon: Icon, value, label, bgFrom, bgTo, shadow }) => (
                    <div
                      key={label}
                      className={`group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 
                                        dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm 
                                        border border-white/20 dark:border-slate-700/50 
                                        hover:scale-105 transition-all duration-300 ${shadow}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${bgFrom} ${bgTo} text-white group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">{value}</div>
                          <div className="text-sm text-muted-foreground">{label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book List Table */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-4 px-2 border-b border-border/50 justify-between items-center flex flex-col sm:flex-row gap-4 bg-gradient-to-r from-blue-200/10 via-purple-200/10 to-blue-500/10">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Lịch sử mượn sách
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị {startIndex + 1} đến {Math.min(endIndex, books.length)} trong {books.length} sách
                    </p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleCheckOverdue}
                        disabled={isSubmitting}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang kiểm tra...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Cập nhật
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Kiểm tra trạng thái quá hạn của sách</TooltipContent>
                  </Tooltip>

                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <BookLoanTable
                      data={books}
                      loading={loading}
                      onView={handleViewDetails}
                      onReturn={handleReturnBook}
                    />

                    {books.length === 0 && (
                      <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg font-medium">Chưa có sách nào trong hệ thống</p>
                        <p className="text-muted-foreground/60 text-sm mt-2">Hãy thêm sách đầu tiên để bắt đầu</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <BookDetailsModal book={selectedBook} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <NotificationModal
        isOpen={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        type={notification.type}
      />

    </ThemeProvider>
  )
}

export default BookStatisticsPage
