import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Calendar, Badge, HStack, CustomProvider, Whisper } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import { TypeAttributes } from "rsuite/esm/internals/types";
import locale from "@/utils/locale";
import { AddTaskForm } from "./task-add-form";
import { EventFilter } from "./event-filter";
import type { Event, EventType } from "@/models/Event";
import React from "react";
import { Edit2, Trash2, Clock, FolderClosed, User2 } from "lucide-react";
// ========================
// ⚙️ Helper
// ========================
function getBadgeColor(type: EventType): TypeAttributes.Color | undefined {
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
// Overlay Custom
// ========================
const EventOverlay = React.forwardRef(
  ({ events, onClose, ...rest }: any, ref: any) => {
    return (
      <div
        {...rest}
        ref={ref}
        className="absolute text-black dark:text-white bg-white dark:bg-gray-600 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-xl z-[1000] w-[380px] max-w-[90vw]"
      >
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-center mb-1">
            Chi tiết sự kiện
          </h3>
          <div className="h-[1px] bg-gray-200 dark:bg-neutral-700" />
        </div>

        {/*Show data columns*/}
        <div className="space-y-3 max-h-[320px] overflow-y-auto sidebar-scroll">
          {events.map((event: Event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-gray-100 dark:border-neutral-700 bg-gray-50/60 dark:bg-gray-800/60 hover:bg-gray-100/80 dark:hover:bg-gray-700/60 transition-all duration-200 shadow-sm"
            >
              {/* Header: Title + Type + Actions */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    color={getBadgeColor(event.type)}
                    className="shadow-sm scale-90"
                  />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {event.title}
                  </h4>
                </div>

                {/* Action buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => console.log("Edit", event.id)}
                    className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4 text-blue-500" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => console.log("Delete", event.id)}
                    className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition"
                    title="Xóa sự kiện"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-400 dark:text-gray-500" />
                {new Date(event.startDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-snug mb-2">
                  “{event.description}”
                </p>
              )}

              {/* Project + User */}
              {event.project && (
                <div className="flex items-center justify-between mt-2 text-xs border-t border-gray-100 dark:border-neutral-700 pt-2">
                  <div className="flex items-center text-yellow-600 dark:text-yellow-500 font-medium gap-1">
                    <FolderClosed className="w-3.5 h-3.5" />
                    {event.project.name}
                  </div>
                  {event.project.user?.name && (
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 gap-1">
                      <User2 className="w-3.5 h-3.5" />
                      {event.project.user.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

// ========================
// 📋 Subcomponent: EventList
// ========================
// interface EventListProps {
//   date: Date | null;
//   onAddTask: () => void;
//   list: Event[];
// }

// const EventList = ({ date, onAddTask, list }: EventListProps) => {
//   if (!date || !list.length) return null;

//   return (
//     <List
//       style={{ flex: 1, margin: "10px" }}
//       bordered
//       hover
//       className="text-sm"
//     >
//       <List.Item className="font-semibold text-base flex justify-between items-center">
//         <span>Danh sách sự kiện</span>
//         <Button
//           onClick={onAddTask}
//           className="gap-2 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <Plus className="w-4 h-4" />
//           Thêm sự kiện
//         </Button>
//       </List.Item>

//       {list.map((item) => (
//         <List.Item key={item.id} className="flex justify-between items-center">
//           <div className="flex flex-col gap-1">
//             <Badge
//               color={getBadgeColor(item.type)}
//               content={item.type}
//               className="w-fit"
//             />
//             <span className="font-medium text-base">{item.title}</span>
//             <span className="text-xs text-gray-500">
//               {new Date(item.startDate).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </span>
//           </div>

//           <div className="flex gap-2">
//             <Button appearance="subtle" size="xs">
//               <Edit className="w-4 h-4" />
//             </Button>
//             <Button appearance="subtle" color="red" size="xs">
//               <Trash className="w-4 h-4" />
//             </Button>
//           </div>
//         </List.Item>
//       ))}
//     </List>
//   );
// };

// ========================
// 🌞 Main component
// ========================
export function EventCalendar() {
  const isDarkMode = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Họp đối tác",
      startDate: "2025-10-10T10:30:00",
      type: "Họp",
      description: "Thảo luận về hợp đồng hợp tác giữa hai công ty.",
      project: {
        id: "1",
        name: "Dự án ThadoCRM",
        description: "Hệ thống quản lý khách hàng toàn diện cho doanh nghiệp.",
        user: {
          id: "1",
          name: "Trí",
          email: "tri@thadosoft.com",
          phoneNumber: "0901234567",
          username: "tri.nguyen",
          role: "Admin",
          modifiedDate: "2025-09-15T08:00:00",
          createdDate: "2025-09-01T09:00:00",
        },
        modifiedDate: "2025-10-05T14:00:00",
        createdDate: "2025-09-01T09:00:00",
      },
    },
    {
      id: "2",
      title: "Khảo sát thị trường",
      startDate: "2025-10-10T12:00:00",
      type: "Khảo sát",
      description: "Khảo sát nhu cầu khách hàng trong khu vực miền Nam.",
      project: {
        id: "2",
        name: "Dự án Market Insight",
        description:
          "Phân tích xu hướng thị trường và hành vi người tiêu dùng.",
        user: {
          id: "2",
          name: "Dũng",
          email: "dung@thadosoft.com",
          phoneNumber: "0912345678",
          username: "lantran",
          role: "Project Manager",
          modifiedDate: "2025-09-20T10:30:00",
          createdDate: "2025-09-05T09:15:00",
        },
        modifiedDate: "2025-10-08T15:00:00",
        createdDate: "2025-09-05T09:15:00",
      },
    },
    {
      id: "3",
      title: "Demo Betrimex",
      startDate: "2025-10-15T09:30:00",
      type: "Demo",
      description:
        "Trình bày bản demo tính năng mới của hệ thống cho đối tác Betrimex.",
      project: {
        id: "3",
        name: "Dự án Betrimex Portal",
        description: "Cổng thông tin nội bộ dành cho khách hàng Betrimex.",
        user: {
          id: "3",
          name: "Khoa",
          email: "khoa@thadosoft.com",
          phoneNumber: "0938765432",
          username: "hunglv",
          role: "Developer",
          modifiedDate: "2025-09-25T09:45:00",
          createdDate: "2025-09-10T10:00:00",
        },
        modifiedDate: "2025-10-12T11:00:00",
        createdDate: "2025-09-10T10:00:00",
      },
    },
    {
      id: "4",
      title: "Họp nội bộ",
      startDate: "2025-10-15T14:30:00",
      type: "Họp",
      description: "Đánh giá tiến độ các task trong sprint hiện tại.",
      project: {
        id: "4",
        name: "Dự án Quản lý nội bộ",
        description: "Nền tảng giúp theo dõi công việc nội bộ công ty.",
        user: {
          id: "4",
          name: "Tùng",
          email: "tung@thadosoft.com",
          phoneNumber: "0987654321",
          username: "mainv",
          role: "Scrum Master",
          modifiedDate: "2025-09-28T16:00:00",
          createdDate: "2025-09-10T09:00:00",
        },
        modifiedDate: "2025-10-14T08:00:00",
        createdDate: "2025-09-10T09:00:00",
      },
    },
    {
      id: "5",
      title: "Khảo sát team",
      startDate: "2025-10-15T16:00:00",
      type: "Khảo sát",
      description: "Thu thập phản hồi từ các thành viên team phát triển.",
      project: {
        id: "5",
        name: "Dự án ThadoSoft HR",
        description: "Hệ thống quản lý nhân sự dành cho công ty ThadoSoft.",
        user: {
          id: "5",
          name: "Minh",
          email: "minh@thadosoft.com",
          phoneNumber: "0976543210",
          username: "baopq",
          role: "HR Manager",
          modifiedDate: "2025-09-30T13:00:00",
          createdDate: "2025-09-12T10:30:00",
        },
        modifiedDate: "2025-10-10T09:45:00",
        createdDate: "2025-09-12T10:30:00",
      },
    },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    startDate: "",
    type: "Họp",
  });

  const getEventsByDate = (date: Date | null): Event[] => {
    if (!date) return [];
    const key = date.toISOString().split("T")[0];
    return events.filter((event) => event.startDate.startsWith(key));
  };

  const handleSelect = (date: Date) => setSelectedDate(date);
  // const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => {
    setOpenAddTask(false);
    setNewEvent({ title: "", startDate: "", type: "Họp" });
  };
  const handleSave = () => {
    if (!selectedDate || !newEvent.title?.trim()) return;
    const key = selectedDate.toISOString().split("T")[0];
    const newItem: Event = {
      id: Date.now().toString(),
      title: newEvent.title!,
      startDate: newEvent.startDate || `${key}T00:00:00`,
      type: newEvent.type || "Họp",
    };
    setEvents((prev) => [...prev, newItem]);
    handleClose();
  };

  const renderCell = (date: Date) => {
    const list = getEventsByDate(date);
    if (!list.length) return null;

    const uniqueTypes = Array.from(new Set(list.map((i) => i.type)));

    return (
      <Whisper
        trigger="hover"
        enterable
        placement="auto"
        speaker={(props, ref) => (
          <EventOverlay
            ref={ref}
            {...props}
            events={list}
            onClose={() => {
              if (props.onClose) props.onClose();
            }}
          />
        )}
      >
        <HStack
          alignItems="center"
          justifyContent="center"
          className="p-1 cursor-pointer"
        >
          {uniqueTypes.map((type) => (
            <Badge
              key={type}
              color={getBadgeColor(type)}
              className="calendar-todo-item-badge"
            />
          ))}
        </HStack>
      </Whisper>
    );
  };

  // const list = getEventsByDate(selectedDate);
  const handleSearch = () => {};

  return (
    <CustomProvider locale={locale}>
      <HStack
        spacing={0}
        alignItems="flex-start"
        wrap
        className={isDarkMode ? "rs-theme-dark" : "rs-theme-light"}
      >
        <Calendar
          bordered
          renderCell={renderCell}
          onSelect={handleSelect}
          className="w-full lg:w-1/2"
        />

        <AddTaskForm
          open={openAddTask}
          onClose={handleClose}
          onSave={handleSave}
          newTaskName={newEvent.title || ""}
          setNewTaskName={(val) =>
            setNewEvent((prev) => ({ ...prev, title: val }))
          }
          newTaskTime={newEvent.startDate || ""}
          setNewTaskTime={(val) =>
            setNewEvent((prev) => ({ ...prev, startDate: val }))
          }
        />

        {/* <EventList date={selectedDate} list={list} onAddTask={handleOpen} /> */}
        <EventFilter onFilter={handleSearch} />
      </HStack>
    </CustomProvider>
  );
}
