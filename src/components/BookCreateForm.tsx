"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import type { CreateBookRequest } from "@/models/Book";

export function BookCreateForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CreateBookRequest) => Promise<void>;
  isLoading?: boolean;
}) {
  // ✅ Tách state open ra ngoài form — không reset khi nhập
  const [open, setOpen] = useState(false);

  // ✅ React Hook Form sẽ giữ state input ổn định
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookRequest>();

  const handleCreate = async (data: CreateBookRequest) => {
    await onSubmit(data);
    reset(); // reset form
    setOpen(false); // đóng dialog sau khi submit
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Plus className="w-4 h-4" />
          Thêm sách
        </Button>
      </DialogTrigger>

      <DialogContent forceMount className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm Sách Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên sách</label>
            <Input {...register("title", { required: true })} placeholder="Nhập tên sách" />
            {errors.title && <p className="text-red-500 text-xs mt-1">Không được bỏ trống</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Tác giả</label>
            <Input {...register("author", { required: true })} placeholder="Nhập tác giả" />
          </div>

          <div>
            <label className="text-sm font-medium">Thể loại</label>
            <Input {...register("category")} placeholder="VD: Khoa học, CNTT..." />
          </div>

          <div>
            <label className="text-sm font-medium">Chủ sở hữu</label>
            <Input {...register("publisher")} placeholder="Nhập nhà xuất bản" />
          </div>

          <div>
            <label className="text-sm font-medium">Năm xuất bản</label>
            <Input {...register("publicationYear")} placeholder="Nhập năm xuất bản" />
          </div>

          <div>
            <label className="text-sm font-medium">Vị trí</label>
            <Input {...register("location")} placeholder="Nhập vị trí của sách" />
          </div>

          <div>
            <label className="text-sm font-medium">Số lượng</label>
            <Input type="number" {...register("quantity_total", { valueAsNumber: true, required: true })} />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Thêm mới
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
