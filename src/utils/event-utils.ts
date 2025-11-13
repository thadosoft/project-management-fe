import { TypeAttributes } from "rsuite/esm/internals/types";
import type { EventType } from "@/models/Event";

export type EventTypeAPI = "MEETING" | "SURVEY" | "DEMO" | "FACTORY";

/**
 * 🧭 Mapping giữa giá trị API và nhãn hiển thị (EventType)
 */
export const EVENT_TYPE_MAP: Record<EventTypeAPI, EventType> = {
  MEETING: "Họp",
  SURVEY: "Khảo sát",
  DEMO: "Demo",
  FACTORY: "Onsite nhà máy",
};

/**
 * 🔁 Mapping ngược giữa nhãn hiển thị và giá trị API
 */
export const EVENT_TYPE_REVERSE_MAP: Record<EventType, EventTypeAPI> = {
  Họp: "MEETING",
  "Khảo sát": "SURVEY",
  Demo: "DEMO",
  "Onsite nhà máy": "FACTORY",
};

/**
 * 🔄 Chuyển từ API type (MEETING, SURVEY, DEMO)
 * sang hiển thị tiếng Việt (Họp, Khảo sát, Demo)
 */
export function getEventTypeLabel(apiType?: string): EventType | string {
  if (!apiType) return "";
  return EVENT_TYPE_MAP[apiType as EventTypeAPI] ?? apiType;
}

/**
 * 🔁 Chuyển từ hiển thị tiếng Việt (Họp, Khảo sát, Demo)
 * sang API type (MEETING, SURVEY, DEMO)
 */
export function getEventTypeValue(label?: string): EventTypeAPI | string {
  if (!label) return "";
  return EVENT_TYPE_REVERSE_MAP[label as EventType] ?? label;
}

/**
 * 📋 Danh sách option cho Select
 */
export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_MAP).map(
  ([value, label]) => ({ value, label })
);

/**
 * 🎨 Badge color cho Calendar hoặc List
 */
export function getBadgeColor(
  type: EventType
): TypeAttributes.Color | undefined {
  switch (type.toUpperCase()) {
    case "DEMO":
      return "red";
    case "HỌP":
    case "MEETING":
      return "yellow";
    case "KHẢO SÁT":
    case "SURVEY":
      return "green";
    case "FACTORY":
      return "blue";
    default:
      return undefined;
  }
}

/**
 * 🎨 Badge TailwindCSS class chi tiết hơn
 */
export function getBadgeClass(type: EventType): string {
  switch (type.toUpperCase()) {
    case "DEMO":
      return "bg-red-500/10 text-red-600 border border-red-500/20";
    case "HỌP":
    case "MEETING":
      return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
    case "KHẢO SÁT":
    case "SURVEY":
      return "bg-green-500/10 text-green-600 border border-green-500/20";
    case "FACTORY":
      return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border border-gray-500/20";
  }
}
