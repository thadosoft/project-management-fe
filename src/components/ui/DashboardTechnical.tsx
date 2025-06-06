import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PieChart } from "@/components/charts"
import { Dashboard } from "@/models/Dashboard";
import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboardService";
import { Skeleton } from "antd";
import { AuditLog } from "@/models/AuditLog";
import { get6LatestAuditLogs } from "@/services/auditLogService";
import { ItemProject } from "@/components/item-project.tsx";
import { getProjects, createProject } from "@/services/projectService.ts";
import { Project, ProjectRequest } from "@/models/Project.ts";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card.tsx";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { OrgChart, OrgNode } from "@/components/ui/OrgChart";
import orgChartData from "@/data/orgChartData.json";


function DashboardTechnical() {
  const [dashboardData, setDashboardData] = useState<Dashboard[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const COLORS = ["bg-purple-600", "bg-teal-500", "bg-orange-500", "bg-blue-500", "bg-red-500"];
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<"chart" | "project">("chart");



  const handleCreateProject = async () => {
    const projectRequest: ProjectRequest = {
      name: newProjectName,
      description: newProjectDescription,
      userId: localStorage.getItem("id")!,
    };
    const projectCreated: Project | null = await createProject(projectRequest);
    if (projectCreated) {
      setNewProjectName("");
      setNewProjectDescription("");
      setIsDialogOpen(false);
      setProjects(prev => [...prev, projectCreated]);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };


  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await getDashboard();
      if (data) {
        setDashboardData(data);
      }
    };

    const fetchLogs = async () => {
      const logs = await get6LatestAuditLogs();
      if (logs) {
        setAuditLogs(logs);
      }
    };

    const fetchProjects = async () => {
      const data = await getProjects();
      if (data) setProjects(data);
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchLogs(), fetchProjects()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-48" />;
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Khối kỹ thuật</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Toggle buttons */}
          <div className="flex justify-end px-4 mt-4">
            {expandedSection === "chart" ? (
              <Button onClick={() => setExpandedSection("project")}>
                Xem danh sách dự án
              </Button>
            ) : (
              <Button onClick={() => setExpandedSection("chart")}>
                Quay lại sơ đồ tổ chức
              </Button>
            )}
          </div>

          {/* Section: OrgChart + Charts */}
          {expandedSection === "chart" && (
            <>
              <div className="p-4 container mx-auto">
                <h2 className="text-xl font-semibold mb-4">Sơ đồ tổ chức</h2>
                <div className="overflow-auto border rounded-lg p-4 bg-muted/30 ">
                  <OrgChart data={orgChartData as OrgNode} />
                </div>
              </div>

              <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Dự án + phần trăm tiến độ */}
                  <Card className="border shadow-sm p-4">
                    <div className="mb-2">
                      <h2 className="text-base font-medium">
                        Dự án và phần trăm tiến độ dự án
                      </h2>
                    </div>
                    <div className="space-y-3 mt-4">
                      {dashboardData.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs mb-1">
                            <span>{item.projectName}</span>
                            <span>{item.progressPercentage}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`${COLORS[index % COLORS.length]} h-2.5 rounded-full`}
                                style={{ width: `${item.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Pie Chart */}
                  <Card className="border shadow-sm p-4">
                    <div className="mb-2">
                      <h2 className="text-base font-medium">
                        Biểu đồ thống kê dự án
                      </h2>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-3xl font-bold">
                        {dashboardData.length}
                      </div>
                      <div className="text-xs text-gray-500">Tổng Số Dự Án</div>
                    </div>
                    <div className="h-[180px] mt-2">
                      <PieChart
                        data={dashboardData.map((item) => ({
                          name: item.projectName,
                          value: item.progressPercentage,
                        }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span>
                          Hoàn thành:{" "}
                          {dashboardData.filter((d) => d.status === "DONE").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>
                          Đang tiến hành:{" "}
                          {dashboardData.filter((d) => d.status === "IN_PROGRESS").length}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Section: Danh sách dự án */}
          {expandedSection === "project" && (
            <Card className="border shadow-sm mt-4 p-8 container mx-auto">
              <h2 className="text-base font-medium mb-4">Danh sách dự án</h2>
              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                {projects.map((project) => (
                  <ItemProject
                    key={project.id}
                    project={project}
                    removeProject={handleDeleteProject}
                  />
                ))}
                <Dialog
                  modal={false}
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="h-[23vh] rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500 flex flex-col p-4 items-center justify-center">
                      <Plus size={100} />
                    </div>
                  </DialogTrigger>
                  <DialogContent
                    onInteractOutside={(event) => event.preventDefault()}
                    className="sm:max-w-[425px] p-0"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="pl-6 py-4">Tạo dự án mới</CardTitle>
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
                                onChange={(e) =>
                                  setNewProjectDescription(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        {newProjectName !== "" &&
                          !projects.some(
                            (p) =>
                              p.name.toLowerCase() === newProjectName.toLowerCase()
                          ) ? (
                          <div className="pt-4">
                            <Button onClick={handleCreateProject}>Create</Button>
                          </div>
                        ) : (
                          <div className="pt-4">
                            <Button className="opacity-50 hover:bg-white cursor-auto">
                              Create
                            </Button>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          )}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default DashboardTechnical;