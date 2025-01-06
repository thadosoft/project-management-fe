import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import {TaskId} from "@/pages/TaskPage.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export interface Assignment {
  id: UniqueIdentifier;
  taskId: TaskId;
  content: string;
}

interface Props {
  assignment: Assignment;
  isOverlay?: boolean;
}

export type AssignmentType = "Assignment";

export interface AssignmentDragData {
  type: AssignmentType;
  assignment: Assignment;
}

export function ItemAssignment({ assignment, isOverlay }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: assignment.id,
    data: {
      type: "Assignment",
      assignment,
    } satisfies AssignmentDragData,
    attributes: {
      roleDescription: "Assignment",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
      <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
      >
        <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
          <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move assignment</span>
            <GripVertical />
          </Button>
          <Badge variant={"outline"} className="ml-auto font-semibold">
            Assignment
          </Badge>
        </CardHeader>
        <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
          {assignment.content}
        </CardContent>
      </Card>
  );
}
