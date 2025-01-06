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
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {SortableContext, arrayMove} from "@dnd-kit/sortable";
import {type Assignment, ItemAssignment} from "@/components/item-assignment.tsx";
import type {Task} from "@/components/item-task.tsx";
import {hasDraggableData} from "@/components/utils";
import {coordinateGetter} from "@/components/multipleContainersKeyboardPreset";
import {getTasksByProjectId} from "@/services/taskService.ts";
import {useParams} from "react-router";

const defaultTasks = [
  {
    id: 123,
    title: "Todo",
  },
  {
    id: 456,
    title: "In progress",
  },
  {
    id: 789,
    title: "Done",
  },
] satisfies Task[];

export type TaskId = (typeof defaultTasks)[number]["id"];

const initialAssignments: Assignment[] = [
  {
    id: 1,
    taskId: 789,
    content: "Project initiation and planning",
  },
  {
    id: 2,
    taskId: 789,
    content: "Gather requirements from stakeholders",
  },
  {
    id: 3,
    taskId: 789,
    content: "Create wireframes and mockups",
  },
  {
    id: 4,
    taskId: 456,
    content: "Develop homepage layout",
  },
  {
    id: 5,
    taskId: 456,
    content: "Design color scheme and typography",
  },
  {
    id: 6,
    taskId: 123,
    content: "Implement user authentication",
  },
  {
    id: 7,
    taskId: 123,
    content: "Build contact us page",
  },
  {
    id: 8,
    taskId: 123,
    content: "Create product catalog",
  },
  {
    id: 9,
    taskId: 123,
    content: "Develop about us page",
  },
  {
    id: 10,
    taskId: 123,
    content: "Optimize website for mobile devices",
  },
  {
    id: 11,
    taskId: 123,
    content: "Integrate payment gateway",
  },
  {
    id: 12,
    taskId: 123,
    content: "Perform testing and bug fixing",
  },
  {
    id: 13,
    taskId: 123,
    content: "Launch website and deploy to server",
  },
];

export default function TaskPage() {
  // const {projectId} = useParams<{ projectId: string }>();

  // if (!projectId) return <p>Can not found project ID...</p>;

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const pickedUpAssignmentTask = useRef<TaskId | null>(null);
  const tasksId = useMemo(() => tasks.map((col) => col.id), [tasks]);

  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);

  const sensors = useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: coordinateGetter,
      })
  );

  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  //
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     setLoading(true);
  //     try {
  //       const tasks = await getTasksByProjectId(projectId);
  //       setTasks(tasks);
  //     } catch (error) {
  //       setError('Error fetching tasks: ' + error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //
  //   fetchTasks();
  // }, []);

  function getDraggingAssignmentData(assignmentId: UniqueIdentifier, taskId: TaskId) {
    const assignmentsInTask = assignments.filter((assignment) => assignment.taskId === taskId);
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
        return `Picked up Task ${startTask?.title} at position: ${
            startTaskIdx + 1
        } of ${tasksId.length}`;
      } else if (active.data.current?.type === "Assignment") {
        pickedUpAssignmentTask.current = active.data.current.assignment.taskId;
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            active.id,
            pickedUpAssignmentTask.current
        );
        return `Picked up Assignment ${
            active.data.current.assignment.content
        } at position: ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.title}`;
      }
    },
    onDragOver({active, over}) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
          active.data.current?.type === "Task" &&
          over.data.current?.type === "Task"
      ) {
        const overTaskIdx = tasksId.findIndex((id) => id === over.id);
        return `Task ${active.data.current.task.title} was moved over ${
            over.data.current.task.title
        } at position ${overTaskIdx + 1} of ${tasksId.length}`;
      } else if (
          active.data.current?.type === "Assignment" &&
          over.data.current?.type === "Assignment"
      ) {
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            over.id,
            over.data.current.assignment.taskId
        );
        if (over.data.current.assignment.taskId !== pickedUpAssignmentTask.current) {
          return `Assignment ${
              active.data.current.assignment.content
          } was moved over task ${task?.title} in position ${
              assignmentPosition + 1
          } of ${assignmentsInTask.length}`;
        }
        return `Assignment was moved over position ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.title}`;
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
            active.data.current.task.title
        } was dropped into position ${overTaskPosition + 1} of ${
            tasksId.length
        }`;
      } else if (
          active.data.current?.type === "Assignment" &&
          over.data.current?.type === "Assignment"
      ) {
        const {assignmentsInTask, assignmentPosition, task} = getDraggingAssignmentData(
            over.id,
            over.data.current.assignment.taskId
        );
        if (over.data.current.assignment.taskId !== pickedUpAssignmentTask.current) {
          return `Assignment was dropped into task ${task?.title} in position ${
              assignmentPosition + 1
          } of ${assignmentsInTask.length}`;
        }
        return `Assignment was dropped into position ${assignmentPosition + 1} of ${
            assignmentsInTask.length
        } in task ${task?.title}`;
      }
      pickedUpAssignmentTask.current = null;
    },
    onDragCancel({active}) {
      pickedUpAssignmentTask.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
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
            {tasks.map((col) => (
                <ItemTask
                    key={col.id}
                    task={col}
                    assignments={assignments.filter((assignment) => assignment.taskId === col.id)}
                />
            ))}
          </SortableContext>
        </BoardContainer>

        {"document" in window &&
            createPortal(
                <DragOverlay>
                  {activeTask && (
                      <ItemTask
                          isOverlay
                          task={activeTask}
                          assignments={assignments.filter(
                              (assignment) => assignment.taskId === activeTask.id
                          )}
                      />
                  )}
                  {activeAssignment && <ItemAssignment assignment={activeAssignment} isOverlay/>}
                </DragOverlay>,
                document.body
            )}
      </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }

    if (data?.type === "Assignment") {
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

    const isActiveATask = activeData?.type === "Task";
    if (!isActiveATask) return;

    setTasks((tasks) => {
      const activeTaskIndex = tasks.findIndex((col) => col.id === activeId);

      const overTaskIndex = tasks.findIndex((col) => col.id === overId);

      return arrayMove(tasks, activeTaskIndex, overTaskIndex);
    });
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

    // Im dropping a Assignment over another Assignment
    if (isActiveAAssignment && isOverAAssignment) {
      setAssignments((assignments) => {
        const activeIndex = assignments.findIndex((t) => t.id === activeId);
        const overIndex = assignments.findIndex((t) => t.id === overId);
        const activeAssignment = assignments[activeIndex];
        const overAssignment = assignments[overIndex];
        if (
            activeAssignment &&
            overAssignment &&
            activeAssignment.taskId !== overAssignment.taskId
        ) {
          activeAssignment.taskId = overAssignment.taskId;
          return arrayMove(assignments, activeIndex, overIndex - 1);
        }

        return arrayMove(assignments, activeIndex, overIndex);
      });
    }

    const isOverATask = overData?.type === "Task";

    // Im dropping a Assignment over a task
    if (isActiveAAssignment && isOverATask) {
      setAssignments((assignments) => {
        const activeIndex = assignments.findIndex((t) => t.id === activeId);
        const activeAssignment = assignments[activeIndex];
        if (activeAssignment) {
          activeAssignment.taskId = overId as TaskId;
          return arrayMove(assignments, activeIndex, activeIndex);
        }
        return assignments;
      });
    }
  }
}
