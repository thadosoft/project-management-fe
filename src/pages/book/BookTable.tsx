"use client";

import { useRef, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { InputRef } from "antd";
import type { Book } from "@/models/Book";
import { BookPlus, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookTableProps {
  data: Book[];
  loading: boolean;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onBorrow: (book: Book) => void;
  currentPage: number;
  pageSize: number;
}

export function BookTable({
  data,
  loading,
  onView,
  onBorrow,
  currentPage,
  pageSize,
}: BookTableProps) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters?.();
    setSearchText("");
  };

  // Hàm tạo filter search cho từng cột
  const getColumnSearchProps = (dataIndex: keyof Book): ColumnType<Book> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex as string)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                selectedKeys as string[],
                confirm,
                dataIndex as string
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
        ? record[dataIndex]!.toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : false,
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  //hàm định nghĩa cột số lượng cho bảng
  const getAvailabilityLabel = (quantity: number | undefined) => {
    if (quantity === undefined) return "Không rõ";
    if (quantity === 0) return "Đã mượn hết";
    if (quantity === 1) return "Còn 1,2 cuốn";
    if (quantity >= 2) return "Sẵn sàng mượn";
    return "Không rõ";
  };

  const columns: ColumnsType<Book> = [
    {
      title: "STT",
      key: "index",
      width: "2%",
      align: "center",
      render: (_: any, __: Book, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      width: "20%",
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      ...getColumnSearchProps("author"),
      width: "10%",
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "publisher",
      key: "publisher",
      ...getColumnSearchProps("publisher"),
      width: "10%",
    },
    {
      title: "Năm XB",
      dataIndex: "publicationYear",
      key: "publicationYear",
      sorter: (a, b) => (a.publicationYear ?? 0) - (b.publicationYear ?? 0),
      width: "10%",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      width: "10%",
    },

    {
      title: "Tình trạng",
      dataIndex: "available",
      key: "available",
      sorter: (a, b) => {
        // Ưu tiên available trước, sau đó mới so sánh theo số lượng tồn
        const aValue = (a.available ? 1 : 0) * 10 + (a.quantity_available ?? 0);
        const bValue = (b.available ? 1 : 0) * 10 + (b.quantity_available ?? 0);
        return aValue - bValue;
      },
      render: (_: boolean | undefined, record: Book) => {
        const { available, quantity_available } = record;

        let label = "Không rõ";
        let color = "text-gray-500";

        if (available === false || quantity_available === 0) {
          label = "Đã hết";
          color = "text-red-600";
        } else  {
          label = "Còn sách";
          color = "text-green-600";
        }

        return <span className={`${color} font-medium`}>{label}</span>;
      },
      width: "10%",
      align: "center",
    },
    {
      title: "Số lượng khả dụng",
      dataIndex: "quantity_available",
      key: "quantity_available",
      sorter: (a, b) =>
        (a.quantity_available ?? 0) - (b.quantity_available ?? 0),
      render: (v: number | undefined) => <span>{v ?? 0}</span>,
      width: "5%",
      align: "center",
    },

    {
      title: "Hành động",
      key: "actions",
      render: (_, book) => (
        <Space>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="link" onClick={() => onView(book)}>
                <Eye className="w-4 h-4 text-primary dark:text-secondary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xem chi tiết</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="link" onClick={() => onBorrow(book)}>
                <BookPlus className="w-4 h-4 text-primary dark:text-secondary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mượn sách</TooltipContent>
          </Tooltip>
        </Space>
      ),
      width: "10%",
      align: "center",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={false}
      bordered
      scroll={{ x: true }}
      className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none"
    />
  );
}
