
// LoanStatus enum giống BE
export type LoanStatus = "AVAILABLE" | "BORROWED" | "OVERDUE" | "RETURNED";

export interface BookLoan {
  id: number;
  bookId?: number;
  bookTitle: string;
  borrowerName: string;
  borrowerId?: string;
  borrowDate: string;
  dueDate?: string;
  status: LoanStatus;
  approverName?: string;
  approvedAt?: string;
  returnedAt?: string;
  bookOwner?: string;
  bookCondition?: string;
  isAvailable?: boolean;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dùng cho tạo phiếu mượn
export interface CreateBookLoanRequest {
  bookId?: number;
  bookTitle: string;
  borrowerName: string;
  borrowerId?: string;
  borrowDate: string;
  dueDate?: string;
  status: LoanStatus;
  approverName?: string;
  approvedAt?: string;
  returnedAt?: string;
  bookOwner?: string;
  bookCondition?: string;
  isAvailable?: boolean;
  remarks?: string;
}

// Dùng cho tìm kiếm
export interface BookLoanRequest {
  title?: string;
  startDate?: string;
  endDate?: string;
}

// Thống kê
export interface BookLoanStatsResponse {
  borrowedCount: number;
  returnedCount: number;
  overdueCount: number;
}

// Kiểu dữ liệu cho bảng thống kê theo người
export interface UserBookLoanStats {
  borrowerId: string
  totalLoans: number
  borrowingCount: number
  returnedCount: number
  overdueCount: number
  returnRate?: number
}
