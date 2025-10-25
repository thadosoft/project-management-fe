"use client"

import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Eye } from "lucide-react"
import type { Book } from "@/models/Book"

interface BookActionButtonsProps {
  book: Book
  onView: (book: Book) => void
  onEdit: (book: Book) => void
  onDelete: (id: number) => void
  isDeleting?: boolean
}

export function BookActionButtons({ book, onView, onEdit, onDelete, isDeleting = false }: BookActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(book)}
        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600 transition-all"
        title="Xem chi tiết"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(book)}
        className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-600 transition-all"
        title="Chỉnh sửa"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(book.id)}
        disabled={isDeleting}
        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600 transition-all disabled:opacity-50"
        title="Xóa"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
