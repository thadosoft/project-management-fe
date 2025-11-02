"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Pencil, Save, X } from "lucide-react";
import type { Book } from "@/models/Book";
import { updateBook } from "@/services/bookService";
import { NotificationModal } from "@/components/NotificationModal";

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const BookDetailsModal = ({
  book,
  isOpen,
  onClose,
  onUpdated,
}: BookDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Book | null>(book);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "warning",
  });

  if (!book) return null;

  const handleEditToggle = () => {
    setIsEditing(true);
    setFormData(book);
  };

  const handleChange = (field: keyof Book, value: string | number) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      setLoading(true);
      await updateBook(formData.id, {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        publisher: formData.publisher,
        publicationYear: formData.publicationYear,
        quantity_total: formData.quantity_total,
        quantity_available: formData.quantity_available,
        location: formData.location,
      });

      setNotification({
        open: true,
        message: "Đã cập nhật sách thành công!",
        type: "success",
      });

      setTimeout(() => {
        setIsEditing(false);
        onUpdated?.();
        onClose();
      }, 1200);
    } catch (error) {
      setNotification({
        open: true,
        message: "Không thể cập nhật sách!",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-border/50">
        <DialogHeader className="pb-2 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {isEditing ? "Chỉnh sửa thông tin sách" : book.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Card className="border-0 shadow-none bg-transparent mt-4">
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Tựa sách"
                  value={formData?.title}
                  onChange={(v) => handleChange("title", v)}
                />
                <InputField
                  label="Tác giả"
                  value={formData?.author}
                  onChange={(v) => handleChange("author", v)}
                />
                <InputField
                  label="Thể loại"
                  value={formData?.category}
                  onChange={(v) => handleChange("category", v)}
                />
                <InputField
                  label="Nhà xuất bản"
                  value={formData?.publisher}
                  onChange={(v) => handleChange("publisher", v)}
                />
                <InputField
                  label="Năm xuất bản"
                  type="number"
                  value={formData?.publicationYear?.toString()}
                  onChange={(v) => handleChange("publicationYear", Number(v))}
                />
                <InputField
                  label="Số lượng tổng"
                  type="number"
                  value={formData?.quantity_total?.toString()}
                  onChange={(v) => handleChange("quantity_total", Number(v))}
                />
                <InputField
                  label="Số lượng khả dụng"
                  type="number"
                  value={formData?.quantity_available?.toString()}
                  onChange={(v) =>
                    handleChange("quantity_available", Number(v))
                  }
                />
                <InputField
                  label="Vị trí"
                  value={formData?.location}
                  onChange={(v) => handleChange("location", v)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <InfoField label="Tác giả" value={book.author} />
                <InfoField label="Thể loại" value={book.category} />
                <InfoField label="Nhà xuất bản" value={book.publisher} />
                <InfoField
                  label="Năm xuất bản"
                  value={book.publicationYear?.toString()}
                />
                <InfoField
                  label="Số lượng tổng"
                  value={book.quantity_total?.toString()}
                />
                <InfoField
                  label="Số lượng khả dụng"
                  value={book.quantity_available?.toString()}
                />
                <InfoField label="Vị trí" value={book.location} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2 border-t border-border/20 mt-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="gap-2"
              >
                <X className="w-4 h-4" /> Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                {loading ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu thay đổi
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} className="gap-2">
                <X className="w-4 h-4" /> Đóng
              </Button>
              <Button
                onClick={handleEditToggle}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <Pencil className="w-4 h-4" /> Chỉnh sửa
              </Button>
            </>
          )}
        </div>
      </DialogContent>

      <NotificationModal
        isOpen={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
        type={notification.type}
      />
    </Dialog>
  );
};

const InfoField = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {label}
    </p>
    <p className="text-base font-medium text-foreground">{value || "-"}</p>
  </div>
);

const InputField = ({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value?: string;
  type?: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <Input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="focus:ring-2 focus:ring-blue-500/40"
    />
  </div>
);
