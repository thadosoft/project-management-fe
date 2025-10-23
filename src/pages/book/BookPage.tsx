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
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Book, BookRequest } from "@/models/Book";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Plus,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ItemBook } from "@/components/item-book";
import { createBook, getTotalBooks, searchBooks } from "@/services/bookService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function BookPage() {
  const [totalPages, setTotalPages] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(3);
  const [books, setBooks] = useState<Book[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState<string>("");
  const [newBookAuthour, setNewBookAuthour] = useState<string>("");
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

  const handleCreateBook = async () => {
      const bookRequest: BookRequest = {
        title: newBookTitle,
        author: newBookAuthour,
      }
  
      const bookCreated: Book | null = await createBook(bookRequest)
  
      if (bookCreated) {
        setNewBookTitle("")
        setNewBookAuthour("")
        setIsDialogOpen(false)
        setBooks((prev) => [...prev, bookCreated])
      }
    }

  function handleRemoveBook(bookId: number): void {
    throw new Error("Function not implemented.");
  }

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
                      <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

                        {/* Enhanced Create Book Card */}
                        <Dialog
                          modal={false}
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <div className="group h-[23vh] rounded-2xl bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 cursor-pointer hover:from-purple-500/10 hover:via-purple-500/5 hover:to-purple-500/10 border-2 border-dashed border-muted-foreground/20 hover:border-purple-500/40 transition-all duration-500 flex flex-col p-8 items-center justify-center hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="relative z-10 space-y-4 text-center">
                                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                                </div>
                                <div>
                                  <div className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                                    Thêm sách
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Thêm sách mới vào thư viện
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent
                            onInteractOutside={(event) =>
                              event.preventDefault()
                            }
                            className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none"
                          >
                            <Card className="border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-700/70 backdrop-blur-xl shadow-2xl">
                              <CardHeader className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
                                <CardTitle className="flex items-center gap-4 text-xl">
                                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                                    <Sparkles className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                      Thêm sách mới
                                    </span>
                                    <p className="text-sm text-muted-foreground font-normal mt-1">
                                      Thêm sách vào thư viện
                                    </p>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-8">
                                <form className="space-y-6">
                                  <div className="space-y-3">
                                    <Label
                                      htmlFor="name"
                                      className="text-sm font-semibold flex items-center gap-2"
                                    >
                                      <Star className="w-4 h-4 text-blue-500" />
                                      Tên sách
                                    </Label>
                                    <Input
                                      id="name"
                                      placeholder="Nhập tựa đề sách..."
                                      value={newBookTitle}
                                      onChange={(e) =>
                                        setNewBookTitle(e.target.value)
                                      }
                                      className="h-12 bg-background/50 border-2 hover:border-blue-500/30 focus:border-cyan-500/50 transition-all duration-300 rounded-xl"
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <Label
                                      htmlFor="author"
                                      className="text-sm font-semibold flex items-center gap-2"
                                    >
                                      <Calendar className="w-4 h-4 text-blue-500" />
                                      Tên tác giả
                                    </Label>
                                    <Input
                                      id="author"
                                      placeholder="Nhập tên tác giả..."
                                      value={newBookAuthour}
                                      onChange={(e) =>
                                        setNewBookAuthour(e.target.value)
                                      }
                                      className="h-12 bg-background/50 border-2 hover:border-blue-500/30 focus:border-cyan-500/50 transition-all duration-300 rounded-xl"
                                    />
                                  </div>
                                </form>
                              </CardContent>
                              <CardFooter className="flex justify-center pb-8">
                                {newBookTitle !== "" &&
                                !books.some(
                                  (p) =>
                                    p.title.toLowerCase() ===
                                    newBookTitle.toLowerCase()
                                ) ? (
                                  <Button
                                    onClick={handleCreateBook}
                                    size="lg"
                                    className="group relative overflow-hidden min-w-[160px] h-12 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 rounded-xl"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                    Thêm sách mới
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    size="lg"
                                    className="min-w-[160px] h-12 px-8 opacity-50 cursor-not-allowed rounded-xl"
                                  >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Thêm sách mới
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Empty State */}
                      {books.length === 0 && (
                        <div className="text-center py-16 space-y-6">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <FolderOpen className="w-10 h-10 text-purple-500" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              Chưa có dự án nào
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Bắt đầu tạo dự án đầu tiên của bạn để quản lý công
                              việc một cách hiệu quả
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
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
