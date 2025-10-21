import { fetchData } from "@/utils/api"
import type { Book, BookRequest } from "@/models/Book"
import tokenService from "@/services/tokenService.ts";


const API_URL = "book-loans"

export const getBooks = async (): Promise<Book[]> => {
  try {
    const requestBody = {
      title: "",
      startDate: "",
      endDate: ""
    }
    const response = await fetchData<{ content: Book[] }>(`${API_URL}/search`, "POST", tokenService.accessToken,requestBody )
    console.log("Books fetched:", response?.content) 
    return response?.content || []
  
  } catch (error) {
    console.error("Error fetching books:", error)
    return []
  }
}

export const createBook = async (bookData: BookRequest): Promise<Book | null> => {
  try {
    const response = await fetchData<Book>(API_URL, "POST", null, bookData)
    return response
  } catch (error) {
    console.error("Error creating book:", error)
    return null
  }
}

export const updateBook = async (id: string, bookData: Partial<BookRequest>): Promise<Book | null> => {
  try {
    const response = await fetchData<Book>(`${API_URL}/${id}`, "PUT", null, bookData)
    return response
  } catch (error) {
    console.error("Error updating book:", error)
    return null
  }
}

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    await fetchData(`${API_URL}/${id}`, "DELETE")
    return true
  } catch (error) {
    console.error("Error deleting book:", error)
    return false
  }
}
