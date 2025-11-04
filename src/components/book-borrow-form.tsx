"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import type { CreateBookLoanRequest } from "@/models/BookLoan";
import type { Book } from "@/models/Book";
import { searchBooks } from "@/services/bookService";
import { fetchData } from "@/utils/api";
import type { User } from "@/models/User";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface BookBorrowFormProps {
  onSubmit: (data: CreateBookLoanRequest) => Promise<void>;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedBook?: Book | null;
}

export function BookBorrowForm({
  onSubmit,
  isLoading,
  open: externalOpen,
  onOpenChange,
  selectedBook,
}: BookBorrowFormProps) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateBookLoanRequest>({
    bookId: 0,
    bookTitle: "",
    borrowerName: "",
    borrowerId: "",
    borrowDate: "",
    dueDate: "",
    status: "BORROWED",
    approverName: "Nguyễn Thị Út Tiên",
    remarks: "",
  });

  // 🔁 Đồng bộ trạng thái mở từ props
  useEffect(() => {
    if (typeof externalOpen === "boolean") setOpen(externalOpen);
  }, [externalOpen]);

  // ✅ Khi mở dialog -> gọi onOpenChange nếu có
  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    onOpenChange?.(val);
  };

  // ✅ Lấy user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("id");
      if (!userId) return;

      try {
        const user = (await fetchData(`users/${userId}`, "GET", accessToken)) as User;
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          borrowerName: user.name || user.username || "Người dùng",
          borrowerId: user.id,
        }));
      } catch (error) {
        console.error("Không thể lấy thông tin user hiện tại:", error);
      }
    };
    fetchUser();
  }, []);

  // ✅ Lấy danh sách sách khi mở form
  useEffect(() => {
    if (!open) return;
    const fetchBooks = async () => {
      const result = await searchBooks({}, 0, 100);
      if (result?.content) setBooks(result.content);
    };
    fetchBooks();
  }, [open]);

  // ✅ Nếu có selectedBook truyền vào từ ngoài thì tự điền form
  useEffect(() => {
    if (selectedBook) {
      setFormData((prev) => ({
        ...prev,
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
      }));
    }
  }, [selectedBook]);

  // ✅ Chọn sách trong dropdown
  const handleSelectBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setFormData((prev) => ({
        ...prev,
        bookId: book.id,
        bookTitle: book.title,
      }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookId || !formData.borrowerName) return;

    try {
      await onSubmit({
        ...formData,
        borrowDate: new Date().toISOString().split("T")[0] + "T00:00:00",
      });
      handleOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="gap-2 bg-gradient-to-l from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> Mượn sách
        </Button>
      </DialogTrigger>

      <DialogContent forceMount className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Đăng ký mượn sách</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentUser && (
            <div className="bg-muted/30 rounded-lg p-3 border border-border/40">
              <p className="text-sm font-semibold mb-1">Người mượn hiện tại</p>
              <p className="text-sm text-foreground">👤 {currentUser.name}</p>
              <p className="text-xs text-muted-foreground">📧 {currentUser.email}</p>
              <p className="text-xs text-muted-foreground">📞 {currentUser.phoneNumber}</p>
            </div>
          )}

          {/* Dropdown chọn sách */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Chọn sách</label>
            <Command className="rounded-lg border border-border shadow-sm sidebar-scroll">
              <CommandInput placeholder="Nhập tên sách cần tìm..." />
              <CommandList className="max-h-60 overflow-y-auto">
                <CommandEmpty>Không tìm thấy sách nào.</CommandEmpty>
                <CommandGroup heading="Kết quả">
                  {books.map((b) => (
                    <CommandItem key={b.id} value={b.title} onSelect={() => handleSelectBook(b.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{b.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {b.publisher} — SL: {b.quantity_available}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {formData.bookTitle && (
              <p className="text-sm mt-2 text-muted-foreground">
                ✅ Đã chọn: <strong>{formData.bookTitle}</strong>
              </p>
            )}
          </div>

          {/* Ngày mượn */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Ngày mượn</label>
            <div className="relative w-full">
              <Input
                id="borrowDate"
                type="date"
                value={formData.borrowDate || ""}
                onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                required
              />
              <CalendarIcon
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById("borrowDate") as HTMLInputElement | null;
                  input?.showPicker?.();
                }}
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Ghi chú</label>
            <Input
              type="text"
              value={formData.remarks ?? ""}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="border-border"
            />
          </div>

          {/* Nút submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tạo phiếu...
              </>
            ) : (
              "Tạo phiếu mượn"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
