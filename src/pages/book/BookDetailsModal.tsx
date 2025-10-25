"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { BookLoan } from "@/models/BookLoan"
import { format } from "date-fns"

interface BookDetailsModalProps {
  book: BookLoan | null
  isOpen: boolean
  onClose: () => void
}

export const BookDetailsModal = ({ book, isOpen, onClose }: BookDetailsModalProps) => {
  if (!book) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? "-" : d.toLocaleString("vi-VN")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết sách</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" className="absolute mx-auto"></Button>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <p><strong>Tên sách:</strong> {book.bookTitle}</p>
          <p><strong>Tác giả:</strong> {book.approverName || "-"}</p>
          <p><strong>Người mượn:</strong> {book.borrowerName || "-"}</p>
          <p><strong>Chủ sở hữu:</strong> {book.bookOwner || "-"}</p>
          <p><strong>Ngày mượn:</strong> {book.borrowDate}</p>
          <p><strong>Ngày phê duyệt:</strong> {book.approvedAt}</p>
          <p><strong>Ngày trả:</strong> {book.dueDate}</p>
          <p><strong>Tình trạng:</strong> {book.status}</p>
          <p><strong>Vị trí:</strong> {book.remarks || "-"}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
