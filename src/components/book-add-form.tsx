import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";
import type { BookRequest } from "@/models/Book";

interface BookAddFormProps {
  onSubmit: (data: BookRequest) => Promise<void>;
  isLoading?: boolean;
}

export function BookAddForm({ onSubmit, isLoading = false }: BookAddFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BookRequest>({
    title: "",
    author: "",
    category: "",
    quantity_total: 1,
    publisher: "",
    publicationYear: undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "publicationYear" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        author: "",
        category: "",
        quantity_total: 1,
        publisher: "",
        publicationYear: undefined,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group h-[22rem] sm:h-[18rem] md:h-[20rem] lg:h-[23rem] rounded-2xl bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 cursor-pointer hover:from-purple-500/10 hover:via-purple-500/5 hover:to-purple-500/10 border-2 border-dashed border-muted-foreground/20 hover:border-purple-500/40 transition-all duration-500 flex flex-col p-8 items-center justify-center hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 space-y-4 text-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <div>
              <div className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                Thêm sách mới
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Thêm sách vào thư viện
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Thêm sách mới
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Điền thông tin sách để thêm vào thư viện
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tên sách <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Nhập tên sách"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Author */}
          <div className="space-y-2">
            <Label
              htmlFor="author"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tác giả
            </Label>
            <Input
              id="author"
              name="author"
              placeholder="Nhập tên tác giả"
              value={formData.author}
              onChange={handleInputChange}
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Category */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Thể loại
            </Label>
            <Input
              id="category"
              name="category"
              placeholder="Ví dụ: Tiểu thuyết, Khoa học, ..."
              value={formData.category}
              onChange={handleInputChange}
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Publisher */}
          <div className="space-y-2">
            <Label
              htmlFor="publisher"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Nhà xuất bản
            </Label>
            <Input
              id="publisher"
              name="publisher"
              placeholder="Nhập tên nhà xuất bản"
              value={formData.publisher}
              onChange={handleInputChange}
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Publication Year
          <div className="space-y-2">
            <Label
              htmlFor="publicationYear"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Năm xuất bản
            </Label>
            <Input
              id="publicationYear"
              name="publicationYear"
              type="number"
              placeholder="VD: 2024"
              value={formData.publicationYear || ""}
              onChange={handleInputChange}
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}

          {/* Publication Year */}
          <div className="space-y-2">
            <Label
              htmlFor="publicationYear"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Năm xuất bản
            </Label>

            <select
              id="publicationYear"
              name="publicationYear"
              value={formData.publicationYear || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  publicationYear: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn năm xuất bản --</option>
              {Array.from(
                { length: new Date().getFullYear() - 1950 + 1 },
                (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                }
              )}
            </select>
          </div>
          {/* Quantity */}
          <div className="space-y-2">
            <Label
              htmlFor="quantity_total"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Số lượng
            </Label>
            <Input
              id="quantity_total"
              name="quantity_total"
              type="number"
              placeholder="Số lượng nhập"
              value={formData.quantity_total || 1}
              onChange={handleInputChange}
              className="border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Buttons */}
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
              {isLoading ? "Đang thêm..." : "Thêm sách"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
