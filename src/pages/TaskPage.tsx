import {ThemeProvider} from "@/components/theme-provider.tsx";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Separator} from "@/components/ui/separator.tsx";
import {ItemTask} from "@/components/item-task.tsx";
import {useEffect, useState} from "react";
import {DndContext, DragEndEvent} from "@dnd-kit/core";
import {getTasksByProjectId} from "@/services/taskService.ts";
import {Task} from "@/models/Task.ts";
import {Assignment} from "@/models/Assignment.ts";
import {useParams} from "react-router-dom";
import {Project} from "@/models/Project.ts";
import {getProjectById} from "@/services/projectService.ts";
import {getAssignmentsByProjectId, updateAssignment} from "@/services/assignmentService.ts";

export default function TaskPage() {
  const {projectId} = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!projectId) {
    throw new Error("Project not found");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [projectData, tasksData, assignmentsData] = await Promise.all([
          getProjectById(projectId),
          getTasksByProjectId(projectId),
          getAssignmentsByProjectId(projectId)
        ]);

        setProject(projectData);
        setTasks(tasksData);
        setAssignments(assignmentsData);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) return;

    const assignmentId = active.id as number;
    const newStatus = over.id as string;

    setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
            assignment.id === assignmentId ? {...assignment, status: newStatus} : assignment
        )
    );
  }

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar/>
          <SidebarInset className="overflow-x-auto">
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
            <div className="flex flex-1 gap-4 p-4 pt-0">
              <div className="grid grid-flow-col">
                <DndContext onDragEnd={handleDragEnd}>
                  {
                    tasks.map((task: Task, index: number) => (
                        <ItemTask
                            key={task.id}
                            isLast={index === tasks.length - 1}
                            task={task}
                            assignments={assignments.filter((assignment) => assignment.status === task.status)}
                        />
                    ))
                  }
                </DndContext>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
  )
}
