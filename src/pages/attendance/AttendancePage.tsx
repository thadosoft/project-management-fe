import { ThemeProvider } from "@/components/theme-provider.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
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
import { searchGroupedAttendances } from "@/services/attendanceService";

interface AttendanceRecord {
  personId: string;
  personName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
}

function AttendancePage() {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);

  const today = new Date();
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [searchAttendanceRequest, setSearchAttendanceRequest] = useState({
    personName: "",
    startDate: today.toISOString().split("T")[0],
    endDate: endOfDay.toISOString().split("T")[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchAttendanceRequest((prev) => ({
      ...prev,
      [name]: value ? value : "",
    }));
  };

  const calculateMinutesDiff = (
    actualTimeStr: string | null,
    baseTimeStr: string
  ): number => {
    if (!actualTimeStr) return 0;

    const [datePart, timePart] = actualTimeStr.split(" ");
    const [day, month, year] = datePart.split("/");
    const actual = new Date(`${year}-${month}-${day}T${timePart}`);
    const base = new Date(`${year}-${month}-${day}T${baseTimeStr}`);

    const diff = actual.getTime() - base.getTime();
    return diff > 0 ? Math.floor(diff / 60000) : 0;
  };

  const calculateEarlyLeaveMinutes = (
    actualTimeStr: string | null,
    baseTimeStr: string
  ): number => {
    if (!actualTimeStr) return 0;

    const [datePart, timePart] = actualTimeStr.split(" ");
    const [day, month, year] = datePart.split("/");
    const actual = new Date(`${year}-${month}-${day}T${timePart}`);
    const base = new Date(`${year}-${month}-${day}T${baseTimeStr}`);

    const diff = base.getTime() - actual.getTime();
    return diff > 0 ? Math.floor(diff / 60000) : 0;
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "Chưa có";

    // Tách chuỗi dd/MM/yyyy HH:mm:ss
    const [datePart, timePart] = value.split(" ");
    if (!datePart || !timePart) return "Invalid";

    const [day, month, year] = datePart.split("/");
    const formatted = `${year}-${month}-${day}T${timePart}`;

    const parsed = new Date(formatted);
    return isNaN(parsed.getTime()) ? "Invalid" : parsed.toLocaleString("en-GB");
  };

  const fetchGroupedAttendances = async () => {
    try {
      const data = await searchGroupedAttendances(
        searchAttendanceRequest,
        page,
        size
      );
      if (data) {
        setAttendances(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching grouped attendances:", error);
    }
  };

  useEffect(() => {
    fetchGroupedAttendances();
  }, [page, size]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // reset về page đầu tiên khi tìm kiếm mới
    fetchGroupedAttendances();
  };

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
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Bảng chấm công</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="p-10">
            <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">
              Bảng <span className="text-indigo-600">chấm công</span>
            </h3>
            <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
              <form onSubmit={handleSearch}>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                    <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">
                        Tên nhân viên
                      </label>
                      <input
                        type="text"
                        name="personName"
                        value={searchAttendanceRequest.personName}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">
                        Chấm công từ ngày
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={searchAttendanceRequest.startDate}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs xs:text-sm font-medium mb-1">
                        Chấm công đến ngày
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={searchAttendanceRequest.endDate}
                        onChange={handleInputChange}
                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <button
                    type="submit"
                    className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </section>

            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    STT
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên nhân viên
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mã nhân viên
                  </th>
                  {/* <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Hình ảnh
                                    </th> */}
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-in
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trễ (phút)
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OT (phút)
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Về sớm (phút)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.map((attend, index) => (
                  <tr key={`${attend.personId}-${attend.date}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page * size + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attend.personName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attend.personId}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{attend.personId}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateTime(attend.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateTime(attend.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateMinutesDiff(attend.checkIn, "08:30:00")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateMinutesDiff(attend.checkOut, "23:30:00")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateEarlyLeaveMinutes(attend.checkOut, "17:45:00")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 mx-1 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Trước
              </button>

              <span className="px-4 py-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
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

export default AttendancePage;
