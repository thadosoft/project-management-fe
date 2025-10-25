import { useTheme } from "@/hooks/use-theme";
import { Edit, Plus, Star, Trash, Timer } from "lucide-react";
import { useState } from "react";
import {
  Calendar,
  Badge,
  List,
  HStack,
  Button,
  CustomProvider,
  Modal,
} from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { TypeAttributes } from "rsuite/esm/internals/types";
import locale from "@/utils/locale";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// ========================
// 🎯 Type definitions
// ========================
interface TodoItem {
  id: number;
  time: string;
  title: string;
  type: "Demo" | "Họp" | "Khảo sát";
}

interface TodoListProps {
  date: Date | null;
  onAddTask: () => void;
  list: TodoItem[];
}

// ========================
// ⚙️ Helper
// ========================
function getBadgeColor(
  type: TodoItem["type"]
): TypeAttributes.Color | undefined {
  switch (type) {
    case "Demo":
      return "red";
    case "Họp":
      return "yellow";
    case "Khảo sát":
      return "green";
    default:
      return undefined;
  }
}

// ========================
// 📋 Subcomponent: TodoList
// ========================
const TodoList = ({ date, onAddTask, list }: TodoListProps) => {
  if (!date || !list.length) return null;

  return (
    <List style={{ flex: 1, margin: "10px" }} bordered hover className="text-sm">
      <List.Item className="font-semibold text-base flex justify-between items-center">
        <span>Danh sách sự kiện</span>
        <Button
          onClick={onAddTask}
          className="gap-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Thêm sự kiện
        </Button>
      </List.Item>

      {list.map((item) => (
        <List.Item key={item.id} className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Badge
              color={getBadgeColor(item.type)}
              content={item.type}
              className="w-fit"
            />
            <span className="font-medium text-base">{item.title}</span>
            <span className="text-xs text-gray-500">{item.time}</span>
          </div>

          <div className="flex gap-2">
            <Button appearance="subtle" size="xs">
              <Edit className="w-4 h-4" />
            </Button>
            <Button appearance="subtle" color="red" size="xs">
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </List.Item>
      ))}
    </List>
  );
};

// ========================
// 🌞 Main component
// ========================
export function EventCalendar() {
  const isDarkMode = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [events, setEvents] = useState<Record<string, TodoItem[]>>({
    // ✅ Mock data
    "2025-10-10": [
      { id: 1, time: "10:30 am", title: "Họp đối tác", type: "Họp" },
      { id: 2, time: "12:00 pm", title: "Khảo sát thị trường", type: "Khảo sát" },
    ],
    "2025-10-15": [
      { id: 1, time: "09:30 am", title: "Demo Betrimex", type: "Demo" },
      { id: 2, time: "02:30 pm", title: "Họp nội bộ", type: "Họp" },
      { id: 3, time: "04:00 pm", title: "Khảo sát team", type: "Khảo sát" },
    ],
  });

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskType, setNewTaskType] = useState<TodoItem["type"]>("Họp");

  const getTodoList = (date: Date | null): TodoItem[] => {
    if (!date) return [];
    const key = date.toISOString().split("T")[0];
    return events[key] || [];
  };

  const handleSelect = (date: Date) => setSelectedDate(date);
  const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => {
    setOpenAddTask(false);
    setNewTaskName("");
    setNewTaskTime("");
    setNewTaskType("Họp");
  };

  const handleSave = () => {
    if (!selectedDate || !newTaskName.trim()) return;

    const key = selectedDate.toISOString().split("T")[0];
    const newTask: TodoItem = {
      id: Date.now(),
      title: newTaskName,
      time: newTaskTime || "Chưa có giờ",
      type: newTaskType,
    };

    setEvents((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newTask],
    }));

    handleClose();
  };

  const renderCell = (date: Date) => {
    const list = getTodoList(date);
    if (!list.length) return null;

    const uniqueTypes = Array.from(new Set(list.map((i) => i.type)));
    return (
      <HStack alignItems="center" className="p-1" justifyContent="center">
        {uniqueTypes.map((type) => (
          <Badge key={type} color={getBadgeColor(type)} className="calendar-todo-item-badge" />
        ))}
      </HStack>
    );
  };

  const list = getTodoList(selectedDate);

  return (
    <CustomProvider locale={locale}>
      <HStack
        spacing={20}
        alignItems="flex-start"
        wrap
        className={isDarkMode ? "rs-theme-dark" : "rs-theme-light"}
      >
        <Calendar bordered renderCell={renderCell} onSelect={handleSelect} />

        <TodoList date={selectedDate} list={list} onAddTask={handleOpen} />

        {/* ✅ Modal thêm sự kiện */}
        <Modal
          open={openAddTask}
          onClose={handleClose}
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
                  <Star className="w-4 h-4 text-green-500" />
                  Tên sự kiện
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập tên sự kiện..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="h-12 bg-background/50 border-2 hover:border-green-500/30 focus:border-green-500/50 transition-all duration-300 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="time"
                  className="text-sm font-semibold flex items-center gap-2"
                >
                  <Timer className="w-4 h-4 text-green-500" />
                  Thời gian
                </Label>
                <Input
                  id="time"
                  placeholder="Ví dụ: 09:00 AM"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="h-12 bg-background/50 border-2 hover:border-green-500/30 focus:border-green-500/50 transition-all duration-300 rounded-xl"
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Hủy
            </Button>
            <Button onClick={handleSave} appearance="primary" color="green">
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </HStack>
    </CustomProvider>
  );
}
