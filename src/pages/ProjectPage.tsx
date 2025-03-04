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
import {ItemProject} from "@/components/item-project.tsx";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {Project, ProjectRequest} from "@/models/Project.ts";
import {createProject, getProjects} from "@/services/projectService.ts";
import {Plus} from "lucide-react";
import {Dialog, DialogContent, DialogDescription, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DialogTitle} from "@radix-ui/react-dialog";
import {useNavigate} from "react-router-dom";
import tokenService from "@/services/tokenService.ts";

function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    } else {
      tokenService.accessToken = token;
      getProjects().then(response => {
        setProjects(response ?? []);
      });
    }
  }, []);

  const handleCreateProject = async () => {
    const projectRequest: ProjectRequest = {
      name: newProjectName,
      description: newProjectDescription,
      userId: localStorage.getItem("id")!,
    }

    const projectCreated: Project | null = await createProject(projectRequest);

    if (projectCreated) {
      setNewProjectName("")
      setNewProjectDescription("")
      setIsDialogOpen(false)
      setProjects(prev => [...prev, projectCreated]);
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar/>
          <SidebarInset>
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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-4 ">
                {
                  projects.map((project: Project) => {
                    return (
                        <Link key={project.id} to={`/project/task/${project.id}`}>
                          <ItemProject
                              project={project}
                              removeProject={handleDeleteProject}
                          />
                        </Link>
                    )
                  })
                }
                <Dialog
                    modal={false}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="h-[23vh] rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500 flex flex-col p-4 items-center justify-center">
                      <Plus size={100}/>
                    </div>
                  </DialogTrigger>
                  <DialogContent
                      onInteractOutside={(event) => event.preventDefault()}
                      className="sm:max-w-[425px] p-0"
                  >
                    <Card>
                      <DialogTitle></DialogTitle>
                      <DialogDescription></DialogDescription>
                      <CardHeader>
                        <CardTitle className="pl-6 py-4">Create project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form>
                          <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                  id="name"
                                  placeholder="Name of your project"
                                  value={newProjectName}
                                  onChange={(e) => setNewProjectName(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                              <Label htmlFor="description">Description</Label>
                              <Input
                                  id="description"
                                  placeholder="Brief description of your project"
                                  value={newProjectDescription}
                                  onChange={(e) => setNewProjectDescription(e.target.value)}
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        {
                          newProjectName !== "" && !projects.some(project => project.name.toLowerCase() === newProjectName.toLowerCase())
                              ?
                              <div className="pt-4">
                                <Button onClick={handleCreateProject}>Create</Button>
                              </div>
                              :
                              <div className="pt-4">
                                <Button
                                    className="opacity-50 hover:bg-white cursor-auto"
                                >Create</Button>
                              </div>
                        }
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
  )
}

export default ProjectPage
