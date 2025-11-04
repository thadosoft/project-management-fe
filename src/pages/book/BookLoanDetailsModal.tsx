"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import type { BookLoan } from "@/models/BookLoan";

interface BookDetailsModalProps {
  book: BookLoan | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; label: string }> =
    {
      BORROWED: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-200",
        label: "Đang mượn",
      },
      RETURNED: {
        bg: "bg-gray-100 dark:bg-gray-900",
        text: "text-gray-800 dark:text-gray-200",
        label: "Đã trả",
      },
      OVERDUE: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-200",
        label: "Quá hạn",
      },
    };
  const statusInfo = statusMap[status] || {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-800 dark:text-gray-200",
    label: status,
  };
  return statusInfo;
};

const InfoField = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="py-3">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-base text-foreground">{value || "-"}</p>
  </div>
);

export const BookDetailsModal = ({
  book,
  isOpen,
  onClose,
}: BookDetailsModalProps) => {
  if (!book) return null;

  const statusBadge = getStatusBadge(book.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sidebar-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {book.bookTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className={`px-4 py-3 rounded-md ${statusBadge.bg}`}>
            <p className={`font-semibold text-sm ${statusBadge.text}`}>
              {statusBadge.label}
            </p>
          </div>

          {/* Book Information */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Thông tin sách
                  </p>
                  <div className="space-y-3">
                    <InfoField label="Chủ sở hữu" value={book.bookOwner} />
                    <InfoField label="Ghi chú" value={book.remarks} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Information */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Thông tin mượn
                  </p>
                  <div className="space-y-3">
                    <InfoField label="Người duyệt" value={book.approverName} />
                    <InfoField label="Người mượn" value={book.borrowerName} />
                    <InfoField label="Ngày mượn" value={book.borrowDate} />
                    <InfoField label="Ngày phê duyệt" value={book.approvedAt} />
                    <InfoField label="Ngày trả dự kiến" value={book.dueDate} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {/* <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Đóng
            </Button>
            <Button className="flex-1">Chỉnh sửa</Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
