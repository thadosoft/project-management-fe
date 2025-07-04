import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useMemo, useState } from "react";
import { ItemAssignment } from "./item-assignment.tsx";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Check, GripVertical, Trash2, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Task, TaskRequest } from "@/models/Task.ts";
import { Assignment, AssignmentRequest } from "@/models/Assignment.ts";
import { deleteTask, updateTask } from "@/services/taskService.ts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { BsThreeDots } from "react-icons/bs";
import { Input } from "@/components/ui/input.tsx";
import { createAssignment } from "@/services/assignmentService.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User } from "@/models/User.ts";

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

interface Props {
  task: Task,
  assignments: Assignment[],
  isOverlay?: boolean,
  removeTask: (taskId: string) => void,
  addAssignment: (newAssignment: Assignment) => void,
  removeAssignment: (assignmentId: string) => void,
  currentUser: User | null;
  onAssignmentUpdate?: (updatedAssignment: Assignment) => void;
}

export function ItemTask({ task, assignments, isOverlay, addAssignment, removeAssignment, removeTask, currentUser, onAssignmentUpdate }: Props) {
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
    "h-[85vh] max-h-full w-[300px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
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
  const [isTaskEditing, setIsTaskEditing] = useState(false);
  const [isNewAssignmentEditing, setIsNewAssignmentEditing] = useState(false);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState("");
  const [status, setStatus] = useState(task.status);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

  const handleChangeStatus = async (isChanged: boolean) => {
    if (isChanged) {
      const newTask: TaskRequest = {
        status: status,
        taskOrder: task.taskOrder,
        projectId: task.project.id
      }

      await updateTask(task.id, newTask);
      if (newTask.status != null) {
        task.status = newTask.status;
      }
    } else {
      setStatus(task.status);
    }

    setIsTaskEditing(false);
  }

  const handleCreateAssignment = async (isChanged: boolean) => {
  if (!currentUser) {
    console.error("Chưa có user đăng nhập → không thể tạo assignment.");
    return;
  }

  if (isChanged) {
    const assignmentRequest: AssignmentRequest = {
      title: newAssignmentTitle,
      description: "",
      assignmentOrder: assignments.length + 1,
      taskId: task.id,
      assignerId: currentUser.id, // ✅ đảm bảo có giá trị thật
    }

    const newAssignmentCreated: Assignment | null = await createAssignment(assignmentRequest);

    if (newAssignmentCreated) {
      addAssignment(newAssignmentCreated);
    }
  }

  setIsNewAssignmentEditing(false);
}


  const handleDeleteTask = async () => {
    removeTask(task.id)
    await deleteTask(task.id)
    setIsDeleteTaskOpen(false)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      }) + " relative group"}
    >
      <CardHeader className="p-2 font-semibold border-b-2 text-left flex flex-row space-between gap-2 items-center">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="flex p-1 text-primary/50 h-auto cursor-grab relative mt-0"
        >
          <span className="sr-only">{`Move task: ${task.status}`}</span>
          <GripVertical />
        </Button>
        {isTaskEditing ? (
          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-1 rounded-md"
            />
            <button onClick={() => handleChangeStatus(true)} className="hover:bg-zinc-700 p-1 duration-200 rounded">
              <Check size={20} />
            </button>
            <button onClick={() => handleChangeStatus(false)} className="hover:bg-zinc-700 p-1 duration-200 rounded">
              <X size={20} />
            </button>
          </div>
        ) : (
          <span
            onClick={() => setIsTaskEditing(true)}
            className="hover:bg-zinc-700 px-4 py-1 rounded duration-200 cursor-pointer flex-1 min-h-8"
          >
            {status}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <BsThreeDots />
            </Button>
          </DropdownMenuTrigger>

          <Dialog
            open={isDeleteTaskOpen}
            onOpenChange={setIsDeleteTaskOpen}
          >
            <DialogTrigger asChild>
              <DropdownMenuContent className="w-40">
                <DropdownMenuItem>
                  <Trash2 />
                  <span className="cursor-pointer">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogDescription>
                  Make sure you want to delete and <span className="text-red-500 font-bold">NOT UNDO</span>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-around">
                <Button onClick={() => setIsDeleteTaskOpen(false)}>Cancel</Button>
                <Button onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-400">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={assignmentsIds}>
            {
              assignments.map((assignment) => (
                <ItemAssignment
                  key={assignment.id}
                  assignment={assignment}
                  removeAssignment={removeAssignment}
                  onUpdate={onAssignmentUpdate}
                />
              ))
            }
            {
              isNewAssignmentEditing
                ?
                <div>
                  <Input
                    type="text"
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                    autoFocus
                    className="px-2 py-1 rounded text-white border border-gray-600"
                  />
                  <div className="flex justify-end pt-2 gap-2">
                    {
                      newAssignmentTitle !== "" && !assignments.some((assignment) => assignment.title.toLowerCase() === newAssignmentTitle.toLowerCase())
                        ?
                        <Button
                          onClick={() => handleCreateAssignment(true)}
                          variant="outline"
                        >
                          <Check />
                        </Button>
                        :
                        <Button
                          variant="outline"
                          className="opacity-50 hover:bg-zinc-950 cursor-auto hover:none border-0"
                        >
                          <Check />
                        </Button>
                    }
                    <Button onClick={() => handleCreateAssignment(false)} variant="destructive">
                      <X />
                    </Button>
                  </div>
                </div>
                :
                <span
                  onClick={() => setIsNewAssignmentEditing(true)}
                  className="text-center text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  + Create assignment
                </span>
            }

          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  )
    ;
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  // const dndContext = useDndContext();

  // const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
  //   variants: {
  //     dragging: {
  //       default: "snap-x snap-mandatory",
  //       active: "snap-none",
  //     },
  //   },
  // });

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
