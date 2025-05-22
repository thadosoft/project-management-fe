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
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import tokenService from "@/services/tokenService.ts";
import { AuditLog, SearchAuditLog } from "@/models/AuditLog";
import { searchAuditLogs } from "@/services/auditLogService";

function AuditLogPage() {
  const [auditlogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [_, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [searchParams, setSearchParams] = useState<SearchAuditLog>({
    resource: "",

    startDate: "",

    endDate: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      tokenService.accessToken = token;
      searchAuditLogs(searchParams, page, size)
        .then(response => {
          setAuditLogs(response.content);
          setTotalPages(response.totalPages);
        })
        .catch(error => console.error("Search failed:", error));
    }
  }, [page, searchParams]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };


  const handleSearch = async () => {
    try {
      const result = await searchAuditLogs(searchParams, 0, size); // luôn bắt đầu từ trang đầu tiên khi tìm kiếm
      if (result) {
        setAuditLogs(result.content);
        setTotalPages(result.totalPages);
        setPage(0); // Reset về trang đầu
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-AuditLogPageer:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/home">
                      Thông tin nhân viên
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Tìm kiếm nhân viên</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="p-6">
            <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
              <h2 className="sm:text-xl text-[12px] font-bold mb-6">Tìm kiếm hoạt động</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">Chức năng</label>
                      <input
                        type="text"
                        name="resource"
                        value={searchParams.resource}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                        placeholder="Nguyễn Trung Dũng"
                      />
                    </div>
                    {/* <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">Từ ngày</label>
                      <input
                        type="date"
                        name="startDate"
                        value={searchParams.startDate}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">Đến ngày</label>
                      <input
                        type="date"
                        name="endDate"
                        value={searchParams.endDate}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                      />
                    </div> */}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <button onClick={handleSearch}
                    type="submit"
                    className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </section>
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">STT</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Tên</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Hành động</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Chức năng thực thi</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Chi tiết</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-center">
                {auditlogs.map((employee, index) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{page * size + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm"> {employee.action} </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {employee.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {employee.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 mx-1 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">{page + 1} / {totalPages}</span>
              <button type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 mx-1 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default AuditLogPage;
