"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  type?: "success" | "error" | "warning"
}

export function NotificationModal({
  isOpen,
  onClose,
  title = "Thông báo",
  message,
  type = "success",
}: NotificationModalProps) {
  const iconMap = {
    success: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    error: <XCircle className="w-8 h-8 text-red-500" />,
    warning: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="flex flex-col items-center space-y-3">
          {iconMap[type]}
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground text-sm mt-2">{message}</div>

        <DialogFooter className="mt-4 flex justify-center">
          <Button onClick={onClose} className="px-6">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
