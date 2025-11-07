import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { Calendar, Badge, HStack, CustomProvider, Whisper } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import locale from "@/utils/locale";

import type { Event, EventFilterValues, EventRequest } from "@/models/Event";
import { Project } from "@/models/Project";
import {
  createEvent,
  deleteEvent,
  EventSearchFilter,
  searchEvents,
  updateEvent,
} from "@/services/event/eventService";
import { getProjects } from "@/services/projectService";

import { getBadgeColor, getEventTypeValue } from "@/utils/event-utils";
import { EventOverlay } from "./event-overlay";
import { EventFilter } from "./event-filter";
import { EventForm } from "./event-form";
import { EventListView } from "./event-listview";

export function EventCalendar() {
  const isDarkMode = useTheme();

  // ========================
  // ⚙️ State
  // ========================
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasFiltered, setHasFiltered] = useState(false);

  // ========================
  // 🧩 Helpers
  // ========================

  /** Lấy danh sách sự kiện theo ngày */
  const getEventsByDate = (date: Date | null): Event[] => {
    if (!date) return [];
    return events.filter(
      (event) =>
        new Date(event.startDate).toDateString() ===
        new Date(date).toDateString()
    );
  };

  /** Tạo filter gửi đến backend */
  const buildSearchFilter = (filters: EventFilterValues): EventSearchFilter => {
    const { title, type, mode, date, quarter, year } = filters;
    const result: EventSearchFilter = {
      title: title?.trim() || "",
      type: type && type !== "Tất cả" ? getEventTypeValue(type) : "",
    };

    if (mode === "ngày" && date)
      result.startDate = date.toISOString().split("T")[0];

    if (mode === "tháng" && date) {
      const [y, m] = date.toISOString().split("T")[0].split("-");
      result.month = Number(m);
      result.year = Number(y);
    }

    if (mode === "quý" && quarter && year) {
      result.quarter = quarter;
      result.year = year;
    }

    if (mode === "năm" && year) result.year = year;

    return result;
  };

  // ========================
  // 🧭 CRUD Handlers
  // ========================

  const loadEvents = async (pageNumber = page, pageSize = size) => {
    setLoading(true);
    try {
      const response = await searchEvents({}, pageNumber, pageSize);
      setEvents(response.content);
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
      const data = await getProjects();
      if (data) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
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
      await loadEvents();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (error) {
      console.error("Error:", error);
    }
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

  // ========================
  // 🔍 Filtering
  // ========================

  const handleFilter = async (filters: EventFilterValues) => {
    const apiFilters = buildSearchFilter(filters);
    try {
      const response = await searchEvents(apiFilters, 0, 10, "title,asc");
      setFilteredEvents(response.content);
      setHasFiltered(true);
    } catch (error) {
      console.error("❌ Error filtering events:", error);
    }
  };

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  // ========================
  // 🧱 Render Calendar Cell
  // ========================

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

  // ========================
  // 🚀 Lifecycle
  // ========================

  useEffect(() => {
    loadEvents();
  }, [page, size]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // ========================
  // 🎨 Render UI
  // ========================

  return (
    <CustomProvider locale={locale} theme={isDarkMode ? "dark" : "light"}>
      <HStack
        spacing={0}
        alignItems="flex-start"
        wrap
        className="flex flex-col xl:flex-row w-full gap-4"
      >
        {/* 📅 Calendar (Trái) */}
        <div className="w-full xl:w-1/2">
          <Calendar
            bordered
            renderCell={renderCell}
            className="w-full h-full"
          />
        </div>

        {/* 🔍 Filter + 📋 List (Phải) */}
        <div className="w-full xl:w-1/2 flex flex-col h-full gap-4">
          <EventFilter onFilter={handleFilter} />
          <EventListView events={filteredEvents} onAddEvent={handleAddTask} />
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
