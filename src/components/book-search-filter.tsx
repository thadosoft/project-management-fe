"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface BookSearchFilterProps {
  value: string
  onChange: (query: string) => void
}

export function BookSearchFilter({ value, onChange }: BookSearchFilterProps) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sách theo tên..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  )
}
