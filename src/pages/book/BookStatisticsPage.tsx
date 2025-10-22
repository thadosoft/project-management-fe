import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookBorrowForm } from "@/components/book-borrow-form"
import { searchBookLoans, createBookLoan } from "@/services/bookLoanService";
import type { BookLoan, CreateBookLoanRequest, BookLoanRequest } from "@/models/BookLoan";
import { getBookLoanStats } from "@/services/bookLoanService";
import type { BookLoanStatsResponse } from "@/models/BookLoan";
import { BookOpen, CheckCircle2, Clock, Eye } from "lucide-react"
import { parse, format } from "date-fns"
import { BookDetailsModal } from "./BookDetailsModal"


function BookStatisticsPage() {
  const [books, setBooks] = useState<BookLoan[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookLoan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  //thong ke so luong theo trang thai
  const [stats, setStats] = useState<BookLoanStatsResponse>({
    totalBorrowed: 0,
    totalReturned: 0,
    totalOverdue: 0,
  });

  // console.log("Books:", stats);

  // helper de dinh dang ngay thang
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    const parsed = parse(dateStr, "dd/MM/yyyy HH:mm:ss", new Date())
    return format(parsed, "dd/MM/yyyy")
  }

  // xem chi tiet sach
  const handleViewDetails = (book: BookLoan) => {
    setSelectedBook(book)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const request: BookLoanRequest = {};
        const response = await searchBookLoans(request, 0, 100); // page=0, size=100
        if (response?.content) {
          setBooks(response.content);
          console.log("Fetched books:", response.content);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);


  const handleAddBook = async (formData: CreateBookLoanRequest) => {
    setIsSubmitting(true);
    try {
      const newBook = await createBookLoan(formData);
      if (newBook) {
        setBooks([...books, newBook]);
      }
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any }> = {
      AVAILABLE: {
        label: "Có sẵn",
        variant: "default",
      },
      BORROWED: {
        label: "Đang mượn",
        variant: "secondary",
      },
    }

    const config = statusConfig[status] || statusConfig.AVAILABLE
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookLoanStats();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

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
          <div className="flex-1 relative min-h-screen overflow-hidden 
                bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 
                dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800">

            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent 
                  rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent 
                  rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 px-6 py-12 lg:px-8 max-w-full mx-auto">

              {/* Hero Section */}
              <div className="text-center space-y-8 mb-12">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Quản lý thư viện</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight space-y-2">
                  <span className="block bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 
                         dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                    Thư viện
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
                         bg-clip-text text-transparent animate-gradient">
                    Sách AITS
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Quản lý và theo dõi thông tin sách trong thư viện công ty <br /> Mrs.Tien (+84 853552097)
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                    { icon: BookOpen, value: books.length, label: "Tổng sách", bgFrom: "from-blue-500", bgTo: "to-blue-600", shadow: "hover:shadow-blue-500/10" },
                    { icon: CheckCircle2, value: stats.totalOverdue, label: "Quá hạn", bgFrom: "from-emerald-500", bgTo: "to-emerald-600", shadow: "hover:shadow-emerald-500/10" },
                    { icon: Clock, value: stats.totalReturned, label: "Đang mượn", bgFrom: "from-orange-500", bgTo: "to-orange-600", shadow: "hover:shadow-orange-500/10" },
                  ].map(({ icon: Icon, value, label, bgFrom, bgTo, shadow }) => (
                    <div key={label} className={`group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 
                                        dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm 
                                        border border-white/20 dark:border-slate-700/50 
                                        hover:scale-105 transition-all duration-300 ${shadow}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${bgFrom} ${bgTo} text-white group-hover:scale-110 transition-transform duration-300`}>
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
              <Card className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3 border-b border-border/50 justify-between items-center flex flex-col sm:flex-row gap-4">
                  <CardTitle className="text-lg font-semibold">Danh sách sách</CardTitle>
                  <BookBorrowForm onSubmit={handleAddBook} isLoading={isSubmitting} />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 border-b border-border/50">
                        <tr>
                          {["Tên sách", "Tác giả", "Người mượn", "Chủ sở hữu", "Ngày mượn", "Tình trạng", "Vị trí", "Hành động"].map((th) => (
                            <th key={th} className="px-4 py-3 text-center font-semibold text-foreground">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {books.map((book) => (
                          <tr key={book.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-auto py-auto text-center text-muted-foreground">{book.bookTitle}</td>
                            <td className="px-auto py-auto text-center text-muted-foreground">{book.approverName}</td>
                            <td className="px-auto py-auto text-center text-muted-foreground">{book.borrowerName}</td>
                            <td className="px-auto py-auto text-center font-medium text-foreground">{book.bookOwner}</td>
                            <td className="px-auto py-auto text-center text-muted-foreground">
                              {book.approvedAt}
                            </td>
                            <td className="px-4 text-center py-3">{book.status}</td>
                            <td className="px-4 text-center py-3">{book.remarks}</td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(book)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Eye className="w-4 h-4 text-primary" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {books.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">Chưa có sách nào trong hệ thống</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <BookDetailsModal
                book={selectedBook}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default BookStatisticsPage
