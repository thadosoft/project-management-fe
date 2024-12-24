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
import {useState} from "react";
import {Assignment, Task, User} from "@/types.tsx";
import {DndContext, DragEndEvent} from "@dnd-kit/core";

const tasks: Task[] = [
  {id: 'TODO', title: 'To Do'},
  {id: 'IN_PROGRESS', title: 'In Progress'},
  {id: 'DONE', title: 'Done'},
  {id: 'TEST', title: 'Test'},
]

const example_assignments: Assignment[] = [
  {
    id: '1',
    title: 'Research Project',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO'
  },
  {
    id: '2',
    title: 'Research',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO'
  },
  {
    id: '3',
    title: 'Research',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO'
  },
  {
    id: '4',
    title: 'Research',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO'
  }
]

const user: User = {
  name: "Tran Trong",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}


export default function ProjectPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(example_assignments);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) return;

    const assignmentId = active.id as string;
    const newStatus = over.id as Assignment['status'];

    setAssignments(() =>
        assignments.map((assignment) =>
            assignment.id === assignmentId ? {...assignment, status: newStatus} : assignment
        )
    )
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
            <div className="flex flex-1 gap-4 p-4 pt-0 ">
              <div className="grid gap-4 grid-flow-col grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
                <DndContext onDragEnd={handleDragEnd}>
                  {
                    tasks.map((task: Task) => {

                      return <ItemTask
                          key={task.id}
                          task={task}
                          assignments={assignments.filter((assignment) => assignment.status === task.id)}
                          user={user}
                      />
                    })
                  }
                </DndContext>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
  )
}
