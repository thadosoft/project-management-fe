"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2, BookOpen, User, Tag, Building2, Calendar, MapPin, Package } from "lucide-react"
import type { CreateBookRequest } from "@/models/Book"

export function BookCreateForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CreateBookRequest) => Promise<void>
  isLoading?: boolean
}) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookRequest>()

  const handleCreate = async (data: CreateBookRequest) => {
    await onSubmit(data)
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4" />
          Thêm sách
        </Button>
      </DialogTrigger>

      <DialogContent forceMount className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">Thêm Sách Mới</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết về cuốn sách</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Title Field */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Tên sách
              </label>
              <Input
                {...register("title", { required: "Vui lòng nhập tên sách" })}
                placeholder="Nhập tên sách..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Author Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                Tác giả
              </label>
              <Input
                {...register("author", { required: "Vui lòng nhập tác giả" })}
                placeholder="Nhập tác giả..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <Tag className="w-4 h-4 text-blue-600" />
                Thể loại
              </label>
              <Input
                {...register("category")}
                placeholder="VD: Khoa học, CNTT..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
            </div>

            {/* Publisher Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Chủ sở hữu
              </label>
              <Input
                {...register("publisher")}
                placeholder="Nhập chủ sở hữu..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
            </div>

            {/* Publication Year Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Năm xuất bản
              </label>
              <Input
                type="number"
                {...register("publicationYear", {
                  valueAsNumber: true,
                  min: { value: 1000, message: "Năm xuất bản phải từ 1000 trở lên" },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: `Năm xuất bản không được vượt quá ${new Date().getFullYear() + 1}`,
                  },
                })}
                placeholder="VD: 2024"
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
              {errors.publicationYear && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.publicationYear.message}
                </p>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Vị trí
              </label>
              <Input
                {...register("location")}
                placeholder="Nhập vị trí của sách..."
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
            </div>

            {/* Quantity Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                Số lượng
              </label>
              <Input
                type="number"
                {...register("quantity_total", { valueAsNumber: true, required: "Vui lòng nhập số lượng" })}
                placeholder="0"
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
              />
              {errors.quantity_total && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.quantity_total.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Thêm sách
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
