"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, BookOpen } from "lucide-react"
import type { BookLoanRequest } from "@/models/BookLoan"

interface BookBorrowFormProps {
  onSubmit: (data: BookLoanRequest) => Promise<void>
  isLoading?: boolean
}

export function BookBorrowForm({ onSubmit, isLoading = false }: BookBorrowFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<BookLoanRequest>({
    bookTitle: "",
    approverName: "",
    borrowerName: "",
    bookOwner: "",
    status: "BORROWED",
    borrowDate: new Date().toISOString().split("T")[0],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "AVAILABLE" | "BORROWED",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(formData)
      setFormData({
        bookTitle: "",
        approverName: "",
        borrowerName: "",
        bookOwner: "",
        status: "BORROWED",
        borrowDate: new Date().toISOString().split("T")[0],
      })
      setOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4 " />
          Đăng ký mượn sách
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Đăng ký mượn sách</DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Điền thông tin để đăng ký mượn sách từ thư viện
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Row 1: Book Name and Author */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bookName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tên sách <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bookName"
                name="bookName"
                placeholder="Nhập tên sách"
                value={formData.bookTitle}
                onChange={handleInputChange}
                required
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="authorName"
                name="authorName"
                placeholder="Nhập tên tác giả"
                value={formData.approverName}
                onChange={handleInputChange}
                required
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 2: Borrower and Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="borrowerName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Người mượn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="borrowerName"
                name="borrowerName"
                placeholder="Nhập tên người mượn"
                value={formData.borrowerName}
                onChange={handleInputChange}
                required
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chủ sở hữu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="Nhập tên chủ sở hữu"
                value={formData.bookOwner}
                onChange={handleInputChange}
                required
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3: Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="borrowDate" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ngày mượn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="borrowDate"
                name="borrowDate"
                type="date"
                value={formData.borrowDate}
                onChange={handleInputChange}
                required
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDate" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ngày trả dự kiến
              </Label>
              <Input
                id="returnDate"
                name="returnDate"
                type="date"
                value={formData.returnedAt || ""}
                onChange={handleInputChange}
                className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tình trạng sách <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="AVAILABLE">Có sẵn</SelectItem>
                <SelectItem value="BORROWED">Đang mượn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
