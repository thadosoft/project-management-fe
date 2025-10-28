import { fetchData } from "@/utils/api";
import type {
  BookLoan,
  BookLoanRequest,
  CreateBookLoanRequest,
  // UpdateBookLoanRequest,
  BookLoanStatsResponse,
} from "@/models/BookLoan";

const API_URL = "book-loans";

// Tìm kiếm phiếu mượn
export const searchBookLoans = async (
  request: BookLoanRequest,
  page?: number,
  size?: number
): Promise<{ content: BookLoan[]; totalElements: number; totalPages: number } | null> => {
  const query = new URLSearchParams();
  if (page !== undefined) query.append("page", page.toString());
  if (size !== undefined) query.append("size", size.toString());

  return await fetchData<{ content: BookLoan[]; totalElements: number; totalPages: number }, BookLoanRequest>(
    `${API_URL}/search?${query.toString()}`,
    "POST",
    undefined,
    request
  );
};

// Tạo phiếu mượn
export const createBookLoan = async (data: CreateBookLoanRequest): Promise<BookLoan | null> => {
  return await fetchData<BookLoan, CreateBookLoanRequest>(API_URL, "POST", undefined, data);
};

// Cập nhật phiếu mượn
// export const updateBookLoan = async (id: number, data: UpdateBookLoanRequest): Promise<void | null> => {
//   return await fetchData<void, UpdateBookLoanRequest>(`${API_URL}/${id}`, "PUT", undefined, data);
// };

// Xóa phiếu mượn
export const deleteBookLoan = async (id: number): Promise<void | null> => {
  return await fetchData<void>(`${API_URL}/${id}`, "DELETE");
};

// Đánh dấu đã trả
export const markBookLoanAsReturned = async (id: number): Promise<void | null> => {
  return await fetchData<void>(`${API_URL}/${id}/return`, "PUT");
};

// Kiểm tra các phiếu quá hạn
export const checkOverdueBookLoans = async (): Promise<string | null> => {
  return await fetchData<string>(`${API_URL}/check-overdue`, "POST");
};

// Lấy thống kê
export const getBookLoanStats = async (): Promise<BookLoanStatsResponse | null> => {
  return await fetchData<BookLoanStatsResponse>(`${API_URL}/stats`);
};
