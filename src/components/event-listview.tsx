import type { Event } from "@/models/Event";
import { getBadgeClass } from "@/utils/event-utils";
import { Calendar1, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";

interface EventListViewProps {
  events: Event[];
}

export function EventListView({ events }: EventListViewProps) {
  const now = new Date();

  const upcomingEvents = [...events]
    .filter((e) => new Date(e.startDate) >= now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return (
    <div className="p-4 bg-gradient-to-bl from-black-500/5 via-transparent to-black-500/10 group-hover:opacity-100 transition-opacity duration-500 rounded-md border border-white/20 space-y-4 shadow-sm">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar1 className="w-5 h-5 text-lime-500" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Sự kiện
          </h3>
        </div>

        <Button className="w-32 flex items-center gap-2 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4"/>
          Thêm sự kiện
        </Button>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-lg border border-border/30">
        <table className="w-full text-sm text-muted-foreground">
          <thead className="bg-muted/10 text-xs uppercase tracking-wide text-foreground/80 border-b border-border/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Tên sự kiện</th>
              <th className="px-4 py-3 text-left font-semibold">Loại</th>
              <th className="px-4 py-3 text-left font-semibold">
                Thời gian bắt đầu
              </th>
              <th className="px-4 py-3 text-center font-semibold">Dự án</th>
              <th className="px-4 py-3 text-left font-semibold">
                Người phụ trách
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/20">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/10 transition-colors text-foreground"
                >
                  <td className="px-4 py-3 font-medium text-sm">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant="outline"
                      className={`capitalize px-2 py-0.5 text-xs font-medium ${getBadgeClass(
                        event.type
                      )}`}
                    >
                      {event.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {event.project?.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {event.project?.user.name || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground text-sm italic"
                >
                  Không có sự kiện sắp diễn ra
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
