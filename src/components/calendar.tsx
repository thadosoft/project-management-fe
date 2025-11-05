import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { Calendar, Badge, HStack, CustomProvider, Whisper } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import locale from "@/utils/locale";
import type { Event, EventRequest } from "@/models/Event";
import { getBadgeColor } from "@/utils/event-utils"; // you already have this
import { EventOverlay } from "./event-overlay";
import { EventFilter, EventFilterValues } from "./event-filter";
import { EventForm } from "./event-form";
import { Project } from "@/models/Project";
import { EventListView } from "./event-listview";
import {
  createEvent,
  searchEvents,
  updateEvent,
} from "@/services/event/eventService";
import { parseDatetoISO } from "@/utils/dateUtils";
import { getProjects } from "@/services/projectService";

export function EventCalendar() {
  const isDarkMode = useTheme();
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [loading, setLoading] = useState(true);

  // // Mock data
  // const [events, setEvents] = useState<Event[]>([
  //   {
  //     id: "1",
  //     title: "Họp đối tác",
  //     startDate: "2025-10-10T10:30:00",
  //     type: "Họp",
  //     description: "Thảo luận về hợp đồng hợp tác giữa hai công ty.",
  //     project: {
  //       id: "1",
  //       name: "Dự án ThadoCRM",
  //       description: "Hệ thống quản lý khách hàng toàn diện cho doanh nghiệp.",
  //       user: {
  //         id: "1",
  //         name: "Trí",
  //         email: "tri@thadosoft.com",
  //         phoneNumber: "0901234567",
  //         username: "tri.nguyen",
  //         role: "Admin",
  //         modifiedDate: "2025-09-15T08:00:00",
  //         createdDate: "2025-09-01T09:00:00",
  //       },
  //       modifiedDate: "2025-10-05T14:00:00",
  //       createdDate: "2025-09-01T09:00:00",
  //     },
  //   },
  //   {
  //     id: "2",
  //     title: "Khảo sát thị trường",
  //     startDate: "2025-10-10T12:00:00",
  //     type: "Khảo sát",
  //     description: "Khảo sát nhu cầu khách hàng trong khu vực miền Nam.",
  //     project: {
  //       id: "2",
  //       name: "Dự án Market Insight",
  //       description:
  //         "Phân tích xu hướng thị trường và hành vi người tiêu dùng.",
  //       user: {
  //         id: "2",
  //         name: "Dũng",
  //         email: "dung@thadosoft.com",
  //         phoneNumber: "0912345678",
  //         username: "lantran",
  //         role: "Project Manager",
  //         modifiedDate: "2025-09-20T10:30:00",
  //         createdDate: "2025-09-05T09:15:00",
  //       },
  //       modifiedDate: "2025-10-08T15:00:00",
  //       createdDate: "2025-09-05T09:15:00",
  //     },
  //   },
  //   {
  //     id: "3",
  //     title: "Demo Betrimex",
  //     startDate: "2025-10-31T09:30:00",
  //     type: "Demo",
  //     description:
  //       "Trình bày bản demo tính năng mới của hệ thống cho đối tác Betrimex.",
  //     project: {
  //       id: "3",
  //       name: "Dự án Betrimex Portal",
  //       description: "Cổng thông tin nội bộ dành cho khách hàng Betrimex.",
  //       user: {
  //         id: "3",
  //         name: "Khoa",
  //         email: "khoa@thadosoft.com",
  //         phoneNumber: "0938765432",
  //         username: "hunglv",
  //         role: "Developer",
  //         modifiedDate: "2025-09-25T09:45:00",
  //         createdDate: "2025-09-10T10:00:00",
  //       },
  //       modifiedDate: "2025-10-12T11:00:00",
  //       createdDate: "2025-09-10T10:00:00",
  //     },
  //   },
  //   {
  //     id: "4",
  //     title: "Họp nội bộ",
  //     startDate: "2025-10-31T14:30:00",
  //     type: "Họp",
  //     description: "Đánh giá tiến độ các task trong sprint hiện tại.",
  //     project: {
  //       id: "4",
  //       name: "Dự án Quản lý nội bộ",
  //       description: "Nền tảng giúp theo dõi công việc nội bộ công ty.",
  //       user: {
  //         id: "4",
  //         name: "Tùng",
  //         email: "tung@thadosoft.com",
  //         phoneNumber: "0987654321",
  //         username: "mainv",
  //         role: "Scrum Master",
  //         modifiedDate: "2025-09-28T16:00:00",
  //         createdDate: "2025-09-10T09:00:00",
  //       },
  //       modifiedDate: "2025-10-14T08:00:00",
  //       createdDate: "2025-09-10T09:00:00",
  //     },
  //   },
  //   {
  //     id: "5",
  //     title: "Khảo sát team",
  //     startDate: "2025-10-31T16:00:00",
  //     type: "Khảo sát",
  //     description: "Thu thập phản hồi từ các thành viên team phát triển.",
  //     project: {
  //       id: "5",
  //       name: "Dự án ThadoSoft HR",
  //       description: "Hệ thống quản lý nhân sự dành cho công ty ThadoSoft.",
  //       user: {
  //         id: "5",
  //         name: "Minh",
  //         email: "minh@thadosoft.com",
  //         phoneNumber: "0976543210",
  //         username: "baopq",
  //         role: "HR Manager",
  //         modifiedDate: "2025-09-30T13:00:00",
  //         createdDate: "2025-09-12T10:30:00",
  //       },
  //       modifiedDate: "2025-10-10T09:45:00",
  //       createdDate: "2025-09-12T10:30:00",
  //     },
  //   },
  //   {
  //     id: "6",
  //     title: "Họp kết quả khảo sát",
  //     startDate: "2025-10-15T17:00:00",
  //     type: "Họp",
  //     description: "Họp công bố kết quả khảo sát",
  //     project: {
  //       id: "5",
  //       name: "Dự án ThadoSoft HR",
  //       description: "Hệ thống quản lý nhân sự dành cho công ty ThadoSoft.",
  //       user: {
  //         id: "5",
  //         name: "Minh",
  //         email: "minh@thadosoft.com",
  //         phoneNumber: "0976543210",
  //         username: "baopq",
  //         role: "HR Manager",
  //         modifiedDate: "2025-09-30T13:00:00",
  //         createdDate: "2025-09-12T10:30:00",
  //       },
  //       modifiedDate: "2025-10-10T09:45:00",
  //       createdDate: "2025-09-12T10:30:00",
  //     },
  //   },
  // ]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [hasFiltered, setHasFiltered] = useState(false);

  // ========================
  // 🧠 Logic
  // ========================
  const getEventsByDate = (date: Date | null): Event[] => {
    if (!date) return [];
    const key = date.toLocaleDateString("en-CA"); // 🧡 keeps local date
    return events.filter((event) => event.startDate.startsWith(key));
  };

  const handleDeleteTask = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const handleAddTask = () => {
    setFormMode("add");
    setEditingEvent(null);
    setOpenForm(true);
  };

  const handleEditTask = (event: Event) => {
    setFormMode("edit");
    setEditingEvent(event);
    setOpenForm(true);
  };

  const handleSaveTask = async (data: EventRequest) => {
    try {
      if (formMode === "add") {
        await createEvent(data);
        alert("Thêm sự kiện thành công ✅");
      } else if (formMode === "edit" && editingEvent?.id) {
        await updateEvent(editingEvent.id, data);
        alert("Cập nhật sự kiện thành công ✅");
      }
      await loadEvents(); // load lại dữ liệu sau khi thêm/sửa
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilter = (filters: EventFilterValues) => {
    let result = [...events];
    console.log("Event: ", events);
    setHasFiltered(true);
    const searchTitle = filters.title?.trim().toLowerCase();
    if (searchTitle) {
      result = result.filter((e) =>
        e.title.toLowerCase().includes(searchTitle)
      );
    }

    if (filters.type && filters.type !== "Tất cả") {
      result = result.filter((e) => e.type === filters.type);
    }

    if (filters.mode === "ngày" && filters.date) {
      const dateStr = filters.date.toISOString().split("T")[0];
      result = result.filter((e) => e.startDate.startsWith(dateStr));
    }

    if (filters.mode === "tháng" && filters.date) {
      const [year, month] = filters.date.toISOString().split("T")[0].split("-");
      result = result.filter((e) => {
        const [y, m] = e.startDate.split("T")[0].split("-");
        return y === year && m === month;
      });
    }

    const year = filters.year?.toString();
    if (filters.mode === "năm" && year) {
      result = result.filter((e) => e.startDate.startsWith(year));
    }

    if (filters.mode === "quý" && filters.quarter && filters.year) {
      const startMonth = (filters.quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      result = result.filter((e) => {
        const [y, m] = e.startDate.split("T")[0].split("-").map(Number);
        return y === filters.year && m >= startMonth && m <= endMonth;
      });
    }
    console.log("Result: ", result);

    setFilteredEvents(result);
  };

  const projectOptions: Project[] = Array.from(
    new Map(
      events
        .map((e) => e.project) // could be undefined
        .filter((p): p is Project => !!p) // type guard to remove undefined
        .map((p) => [p.id, p])
    ).values()
  );

  // ========================
  // 📅 Render Cell
  // ========================
  const renderCell = (date: Date) => {
    const list = getEventsByDate(date);
    if (!list.length) return null;
    const uniqueTypes = Array.from(new Set(list.map((i) => i.type)));
    // console.log("Event api:", events);

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
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
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

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const loadEvents = async (pageNumber = page, pageSize = size) => {
    setLoading(true);
    try {
      const response = await searchEvents({}, pageNumber, pageSize);
      const data = response.content.map((e: any) => ({
        ...e,
        startDate: parseDatetoISO(e.startDate),
        endDate: parseDatetoISO(e.endDate),
        createdAt: parseDatetoISO(e.createdAt),
        updatedAt: parseDatetoISO(e.updatedAt),
      }));
      setEvents(data);
      setTotalPages(response.totalPages);
      setPage(response.number);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
  try {
    const data = await getProjects(); // gọi API getProjects
    if (data) setProjects(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

  useEffect(() => {
    loadEvents();
  }, [page, size]);

  useEffect(() => {
  fetchProjects();
}, []);

  return (
    <CustomProvider locale={locale} theme={isDarkMode ? "dark" : "light"}>
      <HStack
        spacing={0}
        alignItems="flex-start"
        wrap
        className="flex flex-col xl:flex-row w-full gap-4"
      >
        {/*Calendar */}
        <div className="w-full xl:w-1/2">
          <Calendar
            bordered
            renderCell={renderCell}
            className="w-full h-full"
          />
        </div>

        {/* Filter (top) + List (bottom) */}
        <div className="w-full xl:w-1/2 flex flex-col h-full gap-4">
          <EventFilter onFilter={handleFilter} />
          <EventListView
            events={
              hasFiltered
                ? filteredEvents // nếu đã lọc rồi, dù rỗng vẫn truyền mảng rỗng
                : events.filter((e) => new Date(e.startDate) >= new Date()) // nếu chưa lọc, hiển thị mặc định
            }
            onAddEvent={handleAddTask}
          />
        </div>

        {/* 📝 Modal Form */}
        <EventForm
          open={openForm}
          mode={formMode}
          event={editingEvent}
          onClose={() => setOpenForm(false)}
          onSave={handleSaveTask}
          projects={projects}
        />
      </HStack>
    </CustomProvider>
  );
}
