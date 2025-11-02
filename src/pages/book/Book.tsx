"use client";

import { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CheckCircle2, Clock, CheckCircle, BellIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard } from "@/components/profile-card";
import { searchBooks, deleteBook, createBook } from "@/services/bookService";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import type { Book, BookRequest } from "@/models/Book";
import { BookCreateForm } from "@/components/BookCreateForm";
import { useDebounce } from "use-debounce";
import { BookTable } from "./BookTable";
import { BookDetailsModal } from "./BookDetailsModal";
import { BookBorrowForm } from "@/components/book-borrow-form";
import { BookLoan, CreateBookLoanRequest } from "@/models/BookLoan";
import { createBookLoan, searchBookLoans } from "@/services/bookLoanService";

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookLoans, setBookLoans] = useState<BookLoan[]>([])
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [filters, setFilters] = useState<{
    status?: string;
    category?: string;
  }>({ status: "", category: "" });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const itemsPerPage = 10;
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
  


  const fetchBooks = async (page = 0) => {
    try {
      setLoading(true);

      const request: BookRequest = {};

      if (debouncedQuery && debouncedQuery.trim() !== "") {
        request.title = debouncedQuery.trim();
      }

      const result = await searchBooks(request, page, itemsPerPage);

      if (result) {
        setBooks(result.content);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
      } else {
        toast.error("Lỗi khi tải danh sách sách");
      }
    } catch (error) {
      console.log("[v0] Error fetching books:", error);
      toast.error("Lỗi khi tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(0);
  }, [debouncedQuery, filters]);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleEditBook = (book: Book) => {};

  const handleDeleteBook = async (id: number) => {
    try {
      setIsSubmitting(true);
      const result = await deleteBook(id);
      if (result !== null) {
        toast.success("Đã xóa sách");
        fetchBooks(currentPage - 1);
      } else {
        toast.error("Lỗi khi xóa sách");
      }
    } catch (error) {
      console.log("[v0] Error deleting book:", error);
      toast.error("Lỗi khi xóa sách");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBookLoan = async (formData: CreateBookLoanRequest) => {
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
        if (loanResponse?.content) setBookLoans(loanResponse.content)
  
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

  const borrowForm = useMemo(
    () => <BookBorrowForm onSubmit={handleAddBookLoan} isLoading={isSubmitting} />,
    [isSubmitting]
  );

  const bookForm = useMemo(
    () => (
      <BookCreateForm
        onSubmit={async (data) => {
          setIsSubmitting(true);
          try {
            const created = await createBook(data);
            if (created) {
              toast.success("Đã thêm sách mới!");
              fetchBooks(currentPage - 1);
            }
          } catch {
            toast.error("Không thể thêm sách");
          } finally {
            setIsSubmitting(false);
          }
        }}
        isLoading={isSubmitting}
      />
    ),
    [isSubmitting]
  );

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
    );
  }

  // Thống kê dữ liệu thực
  const totalBooks = books.length;
  const availableBooks = books.filter(
    (b) => (b.quantity_available ?? 0) >= 2
  ).length;
  const outOfStockBooks = books.filter(
    (b) => (b.quantity_available ?? 0) === 0
  ).length;
  const lowStockBooks = books.filter(
    (b) => (b.quantity_available ?? 0) > 0 && (b.quantity_available ?? 0) <= 1
  ).length;

  const stats = [
    {
      icon: BookOpen,
      value: totalBooks,
      label: "Tổng sách",
      bgFrom: "from-blue-500",
      bgTo: "to-blue-600",
      shadow: "hover:shadow-blue-500/10",
    },
    {
      icon: CheckCircle2,
      value: availableBooks,
      label: "Có sẵn",
      bgFrom: "from-emerald-500",
      bgTo: "to-emerald-600",
      shadow: "hover:shadow-emerald-500/10",
    },
    {
      icon: Clock,
      value: outOfStockBooks,
      label: "Tạm hết",
      bgFrom: "from-orange-500",
      bgTo: "to-orange-600",
      shadow: "hover:shadow-orange-500/10",
    },
    {
      icon: BellIcon,
      value: lowStockBooks,
      label: "Số lượng ít",
      bgFrom: "from-red-500",
      bgTo: "to-red-600",
      shadow: "hover:shadow-red-500/10",
    },
  ];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 items-center gap-2 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 opacity-50"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/home"
                      className="hover:text-primary font-medium"
                    >
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Quản lý Sách
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main */}
          <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800">
            <div className="relative z-10 px-6 py-12 lg:px-8 max-w-full mx-auto">
              {/* Hero */}
              <div className="text-center space-y-8 mb-12">
                <div
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full 
                      bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Quản lý thư viện
                  </span>
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

                <div className="flex justify-center gap-3 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    {borrowForm}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    {bookForm}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowContactInfo(!showContactInfo)}
                    className="gap-2 hover:bg-primary/10"
                  >
                    {showContactInfo ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Ẩn liên hệ
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Hiện liên hệ
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto pb-10">
                {stats.map(
                  ({ icon: Icon, value, label, bgFrom, bgTo, shadow }) => (
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
                          <div className="text-2xl font-bold text-foreground">
                            {value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {label}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Table */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-4 px-6 border-b border-border/50 bg-gradient-to-r from-blue-200/10 to-purple-200/10 flex justify-between items-left">
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Danh sách
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hiển thị{" "}
                      {books.length > 0
                        ? (currentPage - 1) * itemsPerPage + 1
                        : 0}{" "}
                      đến {Math.min(currentPage * itemsPerPage, totalElements)}{" "}
                      trong {totalElements} sách
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <BookTable
                      data={books}
                      loading={loading}
                      onView={handleViewDetails}
                      onEdit={handleEditBook}
                      onDelete={handleDeleteBook}
                    />
                  </div>

                  {/* {books.length > 0 && (
                    <div className="border-t border-border/50 bg-muted/30 px-6 py-4">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </div>
          </div>
          <BookDetailsModal
            book={selectedBook}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onUpdated={() => fetchBooks(currentPage - 1)}
          />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default BooksPage;
