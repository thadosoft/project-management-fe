import { Star, Timer } from "lucide-react";
import { Modal, Button } from "rsuite";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTheme } from "@/hooks/use-theme";

interface AddTaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  newTaskName: string;
  setNewTaskName: (value: string) => void;
  newTaskTime: string;
  setNewTaskTime: (value: string) => void;
}

export function AddTaskForm({
  open,
  onClose,
  onSave,
  newTaskName,
  setNewTaskName,
  newTaskTime,
  setNewTaskTime,
}: AddTaskFormProps) {
  const isDarkMode = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={isDarkMode ? "rs-theme-dark" : "rs-theme-light"}
    >
      <Modal.Header>
        <Modal.Title>Thêm sự kiện</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-lime-500" />
              Tên sự kiện
            </Label>
            <Input
              id="name"
              placeholder="Nhập tên sự kiện..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="h-12 bg-background/50 border-2 hover:border-lime-500/30 focus-visible:ring-0.5 focus:border-lime-500/50 transition-all duration-300 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="time"
              className="text-sm font-semibold flex items-center gap-2"
            >
              <Timer className="w-4 h-4 text-lime-500" />
              Thời gian
            </Label>
            <Input
              id="time"
              placeholder="Ví dụ: 09:00 AM"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className="h-12 bg-background/50 border-2 hover:border-lime-500/30 focus-visible:ring-0.5 focus:border-lime-500/50 transition-all duration-300 rounded-xl"
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose} appearance="subtle">
          Hủy
        </Button>
        <Button onClick={onSave} appearance="primary" className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
