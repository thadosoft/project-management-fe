import { fetchData } from "@/utils/api";
import type { Book, BookRequest } from "@/models/Book";
import tokenService from "@/services/tokenService.ts";

const API_URL = "books";

// Lấy danh sách sách (phân trang / tìm kiếm)
export const searchBooks = async (
  title: string = "",
  page: number = 0,
  size: number = 10,
  sort: string = "title,asc"
): Promise<{ content: Book[]; totalPages: number; number: number, numberOfElements: number }> => {
  try {
    const requestBody = { title };

    // gọi API với pageable params
    const response = await fetchData<{
      content: Book[];
      totalPages: number;
      number: number;
      numberOfElements: number;
    }>(
      `${API_URL}/search?page=${page}&size=${size}&sort=${sort}`,
      "POST",
      tokenService.accessToken,
      requestBody
    );

    return {
      content: response?.content || [],
      totalPages: response?.totalPages || 1,
      number: response?.number || 0,
      numberOfElements: response?.numberOfElements || 0,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      content: [],
      totalPages: 1,
      number: 0,
      numberOfElements: 0,
    };
  }
};

// Lấy tổng số sách (dùng cho thống kê)
export const getTotalBooks = async (title: string = ""): Promise<number> => {
  try {
    const requestBody = { title };

    const response = await fetchData<{
      totalElements: number;
    }>(`${API_URL}/search`, "POST", tokenService.accessToken, requestBody);

    return response?.totalElements || 0;
  } catch (error) {
    console.error("Error fetching total books:", error);
    return 0;
  }
};

// Thêm sách mới
export const createBook = async (bookData: BookRequest): Promise<Book | null> => {
  try {
    const response = await fetchData<Book>(API_URL, "POST", tokenService.accessToken, bookData);
    return response;
  } catch (error) {
    console.error("Error creating book:", error);
    return null;
  }
};

// Cập nhật sách theo ID
export const updateBook = async (
  id: string,
  bookData: Partial<BookRequest>
): Promise<Book | null> => {
  try {
    const response = await fetchData<Book>(
      `${API_URL}/${id}`,
      "PUT",
      tokenService.accessToken,
      bookData
    );
    return response;
  } catch (error) {
    console.error("Error updating book:", error);
    return null;
  }
};

// Xóa sách theo ID
export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    await fetchData(`${API_URL}/${id}`, "DELETE", tokenService.accessToken);
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
};

// Lấy sách theo ID
export const getBookById = async (id: string) => {
  const response = await fetchData<Book>(
    `${API_URL}/${id}`,
    "GET",
    tokenService.accessToken
  );
  console.log("getBookById response:", response);
  return response;
};

