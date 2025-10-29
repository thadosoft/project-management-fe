import { TypeAttributes } from "rsuite/esm/internals/types";
import type { EventType } from "@/models/Event";

export function getBadgeColor(type: EventType): TypeAttributes.Color | undefined {
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
export function getBadgeClass(type: EventType): string {
  switch (type) {
    case "Demo":
      return "bg-red-500/10 text-red-600 border border-red-500/20";
    case "Họp":
      return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
    case "Khảo sát":
      return "bg-green-500/10 text-green-600 border border-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border border-gray-500/20";
  }
}
