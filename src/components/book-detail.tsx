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
import { Plus, BookOpen, Eye } from "lucide-react"
import type { BookRequest } from "@/models/BookLoan"

interface BookDetailProps {
  onClick: (data: BookRequest) => Promise<void>
  isLoading?: boolean
}

export function BookDetail({  }: BookDetailProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<BookRequest>({
    bookTitle: "",
    approverName: "",
    borrowerName: "",
    bookOwner: "",
    status: "BORROWED",
    borrowDate: new Date().toISOString().split("T")[0],
  })



    function handleViewDetails(): void {
        throw new Error("Function not implemented.")
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleViewDetails()}
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
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Đăng ký mượn sách</DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Điền thông tin để đăng ký mượn sách từ thư viện
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        
      </DialogContent>
    </Dialog>
  )
}
