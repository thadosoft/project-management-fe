"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookBorrowForm } from "@/components/book-borrow-form";
import type { BookLoan, BookLoanRequest } from "@/models/BookLoan";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Undo2,
  AlarmClockMinus,
} from "lucide-react";
import { checkOverdueLoans, getBooksLoans, returnBook } from "@/services/bookLoanService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseVNDate } from "@/utils/dateUtils";

function BookStatisticsPage() {
  const [books, setBooks] = useState<BookLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookLoan | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        await checkOverdueLoans(); // Check and update overdue loans on load
        const response = await getBooksLoans();
        setBooks(response);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = async (formData: BookLoanRequest) => {
    setIsSubmitting(true);
    try {
      // Uncomment when API is ready
      // const newBook = await createBook(formData);
      // if (newBook) {
      //   setBooks([...books, newBook]);
      // }

      // Mock implementation
      const newBook: BookLoan = {
        id: books.length + 1,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBooks([...books, newBook]);
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (book: BookLoan) => {
    setSelectedBook(book);
    // You can add a modal or drawer here to show book details
  };

  const handleReturnBook = async (book: BookLoan) => {
    console.log("Returning book:", book);
    if (!book.id) return;
    if (!confirm(`Xác nhận trả sách "${book.bookTitle}"?`)) return;

    const success = await returnBook(book.id);
    if (success) {
      alert("✅ Trả sách thành công!");
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id
            ? {
                ...b,
                status: "AVAILABLE",
                returnedAt: new Date().toISOString(),
              }
            : b
        )
      );
    } else {
      alert("❌ Lỗi khi trả sách, vui lòng thử lại!");
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
      OVERDUE: {
        label: "Quá hạn",
        variant: "destructive", 
      },
    };

    const config = statusConfig[status] || statusConfig.AVAILABLE;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusText = (status: string | null | undefined): string => {
    switch (status) {
      case "AVAILABLE":
      case "RETURNED":
        return "Có sẵn";
      case "BORROWED":
        return "Đang mượn";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return "-";
    }
  };

  const stats = {
    total: books.length,
    available: books.filter(
      (b) => b.status === "AVAILABLE" || b.status === "RETURNED"
    ).length,
    borrowed: books.filter((b) => b.status === "BORROWED").length,
    overdue: books.filter((b) => b.status === "OVERDUE").length,
  };

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

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
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
                      className="hover:text-primary transition-colors font-medium"
                    >
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Thống kê mượn trả sách
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

            <div className="relative z-10 px-6 py-12 lg:px-8">
              <div className="mx-auto max-w-full">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Quản lý thư viện
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                        Thư viện
                      </span>
                      <br />
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                        Sách AITS
                      </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Quản lý và theo dõi thông tin sách trong thư viện công ty{" "}
                      <br /> Ms.Tien (+84 853552097)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {stats.total}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tổng sách
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {stats.available}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Có sẵn
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white group-hover:scale-110 transition-transform duration-300">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {stats.borrowed}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Đang mượn
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white group-hover:scale-110 transition-transform duration-300">
                          <AlarmClockMinus className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-foreground">
                            {stats.overdue}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Quá hạn
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <Card className="border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="px-3 pb-3 border-b border-border/50 justify-between items-center flex flex-col sm:flex-row gap-4">
                    <CardTitle className="text-lg font-semibold">
                      Danh sách phiếu mượn
                    </CardTitle>
                    <BookBorrowForm
                      onSubmit={handleAddBook}
                      isLoading={isSubmitting}
                    />
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/30 border-b border-border/50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Tên sách
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Tác giả
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Người mượn
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Chủ sở hữu
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Ngày mượn
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                              Tình trạng
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-foreground">
                              Xem chi tiết
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-foreground">
                              Trả sách
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {books.map((book) => (
                            <tr
                              key={book.id}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium text-foreground">
                                {book.bookTitle}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {book.approverName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {book.borrowerName}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {book.bookOwner}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {book.borrowDate
                                  ? parseVNDate(book.borrowDate)
                                      ?.toLocaleString("vi-VN")
                                      .replace(",", "")
                                  : "-"}
                              </td>
                              <td className="px-4 py-3">
                                {getStatusBadge(book.status)}
                              </td>

                              {/* View Details Action */}
                              <td className="px-4 py-3 text-center">
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewDetails(book)}
                                      className="h-8 w-8 p-0 hover:bg-primary/10"
                                    >
                                      <Eye className="w-4 h-4 text-primary" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
                                    <DialogHeader className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                          <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                            Chi tiết phiếu mượn
                                          </DialogTitle>
                                          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            Hiển thị thông tin chi tiết phiếu mượn
                                          </DialogDescription>
                                        </div>
                                      </div>
                                    </DialogHeader>

                                    {/* Book Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm text-foreground">
                                      {/** Từng field bọc trong card nhỏ với shadow nhẹ */}
                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Tên sách
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.bookTitle || "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Chủ sở hữu
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.bookOwner || "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Người mượn
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.borrowerName || "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Người duyệt
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.approverName || "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Ngày mượn
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.borrowDate
                                            ? parseVNDate(
                                                selectedBook?.borrowDate
                                              )
                                                ?.toLocaleString("vi-VN")
                                                .replace(",", "")
                                            : "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Ngày đến hạn
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.dueDate
                                            ? parseVNDate(
                                                selectedBook?.dueDate
                                              )
                                                ?.toLocaleString("vi-VN")
                                                .replace(",", "")
                                            : "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Ngày trả
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.returnedAt
                                            ? parseVNDate(
                                                selectedBook?.returnedAt
                                              )
                                                ?.toLocaleString("vi-VN")
                                                .replace(",", "")
                                            : "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Tình trạng sách
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.bookCondition || "-"}
                                        </p>
                                      </div>

                                      <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Trạng thái
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {getStatusText(selectedBook?.status)}
                                        </p>
                                      </div>

                                      <div className="md:col-span-2 p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">
                                          Ghi chú
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                          {selectedBook?.remarks || "-"}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </td>

                              <td className="px-4 py-3 text-center">
                                {book.status === "BORROWED" ||
                                book.status === "OVERDUE" ? (
                                  <Button
                                    onClick={() => handleReturnBook(book)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                  >
                                    <Undo2 />
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {books.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          Chưa có sách nào trong hệ thống
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default BookStatisticsPage;
