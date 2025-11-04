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
import { CardTitle } from "@/components/ui/card";
import { getUserById, getUsers } from "@/services/userService";

interface BookTableProps {
  data: BookLoan[];
  loading: boolean;
  onView: (book: BookLoan) => void;
  onReturn: (book: BookLoan) => void;
  currentPage: number;
  pageSize: number;
}

export function BookLoanTable({
  data,
  loading,
  onView,
  onReturn,
  currentPage,
  pageSize,
}: BookTableProps) {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [selectedBorrower, setSelectedBorrower] = useState<string | null>(null);
  const [borrowerLoans, setBorrowerLoans] = useState<BookLoan[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserBookLoanStats[]>([]);
  const [userInfoMap, setUserInfoMap] = useState<
    Record<string, { name: string; email: string }>
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
  const handleViewBorrowerLoans = (borrowerId: string) => {
    const loans = data.filter((loan) => loan.borrowerId === borrowerId);
    setBorrowerLoans(loans);
    setSelectedBorrower(borrowerId);
    setDetailOpen(true);
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

  const getUserStatsSearchProps = (
    dataIndex: keyof UserBookLoanStats
  ): ColumnType<UserBookLoanStats> => ({
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
    onFilter: (value, record) => {
      const info = userInfoMap[record.borrowerId];
      return info?.name
        ? info.name.toLowerCase().includes((value as string).toLowerCase())
        : false;
    },
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

  // Hàm trả về class màu dựa theo tỷ lệ %
  const getReturnRateColor = (rate: number): string => {
    if (rate >= 80) return "text-emerald-600 font-semibold"; // tốt
    if (rate >= 50) return "text-yellow-600 font-semibold"; // trung bình
    return "text-red-600 font-semibold"; // kém
  };

  const formatDateWithStyledTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const [date, time] = dateStr.split(" "); // "17/11/2025 09:05:58"
    return (
      <span>
        {date} <span className="text-xs text-gray-400 italic">{time}</span>
      </span>
    );
  };

  // ========== Cột bảng chi tiết phiếu mượn ==========
  const columns1: ColumnsType<BookLoan> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: BookLoan, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: "auto",
      align: "center",
    },
    {
      title: "Tên sách",
      dataIndex: "bookTitle",
      key: "bookTitle",
      ...getBookLoanSearchProps("bookTitle"),
      width: "auto",
    },
    {
      title: "Người mượn",
      dataIndex: "borrowerName",
      key: "borrowerName",
      ...getBookLoanSearchProps("borrowerName"),
      width: "auto",
    },
    {
      title: "Người duyệt",
      dataIndex: "approverName",
      key: "approverName",
      ...getBookLoanSearchProps("approverName"),
      width: "auto",
    },
    // {
    //   title: "Chủ sở hữu",
    //   dataIndex: "bookOwner",
    //   key: "bookOwner",
    //   ...getBookLoanSearchProps("bookOwner"),
    // },
    {
      title: "Ghi chú",
      dataIndex: "remarks",
      key: "remarks",
      ...getBookLoanSearchProps("remarks"),
      width: "auto",
    },
    {
      title: "Ngày mượn",
      dataIndex: "approvedAt",
      key: "approvedAt",
      width: "auto",
      render: (value) => formatDateWithStyledTime(value),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      width: "auto",
      render: (value) => formatDateWithStyledTime(value),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnedAt",
      width: "auto",
      key: "returnedAt",
      render: (value: string | null | undefined) =>
        value ? (
          formatDateWithStyledTime(value)
        ) : (
          <span className="text-gray-400 italic">Chưa trả</span>
        ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      width: "auto",
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
      width: "auto",
      align: "center",
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
          {(book.status === "BORROWED" || book.status === "OVERDUE") && (
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
  // ========== Gom nhóm dữ liệu để thống kê theo tất cả nhân viên ==========
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1️⃣ Lấy toàn bộ danh sách nhân viên
        const users = await getUsers(); // Đổi lại tên hàm nếu service của em khác

        if (!users || users.length === 0) {
          setUserStats([]);
          return;
        }

        // 2️⃣ Gom nhóm dữ liệu phiếu mượn
        const grouped = data.reduce((acc, loan) => {
          if (!loan.borrowerId) return acc;
          if (!acc[loan.borrowerId]) acc[loan.borrowerId] = [];
          acc[loan.borrowerId].push(loan);
          return acc;
        }, {} as Record<string, BookLoan[]>);

        // 3️⃣ Gộp dữ liệu nhân viên với thống kê phiếu mượn
        const stats: UserBookLoanStats[] = users.map((user) => {
          const loans = grouped[user.id] || [];
          const totalLoans = loans.length;
          const borrowingCount = loans.filter(
            (l) => l.status === "BORROWED"
          ).length;
          const returnedCount = loans.filter(
            (l) => l.status === "RETURNED"
          ).length;
          const overdueCount = loans.filter(
            (l) => l.status === "OVERDUE"
          ).length;
          const returnRate =
            totalLoans > 0 && (returnedCount > 0 || overdueCount > 0)
              ? (returnedCount / (returnedCount + overdueCount)) * 100
              : undefined;

          return {
            borrowerId: user.id,
            totalLoans,
            borrowingCount,
            returnedCount,
            overdueCount,
            returnRate,
          };
        });

        setUserStats(stats);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê người mượn:", error);
      }
    };

    fetchStats();
  }, [data]);

  // ========== Fetch thông tin nhân viên để hiển thị username/email ==========
  useEffect(() => {
    const fetchUserInfo = async () => {
      const mapCopy = { ...userInfoMap };
      for (const stat of userStats) {
        const id = stat.borrowerId;
        if (!id || mapCopy[id]) continue;
        const emp = await getUserById(id);
        console.log(emp);
        mapCopy[id] = {
          name: emp?.name || `#${id}`,
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
      ...getUserStatsSearchProps("borrowerId"),
      render: (id: string) => {
        const info = userInfoMap[id];
        return (
          <div>
            <div className="font-semibold">{info?.name || "Đang tải..."}</div>
            <div className="text-xs text-muted-foreground">
              {info?.email || ""}
            </div>
          </div>
        );
      },
    },
    {
      title: "Số lần mượn",
      dataIndex: "totalLoans",
      key: "totalLoans",
      align: "center",
      width: "10%",
      sorter: (a, b) => a.totalLoans - b.totalLoans,
    },
    {
      title: "Đang mượn",
      dataIndex: "borrowingCount",
      key: "borrowingCount",
      align: "center",
      width: "10%",
      sorter: (a, b) => a.borrowingCount - b.borrowingCount,
    },
    {
      title: "Đã trả",
      dataIndex: "returnedCount",
      key: "returnedCount",
      align: "center",
      width: "10%",
      sorter: (a, b) => a.returnedCount - b.returnedCount,
    },
    {
      title: "Quá hạn",
      dataIndex: "overdueCount",
      key: "overdueCount",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.overdueCount - b.overdueCount,
    },
    {
      title: "Tỷ lệ trả đúng hạn (%)",
      dataIndex: "returnRate",
      key: "returnRate",
      width: "15%",
      align: "center",
      sorter: (a, b) => (a.returnRate ?? 0) - (b.returnRate ?? 0),
      render: (v: number | undefined) =>
        v === undefined ? (
          <span className="text-gray-400 italic">Chưa có dữ liệu mượn</span>
        ) : (
          <span className={getReturnRateColor(v)}>{Math.round(v)}%</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="link"
              onClick={() => handleViewBorrowerLoans(record.borrowerId)}
            >
              <Eye className="w-4 h-4 text-primary dark:text-secondary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xem chi tiết</TooltipContent>
        </Tooltip>
      ),
    },
  ];

  // ========== Cột bảng hiển thị chi tiết (bỏ cột hành động) ==========
  const columnsDetail = columns1.filter((col) => col.key !== "actions");

  // ========== Render cả 2 bảng ==========
  return (
    <div className="space-y-2">
      <Table
        columns={columns1}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none overflow-auto"
      />

      <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pl-2">
        Thống kê người mượn
      </CardTitle>
      <div></div>
      <Table
        columns={columns2}
        dataSource={userStats}
        loading={loading}
        rowKey={(r) => r.borrowerId}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none overflow-auto"
      />

      {/* Dialog chi tiết phiếu mượn */}
      {detailOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-[90%] max-w-8xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Lịch sử mượn của{" "}
              <span className="text-blue-600">
                {userInfoMap[selectedBorrower!]?.name || "Nhân viên"}
              </span>
            </h2>

            <Table
              columns={columnsDetail}
              dataSource={borrowerLoans}
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
              bordered
              rowKey="id"
              className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none"
            />

            <div className="text-right mt-4">
              <Button
                type="primary"
                danger
                onClick={() => setDetailOpen(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
