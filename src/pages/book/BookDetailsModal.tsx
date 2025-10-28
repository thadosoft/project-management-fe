"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Book } from "@/models/Book"
import { updateBook } from "@/services/bookService"
import { NotificationModal } from "@/components/NotificationModal"


interface BookDetailsModalProps {
    book: Book | null
    isOpen: boolean
    onClose: () => void
    onUpdated?: () => void
}

export const BookDetailsModal = ({ book, isOpen, onClose, onUpdated }: BookDetailsModalProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Book | null>(book)
    const [loading, setLoading] = useState(false)

    //modal thông báo
    const [notification, setNotification] = useState<{
        open: boolean
        message: string
        type: "success" | "error" | "warning"
    }>({
        open: false,
        message: "",
        type: "success",
    })

    if (!book) return null

    const handleEditToggle = () => {
        setIsEditing(true)
        setFormData(book)
    }

    const handleChange = (field: keyof Book, value: string | number) => {
        if (!formData) return
        setFormData({ ...formData, [field]: value })
    }

    const handleSave = async () => {
        if (!formData) return
        try {
            setLoading(true)
            await updateBook(formData.id, {
                title: formData.title,
                author: formData.author,
                category: formData.category,
                publisher: formData.publisher,
                publicationYear: formData.publicationYear,
                quantity_total: formData.quantity_total,
                quantity_available: formData.quantity_available,
                location: formData.location,
            })

            setNotification({
                open: true,
                message: "Đã cập nhật sách thành công!",
                type: "success",
            })

            setTimeout(() => {
                setIsEditing(false)
                onUpdated?.()
                onClose()
            }, 1500)
        } catch (error) {
            setNotification({
                open: true,
                message: "Không thể cập nhật sách!",
                type: "error",
            })
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEditing ? "Chỉnh sửa sách" : book.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            {isEditing ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Tựa sách</Label>
                                            <Input
                                                value={formData?.title || ""}
                                                onChange={(e) => handleChange("title", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Tác giả</Label>
                                            <Input
                                                value={formData?.author || ""}
                                                onChange={(e) => handleChange("author", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Thể loại</Label>
                                            <Input
                                                value={formData?.category || ""}
                                                onChange={(e) => handleChange("category", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Nhà xuất bản</Label>
                                            <Input
                                                value={formData?.publisher || ""}
                                                onChange={(e) => handleChange("publisher", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Năm xuất bản</Label>
                                            <Input
                                                type="number"
                                                value={formData?.publicationYear || ""}
                                                onChange={(e) =>
                                                    handleChange("publicationYear", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Số lượng tổng</Label>
                                            <Input
                                                type="number"
                                                value={formData?.quantity_total || ""}
                                                onChange={(e) =>
                                                    handleChange("quantity_total", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Số lượng khả dụng</Label>
                                            <Input
                                                type="number"
                                                value={formData?.quantity_available || ""}
                                                onChange={(e) =>
                                                    handleChange("quantity_available", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label>Vị trí</Label>
                                            <Input
                                                value={formData?.location || ""}
                                                onChange={(e) => handleChange("location", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <InfoField label="Tác giả" value={book.author} />
                                    <InfoField label="Thể loại" value={book.category} />
                                    <InfoField label="Chủ sở hữu" value={book.publisher} />
                                    <InfoField label="Năm xuất bản" value={book.publicationYear?.toString()} />
                                    <InfoField label="Số lượng tổng" value={book.quantity_total?.toString()} />
                                    <InfoField label="Số lượng khả dụng" value={book.quantity_available?.toString()} />
                                    <InfoField label="Vị trí" value={book.location} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3 pt-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={onClose}>
                                    Đóng
                                </Button>
                                <Button onClick={handleEditToggle}>Chỉnh sửa</Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
            <NotificationModal
                isOpen={notification.open}
                onClose={() => setNotification({ ...notification, open: false })}
                message={notification.message}
                type={notification.type}
            />
        </Dialog>
    )
}

const InfoField = ({ label, value }: { label: string; value?: string }) => (
    <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {label}
        </p>
        <p className="text-base text-foreground">{value || "-"}</p>
    </div>
)
