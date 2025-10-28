"use client"

import { useRef, useState } from "react"
import { Table, Input, Button, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import type { ColumnType, ColumnsType } from "antd/es/table"
import type { InputRef } from "antd"
import { Eye, RotateCcw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BookLoan } from "@/models/BookLoan"

interface BookTableProps {
    data: BookLoan[]
    loading: boolean
    onView: (book: BookLoan) => void
    onReturn: (book: BookLoan) => void
}

export function BookLoanTable({ data, loading, onView, onReturn }: BookTableProps) {
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
    const getColumnSearchProps = (dataIndex: keyof BookLoan): ColumnType<BookLoan> => ({
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

    //tahy đổi trạng thái tương ứng
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "BORROWED":
                return "Đang mượn"
            case "RETURNED":
                return "Đã trả"
            case "OVERDUE":
                return "Quá hạn"
            default:
                return status
        }
    }


    const columns: ColumnsType<BookLoan> = [
        {
            title: "Tên sách",
            dataIndex: "bookTitle",
            key: "bookTitle",
            ...getColumnSearchProps("bookTitle"),
        },
        {
            title: "Tác giả",
            dataIndex: "approverName",
            key: "approverName",
            ...getColumnSearchProps("approverName"),
        },
        {
            title: "Người mượn",
            dataIndex: "borrowerName",
            key: "borrowerName",
            ...getColumnSearchProps("borrowerName"),
        },
        {
            title: "Chủ sở hữu",
            dataIndex: "bookOwner",
            key: "bookOwner",
            ...getColumnSearchProps("bookOwner"),
        },
        {
            title: "Vị trí",
            dataIndex: "remarks",
            key: "remarks",
            ...getColumnSearchProps("remarks"),
        },
        {
            title: "Ngày mượn",
            dataIndex: "approvedAt",
            key: "approvedAt",
            // sorter: (a, b) => (a.approvedAt ?? 0) - (b.approvedAt ?? 0),

        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            sortDirections: ["ascend", "descend"],
            render: (status: string) => {
                const text = getStatusLabel(status)
                const color =
                    status === "BORROWED"
                        ? "text-blue-600"
                        : status === "RETURNED"
                            ? "text-green-600"
                            : status === "OVERDUE"
                                ? "text-red-600"
                                : ""

                return <span className={`${color} font-medium`}>{text}</span>
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
                    {book.status === "BORROWED" && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="link"
                                    onClick={() => onReturn(book)}
                                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-500/10 hover:text-green-700 transition-all duration-200"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Trả sách</TooltipContent>
                        </Tooltip>
                    )}
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
