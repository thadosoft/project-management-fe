import { fetchData } from "@/utils/api"
import type {
    Book,
    BookRequest,
    CreateBookRequest,
    UpdateBookRequest
} from "@/models/Book";

const API_URL = "books"

// 🔍 Tìm kiếm sách (POST /books/search)
export const searchBooks = async (
  request: BookRequest,
  page?: number,
  size?: number
): Promise<{ content: Book[]; totalElements: number; totalPages: number } | null> => {
  const query = new URLSearchParams()
  if (page !== undefined) query.append("page", page.toString())
  if (size !== undefined) query.append("size", size.toString())

  return await fetchData<{ content: Book[]; totalElements: number; totalPages: number }, BookRequest>(
    `${API_URL}/search?${query.toString()}`,
    "POST",
    undefined,
    request
  )
}

// 📘 Lấy thông tin chi tiết sách (GET /books/{id})
export const getBookById = async (id: number): Promise<Book | null> => {
  return await fetchData<Book>(`${API_URL}/${id}`)
}

// ➕ Tạo sách mới (POST /books)
export const createBook = async (data: CreateBookRequest): Promise<Book | null> => {
  return await fetchData<Book, CreateBookRequest>(API_URL, "POST", undefined, data)
}

// ✏️ Cập nhật thông tin sách (PUT /books/{id})
export const updateBook = async (id: number, data: UpdateBookRequest): Promise<void | null> => {
  return await fetchData<void, UpdateBookRequest>(`${API_URL}/${id}`, "PUT", undefined, data)
}

// ❌ Xóa sách (DELETE /books/{id})
export const deleteBook = async (id: number): Promise<void | null> => {
  return await fetchData<void>(`${API_URL}/${id}`, "DELETE")
}