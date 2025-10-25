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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/pagination"
import { ProfileCard } from "@/components/profile-card"
import { BookSearchFilter } from "@/components/book-search-filter"
import { BookActionButtons } from "@/components/book-action-buttons"
import { searchBooks, deleteBook, createBook } from "@/services/bookService"
import toast from "react-hot-toast"
import { Plus, ChevronDown, ChevronUp, BookOpen, Loader2 } from "lucide-react"
import type { Book, BookRequest, CreateBookRequest } from "@/models/Book"
import { BookCreateForm } from "@/components/BookCreateForm"

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<{ status?: string; category?: string }>({ status: "", category: "" })
  const itemsPerPage = 10

  const fetchBooks = async (page = 0) => {
    try {
      setLoading(true)
      const request: BookRequest = {
        title: searchQuery || undefined,
        // author: searchQuery || undefined,
        // category: filters.category || undefined,
      }

      const result = await searchBooks(request, page, itemsPerPage)

      if (result) {
        setBooks(result.content)
        setTotalPages(result.totalPages)
        setTotalElements(result.totalElements)
      } else {
        toast.error("Lỗi khi tải danh sách sách")
      }
    } catch (error) {
      console.log("[v0] Error fetching books:", error)
      toast.error("Lỗi khi tải danh sách sách")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks(0)
  }, [])

  useEffect(() => {
    setCurrentPage(1)
    fetchBooks(0)
  }, [searchQuery, filters])

  useEffect(() => {
    if (currentPage > 1) {
      fetchBooks(currentPage - 1)
    }
  }, [currentPage])

  const handleViewDetails = (book: Book) => {
    toast.success(`Xem chi tiết: ${book.title}`)
  }

  const handleEditBook = (book: Book) => {
    // toast.success(`Chỉnh sửa: ${book.title}`)
  }

  const handleDeleteBook = async (id: number) => {
    try {
      setIsSubmitting(true)
      const result = await deleteBook(id)
      if (result !== null) {
        toast.success("Đã xóa sách")
        fetchBooks(currentPage - 1)
      } else {
        toast.error("Lỗi khi xóa sách")
      }
    } catch (error) {
      console.log("[v0] Error deleting book:", error)
      toast.error("Lỗi khi xóa sách")
    } finally {
      setIsSubmitting(false)
    }
  }

  const bookForm = useMemo(() => (
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
  ), [isSubmitting]);

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
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 items-center gap-2 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/home" className="hover:text-primary font-medium">
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
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Quản lý thư viện</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-black">
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Tủ sách AITS
                  </span>
                </h1>

                <div className="flex justify-center gap-3 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    {/* <h1 className="text-2xl font-bold">Danh sách đầu sách</h1> */}
                    {bookForm}
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
                      avatar="https://scontent.fsgn5-14.fna.fbcdn.net/v/t39.30808-1/468279569_2080239279045625_1679455235350617662_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=e99d92&_nc_ohc=XsAPMqT7_TQQ7kNvwEWIXMY&_nc_oc=Adkcx8Q895jlOK9XLRHGJME9FVjUwfNFkjm3gBWmn04Yk8LCUIVpbuQezA0uZLpMuLi-ZYcnzK8qdvr0jE4WTFmD&_nc_zt=24&_nc_ht=scontent.fsgn5-14.fna&_nc_gid=2yibWRyjIBvOakZHlhO97A&oh=00_Afcl5HUKG3bHUKstEqNOLXqZ5DFWcETvGuOGY0tlol39-g&oe=68FE8052"
                    />
                  </div>
                )}
              </div>

              {/* Search and Filter */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg mb-6 p-6">
                <BookSearchFilter onSearch={setSearchQuery} onFilter={setFilters} />
              </Card>

              {/* Table */}
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-4 px-6 border-b border-border/50 bg-gradient-to-r from-blue-200/10 to-purple-200/10 flex justify-between items-left">
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Danh sách
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hiển thị {books.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} đến{" "}
                      {Math.min(currentPage * itemsPerPage, totalElements)} trong {totalElements} sách
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-200/50 dark:bg-slate-200/80 border-b border-border/50 sticky top-0">
                        <tr>
                          {["Tên sách", "Tác giả", "Thể loại", "Chủ sở hữu", "Năm XB", "Vị trí", "TÌnh trạng", "Hành động"].map((th) => (
                            <th key={th} className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {books.map((book) => (
                          <tr
                            key={book.id}
                            className="hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 transition-all duration-200 group"
                          >
                            <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                {book.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                            <td className="px-6 py-4">
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
                              >
                                {book.category}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{book.publisher}</td>
                            <td className="px-6 py-4 text-muted-foreground">{book.publicationYear}</td>
                            <td className="px-6 py-4 text-muted-foreground">{book.location}</td>
                            <td className="px-6 py-4 text-muted-foreground">{book.quantity_available}</td>

                            <td className="px-6 py-4">
                              <BookActionButtons
                                book={book}
                                onView={handleViewDetails}
                                onEdit={handleEditBook}
                                onDelete={handleDeleteBook}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {books.length === 0 && (
                      <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg font-medium">
                          {searchQuery || filters.category
                            ? "Không tìm thấy sách nào"
                            : "Chưa có sách nào trong hệ thống"}
                        </p>
                        <p className="text-muted-foreground/60 text-sm mt-2">
                          {searchQuery || filters.category
                            ? "Hãy thử tìm kiếm hoặc lọc khác"
                            : "Hãy thêm sách đầu tiên để bắt đầu"}
                        </p>
                      </div>
                    )}
                  </div>

                  {books.length > 0 && (
                    <div className="border-t border-border/50 bg-muted/30 px-6 py-4">
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default BooksPage
