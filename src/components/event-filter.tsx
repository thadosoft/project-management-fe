import { useState } from "react";
import { DatePicker, Button } from "rsuite";
import { Search, Filter } from "lucide-react";
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


interface EventFilterProps {
  onFilter: (filters: EventFilterValues) => void;
}

export interface EventFilterValues {
  title?: string;
  type?: EventType | "Tất cả";
  mode: "ngày" | "tháng" | "quý" | "năm";
  date?: Date;
  quarter?: 1 | 2 | 3 | 4;
  year?: number;
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

  const handleChange = (field: keyof EventFilterValues, value: any) => {
    console.log(value);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  return (
    <div className="mt-12 p-4 bg-gradient-to-bl from-black-500/5 via-transparent to-black-500/10 group-hover:opacity-100 transition-opacity duration-500 rounded-xl border border-white/20 space-y-4 shadow-sm w-full lg:w-1/2">
      <div className="flex items-center gap-2 mb-1">
        <Filter className="w-5 h-5 text-lime-500" />
        <h3 className="text-base font-semibold">Bộ lọc sự kiện</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 🔎 Tiêu đề */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium mb-1 block">
            Tiêu đề
          </Label>
          <Input
            id="title"
            placeholder="Nhập tên sự kiện..."
            value={filters.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* 🏷️ Loại sự kiện */}
        <div>
          <Label htmlFor="type" className="text-sm font-medium mb-1 block">
            Loại sự kiện
          </Label>
          <Select
            onValueChange={(val) => handleChange("type", val)}
            defaultValue={filters.type}
          >
            <SelectTrigger className="w-full">
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
            onValueChange={(val) => handleChange("mode", val)}
            defaultValue={filters.mode}
          >
            <SelectTrigger className="w-full">
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
          <div>
            <Label className="text-sm font-medium mb-1 block">Chọn ngày</Label>
            <DatePicker
              oneTap
              value={filters.date}
              onChange={(value) => handleChange("date", value || undefined)}
              className="w-full"
            />
          </div>
        )}

        {filters.mode === "tháng" && (
          <div>
            <Label className="text-sm font-medium mb-1 block">Chọn tháng</Label>
            <DatePicker
              oneTap
              format="MM-yyyy"
              value={filters.date}
              onChange={(value) => handleChange("date", value || undefined)}
              className="w-full"
              
            />
          </div>
        )}

        {filters.mode === "quý" && (
          <>
            <div>
              <Label className="text-sm font-medium mb-1 block">Chọn quý</Label>
              <Select
                onValueChange={(val) => handleChange("quarter", Number(val))}
                defaultValue={filters.quarter?.toString()}
              >
                <SelectTrigger className="w-full">
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
                className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
              className="bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
      </div>

      {/* 🔘 Nút lọc */}
      <div className="flex justify-end">
        <Button
          appearance="primary"
          color="green"
          onClick={handleSearch}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white shadow-md"
        >
          <Search className="w-4 h-4" />
          Lọc sự kiện
        </Button>
      </div>
    </div>
  );
}
