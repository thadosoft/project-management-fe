import { Active, DataRef, Over } from "@dnd-kit/core";
import { TaskDragData } from "@/components/item-task.tsx";
import { AssignmentDragData } from "@/components/item-assignment.tsx";

type DraggableData = TaskDragData | AssignmentDragData;

export function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  return data?.type === "Task" || data?.type === "Assignment";
}
