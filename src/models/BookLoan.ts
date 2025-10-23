export interface BookLoan {
  id: number
  bookTitle: string
  borrowerName: string
  bookOwner: string
  approverName?: string
  bookCondition?: string
  status: "AVAILABLE" | "BORROWED" | "OVERDUE" | "RETURNED"
  borrowDate: string
  dueDate?: string
  returnedAt?: string
  remarks?: string
  createdAt?: string
  updatedAt?: string
}

export interface BookLoanRequest {
  bookTitle: string
  borrowerName: string
  borrowerId?: number
  bookOwner: string
  approverName?: string
  bookCondition?: string
  status: "AVAILABLE" | "BORROWED" | "OVERDUE" | "RETURNED"
  borrowDate: string
  dueDate?: string
  returnedAt?: string
  remarks?: string
}
