import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { EventCalendar } from "@/components/calendar";


function EventPage() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Breadcums header*/}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center gap-2 px-6">
              <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 opacity-50"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/home"
                      className="hover:text-primary transition-colors font-medium"
                    >
                      Trang chủ
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block opacity-50" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Sự kiện nội bộ
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
            <div className="relative z-10 px-6 py-12 lg:px-8">
              <div className="mx-auto max-w-full px-4">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-600 animate-pulse" />
                    <span className="text-sm font-medium text-muted-foreground">
                      SỰ KIỆN
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                        Quản lý
                      </span>
                      <br />
                      <span
                        className="bg-gradient-to-r from-gray-900 via-emerald-500 to-lime-400
 bg-clip-text text-transparent animate-gradient"
                      >
                        Sự kiện
                      </span>
                    </h1>
                  </div>
                </div>
                {/* End Hero Section */}

                <div className="mx-auto max-w-full">
                    <EventCalendar />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
export default EventPage;
