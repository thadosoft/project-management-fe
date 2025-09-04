import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { Project } from "@/models/Project.ts";
import { getProjects } from "@/services/projectService.ts";
import Timeline from "@/components/reference-profile/Timeline.tsx";

function ProjectPage() {
  const [_, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [projectsData] = await Promise.all([
          getProjects(),
        ]);
        if (projectsData) {
          setProjects(projectsData);
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrProjectPageer:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Hồ sơ tham khảo
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tải lên file</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="">
            <section className="relative overflow-hidden">
              <div className="mt-2 md:mt-0 py-12 pb-6 sm:py-16 lg:pb-24 overflow-hidden">
                <h3 className="text-3xl px-8 sm:text-5xl leading-normal font-extrabold tracking-tight">
                  Cách <span className="text-indigo-600">hoạt động ?</span>
                </h3>
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
                  <div className="relative mt-12 lg:mt-20">
                    <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                      <svg className="w-full" xmlns="http://www.w3.org/2000/svg" width="875" height="48" viewBox="0 0 875 48"
                        fill="none">
                        <path
                          d="M2 29C20.2154 33.6961 38.9915 35.1324 57.6111 37.5555C80.2065 40.496 102.791 43.3231 125.556 44.5555C163.184 46.5927 201.26 45 238.944 45C312.75 45 385.368 30.7371 458.278 20.6666C495.231 15.5627 532.399 11.6429 569.278 6.11109C589.515 3.07551 609.767 2.09927 630.222 1.99998C655.606 1.87676 681.208 1.11809 706.556 2.44442C739.552 4.17096 772.539 6.75565 805.222 11.5C828 14.8064 850.34 20.2233 873 24"
                          stroke="#D4D4D8" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 12" />
                      </svg>
                    </div>
                    <div
                      className="relative grid grid-cols-1 text-center gap-y-8 sm:gap-y-10 md:gap-y-12 md:grid-cols-3 gap-x-12">
                      <div>
                        <div
                          className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow">
                          <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">1</span>
                        </div>
                        <h3
                          className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                          Chọn thư mục
                        </h3>
                        <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                          Lựa chọn file và bắt đầu.
                        </p>
                      </div>
                      <div>
                        <div
                          className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow">
                          <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">2</span>
                        </div>
                        <h3
                          className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                          Tải lên
                        </h3>
                        <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                          Tải lên file đã chọn.
                        </p>
                      </div>
                      <div>
                        <div
                          className="flex items-center justify-center w-16 h-16 mx-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow">
                          <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">3</span>
                        </div>
                        <h3
                          className="mt-4 sm:mt-6 text-xl font-semibold leading-tight text-gray-900 dark:text-white md:mt-10">
                          Hoàn tất quá trình

                        </h3>
                        <p className="mt-3 sm:mt-4 text-base text-gray-600 dark:text-gray-400">
                          Quá trình hoàn tất.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div>
              <Timeline />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default ProjectPage
