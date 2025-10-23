import { fetchData } from "@/utils/api";
import type { BookLoan, BookLoanRequest } from "@/models/BookLoan";
import tokenService from "@/services/tokenService.ts";

const API_URL = "book-loans";

export const getBooksLoans = async (): Promise<BookLoan[]> => {
  try {
    const requestBody = {
      title: "",
      startDate: "",
      endDate: "",
    };
    const response = await fetchData<{ content: BookLoan[] }>(
      `${API_URL}/search`,
      "POST",
      tokenService.accessToken,
      requestBody
    );
    return response?.content || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const createBookLoans = async (
  bookData: BookLoanRequest
): Promise<BookLoan | null> => {
  try {
    const response = await fetchData<BookLoan>(API_URL, "POST", null, bookData);
    return response;
  } catch (error) {
    console.error("Error creating book:", error);
    return null;
  }
};

export const updateBookLoans = async (
  id: string,
  bookData: Partial<BookLoanRequest>
): Promise<BookLoan | null> => {
  try {
    const response = await fetchData<BookLoan>(
      `${API_URL}/${id}`,
      "PUT",
      null,
      bookData
    );
    return response;
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
};

export const deleteBookLoans = async (id: string): Promise<boolean> => {
  try {
    await fetchData(`${API_URL}/${id}`, "DELETE");
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
};

export const returnBook = async (id: number): Promise<boolean> => {
  try {
    await fetchData<void>(
      `${API_URL}/${id}/return`,
      "PUT",
      tokenService.accessToken
    );
    return true;
  } catch (error) {
    console.error("Error returning book:", error);
    return false;
  }
};

export const checkOverdueLoans = async (): Promise<void> => {
  try {
    await fetchData(`${API_URL}/check-overdue`, "POST", tokenService.accessToken);
    console.log("Đã kiểm tra và cập nhật trạng thái quá hạn.");
  } catch (error) {
    console.error("Error checking overdue loans:", error);
  }
};
