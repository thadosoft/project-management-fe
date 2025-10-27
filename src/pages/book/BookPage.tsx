import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Book, BookRequest } from "@/models/Book";

import { Separator } from "@radix-ui/react-separator";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ItemBook } from "@/components/item-book";
import { createBook, getTotalBooks, searchBooks } from "@/services/bookService";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookAddForm } from "@/components/book-add-form";
import {
  uploadBookImage,
  uploadMultipleBookImages,
} from "@/services/material/uploadFileService";

function BookPage() {
  const [totalPages, setTotalPages] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [books, setBooks] = useState<Book[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await searchBooks("", page, size); // Fetch books with pagination
        const totalresponse = await getTotalBooks(""); // Fetch total number of books
        // Update state with fetched data
        setBooks(response.content);
        setTotalPages(response.totalPages);
        setPage(response.number);
        setTotalBooks(totalresponse);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, size]);

  const handleCreateBook = async (data: BookRequest, images: File[]) => {
    try {
      // 1. Tạo sách mới
      const bookCreated: Book | null = await createBook(data);

      // Biến lưu ID sách mới
      let bookId: number;

      if (bookCreated?.id) {
        // Nếu API trả về ID
        bookId = Number(bookCreated.id);
        setBooks((prev) => [...prev, bookCreated]);
      } else {
        // Nếu API không trả ID → lấy sách mới nhất từ API khác
        console.warn("createBook thiếu id, thử lấy id từ getAllBooks");
        const allBooks = await searchBooks("");
        const latestBook = allBooks?.content.sort(
          (a, b) => Number(b.id) - Number(a.id)
        )[0];
        bookId = latestBook ? Number(latestBook.id) : 0;
        if (!bookId) {
          throw new Error("Không thể lấy ID sách vừa tạo");
        }
      }

      // 2. Upload ảnh nếu có
      if (images.length > 0) {
        try {
          await uploadMultipleBookImages(images, bookId);
          // Sau khi upload xong → fetch lại thông tin sách đó để cập nhật hình
          const updated = await searchBooks(data.title);
          const updatedBook = updated.content.find((b) => b.id === bookId);
          if (updatedBook) {
            setBooks((prev) =>
              prev.map((b) => (b.id === bookId ? updatedBook : b))
            );
          }
          alert("Tải hình ảnh thành công!");
        } catch (error) {
          console.error("Lỗi khi tải hình ảnh:", error);
          alert("Tải hình ảnh thất bại!");
        }
      }
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const handleRemoveBook = (bookId: number) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Breadcums header*/}
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
                      Quản lý kho sách
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
            <div className="relative z-10 px-6 py-12 lg:px-8">
              <div className="mx-auto max-w-full px-4">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 animate-pulse" />
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
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                        Sách AITS
                      </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Quản lý và theo dõi thông tin sách trong thư viện công ty{" "}
                      <br /> Ms.Tien (+84 853552097)
                    </p>
                  </div>
                </div>
                {/* End Hero Section */}

                {/* Quick Stats - Single Card */}
                <div className="flex justify-center max-w-4xl mx-auto">
                  <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 min-w-[280px]">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold text-foreground">
                          {totalBooks}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Tổng số sách trong thư viện
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Quick Stats */}

                {/* Projects Grid Section */}
                <div className="animate-in slide-in-from-bottom-8 duration-1000 ease-out pt-4">
                  <Card className="border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
                      <CardTitle className="flex items-center gap-4 text-2xl p-2">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                            Quản lý kho sách
                          </span>
                          <p className="text-sm text-muted-foreground font-normal mt-1">
                            Tất cả sách của bạn trong một nơi
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {books.map((book: Book, index) => (
                          <div
                            className="group transition-all duration-500 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <ItemBook
                              book={book}
                              removeBook={handleRemoveBook}
                            />
                          </div>
                        ))}

                        <BookAddForm
                          onSubmit={handleCreateBook}
                          isLoading={loading}
                        />
                      </div>

                      {/* Empty State */}
                      {books.length === 0 && (
                        <div className="text-center py-16 space-y-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <FolderOpen className="w-10 h-10 text-blue-500" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              Chưa có sách nào trong hệ thống
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Bắt đầu thêm sách mới vào thư viện của bạn để quản
                              lý
                            </p>
                          </div>
                          <Dialog
                            modal={false}
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                Tạo dự án đầu tiên
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      )}

                      {/* Enhanced Pagination */}
                      <div className="flex justify-center mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 0))
                            }
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
                            onClick={() =>
                              setPage((prev) =>
                                Math.min(prev + 1, totalPages - 1)
                              )
                            }
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
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default BookPage;
