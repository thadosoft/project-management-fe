import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { Event, EventRequest } from "@/models/Event";
import { Project } from "@/models/Project";
import { CalendarIcon, Plus, Save, X } from "lucide-react";
import { EVENT_TYPE_OPTIONS } from "@/utils/event-utils";

interface EventFormProps {
  open: boolean;
  mode: "add" | "edit";
  event?: Event | null;
  projects?: Project[];
  onClose: () => void;
  onSave: (data: EventRequest) => void;
}

export function EventForm({
  open,
  mode,
  event,
  projects,
  onClose,
  onSave,
}: EventFormProps) {
  const [formData, setFormData] = useState<Partial<Event>>({});

  // Fill form on edit
  useEffect(() => {
    if (mode === "edit" && event) {
      setFormData(event);
    } else {
      setFormData({
        title: "",
        type: undefined,
        startDate: "",
        description: "",
        project: undefined,
      });
    }
  }, [mode, event]);

  const handleChange = (key: keyof Event, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects?.find((p) => p.id === projectId);
    if (!selectedProject) return;
    setFormData((prev) => ({ ...prev, project: selectedProject }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startDate || !formData.project) return;

    const startDate = formData.startDate.length === 16 ? formData.startDate + ":00" : formData.startDate;
    const endDate = formData.endDate?.length === 16 ? formData.endDate + ":00" : formData.endDate;

    const payload: EventRequest = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startDate: startDate,
      endDate: endDate,
      type: formData.type!,
      projectId: formData.project.id, 
    };

    console.log("Payload",payload)

    onSave(payload); 
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sidebar-scroll sm:max-w-[500px] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* Title */}
          <div className="relative space-y-2">
            <Label htmlFor="title">Tiêu đề sự kiện</Label>
            <div className="relative w-full">
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Nhập tiêu đề"
                required
              />
              {formData.title && (
                <X
                  onClick={() => handleChange("title", "")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Thời gian bắt đầu</Label>
            <div className="relative w-full">
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate || ""}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                required
              />
              <CalendarIcon
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById(
                    "startDate"
                  ) as HTMLInputElement | null;
                  input?.showPicker?.();
                }}
              />
            </div>
          </div>

          {/* Project Select */}
          <div className="space-y-2">
            <Label>Chọn dự án / Chủ dự án</Label>
            <Select
              value={formData.project?.id || ""}
              onValueChange={handleProjectSelect}
            >
              <SelectTrigger className="w-full hover:bg-background">
                <SelectValue placeholder="Chọn dự án" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} - {p.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Loại sự kiện</Label>
            <Select
              value={formData.type || ""}
              onValueChange={(val) => handleChange("type", val)}
            >
              <SelectTrigger className="w-full hover:bg-background">
                <SelectValue placeholder="Chọn loại sự kiện" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <div className="relative w-full">
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Nhập mô tả"
              />
              {formData.description && (
                <X
                  onClick={() => handleChange("description", "")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 
               hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 
               dark:hover:from-gray-800 dark:hover:to-gray-700 
               transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Hủy
            </Button>

            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 
               text-white font-semibold shadow-md 
               hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-500 
               hover:shadow-lg active:scale-[0.98]
               transition-all duration-200"
            >
              {mode === "edit" ? (
                <>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Thêm sự kiện
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
