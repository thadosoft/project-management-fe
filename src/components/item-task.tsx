import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {useDndContext} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import React, {useMemo, useState} from "react";
import {ItemAssignment} from "./item-assignment.tsx";
import {cva} from "class-variance-authority";
import {Card, CardContent, CardHeader} from "./ui/card";
import {Button} from "./ui/button";
import {Check, GripVertical, X} from "lucide-react";
import {ScrollArea, ScrollBar} from "./ui/scroll-area";
import {Task, TaskRequest} from "@/models/Task.ts";
import {Assignment} from "@/models/Assignment.ts";
import {updateTask} from "@/services/taskService.ts";

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

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(task.status);
  const handleChangeStatus = async (isChanged: boolean) => {
    if (isChanged) {
      const newTask: TaskRequest = {
        status: status,
        taskOrder: task.taskOrder,
        projectId: task.project.id
      }

      await updateTask(task.id, newTask);
      setIsEditing(false);
    } else {
      setStatus(task.status);
      setIsEditing(false)
    }
  }

  return (
      <Card
          ref={setNodeRef}
          style={style}
          className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
          })}
      >
        <CardHeader className="p-2 font-semibold border-b-2 text-left flex flex-row space-between items-center">
          {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="py-1 rounded-md text-black"
                />
                <button onClick={() => handleChangeStatus(true)} className="hover:bg-zinc-700 p-1 duration-200 rounded">
                  <Check size={20}/>
                </button>
                <button onClick={() => handleChangeStatus(false)} className="hover:bg-zinc-700 p-1 duration-200 rounded">
                  <X size={20}/>
                </button>
              </div>
          ) : (
              <span
                  onClick={() => setIsEditing(true)}
                  className="hover:bg-zinc-700 px-2 py-1 rounded duration-200 cursor-pointer"
              >
          {status}
        </span>
          )}
          <Button
              variant={"ghost"}
              {...attributes}
              {...listeners}
              className="flex p-1 text-primary/50 h-auto cursor-grab relative ml-auto"
          >
            <span className="sr-only">{`Move task: ${task.status}`}</span>
            <GripVertical/>
          </Button>
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
