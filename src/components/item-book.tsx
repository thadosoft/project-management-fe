import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BsThreeDots } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { Book, BookRequest } from "@/models/Book";
import { deleteBook, getBookById, updateBook } from "@/services/bookService";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ItemBookProps {
  book: Book;
  removeBook: (bookId: number) => void;
  updateBookInList: (updatedBook: Book) => void; // new callback
}

export function ItemBook({ book, removeBook, updateBookInList }: ItemBookProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteBook = async () => {
    await deleteBook(book.id.toString());
    removeBook(book.id);
    setIsDeleteDialogOpen(false);
  };

  const [formData, setFormData] = useState<BookRequest>({
    title: "",
    author: "",
    category: "",
    quantity_total: 1,
    publisher: "",
    publicationYear: undefined,
  });

  const handleEditClick = async () => {
    setIsLoading(true);
    try {
      const data = await getBookById(book.id.toString());
      console.log("Fetched book data:", data);
      if (data) {
        setFormData({
          title: data.title,
          author: data.author || "",
          category: data.category || "",
          quantity_total: data.quantity_total || 1,
          publisher: data.publisher || "",
          publicationYear: data.publicationYear || undefined,
        });
        setIsEditDialogOpen(true);
      } else {
        console.error("Book not found.");
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "publicationYear" || name === "quantity_total"
          ? Number(value)
          : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedBook = await updateBook(book.id.toString(), formData);
      if (updatedBook) {
        console.log("Updated successfully:", updatedBook);
        updateBookInList(updatedBook); // 🔥 tell parent to update state

        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[22rem] sm:h-[18rem] md:h-[20rem] lg:h-[23rem] rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500 flex flex-col p-4">
      <div className="gap-2 w-full pb-2 flex justify-between">
        <p className=" text-2xl sm:text-xl md:text-2xl">
          <b>{book.title}</b>
        </p>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hover:bg-zinc-500">
              <BsThreeDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
                setIsEditDialogOpen(true);
                handleEditClick();
              }}
            >
              <Pencil className="mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(false);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full pb-2">
        <p className="truncate text-muted-foreground text-sm sm:text-xs md:text-sm">
          {book.author}
        </p>
      </div>

      <div className="flex flex-row mt-auto mr-auto items-center">
        <Avatar className="h-9 w-9 sm:h-8 sm:w-8 md:h-9 md:w-9">
          <AvatarImage src="/avatars/shadcn.jpg" alt={book.category} />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <div className="flex items-center pl-2 w-[10vw]">
          <span className="font-semibold text-sm sm:text-xs md:text-sm">
            {book.category}
          </span>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle className="py-4">Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa? Hành động này{" "}
              <span className="text-red-500 font-bold">KHÔNG THỂ</span> hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-around">
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteBook}
              className="bg-red-500 hover:bg-red-400"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="py-4">Chỉnh sửa sách</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin sách trong thư viện
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Tên sách</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Thể loại</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">Nhà xuất bản</Label>
              <Input
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
              />
            </div>

            {/* Publication Year */}
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Năm xuất bản</Label>
              <select
                id="publicationYear"
                name="publicationYear"
                value={formData.publicationYear || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="">-- Chọn năm --</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1950 + 1 },
                  (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity_total">Số lượng</Label>
              <Input
                id="quantity_total"
                name="quantity_total"
                type="number"
                value={formData.quantity_total || 1}
                onChange={handleInputChange}
              />
            </div>

            <DialogFooter className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
