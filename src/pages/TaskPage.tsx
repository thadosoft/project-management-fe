import {useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";

import {ItemTask, BoardContainer} from "@/components/item-task.tsx";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {SortableContext, arrayMove} from "@dnd-kit/sortable";
import {ItemAssignment} from "@/components/item-assignment.tsx";
import {hasDraggableData} from "@/components/utils";
import {coordinateGetter} from "@/components/multipleContainersKeyboardPreset";
import {createTask, getTasksByProjectId, updateTask} from "@/services/taskService.ts";
import {useParams} from "react-router";
import {getAssignmentsByProjectId, updateAssignment} from "@/services/assignmentService.ts";
import {Task, TaskRequest} from "@/models/Task.ts";
import {Assignment, AssignmentRequest} from "@/models/Assignment.ts";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const pickedUpAssignmentTask = useRef<string | null>(null);
  const tasksId = useMemo(() => tasks.map((col) => col.id), [tasks]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const sensors = useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: coordinateGetter,
      })
  );
  const [taskRequest, setTaskRequest] = useState<TaskRequest | null>(null);
  const [assignmentUpdated, setAssignmentUpdated] = useState<AssignmentRequest | null>(null);

  const {projectId} = useParams<{ projectId: string }>();

  const handleAddTask = async () => {
    const newTask: TaskRequest = {
      status: "NEW1",
      projectId: projectId,
      taskOrder: tasks.length + 1
    }

    const newTaskCreated: Task = await createTask(newTask);

    // setTasks(async prev => [...prev, newTaskCreated]);
  }

  useEffect(() => {
    console.log(assignmentUpdated);
  }, [assignmentUpdated]);

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const [tasksData, assignmentsData] = await Promise.all([
          getTasksByProjectId(projectId),
          getAssignmentsByProjectId(projectId)
        ]);

        if (tasksData && assignmentsData) {
          setTasks(tasksData.sort((a, b) => a.taskOrder - b.taskOrder));
          setAssignments(assignmentsData.sort((a, b) => a.assignmentOrder - b.assignmentOrder));
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks()
    .then(() => console.log("Tasks fetched successfully"))
    .catch((error) => console.error("Error in fetchTasks:", error));
  }, [projectId]);

  function getDraggingAssignmentData(assignmentId: string, taskId: string) {
    const assignmentsInTask = assignments.filter((assignment) =>
        assignment.task.id === taskId).sort((a, b) =>
        a.assignmentOrder - b.assignmentOrder);
    const assignmentPosition = assignmentsInTask.findIndex((assignment) => assignment.id === assignmentId);
    const task = tasks.find((task) => task.id === taskId);

    return {
      assignmentsInTask,
      assignmentPosition,
      task,
    };
  }

  const announcements: Announcements = {
    onDragStart({active}) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Task") {
        const startTaskIdx = tasksId.findIndex((id) => id === active.id);
        const startTask = tasks[startTaskIdx];
        return `Picked up Task ${startTask?.status} at position: ${
            startTaskIdx + 1
        } of ${tasksId.length}`;
      } else if (active.data.current?.type === "Assignment") {
        pickedUpAssignmentTask.current = active.data.current.assignment.task.id;
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            active.id as string,
            pickedUpAssignmentTask.current
        );

        return `Picked up Assignment ${
            active.data.current.assignment.title
        } at position: ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.status}`;
      }
    },
    onDragOver({active, over}) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
          active.data.current?.type === "Task" &&
          over.data.current?.type === "Task"
      ) {
        setTaskRequest((prev) =>
            ({
              ...prev,
              taskOrder: over.data.current?.sortable.index + 1,
            }));
        const overTaskIdx = tasksId.findIndex((id) => id === over.id);

        return `Task ${active.data.current.task.status} was moved over ${
            over.data.current.task.status
        } at position ${overTaskIdx + 1} of ${tasksId.length}`;
      } else if (
          active.data.current?.type === "Assignment" &&
          over.data.current?.type === "Assignment"
      ) {
        setAssignmentUpdated((prev) =>
            ({
              ...prev,
              taskId: active.data.current?.assignment.task.id,
              oldAssignmentOrder: active.data.current?.assignment.assignmentOrder,
              assignmentOrder: over.data.current?.sortable.index + 1
            }));
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            over.id as string,
            over.data.current.assignment.task.id
        );
        if (over.data.current.assignment.task.id !== pickedUpAssignmentTask.current) {
          return `Assignment ${
              active.data.current.assignment.title
          } was moved over task ${task?.status} in position ${
              assignmentPosition + 1
          } of ${assignmentsInTask.length}`;
        }

        return `Assignment was moved over position ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.status}`;
      }
    },
    onDragEnd({active, over}) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpAssignmentTask.current = null;
        return;
      }
      if (
          active.data.current?.type === "Task" &&
          over.data.current?.type === "Task"
      ) {

        const overTaskPosition = tasksId.findIndex((id) => id === over.id);

        return `Task ${
            active.data.current.task.status
        } was dropped into position ${overTaskPosition + 1} of ${
            tasksId.length
        }`;
      } else if (
          active.data.current?.type === "Assignment" &&
          over.data.current?.type === "Assignment"
      ) {
        if (activeAssignment?.id && assignmentUpdated) {
          if (assignmentUpdated.taskId !== assignmentUpdated.oldTaskId ||
              assignmentUpdated.assignmentOrder !== assignmentUpdated.oldAssignmentOrder) {
            assignmentUpdated.title = activeAssignment.title;

            Object.assign(activeAssignment, assignmentUpdated);

            updateAssignment(activeAssignment.id, assignmentUpdated)
            .then(() => console.log("Assignment updated successfully"))
            .catch((error) => console.error("Error in update Assignment:", error));
          }
        }
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            over.id as string,
            over.data.current.assignment.task.id
        );
        if (over.data.current.assignment.task.id !== pickedUpAssignmentTask.current) {
          return `Assignment was dropped into task ${task?.status} in position ${
              assignmentPosition + 1
          } of ${assignmentsInTask.length}`;
        }
        return `Assignment was dropped into position ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.status}`;
      }
      pickedUpAssignmentTask.current = null;
    }
    ,
    onDragCancel({active}) {
      pickedUpAssignmentTask.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
    ,
  };

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar/>
          <SidebarInset className="overflow-auto">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrProjectPageer:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block"/>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="px-4">
              <DndContext
                  accessibility={{
                    announcements,
                  }}
                  sensors={sensors}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
              >
                <BoardContainer>
                  <SortableContext items={tasksId}>
                    {
                      tasks.map((task) => (
                          <ItemTask
                              key={task.id}
                              task={task}
                              assignments={
                                assignments.filter((assignment) =>
                                    assignment.task.id === task.id
                                )
                              }
                          />
                      ))
                    }
                  </SortableContext>
                  <div className="pr-40">
                    <Button
                        onClick={handleAddTask}
                    >
                      <Plus/>
                    </Button>
                  </div>
                </BoardContainer>
                {
                    "document" in window &&
                    createPortal(
                        <DragOverlay>
                          {
                              activeTask && (
                                  <ItemTask
                                      isOverlay
                                      task={activeTask}
                                      assignments={
                                        assignments.filter((assignment) =>
                                            assignment.task.id === activeTask.id
                                        )
                                      }
                                  />
                              )
                          }
                          {activeAssignment && <ItemAssignment assignment={activeAssignment} isOverlay/>}
                        </DragOverlay>,
                        document.body
                    )
                }
              </DndContext>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Task") {
      setTaskRequest((prev) => ({...prev, oldTaskOrder: event.active.data.current?.task.taskOrder}));
      setActiveTask(data.task);
      return;
    }

    if (data?.type === "Assignment") {
      setAssignmentUpdated((prev) => ({...prev, oldTaskId: event.active.data.current?.assignment.task.id}));
      setActiveAssignment(data.assignment);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    setActiveAssignment(null);

    const {active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    if (activeData?.type === "Task") {
      if (activeTask?.id && taskRequest) {
        if (taskRequest.taskOrder !== taskRequest.oldTaskOrder) {
          taskRequest.status = activeTask.status;
          taskRequest.projectId = activeTask.project.id;

          Object.assign(activeTask, taskRequest);

          updateTask(activeTask.id, taskRequest)
          .then(() => console.log("Task updated successfully"))
          .catch((error) => console.error("Error in update Task:", error));
        }
      }
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    } else {
      if (activeAssignment?.id && assignmentUpdated) {
        if (assignmentUpdated.taskId !== assignmentUpdated.oldTaskId ||
            assignmentUpdated.assignmentOrder !== assignmentUpdated.oldAssignmentOrder) {
          assignmentUpdated.title = activeAssignment.title;

          Object.assign(activeAssignment, assignmentUpdated);

          updateAssignment(activeAssignment.id, assignmentUpdated)
          .then(() => console.log("Assignment updated successfully"))
          .catch((error) => console.error("Error in update Assignment:", error));
        }
      }
    }
  }

  function onDragOver(event: DragOverEvent) {
    const {active, over} = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveAAssignment = activeData?.type === "Assignment";
    const isOverAAssignment = overData?.type === "Assignment";

    if (!isActiveAAssignment) return;

    // dropping assignment over assignment
    if (isActiveAAssignment && isOverAAssignment) {
      setAssignmentUpdated((prev) =>
          ({
            ...prev,
            taskId: active.data.current?.assignment.task.id,
            oldAssignmentOrder: active.data.current?.assignment.assignmentOrder,
            assignmentOrder: over.data.current?.sortable.index + 1
          }));

      setAssignments((assignments) => {
        const activeIndex = assignments.findIndex((t) => t.id === activeId);
        const overIndex = assignments.findIndex((t) => t.id === overId);
        const activeAssignment = assignments[activeIndex];
        const overAssignment = assignments[overIndex];

        if (
            activeAssignment &&
            overAssignment &&
            activeAssignment.task.id !== overAssignment.task.id
        ) {
          activeAssignment.task.id = overAssignment.task.id;

          return arrayMove(assignments, activeIndex, overIndex - 1);
        }

        return arrayMove(assignments, activeIndex, overIndex - 1);
      });
    }

    const isOverATask = overData?.type === "Task";

    // dropping assignment over task
    if (isActiveAAssignment && isOverATask) {
      setAssignmentUpdated((prev) =>
          ({
            ...prev,
            taskId: over.data.current?.task.id,
            oldAssignmentOrder: active.data.current?.assignment.assignmentOrder,
            assignmentOrder: over.data.current?.sortable.index + 1
          }));

      setAssignments((assignments) => {
        const activeIndex = assignments.findIndex((t) => t.id === activeId);
        const activeAssignment = assignments[activeIndex];

        console.log(activeIndex)

        if (activeAssignment) {
          activeAssignment.task.id = overId as string;
          return arrayMove(assignments, activeIndex, activeIndex);
        }
        return assignments;
      });
    }
  }
}
