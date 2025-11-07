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
import { searchBooks } from "@/services/bookService";
import { Book } from "@/models/Book";

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
  const [booksWithAuthor, setBooksWithAuthor] = useState<BookLoan[]>([]);
  const [userInfoMap, setUserInfoMap] = useState<
    Record<string, { name: string; email: string }>
  >({});

  // ===== Search/Filter logic =====
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

  const getSearchProps = <T extends object>(
    dataIndex: keyof T
  ): ColumnType<T> => ({
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
          placeholder={`Tìm ${String(dataIndex)}`}
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
    ...getSearchProps<UserBookLoanStats>(dataIndex),
    onFilter: (value, record) => {
      const info = userInfoMap[record.borrowerId];
      return info?.name
        ? info.name.toLowerCase().includes((value as string).toLowerCase())
        : false;
    },
  });

  // ===== Helpers =====
  const getStatusLabel = (status: string) =>
    status === "BORROWED"
      ? "Đang mượn"
      : status === "RETURNED"
      ? "Đã trả"
      : status === "OVERDUE"
      ? "Quá hạn"
      : status;

  const getReturnRateColor = (rate: number) =>
    rate >= 80
      ? "text-emerald-600 font-semibold"
      : rate >= 50
      ? "text-yellow-600 font-semibold"
      : "text-red-600 font-semibold";

  const formatDateWithStyledTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const [date, time] = dateStr.split(" ");
    return (
      <span>
        {date} <span className="text-xs text-gray-400 italic">{time}</span>
      </span>
    );
  };

  const handleViewBorrowerLoans = (borrowerId: string) => {
    const loans = booksWithAuthor.filter((loan) => loan.borrowerId === borrowerId); // lấy từ booksWithAuthor
    setBorrowerLoans(loans);
    setSelectedBorrower(borrowerId);
    setDetailOpen(true);
  };

  // ===== Columns =====
  const columns1: ColumnsType<BookLoan> = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: BookLoan, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      align: "center",
    },
    {
      title: "Tên sách",
      dataIndex: "bookTitle",
      key: "bookTitle",
      ...getSearchProps<BookLoan>("bookTitle"),
    },
        {
      title: "Tác giả",
      dataIndex: "book_author",
      key: "book_author",
      ...getSearchProps<any>("book_author"),
    },
    {
      title: "Người mượn",
      dataIndex: "borrowerName",
      key: "borrowerName",
      ...getSearchProps<BookLoan>("borrowerName"),
    },
    {
      title: "Ghi chú",
      dataIndex: "remarks",
      key: "remarks",
      ...getSearchProps<BookLoan>("remarks"),
    },
    {
      title: "Ngày mượn",
      dataIndex: "approvedAt",
      key: "approvedAt",
      render: (v) => formatDateWithStyledTime(v),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (v) => formatDateWithStyledTime(v),
    },
    {
      title: "Ngày trả",
      dataIndex: "returnedAt",
      key: "returnedAt",
      render: (v) =>
        v ? (
          formatDateWithStyledTime(v)
        ) : (
          <span className="text-gray-400 italic">Chưa trả</span>
        ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => {
        const color =
          status === "BORROWED"
            ? "text-blue-600"
            : status === "RETURNED"
            ? "text-green-600"
            : "text-red-600";
        return (
          <span className={`${color} font-medium`}>
            {getStatusLabel(status)}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
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
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-500/10 hover:text-green-700"
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

  const columnsDetail = columns1.filter((col) => col.key !== "actions");

  const columns2: ColumnsType<UserBookLoanStats> = [
    {
      title: "Người mượn",
      dataIndex: "borrowerId",
      key: "borrowerId",
      ...getUserStatsSearchProps("borrowerId"),
      render: (id: string) => (
        <div>
          <div className="font-semibold">
            {userInfoMap[id]?.name || "Đang tải..."}
          </div>
          <div className="text-xs text-muted-foreground">
            {userInfoMap[id]?.email || ""}
          </div>
        </div>
      ),
    },
    {
      title: "Số lần mượn",
      dataIndex: "totalLoans",
      key: "totalLoans",
      align: "center",
      sorter: (a, b) => a.totalLoans - b.totalLoans,
    },
    {
      title: "Đang mượn",
      dataIndex: "borrowingCount",
      key: "borrowingCount",
      align: "center",
      sorter: (a, b) => a.borrowingCount - b.borrowingCount,
    },
    {
      title: "Đã trả",
      dataIndex: "returnedCount",
      key: "returnedCount",
      align: "center",
      sorter: (a, b) => a.returnedCount - b.returnedCount,
    },
    {
      title: "Quá hạn",
      dataIndex: "overdueCount",
      key: "overdueCount",
      align: "center",
      sorter: (a, b) => a.overdueCount - b.overdueCount,
    },
    {
      title: "Tỷ lệ trả đúng hạn (%)",
      dataIndex: "returnRate",
      key: "returnRate",
      align: "center",
      sorter: (a, b) => (a.returnRate ?? 0) - (b.returnRate ?? 0),
      render: (v) =>
        v === undefined ? (
          <span className="text-gray-400 italic">Chưa có dữ liệu mượn</span>
        ) : (
          <span className={getReturnRateColor(v)}>{Math.round(v)}%</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
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

  // ===== Effects =====
  useEffect(() => {
    const fetchStats = async () => {
      const users = await getUsers();
      if (!users?.length) return setUserStats([]);
      const grouped = data.reduce((acc, loan) => {
        if (!loan.borrowerId) return acc;
        acc[loan.borrowerId] = acc[loan.borrowerId] || [];
        acc[loan.borrowerId].push(loan);
        return acc;
      }, {} as Record<string, BookLoan[]>);

      const stats = users.map((user) => {
        const loans = grouped[user.id] || [];
        const totalLoans = loans.length;
        const returnedCount = loans.filter(
          (l) => l.status === "RETURNED"
        ).length;
        const overdueCount = loans.filter((l) => l.status === "OVERDUE").length;
        return {
          borrowerId: user.id,
          totalLoans,
          borrowingCount: loans.filter((l) => l.status === "BORROWED").length,
          returnedCount,
          overdueCount,
          returnRate:
            totalLoans > 0
              ? (returnedCount / (returnedCount + overdueCount)) * 100
              : undefined,
        };
      });
      setUserStats(stats);
    };
    fetchStats();
  }, [data]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const mapCopy = { ...userInfoMap };
      for (const stat of userStats) {
        const id = stat.borrowerId;
        if (!id || mapCopy[id]) continue;
        const emp = await getUserById(id);
        mapCopy[id] = { name: emp?.name || `#${id}`, email: emp?.email || "" };
      }
      setUserInfoMap(mapCopy);
    };
    if (userStats.length) fetchUserInfo();
  }, [userStats]);

  useEffect(() => {
    const fetchBookAuthors = async () => {
      const mapCopy: Record<string, string> = {};
      for (const book of data) {
        if (!book.bookTitle || mapCopy[book.bookTitle]) continue;
        try {
          const resp = await searchBooks({ title: book.bookTitle }, 0, 1);
          const bookDetails: Book | undefined = resp?.content?.[0];
          mapCopy[book.bookTitle] = bookDetails?.author || "Chưa rõ tác giả";
        } catch {
          mapCopy[book.bookTitle] = "Chưa rõ tác giả";
        }
      }
      setBooksWithAuthor(
        data.map((book) => ({
          ...book,
          book_author: book.bookTitle
            ? mapCopy[book.bookTitle]
            : "Chưa rõ tác giả",
        }))
      );
    };
    if (data.length) fetchBookAuthors();
  }, [data]);

  // ===== Render =====
  return (
    <div className="space-y-2">
      <Table
        columns={columns1}
        dataSource={booksWithAuthor}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize }}
        scroll={{ x: true }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none overflow-auto"
      />

      <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pl-2">
        Thống kê người mượn
      </CardTitle>

      <Table
        columns={columns2}
        dataSource={userStats}
        loading={loading}
        rowKey={(r) => r.borrowerId}
        pagination={{ pageSize }}
        scroll={{ x: true }}
        bordered
        className="!rounded-none [&_.ant-table-container]:!rounded-none [&_.ant-table]:!rounded-none [&_.ant-table-content]:!rounded-none overflow-auto"
      />

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
