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
import { searchAttendances } from "@/services/attendanceService";
import { CaptureDatumResponse } from "@/models/Attendance";

interface AttendanceRecord {
    personId: string;
    personName: string;
    date: string; 
    checkIn: string; 
    checkOut: string; 
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

    const validateCheckInOut = (times: string[], date: string) => {
        const noonThreshold = new Date(`${date}T12:00:00`);
        let hasCheckIn = false;
        let hasCheckOut = false;

        for (const time of times) {
            const timeDate = new Date(time);
            if (isNaN(timeDate.getTime())) continue;

            if (timeDate <= noonThreshold) {
                hasCheckIn = true;
            }
            if (timeDate > noonThreshold) {
                hasCheckOut = true;
            }
        }

        return { hasCheckIn, hasCheckOut };
    };

    const groupAttendances = (records: CaptureDatumResponse[]): AttendanceRecord[] => {
        const grouped: { [key: string]: { record: AttendanceRecord; times: string[] } } = {};

        records.forEach((record) => {
            if (!record.personId || !record.time) return;

            const dateObj = new Date(record.time);
            if (isNaN(dateObj.getTime())) return; 

            const date = dateObj.toISOString().split("T")[0]; 
            const key = `${record.personId}-${date}`;

            if (!grouped[key]) {
                grouped[key] = {
                    record: {
                        personId: record.personId,
                        personName: record.personName || "N/A",
                        date,
                        checkIn: record.time,
                        checkOut: record.time,
                    },
                    times: [record.time],
                };
            } else {
                grouped[key].times.push(record.time);
            }
        });

        return Object.values(grouped)
            .map(({ record, times }) => {
                const { hasCheckIn, hasCheckOut } = validateCheckInOut(times, record.date);

                let checkIn = "Chưa có";
                let checkOut = "Chưa có";

                if (hasCheckIn) {
                    const validCheckInTimes = times
                        .map((t) => new Date(t))
                        .filter((t) => !isNaN(t.getTime()) && t <= new Date(`${record.date}T12:00:00`));
                    if (validCheckInTimes.length > 0) {
                        checkIn = validCheckInTimes
                            .reduce((earliest, current) => (current < earliest ? current : earliest))
                            .toISOString();
                    }
                }

                if (hasCheckOut) {
                    const validCheckOutTimes = times
                        .map((t) => new Date(t))
                        .filter((t) => !isNaN(t.getTime()) && t > new Date(`${record.date}T12:00:00`));
                    if (validCheckOutTimes.length > 0) {
                        checkOut = validCheckOutTimes
                            .reduce((latest, current) => (current > latest ? current : latest))
                            .toISOString();
                    }
                }

                return {
                    ...record,
                    checkIn,
                    checkOut,
                };
            })
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime() || a.personId.localeCompare(b.personId);
            });
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await searchAttendances(searchAttendanceRequest, page, size);
            if (result) {
                const groupedAttendances = groupAttendances(result.content);
                setAttendances(groupedAttendances);
                setTotalPages(result.totalPages);
            }
        } catch (error) {
            console.error("Error searching attendances:", error);
            if (error instanceof Response) {
                const errorMessage = await error.text();
                console.error("Error details:", errorMessage);
            }
        }
    };

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const data = await searchAttendances(searchAttendanceRequest, page, size);
                if (data) {
                    const groupedAttendances = groupAttendances(data.content);
                    setAttendances(groupedAttendances);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching attendances:", error);
            }
        };
        fetchAttendances();
    }, [page, size]);

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
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tên nhân viên</label>
                                            <input
                                                type="text"
                                                name="personName"
                                                value={searchAttendanceRequest.personName}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Chấm công từ ngày</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={searchAttendanceRequest.startDate}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Chấm công đến ngày</label>
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
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Hình ảnh
                                    </th>
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances.map((attend, index) => (
                                    <tr key={`${attend.personId}-${attend.date}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {page * size + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{attend.personName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{attend.personId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{attend.personId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {attend.checkIn === "Chưa có"
                                                ? "Chưa có"
                                                : new Date(attend.checkIn).toLocaleString("en-GB")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {attend.checkOut === "Chưa có"
                                                ? "Chưa có"
                                                : new Date(attend.checkOut).toLocaleString("en-GB")}
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

export default AttendancePage;