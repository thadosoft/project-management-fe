import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ItemProject } from "@/components/item-project"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Project, ProjectRequest } from "@/models/Project"
import { createProject, getProjects } from "@/services/projectService"
import { Plus, FolderOpen, Sparkles, Star, Calendar, Zap, Rocket, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import tokenService from "@/services/tokenService"
import { Skeleton } from "@/components/ui/skeleton"

function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState<string>("")
  const [newProjectDescription, setNewProjectDescription] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      navigate("/")
    } else {
      tokenService.accessToken = token
      setLoading(true)
      getProjects().then((response) => {
        setProjects(response ?? [])
        setLoading(false)
      })
    }
  }, [navigate])

  useEffect(() => {
  if (!isDialogOpen) {
    setNewProjectName("")
    setNewProjectDescription("")
  }
}, [isDialogOpen])

  const handleCreateProject = async () => {
    const projectRequest: ProjectRequest = {
      name: newProjectName,
      description: newProjectDescription,
      userId: localStorage.getItem("id")!,
    }

    const projectCreated: Project | null = await createProject(projectRequest)

    if (projectCreated) {
      setNewProjectName("")
      setNewProjectDescription("")
      setIsDialogOpen(false)
      setProjects((prev) => [...prev, projectCreated])
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="space-y-8 w-full max-w-6xl mx-auto p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 mx-auto rounded-full" />
              <Skeleton className="h-4 w-48 mx-auto rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Enhanced Header with Glass Effect */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/" className="hover:text-primary transition-colors font-medium">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Quản lý dự án
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Main Content with Enhanced Background */}
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            {/* Enhanced Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow pointer-events-none" />

            <div className="relative z-10">
              {/* Hero Section */}
              <div className="px-6 py-12 lg:px-8">
                <div className="mx-auto max-w-full px-4">
                  {/* Enhanced Header Section */}
                  <div className="text-center space-y-8 mb-12">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse" />
                      <span className="text-sm font-medium text-muted-foreground">Quản lý dự án</span>
                    </div>

                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
                          Workspace
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                          Các dự án
                        </span>
                      </h1>
                      <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Quản lý và theo dõi tiến độ các dự án một cách hiệu quả và chuyên nghiệp
                      </p>
                    </div>

                    {/* Quick Stats - Single Card */}
                    <div className="flex justify-center max-w-4xl mx-auto">
                      <div className="group p-6 rounded-2xl bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-700/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 min-w-[280px]">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                            <FolderOpen className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-foreground">{projects.length}</div>
                            <div className="text-sm text-muted-foreground">Tổng dự án</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-center">
                      <Dialog modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        {/* <DialogTrigger asChild>
                          <Button
                            size="lg"
                            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            Tạo dự án mới
                            <Sparkles className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                          </Button>
                        </DialogTrigger> */}
                        <DialogContent
                          onInteractOutside={(event) => event.preventDefault()}
                          className="sm:max-w-[500px] p-0 border-0 bg-transparent shadow-none"
                        >
                          <Card className="border-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-700/70 backdrop-blur-xl shadow-2xl">
                            <CardHeader className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
                              <CardTitle className="flex items-center gap-4 text-xl">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                                    Tạo dự án mới
                                  </span>
                                  <p className="text-sm text-muted-foreground font-normal mt-1">
                                    Khởi tạo workspace cho dự án mới
                                  </p>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                              <form className="space-y-6">
                                <div className="space-y-3">
                                  <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                                    <Star className="w-4 h-4 text-purple-500" />
                                    Tên dự án
                                  </Label>
                                  <Input
                                    id="name"
                                    placeholder="Nhập tên dự án..."
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="h-12 bg-background/50 border-2 hover:border-purple-500/30 focus:border-purple-500/50 transition-all duration-300 rounded-xl"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <Label
                                    htmlFor="description"
                                    className="text-sm font-semibold flex items-center gap-2"
                                  >
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    Mô tả
                                  </Label>
                                  <Input
                                    id="description"
                                    placeholder="Mô tả ngắn gọn về dự án..."
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    className="h-12 bg-background/50 border-2 hover:border-purple-500/30 focus:border-purple-500/50 transition-all duration-300 rounded-xl"
                                  />
                                </div>
                              </form>
                            </CardContent>
                            <CardFooter className="flex justify-center pb-8">
                              {newProjectName !== "" &&
                              !projects.some((p) => p.name.toLowerCase() === newProjectName.toLowerCase()) ? (
                                <Button
                                  onClick={handleCreateProject}
                                  size="lg"
                                  className="group relative overflow-hidden min-w-[160px] h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 rounded-xl"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                  Tạo dự án
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="lg"
                                  className="min-w-[160px] h-12 px-8 opacity-50 cursor-not-allowed rounded-xl"
                                >
                                  <Zap className="w-5 h-5 mr-2" />
                                  Tạo dự án
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Projects Grid Section */}
                  <div className="animate-in slide-in-from-bottom-8 duration-1000 ease-out">
                    <Card className="border-0 bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-700/40 backdrop-blur-xl shadow-xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
                        <CardTitle className="flex items-center gap-4 text-2xl p-2">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                            <Activity className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold">
                              Workspace dự án
                            </span>
                            <p className="text-sm text-muted-foreground font-normal mt-1">
                              Tất cả dự án của bạn trong một nơi
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {projects.map((project: Project, index) => (
                            <Link key={project.id} to={`/project/task/${project.id}`}>
                              <div
                                className="group transition-all duration-500 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <ItemProject project={project} removeProject={handleDeleteProject} />
                              </div>
                            </Link>
                          ))}

                          {/* Enhanced Create Project Card */}
                          <Dialog modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <div className="group h-[23vh] rounded-2xl bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 cursor-pointer hover:from-purple-500/10 hover:via-purple-500/5 hover:to-purple-500/10 border-2 border-dashed border-muted-foreground/20 hover:border-purple-500/40 transition-all duration-500 flex flex-col p-8 items-center justify-center hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 space-y-4 text-center">
                                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                                      Tạo dự án mới
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">Bắt đầu workspace mới</div>
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                          </Dialog>
                        </div>

                        {/* Empty State */}
                        {projects.length === 0 && (
                          <div className="text-center py-16 space-y-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                              <FolderOpen className="w-10 h-10 text-purple-500" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-foreground">Chưa có dự án nào</h3>
                              <p className="text-muted-foreground max-w-md mx-auto">
                                Bắt đầu tạo dự án đầu tiên của bạn để quản lý công việc một cách hiệu quả
                              </p>
                            </div>
                            <Dialog modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="lg"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                  <Plus className="w-5 h-5 mr-2" />
                                  Tạo dự án đầu tiên
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default ProjectPage