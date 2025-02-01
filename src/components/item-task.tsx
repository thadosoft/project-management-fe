import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {useDndContext} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import React, {useMemo} from "react";
import {ItemAssignment} from "./item-assignment.tsx";
import {cva} from "class-variance-authority";
import {Card, CardContent, CardHeader} from "./ui/card";
import {Button} from "./ui/button";
import {GripVertical} from "lucide-react";
import {ScrollArea, ScrollBar} from "./ui/scroll-area";
import {Task} from "@/models/Task.ts";
import {Assignment} from "@/models/Assignment.ts";

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

interface Props {
  task: Task;
  assignments: Assignment[];
  isOverlay?: boolean;
}

export function ItemTask({task, assignments, isOverlay}: Props) {
  const assignmentsIds = useMemo(() => {
    return assignments.map((assignment) => assignment.id);
  }, [assignments]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: `Task: ${task.status}`,
    },
  });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
      "h-[90vh] max-h-full w-[300px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
      {
        variants: {
          dragging: {
            default: "border-2 border-transparent",
            over: "ring-2 opacity-30",
            overlay: "ring-2 ring-primary",
          },
        },
      }
  );

  return (
      <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
      >
        <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
          <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
          >
            <span className="sr-only">{`Move task: ${task.status}`}</span>
            <GripVertical/>
          </Button>
          <span className="ml-auto"> {task.status}</span>
        </CardHeader>
        <ScrollArea>
          <CardContent className="flex flex-grow flex-col gap-2 p-2">
            <SortableContext items={assignmentsIds}>
              {
                assignments.map((assignment) => (
                    <ItemAssignment key={assignment.id} assignment={assignment}/>
                ))
              }
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </Card>
  );
}

export function BoardContainer({children}: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
      //<ScrollArea
      //    className={variations({
      //    dragging: dndContext.active ? "active" : "default",
      //   })}
      //>
      <div className="flex gap-4 flex-row">
        {children}
      </div>
      //  <ScrollBar orientation="horizontal"/>
      //</ScrollArea>
  );
}
