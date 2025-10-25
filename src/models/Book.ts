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
  available?: boolean
}

export interface BookRequest {
  title?: string
}

export interface CreateBookRequest {
  title: string
  author?: string
  category?: string
  publisher?: string
  publicationYear?: number
  quantity_total?: number
  quantity_available?: number
  location?: string
}

export interface UpdateBookRequest {
  title?: string
  author?: string
  category?: string
  publisher?: string
  publicationYear?: number
  quantity_total?: number
  quantity_available?: number
  location?: string
}