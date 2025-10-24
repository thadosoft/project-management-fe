import { bg } from "date-fns/locale";
import { useState } from "react";
import { Calendar, Badge, List, HStack } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

interface TodoItem {
  id: number;
  time: string;
  title: string;
}

// ✅ Return type is TodoItem[]
function getTodoList(date: Date | null): TodoItem[] {
  if (!date) return [];

  const day = date.getDate();

  switch (day) {
    case 10:
      return [
        { id: 1, time: "10:30 am", title: "Meeting" },
        { id: 2, time: "12:00 pm", title: "Lunch" },
      ];
    case 15:
      return [
        { id: 1, time: "09:30 pm", title: "Products Introduction Meeting" },
        { id: 2, time: "12:30 pm", title: "Client entertaining" },
        { id: 3, time: "02:00 pm", title: "Product design discussion" },
        { id: 4, time: "05:00 pm", title: "Product test and acceptance" },
        { id: 5, time: "06:30 pm", title: "Reporting" },
      ];
    default:
      return [];
  }
}

// ✅ Calendar cell renderer
function renderCell(date: Date): JSX.Element | null {
  const list = getTodoList(date);

  if (list.length) {
    return <Badge className="calendar-todo-item-badge"/>;
  }

  return null;
}

// ✅ Main component
export function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <HStack spacing={20} alignItems="flex-start" wrap>
      <Calendar
        bordered
        renderCell={renderCell}
        onSelect={handleSelect}
        cellClassName={(date) => (date.getDay() ? "hover:bg-red-300" : undefined)}
      />
      <TodoList date={selectedDate} />
    </HStack>
  );
}

// ✅ TodoList component with typed props
interface TodoListProps {
  date: Date | null;
}

const TodoList = ({ date }: TodoListProps) => {
  const list = getTodoList(date);

  if (!list.length) return null;

  return (
    <List
      style={{ flex: 1, margin: "10px" }}
      bordered
      className="text-black dark:text-white"
    >
      {list.map((item) => (
        <List.Item
          key={item.id}
          index={item.id}
          style={{ backgroundColor: "transparent" }}
        >
          <div>{item.time}</div>
          <div>{item.title}</div>
        </List.Item>
      ))}
    </List>
  );
};
