"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface BookSearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: { status?: string; category?: string }) => void
}

export function BookSearchFilter({ onSearch, onFilter }: BookSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setStatusFilter("")
    setCategoryFilter("")
    onSearch("")
    onFilter({})
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sách theo tên, tác giả..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            onFilter({ status: e.target.value, category: categoryFilter })
          }}
          className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm hover:border-primary/50 transition-colors"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="AVAILABLE">Có sẵn</option>
          <option value="BORROWED">Đang mượn</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value)
            onFilter({ status: statusFilter, category: e.target.value })
          }}
          className="px-3 py-2 rounded-lg bg-background/50 border border-border/50 text-sm hover:border-primary/50 transition-colors"
        >
          <option value="">Tất cả thể loại</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Kinh tế">Kinh tế</option>
          <option value="Văn học">Văn học</option>
        </select>

        {(searchQuery || statusFilter || categoryFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  )
}
