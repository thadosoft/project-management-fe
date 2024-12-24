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

const data = {
  user: {
    name: "Tran Trong",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}



function ProjectPage() {

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
              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500">
                  <Link to="/task">
                    <ItemProject user={data.user}/>
                  </Link>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500">
                  <Link to="/task">
                    <ItemProject user={data.user}/>
                  </Link>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500">
                  <Link to="/task">
                    <ItemProject user={data.user}/>
                  </Link>
                </div>
                <div className="aspect-video rounded-xl bg-muted/50 cursor-pointer hover:bg-sidebar-accent duration-500">
                  <Link to="/task">
                    <ItemProject user={data.user}/>
                  </Link>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
  )
}

export default ProjectPage
