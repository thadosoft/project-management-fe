import React, { useEffect, useState } from "react";
import { Badge } from "rsuite";
import { Edit2, Trash2, Clock, Users, User2 } from "lucide-react";
import type { Event } from "@/models/Event";
import { getBadgeColor } from "@/utils/event-utils";
import { getParticipants } from "@/services/event/eventParticipantService";
import { Employee } from "@/models/EmployeeRequest";

interface EventOverlayProps {
  events: Event[];
  employees: Employee[];
  onDelete?: (id: string) => void;
  onEdit?: (event: Event) => void;
}

export const EventOverlay = React.forwardRef<HTMLDivElement, EventOverlayProps>(
  ({ events, employees, onDelete, onEdit, ...rest }, ref) => {
    // State lưu participants theo event id
    const [participantsMap, setParticipantsMap] = useState<
      Record<string, number[]>
    >({});

    useEffect(() => {
      const fetchAllParticipants = async () => {
        const map: Record<string, number[]> = {};
        for (const ev of events) {
          const ids = await getParticipants(ev.id.toString());
          if (ids) map[ev.id] = ids;
        }
        setParticipantsMap(map);
      };

      if (events.length > 0) fetchAllParticipants();
    }, [events]);

    const getEmployeeName = (id: number) =>
      employees.find((e) => e.id === id)?.fullName || `Nhân viên #${id}`;

    return (
      <div
        {...rest}
        ref={ref}
        className="absolute text-black dark:text-white bg-white dark:bg-gray-600 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-xl z-[1000] w-[380px] max-w-[90vw]"
      >
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-center mb-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400  bg-clip-text text-transparent">
            Chi tiết sự kiện
          </h3>
          <div className="h-[1px] bg-gray-200 dark:bg-neutral-700" />
        </div>

        <div className="space-y-3 max-h-[320px] overflow-y-auto sidebar-scroll">
          {events.map((event) => {
            const participants = participantsMap[event.id] || [];

            return (
              <div
                key={event.id}
                className="p-3 rounded-lg border border-gray-100 dark:border-neutral-700 bg-gray-50/60 dark:bg-gray-800/60 hover:bg-gray-100/80 dark:hover:bg-gray-700/60 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      color={getBadgeColor(event.type)}
                      className="shadow-sm scale-90"
                    />
                    <h4 className="font-semibold text-sm">
                      {event.title || "Chưa có tiêu đề"}
                    </h4>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit?.(event)}
                      className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Xoá sự kiện "${event.title}"?`))
                          onDelete?.(event.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(event.startDate).toLocaleString([], {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {event.description && (
                  <p className="text-xs italic leading-snug mb-2">
                    “{event.description}”
                  </p>
                )}

                {/* ✅ Danh sách người tham gia */}
                <div className="mt-2 text-xs border-t border-gray-100 dark:border-neutral-700 pt-2">
                  {participants.length > 0 ? (
                    <div className="space-y-1">
                      {participants.map((id) => (
                        <div
                          key={id}
                          className="flex items-center text-cyan-600 dark:text-blue-400 font-medium gap-1"
                        >
                          <User2 className="w-3.5 h-3.5" />
                          <span>{getEmployeeName(id)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic flex items-center gap-1">
                      <User2 className="w-3.5 h-3.5" />
                      <span>Chưa có người tham gia</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
