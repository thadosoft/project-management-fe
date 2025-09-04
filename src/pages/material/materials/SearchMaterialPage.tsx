import type React from "react"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getImage, uploadMultipleMaterialImages } from "@/services/material/uploadFileService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { deleteMaterial, searchMaterials } from "@/services/material/materialService"
import type { Material } from "@/models/Material"
import {
  Search,
  Package,
  Trash2,
  AlertCircle,
  Loader2,
  MapPin,
  Grid,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ImageIcon,
  Filter,
  RefreshCw,
  Barcode,
} from "lucide-react"

function SearchMaterialPage() {
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [searchRequest, setSearchRequest] = useState({
    name: "",
    sku: "",
  })
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await searchMaterials(searchRequest, 0, size)
      if (result) {
        setMaterials(result.content)
        setTotalPages(result.totalPages)
        setPage(0)
      }
    } catch (error) {
      console.error("Error searching materials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchRequest({ name: "", sku: "" })
    setPage(0)
    fetchMaterials(0)
  }

  const fetchMaterials = async (currentPage: number) => {
    setLoading(true)
    try {
      const data = await searchMaterials(searchRequest, currentPage, size)
      if (data) {
        setMaterials(data.content);
        setTotalPages(data.totalPages);
        data.content.forEach(material => {
          if (material.id && material.images && material.images.length > 0) {
            loadImage(material.id, material.images[0].accessUrl);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials(page)
  }, [page])

  const handleDelete = async (material: Material) => {
    if (!material.id) return

    try {
      setLoading(true)
      await deleteMaterial(material.id)
      await fetchMaterials(page)
      setDeleteDialogOpen(false)
      setSelectedMaterial(null)
    } catch (error) {
      console.error("Lỗi khi xóa:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
  }

  const getStockStatus = (quantity: number) => {
    if (quantity < 2) return { variant: "destructive" as const, label: "Số lượng ít", color: "text-red-600" }
    return { variant: "default" as const, label: "Còn hàng", color: "text-green-600" }
  }

  const loadImage = async (materialId: number, accessUrl: string, index: number = 0) => {
    try {
      const filename = accessUrl.split('/').pop();
      if (filename) {
        const blob = await getImage(filename);
        const objectUrl = URL.createObjectURL(blob);
        setImageUrls(prev => ({ ...prev, [`${materialId}_${index}`]: objectUrl }));
      }
    } catch (error) {
      console.error(`Error loading image for material ${materialId}:`, error);
    }
  };

  const loadMultipleImages = async (material: Material) => {
    if (!material || !material.images || material.images.length === 0) return;

    const newImageUrls: { [key: string]: string } = {};

    for (let i = 0; i < material.images.length; i++) {
      const image = material.images[i];
      try {
        const filename = image.fileName || image.accessUrl.split('/').pop();
        if (filename) {
          const blob = await getImage(filename);
          const objectUrl = URL.createObjectURL(blob);
          const key = `${material.id}_${i}`;
          newImageUrls[key] = objectUrl;
        }
      } catch (error) {
        console.error(`Error loading image ${i} for material ${material.id}:`, error);
      }
    }

    setImageUrls(prev => ({ ...prev, ...newImageUrls }));
  };

  const openImageViewer = (material: Material) => {
    setCurrentMaterial(material);
    setImageViewerVisible(true);
    loadMultipleImages(material);
  };

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages) {
        for (let i = 0; i < totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (page <= 2) {
          for (let i = 0; i < 4; i++) {
            pages.push(i)
          }
          pages.push("...")
          pages.push(totalPages - 1)
        } else if (page >= totalPages - 3) {
          pages.push(0)
          pages.push("...")
          for (let i = totalPages - 4; i < totalPages; i++) {
            pages.push(i)
          }
        } else {
          pages.push(0)
          pages.push("...")
          for (let i = page - 1; i <= page + 1; i++) {
            pages.push(i)
          }
          pages.push("...")
          pages.push(totalPages - 1)
        }
      }

      return pages
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
        <div className="text-sm text-muted-foreground">
          Hiển thị {materials.length} trên tổng số {totalPages * size} kết quả
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Trước</span>
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => (
              <Button
                key={index}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => typeof pageNum === "number" && setPage(pageNum)}
                disabled={pageNum === "..."}
                className={`min-w-[32px] ${pageNum === page
                  ? "bg-primary text-primary-foreground shadow-md"
                  : pageNum === "..."
                    ? "cursor-default"
                    : "hover:bg-muted"
                  }`}
              >
                {typeof pageNum === "number" ? pageNum + 1 : pageNum}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
          >
            <span className="hidden sm:inline mr-1">Sau</span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages - 1)}
            disabled={page === totalPages - 1}
            className="hidden sm:flex"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Trang {page + 1} / {totalPages}
        </div>
      </div>
    )
  }

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
                      Tổng quan
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">Tìm kiếm vật tư</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-4 md:p-8 space-y-8">
              {/* Enhanced Header Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <Search className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-normal">
                        Tìm kiếm <span className="text-blue-500">vật tư</span>
                      </h1>
                      <p className="text-muted-foreground mt-1">Tìm kiếm và quản lý vật tư trong kho</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Tìm kiếm nâng cao
                  </Badge>
                </div>
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
                  <CardDescription className="ml-12">Nhập thông tin để tìm kiếm vật tư trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                          <Package className="w-4 h-4 text-primary" />
                          Tên vật tư
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={searchRequest.name}
                          onChange={handleInputChange}
                          placeholder="Nhập tên vật tư..."
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 focus:bg-background transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="sku" className="text-sm font-semibold flex items-center gap-2">
                          <Barcode className="w-4 h-4 text-primary" />
                          Mã vật tư
                        </Label>
                        <Input
                          id="sku"
                          name="sku"
                          value={searchRequest.sku}
                          onChange={handleInputChange}
                          placeholder="Nhập mã vật tư..."
                          className="h-12 bg-background/50 border-2 hover:border-primary/30 focus:border-primary/50 focus:bg-background transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="h-12 px-8 bg-transparent"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Đặt lại
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="transition-all duration-300 hover:scale-105 min-w-[140px] h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

              {/* Enhanced Results Table */}
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 border-0 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                          <Grid className="w-5 h-5 text-primary" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                          Kết quả tìm kiếm
                        </span>
                      </CardTitle>
                      <CardDescription className="ml-12 mt-1">
                        Hiển thị {materials.length} vật tư được tìm thấy
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-lg mx-6 mb-6 overflow-hidden bg-background/50 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 hover:bg-muted/70 border-b-2">
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground w-16">
                              STT
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground w-24">
                              Hình ảnh
                            </th>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">
                              Tên vật tư
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Mã serial
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Nhóm vật tư
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Đơn vị
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Số lượng
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Nguồn gốc
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Giá mua
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">
                              Trạng thái
                            </th>
                            <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground w-32">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {materials.map((material, index) => {
                            const stockStatus = getStockStatus(material.quantityInStock || 0)
                            return (
                              <tr
                                key={material.id}
                                className="hover:bg-muted/30 transition-all duration-200 group border-b border-border/50"
                              >
                                <td className="px-4 py-4 text-center text-sm font-medium text-muted-foreground">
                                  {page * size + index + 1}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  {material.images && material.images.length > 0 ? (
                                    <div
                                      className="relative inline-block group/image cursor-pointer"
                                      onClick={() => openImageViewer(material)}
                                    >
                                      <Avatar className="w-12 h-12 mx-auto ring-2 ring-transparent group-hover/image:ring-primary/20 transition-all duration-300">
                                        <AvatarImage
                                          src={imageUrls[`${material.id}_0`] || "/placeholder.svg"}
                                          alt="Material"
                                          className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5">
                                          <ImageIcon className="w-4 h-4 text-primary" />
                                        </AvatarFallback>
                                      </Avatar>
                                      {material.images.length > 1 && (
                                        <Badge className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                                          +{material.images.length - 1}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <Avatar className="w-12 h-12 mx-auto">
                                      <AvatarFallback className="bg-muted">
                                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="space-y-1">
                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                      {material.name}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <Badge variant="outline" className="font-mono text-xs bg-background/50">
                                    {material.sku}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                    {material.inventoryCategory?.name || "N/A"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-center text-sm font-medium">{material.unit}</td>
                                <td className="px-4 py-4 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <Badge variant={stockStatus.variant} className="min-w-[60px] justify-center">
                                      {material.quantityInStock}
                                    </Badge>
                                    <span className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  {material.location && (
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                      <MapPin className="w-3 h-3" />
                                      {material.location}
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <p className="font-semibold text-green-600">
                                    {formatCurrency(material.purchasePrice || 0)}
                                  </p>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <Badge variant="outline" className="bg-background/50">
                                    {material.status || "Hoạt động"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                                        onClick={() => setSelectedMaterial(material)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                          <AlertCircle className="w-5 h-5 text-destructive" />
                                          Xác nhận xóa
                                        </DialogTitle>
                                        <DialogDescription className="text-left">
                                          Bạn có chắc chắn muốn xóa vật tư <strong>"{selectedMaterial?.name}"</strong>?
                                          <br />
                                          <span className="text-destructive font-medium">
                                            Hành động này không thể hoàn tác.
                                          </span>
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => setDeleteDialogOpen(false)}
                                          className="flex-1"
                                        >
                                          Hủy
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => selectedMaterial && handleDelete(selectedMaterial)}
                                          disabled={loading}
                                          className="flex-1"
                                        >
                                          {loading ? (
                                            <>
                                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                              Đang xóa...
                                            </>
                                          ) : (
                                            <>
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Xóa
                                            </>
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {materials.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium text-muted-foreground mb-2">Không tìm thấy vật tư nào</p>
                        <p className="text-sm text-muted-foreground">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                      </div>
                    )}

                    {loading && (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">Đang tìm kiếm...</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Pagination */}
                  {materials.length > 0 && totalPages > 1 && <PaginationControls />}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
        <Dialog open={imageViewerVisible} onOpenChange={setImageViewerVisible}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Hình ảnh vật tư: {currentMaterial?.name}</DialogTitle>
            </DialogHeader>
            {currentMaterial && currentMaterial.images && currentMaterial.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentMaterial.images.map((image, index) => {
                  const key = `${currentMaterial.id}_${index}`;
                  return (
                    <div key={index} className="border p-2 rounded">
                      <img
                        src={imageUrls[key] || `api/v1/file-uploads/images/${image.fileName}`}
                        alt={`${currentMaterial.name} - ${index + 1}`}
                        className="w-full h-auto object-contain max-h-[200px]"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500">Không có hình ảnh nào.</p>
            )}
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default SearchMaterialPage
