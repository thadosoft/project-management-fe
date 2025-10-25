"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import type { CreateBookLoanRequest } from "@/models/BookLoan";
import type { Book } from "@/models/Book";
import { searchBooks } from "@/services/bookService";
import { fetchData } from "@/utils/api";
import type { User } from "@/models/User";

interface BookBorrowFormProps {
  onSubmit: (data: CreateBookLoanRequest) => Promise<void>;
  isLoading?: boolean;
}

export function BookBorrowForm({ onSubmit, isLoading }: BookBorrowFormProps) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateBookLoanRequest>({
    bookId: 0,
    bookTitle: "",
    borrowerName: "",
    borrowerId: "",
    borrowDate: "",
    dueDate: "",
    status: "BORROWED",
  });

  // ✅ Lấy thông tin user hiện tại từ localStorage
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

  // ✅ Lấy danh sách sách
  useEffect(() => {
    const fetchBooks = async () => {
      const result = await searchBooks({}, 0, 100);
      if (result?.content) setBooks(result.content);
    };
    fetchBooks();
  }, []);

  // ✅ Chọn sách
  const handleSelectBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
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
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <Plus className="w-4 h-4" /> Mượn sách
        </Button>
      </DialogTrigger>

      <DialogContent forceMount className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Đăng ký mượn sách</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Hiển thị thông tin người mượn hiện tại */}
          {currentUser && (
            <div className="bg-muted/30 rounded-lg p-3 border border-border/40">
              <p className="text-sm font-semibold mb-1">Người mượn hiện tại</p>
              <p className="text-sm text-foreground">👤 {currentUser.name}</p>
              <p className="text-xs text-muted-foreground">📧 {currentUser.email}</p>
              <p className="text-xs text-muted-foreground">📞 {currentUser.phoneNumber}</p>
              {/* <p className="text-xs text-muted-foreground">🆔 ID: {currentUser.id}</p> */}
            </div>
          )}

          {/* Dropdown chọn sách */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Chọn sách</label>
            <select
              value={selectedBook?.id || ""}
              onChange={(e) => handleSelectBook(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn sách --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.publisher} - Số lượng: {b.quantity_available}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày mượn */}
          <div>
            <label className="text-sm font-semibold text-foreground">Ngày mượn</label>
            <Input
              type="date"
              value={formData.borrowDate ?? ""}
              onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
              className="border-border"
            />
          </div>

          {/* Ghi chú / Tình trạng */}
          <div>
            <label className="text-sm font-semibold text-foreground">Tình trạng sách</label>
            <select
              value={formData.bookCondition ?? ""}
              onChange={(e) => setFormData({ ...formData, bookCondition: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tốt">Tốt</option>
              <option value="Bình thường">Bình thường</option>
              {/* <option value="Cần sửa chữa">Cần sửa chữa</option> */}
            </select>
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
