"use client"

import { useRef, useState } from "react"
import { Table, Input, Button, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import type { ColumnType, ColumnsType } from "antd/es/table"
import type { InputRef } from "antd"
import type { Book } from "@/models/Book"
import { Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface BookTableProps {
    data: Book[]
    loading: boolean
    onView: (book: Book) => void
    onEdit: (book: Book) => void
    onDelete: (id: number) => void
}

export function BookTable({ data, loading, onView }: BookTableProps) {
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const searchInput = useRef<InputRef>(null)

    const handleSearch = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters?: () => void) => {
        clearFilters?.()
        setSearchText("")
    }

    // Hàm tạo filter search cho từng cột
    const getColumnSearchProps = (dataIndex: keyof Book): ColumnType<Book> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex as string)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex as string)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Xóa
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]!.toString().toLowerCase().includes((value as string).toLowerCase())
                : false,
        filterDropdownProps: {
            onOpenChange: (open) => {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100)
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
            ) : (
                text
            ),
    })

    //hàm định nghĩa cột số lượng cho bảng
    const getAvailabilityLabel = (quantity: number | undefined) => {
        if (quantity === undefined) return "Không rõ"
        if (quantity === 0) return "Tạm hết"
        if (quantity === 1) return "Số lượng ít"
        if (quantity > 1) return "Có sẵn"
        return "Không rõ"
    }

    const columns: ColumnsType<Book> = [
        {
            title: "Tên sách",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps("title"),
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            key: "author",
            ...getColumnSearchProps("author"),
        },
        {
            title: "Thể loại",
            dataIndex: "category",
            key: "category",
            ...getColumnSearchProps("category"),
        },
        {
            title: "Năm XB",
            dataIndex: "publicationYear",
            key: "publicationYear",
            sorter: (a, b) => (a.publicationYear ?? 0) - (b.publicationYear ?? 0),
        },
        {
            title: "Vị trí",
            dataIndex: "location",
            key: "location",
            ...getColumnSearchProps("location"),
        },
        {
            title: "Tình trạng",
            dataIndex: "quantity_available",
            key: "quantity_available",
            sorter: (a, b) => (a.quantity_available ?? 0) - (b.quantity_available ?? 0),
            render: (quantity: number | undefined) => {
                const label = getAvailabilityLabel(quantity)
                const color =
                    quantity === 0
                        ? "text-red-600"
                        : quantity === 1
                            ? "text-orange-500"
                            : "text-green-600"

                return <span className={`${color} font-medium`}>{label}</span>
            },
        },

        {
            title: "Hành động",
            key: "actions",
            render: (_, book) => (
                <Space>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type="link" onClick={() => onView(book)}>
                                <Eye className="w-4 h-4 text-primary" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Xem chi tiết</TooltipContent>
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
        />
    )
}
