"use client";

import { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { InputRef } from "antd";
import { Eye, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookLoan, UserBookLoanStats } from "@/models/BookLoan";
import { getEmployeeById } from "@/services/employee/EmployeeService";
import { CardTitle } from "@/components/ui/card";

interface BookTableProps {
  data: BookLoan[];
  loading: boolean;
  onView: (book: BookLoan) => void;
  onReturn: (book: BookLoan) => void;
}

export function BookLoanTable({
  data,
  loading,
  onView,
  onReturn,
}: BookTableProps) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [userStats, setUserStats] = useState<UserBookLoanStats[]>([]);
  const [userInfoMap, setUserInfoMap] = useState<
    Record<string, { fullName: string; email: string }>
  >({});

  // ========== Hàm search/filter cho bảng phiếu mượn ==========
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
  const getBookLoanSearchProps = (
    dataIndex: keyof BookLoan
  ): ColumnType<BookLoan> => ({
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
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "BORROWED":
        return "Đang mượn";
      case "RETURNED":
        return "Đã trả";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  // ========== Cột bảng chi tiết phiếu mượn ==========
  const columns1: ColumnsType<BookLoan> = [
    {
      title: "Tên sách",
      dataIndex: "bookTitle",
      key: "bookTitle",
      ...getBookLoanSearchProps("bookTitle"),
    },
    {
      title: "Người duyệt",
      dataIndex: "approverName",
      key: "approverName",
      ...getBookLoanSearchProps("approverName"),
    },
    {
      title: "Người mượn",
      dataIndex: "borrowerName",
      key: "borrowerName",
      ...getBookLoanSearchProps("borrowerName"),
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "bookOwner",
      key: "bookOwner",
      ...getBookLoanSearchProps("bookOwner"),
    },
    {
      title: "Ghi chú",
      dataIndex: "remarks",
      key: "remarks",
      ...getBookLoanSearchProps("remarks"),
    },
    { title: "Ngày mượn", dataIndex: "approvedAt", key: "approvedAt" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
      render: (status: string) => {
        const text = getStatusLabel(status);
        const color =
          status === "BORROWED"
            ? "text-blue-600"
            : status === "RETURNED"
            ? "text-green-600"
            : status === "OVERDUE"
            ? "text-red-600"
            : "";
        return <span className={`${color} font-medium`}>{text}</span>;
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
                <Eye className="w-4 h-4 text-primary dark:text-secondary" />
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
  ];

  // ========== Gom nhóm dữ liệu để thống kê theo borrowerId ==========
  useEffect(() => {
    if (!data || data.length === 0) {
      setUserStats([]);
      return;
    }

    const grouped = data.reduce((acc, loan) => {
      if (!loan.borrowerId) return acc;
      if (!acc[loan.borrowerId]) acc[loan.borrowerId] = [];
      acc[loan.borrowerId].push(loan);
      return acc;
    }, {} as Record<string, BookLoan[]>);

    const stats: UserBookLoanStats[] = [];

    for (const borrowerId in grouped) {
      const loans = grouped[borrowerId];
      const totalLoans = loans.length;
      const borrowingCount = loans.filter(
        (l) => l.status === "BORROWED"
      ).length;
      const returnedCount = loans.filter((l) => l.status === "RETURNED").length;
      const overdueCount = loans.filter((l) => l.status === "OVERDUE").length;
      const returnRate =
        totalLoans > 0 ? (returnedCount / totalLoans) * 100 : 0;

      stats.push({
        borrowerId,
        totalLoans,
        borrowingCount,
        returnedCount,
        overdueCount,
        returnRate,
      });
    }

    setUserStats(stats);
  }, [data]);

  // ========== Fetch thông tin nhân viên để hiển thị username/email ==========
  useEffect(() => {
    const fetchUserInfo = async () => {
      const mapCopy = { ...userInfoMap };
      for (const stat of userStats) {
        const id = stat.borrowerId;
        if (!id || mapCopy[id]) continue;
        const emp = await getEmployeeById(Number(id));
        console.log(emp);
        mapCopy[id] = {
          fullName: emp?.fullName || `#${id}`,
          email: emp?.email || "",
        };
      }
      setUserInfoMap(mapCopy);
    };
    if (userStats.length > 0) fetchUserInfo();
  }, [userStats]);

  // ========== Cột bảng thống kê ==========
  const columns2: ColumnsType<UserBookLoanStats> = [
    {
      title: "Người mượn",
      dataIndex: "borrowerId",
      key: "borrowerId",
      render: (id: string) => {
        const info = userInfoMap[id];
        return (
          <div>
            <div className="font-semibold">
              {info?.fullName || "Đang tải..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {info?.email || ""}
            </div>
          </div>
        );
      },
    },
    { title: "Tổng phiếu", dataIndex: "totalLoans", key: "totalLoans" },
    { title: "Đang mượn", dataIndex: "borrowingCount", key: "borrowingCount" },
    { title: "Đã trả", dataIndex: "returnedCount", key: "returnedCount" },
    { title: "Quá hạn", dataIndex: "overdueCount", key: "overdueCount" },
    {
      title: "Tỷ lệ trả đúng hạn (%)",
      dataIndex: "returnRate",
      key: "returnRate",
      render: (v: number) => (
        <span className="font-semibold text-emerald-600">{v.toFixed(1)}%</span>
      ),
    },
  ];

  // ========== Render cả 2 bảng ==========
  return (
    <div className="space-y-2">
      <Table
        columns={columns1}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none"
      />

      <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
       Thống kê người mượn
      </CardTitle>

      <Table
        columns={columns2}
        dataSource={userStats}
        loading={loading}
        rowKey={(r) => r.borrowerId}
        pagination={{ pageSize: 10 }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none"
      />
    </div>
  );
}
