export interface Book {
  id: number
  title: string
  author?: string
  category?: string
  publisher?: string
  publicationYear?: number
  quantity_total?: number
  quantity_available?: number
  location?: string
  createdAt?: string
  updatedAt?: string
}

export interface BookRequest {
  title: string
  author?: string
  category?: string
  publisher?: string
  publicationYear?: number
  quantity_total?: number
  quantity_available?: number
  location?: string
}