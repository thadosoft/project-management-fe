import { useState } from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { EventType } from "@/models/Event";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface EventFilterValues {
  title?: string;
  type?: EventType | "Tất cả";
  mode: "ngày" | "tháng" | "quý" | "năm";
  date?: Date;
  quarter?: 1 | 2 | 3 | 4;
  year?: number;
}

interface EventFilterProps {
  onFilter: (filters: EventFilterValues) => void;
}

export function EventFilter({ onFilter }: EventFilterProps) {
  const [filters, setFilters] = useState<EventFilterValues>({
    mode: "ngày",
    type: "Tất cả",
  });

  const typeOptions: (EventType | "Tất cả")[] = [
    "Tất cả",
    "Demo",
    "Họp",
    "Khảo sát",
  ];
  const modeOptions: ("ngày" | "tháng" | "quý" | "năm")[] = [
    "ngày",
    "tháng",
    "quý",
    "năm",
  ];
  const quarterOptions = [1, 2, 3, 4];

  const formatDateInput = (date?: Date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleChange = (field: keyof EventFilterValues, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "mode") {
        delete updated.date;
        delete updated.quarter;
        delete updated.year;
      }

      return updated;
    });
  };

  const handleFilter = () => {
    const cleaned: EventFilterValues = { ...filters };

    switch (filters.mode) {
      case "ngày":
        delete cleaned.quarter;
        delete cleaned.year;
        break;
      case "tháng":
        delete cleaned.quarter;
        delete cleaned.year;
        break;
      case "quý":
        delete cleaned.date;
        break;
      case "năm":
        delete cleaned.date;
        delete cleaned.quarter;
        break;
    }

    console.log("🔍 Filter data:", cleaned);
    onFilter(cleaned);
  };

  const handleReset = () => {
    setFilters({
      mode: "ngày",
      type: "Tất cả",
      title: "",
    });
  };

  return (
    <div className="mt-12 p-4 bg-gradient-to-bl from-black-500/5 via-transparent to-black-500/10 group-hover:opacity-100 transition-opacity duration-500 rounded-md border border-white/20 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Filter className="w-5 h-5 text-lime-500" />
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Bộ lọc sự kiện
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 🔎 Tiêu đề */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium mb-1 block">
            Tiêu đề
          </Label>
          <div className="relative">
            <Input
              id="title"
              placeholder="Nhập tên sự kiện..."
              value={filters.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-transparent focus-visible:ring-offset-0"
            />
            {filters.title && (
              <X
                onClick={() => handleChange("title", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* 🏷️ Loại sự kiện */}
        <div>
          <Label htmlFor="type" className="text-sm font-medium mb-1 block">
            Loại sự kiện
          </Label>
          <Select
            value={filters.type}
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger className="w-full hover:bg-transparent">
              <SelectValue placeholder="Chọn loại sự kiện" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🧭 Kiểu thời gian */}
        <div>
          <Label htmlFor="mode" className="text-sm font-medium mb-1 block">
            Kiểu lọc thời gian
          </Label>
          <Select
            value={filters.mode}
            onValueChange={(val) => handleChange("mode", val)}
          >
            <SelectTrigger className="w-full hover:bg-transparent">
              <SelectValue placeholder="Chọn kiểu thời gian" />
            </SelectTrigger>
            <SelectContent>
              {modeOptions.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 📅 Input tùy mode */}
        {filters.mode === "ngày" && (
          <div className="relative">
            <Label className="text-sm font-medium mb-1 block">Chọn ngày</Label>
            <Input
              type="date"
              className="bg-transparent focus-visible:ring-offset-0 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              value={formatDateInput(filters.date)}
              onChange={(e) =>
                handleChange(
                  "date",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
            <CalendarIcon
              className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => {
                const input = document.querySelector(
                  'input[type="date"]'
                ) as HTMLInputElement | null;
                input?.showPicker?.();
              }}
            />
          </div>
        )}

        {filters.mode === "tháng" && (
          <div className="relative">
            <Label className="text-sm font-medium mb-1 block">Chọn tháng</Label>
            <Input
              type="month"
              className="bg-transparent focus-visible:ring-offset-0 pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none"
              onChange={(e) =>
                handleChange(
                  "date",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
            <CalendarIcon
              className="absolute right-2 bottom-2.5 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => {
                const input = document.querySelector(
                  'input[type="month"]'
                ) as HTMLInputElement | null;
                input?.showPicker?.();
              }}
            />
          </div>
        )}

        {filters.mode === "quý" && (
          <>
            <div>
              <Label className="text-sm font-medium mb-1 block">Chọn quý</Label>
              <Select
                value={filters.quarter?.toString()}
                onValueChange={(val) => handleChange("quarter", Number(val))}
              >
                <SelectTrigger className="w-full hover:bg-transparent">
                  <SelectValue placeholder="Chọn quý" />
                </SelectTrigger>
                <SelectContent>
                  {quarterOptions.map((q) => (
                    <SelectItem key={q} value={q.toString()}>
                      Quý {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-1 block">Năm</Label>
              <Input
                type="number"
                placeholder="2025"
                value={filters.year || ""}
                onChange={(e) => handleChange("year", Number(e.target.value))}
                className="bg-transparent focus-visible:ring-offset-0"
              />
            </div>
          </>
        )}

        {filters.mode === "năm" && (
          <div>
            <Label className="text-sm font-medium mb-1 block">Chọn năm</Label>
            <Input
              type="number"
              placeholder="2025"
              value={filters.year || ""}
              onChange={(e) => handleChange("year", Number(e.target.value))}
              className="bg-transparent focus-visible:ring-offset-0"
            />
          </div>
        )}
      </div>

      {/* 🔘 Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <Button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-500 rounded-xl px-5 py-2 transition-all duration-200"
        >
          <RotateCcw className="w-1 h-1 opacity-90" />
          Làm mới
        </Button>
        <Button
          onClick={handleFilter}
          className="flex items-center gap-2 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white font-medium rounded-xl px-5 py-2 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300"
        >
          <Search className="w-1 h-1 opacity-90" />
          Lọc
        </Button>
      </div>
    </div>
  );
}
