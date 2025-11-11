import React from "react";
import { Badge } from "rsuite";
import { Edit2, Trash2, Clock, FolderClosed, User2 } from "lucide-react";
import type { Event } from "@/models/Event";
import { getBadgeColor } from "@/utils/event-utils";

interface EventOverlayProps {
  events: Event[];
  onDelete?: (id: string) => void;
  onEdit?: (event: Event) => void;
}

export const EventOverlay = React.forwardRef<HTMLDivElement, EventOverlayProps>(
  ({ events, onDelete, onEdit, ...rest }, ref) => (
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

      <div className="space-y-3 max-h-[320px] overflow-y-auto sidebar-scroll">
        {events.map((event) => (
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
                <h4 className="font-semibold text-sm">{event.title}</h4>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit?.(event)}
                  className="p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                >
                  <Edit2 className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onDelete?.(event.id)}
                  className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {event.description && (
              <p className="text-xs italic leading-snug mb-2">
                “{event.description}”
              </p>
            )}

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
  )
);
