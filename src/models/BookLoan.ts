// LoanStatus enum giống BE
export type LoanStatus = "AVAILABLE" | "BORROWED" | "OVERDUE" | "RETURNED";

export interface BookLoan {
  id: number;
  bookId?: number;
  bookTitle: string;
  borrowerName: string;
  borrowerId?: number;
  borrowDate: string;       // LocalDateTime BE => string ISO
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
  borrowerId?: number;
  borrowDate: string;       // gửi ISO string
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
  totalBorrowed: number;
  totalReturned: number;
  totalOverdue: number;
}
