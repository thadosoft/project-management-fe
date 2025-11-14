import { useState, useEffect } from "react";
import type { Event } from "@/models/Event";
import { getBadgeClass, getEventTypeLabel } from "@/utils/event-utils";
import { Calendar1, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Employee } from "@/models/EmployeeRequest";
import { getParticipants } from "@/services/event/eventParticipantService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface EventListViewProps {
  events: Event[];
  onAddEvent: () => void;
  employees: Employee[];
}

export function EventListView({
  events,
  onAddEvent,
  employees,
}: EventListViewProps) {
  // --- Pagination state ---
  const [page, setPage] = useState(0);
  const pageSize = 3; // hiển thị 4 record / page
  const totalPages = Math.ceil(events.length / pageSize);

  // reset page khi events thay đổi (ví dụ filter)
  useEffect(() => {
    setPage(0);
  }, [events]);

  // --- Sort events theo ngày bắt đầu ---
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // --- State lưu danh sách participant names cho từng event ---
  const [eventsWithParticipants, setEventsWithParticipants] = useState<
    (Event & { participantNames?: string[] })[]
  >([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!sortedEvents.length) {
        setEventsWithParticipants([]);
        return;
      }

      const updatedEvents = await Promise.all(
        sortedEvents.map(async (event) => {
          const participantIds = await getParticipants(event.id.toString());
          const participantNames = participantIds
            ?.map((id) => employees.find((emp) => emp.id === id)?.fullName)
            .filter(Boolean) as string[];
          return { ...event, participantNames };
        })
      );
      setEventsWithParticipants(updatedEvents);
    };

    fetchParticipants();
  }, [sortedEvents, employees]);

  // --- Lấy events cho page hiện tại ---
  const paginatedEvents = eventsWithParticipants.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <div className="overflow-x-auto lg:h-[22.1rem] sidebar-scroll p-4 bg-gradient-to-bl from-black-500/5 via-transparent to-black-500/10 group-hover:opacity-100 transition-opacity duration-500 rounded-md border border-white/20 space-y-4 shadow-sm">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar1 className="w-5 h-5 text-lime-500" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Sự kiện
          </h3>
        </div>

        <Button
          onClick={onAddEvent}
          className="rounded-full w-32 flex items-center gap-2 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Thêm sự kiện
        </Button>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-lg border border-border/30">
        <table className="w-full text-sm text-muted-foreground">
          <thead className="bg-muted/10 text-sm tracking-wide text-foreground/80 border-b border-border/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Tên sự kiện</th>
              <th className="px-4 py-3 text-center font-semibold">Loại</th>
              <th className="px-4 py-3 text-center font-semibold">Thời gian</th>
              <th className="px-4 py-3 text-center font-semibold">
                Thành viên
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/20">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((event, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/10 transition-colors text-foreground"
                >
                  <td className="px-4 py-3 font-medium text-xs">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Badge
                      variant="outline"
                      className={`capitalize text-center px-2 py-0.5 text-xs font-medium ${getBadgeClass(
                        event.type
                      )}`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground text-center">
                    {new Date(event.startDate).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <td className="px-4 py-3 text-xs max-w-[200px] truncate text-center">
                          {event.participantNames?.join(", ") || "-"}
                        </td>
                      </TooltipTrigger>
                      <TooltipContent className="TooltipContent" sideOffset={5}>
                        <div className=" text-xs text-center">
                          {event.participantNames?.join(", ") || "-"}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground text-sm italic"
                >
                  Không có sự kiện nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>

            <span className="px-4 py-2 text-sm font-medium">
              {page + 1} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
              className="gap-1"
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
